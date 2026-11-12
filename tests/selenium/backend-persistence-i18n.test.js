const { createDriver } = require('./selenium-config');

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By } = require('selenium-webdriver');

const browser = process.env.TEST_BROWSER || 'chrome';
const URL = 'http://127.0.0.1:8000/backend.html';

const escenarios = [
    {
        nombre: 'Registro válido',
        boton: 'persistencia-valido-ejecutar',
        contenedor: 'persistencia-valido-resultado',
        http: 201,
        evidencia: '.sqlite-evidence-panel',
        claveTitulo: 'backendDynamic063'
    },
    {
        nombre: 'Sin consentimiento',
        boton: 'persistencia-sin-consentimiento-ejecutar',
        contenedor: 'persistencia-sin-consentimiento-resultado',
        http: 400,
        evidencia: '.sqlite-evidence-panel',
        claveTitulo: 'backendDynamic072'
    }
];

async function cambiarIdioma(driver, idioma) {
    await driver.executeScript((idioma) => {
        const selector = document.getElementById('cv-language-select');
        if (!selector) throw new Error('Selector de idioma no encontrado');

        selector.value = idioma;
        selector.dispatchEvent(new Event('change', { bubbles: true }));
    }, idioma);

    await driver.wait(async () => {
        return driver.executeScript((idioma) => {
            return document.documentElement.lang === idioma &&
                localStorage.getItem('portfolioLanguage') === idioma;
        }, idioma);
    }, 10000);
}

async function leerResultado(driver, id) {
    return driver.executeScript((id) => {
        const contenedor = document.getElementById(id);

        return {
            veredicto: contenedor?.querySelector(':scope > p')
                ?.textContent.trim() || '',
            json: contenedor?.querySelector(':scope > pre')
                ?.textContent.trim() || '',
            solicitud: contenedor?.querySelector(
                '.api-solicitud-desplegable summary'
            )?.textContent.trim() || '',
            tituloSQLite: contenedor?.querySelector(
                '.sqlite-evidence-panel h4'
            )?.textContent.trim() || '',
            evidencia: contenedor?.querySelector(
                '.sqlite-evidence-panel'
            )?.innerText || ''
        };
    }, id);
}

test('BACKEND-I18N-003 — Persistencia ES/EN/PT', async (t) => {
    const driver = await createDriver(browser);

    t.after(async () => {
        await driver.quit();
    });

    const navegadorReal = (
        await driver.getCapabilities()
    ).get('browserName');

    assert.equal(
        navegadorReal.toLowerCase(),
        browser.toLowerCase(),
        'El navegador ejecutado debe coincidir con el solicitado'
    );

    await driver.get(URL);

    // Contar solicitudes POST a visitantes desde la página.
    await driver.executeScript(() => {
        window.__qaPostCount = 0;

        const fetchOriginal = window.fetch.bind(window);

        window.fetch = function (...args) {
            const recurso = args[0];
            const opciones = args[1] || {};
            const url = typeof recurso === 'string'
                ? recurso
                : recurso?.url || '';

            const metodo = (
                opciones.method ||
                recurso?.method ||
                'GET'
            ).toUpperCase();

            if (metodo === 'POST' && url.includes('/api/visitors')) {
                window.__qaPostCount++;
            }

            return fetchOriginal(...args);
        };
    });

    await cambiarIdioma(driver, 'es');

    for (const escenario of escenarios) {
        const boton = await driver.findElement(By.id(escenario.boton));

        await driver.executeScript((elemento) => {
            elemento.scrollIntoView({
                behavior: 'instant',
                block: 'center'
            });
        }, boton);

        await boton.click();

        await driver.wait(async () => {
            return driver.executeScript((id) => {
                const contenedor = document.getElementById(id);
                const parrafo = contenedor?.querySelector(':scope > p');
                const solicitud = contenedor?.querySelector(
                    '.api-solicitud-desplegable summary'
                );

                return Boolean(
                    parrafo &&
                    solicitud &&
                    /^(PASS|FAIL) —/.test(parrafo.textContent.trim())
                );
            }, escenario.contenedor);
        }, 15000);

        const inicial = await leerResultado(driver, escenario.contenedor);

        assert.match(
            inicial.veredicto,
            new RegExp(`^PASS — HTTP ${escenario.http}`),
            `${escenario.nombre}: resultado HTTP incorrecto`
        );

        assert.ok(
            inicial.json,
            `${escenario.nombre}: falta la respuesta JSON`
        );

        assert.ok(
            inicial.tituloSQLite,
            `${escenario.nombre}: falta la evidencia SQLite`
        );

        const respuesta = JSON.parse(inicial.json);

        if (escenario.http === 201) {
            assert.equal(respuesta.persistencia?.verificada, true);
            assert.ok(respuesta.persistencia?.registroId);
        } else {
            assert.equal(
                respuesta.persistencia?.insercionEjecutada,
                false
            );
        }

        const postsAntes = await driver.executeScript(
            () => window.__qaPostCount
        );

        for (const idioma of ['en', 'pt', 'es']) {
            await cambiarIdioma(driver, idioma);

            const actual = await leerResultado(
                driver,
                escenario.contenedor
            );

            assert.equal(actual.veredicto, inicial.veredicto);
            assert.equal(actual.json, inicial.json);

            const traducciones = await driver.executeScript(
                (idioma, claveTitulo) => {
                    const diccionario =
                        window.portfolioTranslations?.[idioma];

                    return {
                        solicitud: diccionario?.backendDynamic053,
                        titulo: diccionario?.[claveTitulo]
                    };
                },
                idioma,
                escenario.claveTitulo
            );

            assert.ok(traducciones.solicitud);
            assert.ok(traducciones.titulo);

            assert.equal(actual.solicitud, traducciones.solicitud);
            assert.equal(actual.tituloSQLite, traducciones.titulo);

            const postsDespues = await driver.executeScript(
                () => window.__qaPostCount
            );

            assert.equal(
                postsDespues,
                postsAntes,
                `${escenario.nombre}: el cambio de idioma generó un POST`
            );
        }

        console.log(
            `PASS — ${escenario.nombre} — ES/EN/PT`
        );
    }

    // Ambos resultados deben permanecer visibles.
    for (const escenario of escenarios) {
        const resultado = await leerResultado(
            driver,
            escenario.contenedor
        );

        assert.match(resultado.veredicto, /^PASS —/);
        assert.ok(resultado.tituloSQLite);
    }

    assert.equal(
        await driver.executeScript(() => window.__qaPostCount),
        2,
        'Se esperaban exactamente dos solicitudes POST'
    );
});
