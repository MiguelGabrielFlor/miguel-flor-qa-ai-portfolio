const { createDriver } = require('./selenium-config');

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By } = require('selenium-webdriver');

const browser = process.env.TEST_BROWSER || 'chrome';
const URL = 'http://127.0.0.1:8000/backend.html';

const claves = [
    'backendStatic102', 'backendStatic103',
    'backendStatic104', 'backendStatic105',
    'backendStatic106', 'backendStatic107',
    'backendStatic108', 'backendStatic109',
    'backendStatic111', 'backendStatic113',
    'backendStatic115', 'backendStatic117',
    'backendStatic118', 'backendStatic119',
    'backendStatic120', 'backendStatic121',
    'backendStatic122', 'backendStatic123',
    'backendStatic124', 'backendStatic125',
    'backendStatic126', 'backendStatic127',
    'backendStatic128', 'backendStatic129',
    'backendStatic130', 'backendStatic131',
    'backendStatic132', 'backendStatic133',
    'backendStatic134', 'backendStatic135',
    'backendStatic136', 'backendStatic137',
    'backendStatic138', 'backendStatic139',
    'backendStatic140', 'backendStatic141',
    'backendStatic142', 'backendStatic143',
    'backendStatic144', 'backendStatic145',
    'backendStatic146', 'backendStatic147',
    'backendStatic148', 'backendStatic149'
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

test('BACKEND-I18N-004 — Pruebas automatizadas ES/EN/PT', async (t) => {
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

    const seccion = await driver.findElement(By.id('pruebas-api'));
    const biblioteca = await seccion.findElement(
        By.css('details.api-tests-library')
    );

    await driver.executeScript((elemento) => {
        elemento.open = true;
    }, biblioteca);

    for (const idioma of ['es', 'en', 'pt', 'es']) {
        await cambiarIdioma(driver, idioma);

        const resultado = await driver.executeScript(
            (claves, idioma) => {
                const seccion = document.getElementById('pruebas-api');
                const diccionario = window.portfolioTranslations?.[idioma];

                const errores = [];

                if (!diccionario) {
                    return ['Diccionario inexistente: ' + idioma];
                }

                for (const clave of claves) {
                    const elemento = seccion.querySelector(
                        `[data-i18n="${clave}"]`
                    );

                    const traduccion = diccionario[clave];

                    if (!elemento) {
                        errores.push(`Elemento inexistente: ${clave}`);
                    } else if (
                        typeof traduccion !== 'string' ||
                        !traduccion.trim()
                    ) {
                        errores.push(`Traducción faltante: ${clave}`);
                    } else if (
                        elemento.textContent.trim() !== traduccion.trim()
                    ) {
                        errores.push(`Traducción incorrecta: ${clave}`);
                    }
                }

                const clavesAria = [
                    'backendChartAria',
                    'backendBarAria0',
                    'backendBarAria1',
                    'backendBarAria2'
                ];

                for (const clave of clavesAria) {
                    const elemento = seccion.querySelector(
                        `[data-i18n-aria-label="${clave}"]`
                    );

                    const traduccion = diccionario[clave];

                    if (!elemento || !traduccion ||
                        elemento.getAttribute('aria-label') !== traduccion
                    ) {
                        errores.push(`ARIA incorrecto: ${clave}`);
                    }
                }

                const biblioteca = seccion.querySelector(
                    'details.api-tests-library'
                );

                if (!biblioteca?.open) {
                    errores.push('La biblioteca se cerró al cambiar idioma');
                }

                const casos = biblioteca.querySelectorAll(
                    '.api-tests-group ol li'
                );

                if (casos.length !== 15) {
                    errores.push(
                        `Se esperaban 15 casos; encontrados: ${casos.length}`
                    );
                }

                const resumen = seccion.querySelector('.resumen-pruebas');

                for (const texto of ['15 PASS', '0 FAIL', '0 SKIP']) {
                    if (!resumen?.textContent.includes(texto)) {
                        errores.push(`Resultado histórico faltante: ${texto}`);
                    }
                }

                return errores;
            },
            claves,
            idioma
        );

        assert.deepEqual(
            resultado,
            [],
            `Errores de internacionalización en ${idioma}`
        );

        console.log(`PASS — Sección 04 — ${idioma.toUpperCase()}`);
    }
});
