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

    const navegadorEsperado = browser === 'edge'
        ? 'microsoftedge'
        : browser;

    assert.equal(
        (await driver.getCapabilities()).get('browserName').toLowerCase(),
        navegadorEsperado,
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

                const veredicto = contenedor?.querySelector(
                    '.backend-veredicto-pass, .backend-veredicto-fail'
                );

                const solicitud = contenedor?.querySelector(
                    '.api-solicitud-desplegable summary'
                );

                return Boolean(
                    veredicto &&
                    solicitud &&
                    /^(PASS|FAIL)\s*[—–-]\s*HTTP\s+\d+/.test(
                        veredicto.textContent.trim()
                    )
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

        
        assert.equal(
            Object.hasOwn(respuesta, 'persistencia'),
            false,
            `${escenario.nombre}: la API expone metadatos internos`
        );

        if (escenario.http === 201) {
            assert.ok(
                Number.isInteger(respuesta.visitor?.id),
                'Falta el identificador funcional del visitante'
            );
        } else {
            assert.ok(
                Array.isArray(respuesta.errors) &&
                respuesta.errors.length > 0,
                'Faltan los errores de validación'
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
