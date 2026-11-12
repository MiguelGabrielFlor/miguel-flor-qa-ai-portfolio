const { createDriver } = require('./selenium-config');

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By } = require('selenium-webdriver');

const browser = process.env.TEST_BROWSER || 'chrome';
const URL = 'http://127.0.0.1:8000/backend.html';

const familias = [
    { id: '1xx', inicio: 0, cantidad: 3 },
    { id: '2xx', inicio: 5, cantidad: 4 },
    { id: '3xx', inicio: 11, cantidad: 4 },
    { id: '4xx', inicio: 17, cantidad: 8 },
    { id: '5xx', inicio: 27, cantidad: 5 }
];

async function cambiarIdioma(driver, idioma) {
    await driver.executeScript((idioma) => {
        const selector = document.getElementById('cv-language-select');

        if (!selector) {
            throw new Error('Selector de idioma no encontrado');
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

async function leerGuia(driver) {
    return driver.executeScript(() => {
        const detalle = document.getElementById('http-guide-detail');

        return {
            visible: !detalle.hidden,
            titulo: document.getElementById(
                'http-guide-family-title'
            ).textContent.trim(),
            descripcion: document.getElementById(
                'http-guide-description'
            ).textContent.trim(),
            ejemplos: [...document.querySelectorAll(
                '#http-guide-examples .http-guide-example'
            )].map(elemento => ({
                codigo: elemento.querySelector('strong')
                    ?.textContent.trim(),
                texto: elemento.querySelector('span')
                    ?.textContent.trim()
            })),
            activos: [...document.querySelectorAll(
                '[data-http-family][aria-pressed="true"]'
            )].map(elemento => elemento.dataset.httpFamily)
        };
    });
}

test('BACKEND-I18N-005 — Guía HTTP ES/EN/PT', async (t) => {
    const driver = await createDriver(browser);

    t.after(async () => {
        await driver.quit();
    });

    const navegadorReal = (
        await driver.getCapabilities()
    ).get('browserName');

    assert.equal(
        navegadorReal.toLowerCase(),
        browser.toLowerCase()
    );

    await driver.get(URL);
    await cambiarIdioma(driver, 'es');

    const detalleInicial = await driver.executeScript(() => {
        return document.getElementById('http-guide-detail').hidden;
    });

    assert.equal(detalleInicial, true);

    for (const familia of familias) {
        await cambiarIdioma(driver, 'es');

        const boton = await driver.findElement(
            By.css(`[data-http-family="${familia.id}"]`)
        );

        await driver.executeScript((elemento) => {
            elemento.scrollIntoView({
                behavior: 'instant',
                block: 'center'
            });
        }, boton);

        await boton.click();

        const inicial = await leerGuia(driver);

        assert.equal(inicial.visible, true);
        assert.deepEqual(inicial.activos, [familia.id]);

        assert.ok(inicial.titulo);
        assert.ok(inicial.descripcion);
        assert.ok(inicial.ejemplos.length > 0);

        const codigosOriginales = inicial.ejemplos.map(
            ejemplo => ejemplo.codigo
        );

        for (const idioma of ['es', 'en', 'pt', 'es']) {
            await cambiarIdioma(driver, idioma);

            const actual = await leerGuia(driver);

            assert.equal(
                actual.visible,
                true,
                `${familia.id}: panel cerrado en ${idioma}`
            );

            assert.deepEqual(
                actual.activos,
                [familia.id],
                `${familia.id}: selección incorrecta en ${idioma}`
            );

            assert.deepEqual(
                actual.ejemplos.map(e => e.codigo),
                codigosOriginales,
                `${familia.id}: cambiaron los códigos HTTP`
            );

            const esperado = await driver.executeScript(
                (id, idioma) => {
                    const claves = {
                        '1xx': [0, 1, 2, 3, 4],
                        '2xx': [5, 6, 7, 8, 9, 10],
                        '3xx': [11, 12, 13, 14, 15, 16],
                        '4xx': [17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
                        '5xx': [27, 28, 29, 30, 31, 32, 33]
                    };

                    const diccionario =
                        window.portfolioTranslations?.[idioma];

                    const valores = claves[id].map(numero => {
                        const clave = `backendDynamic${String(numero).padStart(3, '0')}`;
                        return diccionario?.[clave];
                    });

                    return {
                        titulo: valores[0],
                        descripcion: valores[1],
                        textos: valores.slice(2)
                    };
                },
                familia.id,
                idioma
            );

            assert.ok(esperado.titulo);
            assert.ok(esperado.descripcion);

            assert.equal(actual.titulo, esperado.titulo);
            assert.equal(actual.descripcion, esperado.descripcion);

            assert.deepEqual(
                actual.ejemplos.map(e => e.texto),
                esperado.textos,
                `${familia.id}: ejemplos sin traducir en ${idioma}`
            );
        }

        console.log(
            `PASS — Familia ${familia.id} — ES/EN/PT`
        );
    }

    // Verificar que el botón activo permite cerrar el panel.
    const botonActivo = await driver.findElement(
        By.css('[data-http-family="5xx"]')
    );

    await botonActivo.click();

    const final = await leerGuia(driver);

    assert.equal(final.visible, false);
    assert.deepEqual(final.activos, []);
});
