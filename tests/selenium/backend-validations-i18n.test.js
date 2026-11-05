
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Builder, By } = require('selenium-webdriver');

const browser = process.env.TEST_BROWSER || 'chrome';
const URL = 'http://127.0.0.1:8000/backend.html';

const escenarios = [
    { laboratorio: 'visitantes', caso: 'nombre' },
    { laboratorio: 'visitantes', caso: 'apellido' },
    { laboratorio: 'visitantes', caso: 'email-visitante' },
    { laboratorio: 'visitantes', caso: 'telefono-visitante' },
    { laboratorio: 'visitantes', caso: 'consentimiento' },
    { laboratorio: 'contacto', caso: 'mensaje-vacio' },
    { laboratorio: 'contacto', caso: 'mensaje-largo' },
    { laboratorio: 'contacto', caso: 'email-contacto' },
    { laboratorio: 'contacto', caso: 'telefono-contacto' }
];

const configuracion = {
    visitantes: {
        selector: 'qa-caso',
        boton: 'qa-ejecutar',
        resultado: 'qa-resultado',
        endpoint: '/api/visitors'
    },
    contacto: {
        selector: 'contacto-qa-caso',
        boton: 'contacto-qa-ejecutar',
        resultado: 'contacto-qa-resultado',
        endpoint: '/api/contact'
    }
};

async function cambiarIdioma(driver, idioma) {
    await driver.executeScript((idioma) => {
        const selector = document.getElementById('cv-language-select');

        if (!selector) {
            throw new Error('No se encontró el selector de idioma.');
        }

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
        const parrafo = contenedor?.querySelector(':scope > p');
        const codigo = contenedor?.querySelector(':scope > pre');

        return {
            veredicto: parrafo?.textContent.trim() || '',
            json: codigo?.textContent.trim() || '',
            texto: contenedor?.innerText || '',
            solicitud: contenedor?.querySelector(
                '.api-solicitud-desplegable summary'
            )?.textContent.trim() || ''
        };
    }, id);
}

test('BACKEND-I18N-002 — Validaciones ES/EN/PT', async (t) => {
    const driver = await new Builder()
        .forBrowser(browser)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    const navegadorReal = (
        await driver.getCapabilities()
    ).get('browserName');

    assert.equal(
        navegadorReal.toLowerCase(),
        browser.toLowerCase(),
        'El navegador ejecutado debe coincidir con el solicitado.'
    );

    await driver.get(URL);
    await cambiarIdioma(driver, 'es');

    for (const escenario of escenarios) {
        const config = configuracion[escenario.laboratorio];

        await cambiarIdioma(driver, 'es');

        await driver.executeScript(({ selector, caso }) => {
            document.getElementById(selector).value = caso;
        }, {
            selector: config.selector,
            caso: escenario.caso
        });

        const boton = await driver.findElement(By.id(config.boton));

        // Ubicar el botón en una zona visible, lejos del footer fijo.
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
            }, config.resultado);
        }, 15000);

        const inicial = await leerResultado(driver, config.resultado);

        assert.match(
            inicial.veredicto,
            /^PASS — HTTP 400/,
            `${escenario.caso}: se esperaba PASS con HTTP 400.`
        );

        const respuesta = JSON.parse(inicial.json);

        assert.ok(
            Array.isArray(respuesta.errors) &&
            respuesta.errors.length > 0,
            `${escenario.caso}: se esperaba una lista de errores.`
        );

        for (const idioma of ['en', 'pt', 'es']) {
            await cambiarIdioma(driver, idioma);

            const actual = await leerResultado(driver, config.resultado);

            assert.equal(
                actual.veredicto,
                inicial.veredicto,
                `${escenario.caso}: el veredicto cambió en ${idioma}.`
            );

            assert.equal(
                actual.json,
                inicial.json,
                `${escenario.caso}: el JSON cambió en ${idioma}.`
            );

            const etiquetaEsperada = await driver.executeScript((idioma) => {
                return window.portfolioTranslations?.[idioma]
                    ?.backendDynamic053;
            }, idioma);

            assert.ok(
                etiquetaEsperada,
                `Falta backendDynamic053 para ${idioma}.`
            );

            assert.equal(
                actual.solicitud,
                etiquetaEsperada,
                `${escenario.caso}: solicitud sin traducir en ${idioma}.`
            );
        }

        console.log(
            `PASS — ${escenario.laboratorio} / ${escenario.caso} — ES/EN/PT`
        );
    }

    // Comprobar que ambos laboratorios conservan sus resultados.
    const visitantes = await leerResultado(driver, 'qa-resultado');
    const contacto = await leerResultado(driver, 'contacto-qa-resultado');

    assert.match(visitantes.veredicto, /^PASS — HTTP 400/);
    assert.match(contacto.veredicto, /^PASS — HTTP 400/);

    assert.ok(visitantes.solicitud);
    assert.ok(contacto.solicitud);
});
