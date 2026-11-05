
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Builder } = require('selenium-webdriver');

const browser = process.env.TEST_BROWSER || 'chrome';
const URL = 'http://127.0.0.1:8000/qa.html';

test('QA-I18N-004 — Regresión y bugs ES/EN/PT', async (t) => {
    const driver = await new Builder().forBrowser(browser).build();
    t.after(async () => driver.quit());

    await driver.get(URL);

    const cantidad = await driver.executeScript(() =>
        document.querySelectorAll(
            '#regresion-bugs .qa-panel > details'
        ).length
    );

    assert.equal(cantidad, 5, 'Se esperaban cinco reportes');

    for (let indice = 0; indice < cantidad; indice++) {
        await driver.executeScript((indice) => {
            const reportes = [...document.querySelectorAll(
                '#regresion-bugs .qa-panel > details'
            )];
            reportes[indice].open = true;
        }, indice);

        await driver.wait(() =>
            driver.executeScript((indice) => {
                const reportes = [...document.querySelectorAll(
                    '#regresion-bugs .qa-panel > details'
                )];
                return reportes[indice].open &&
                    reportes.every((reporte, i) =>
                        i === indice || !reporte.open
                    );
            }, indice), 10000);

        for (const idioma of ['es', 'en', 'pt', 'es']) {
            const resultado = await driver.executeScript(
                (indice, idioma) => {
                    const selector = document.getElementById(
                        'cv-language-select'
                    );
                    selector.value = idioma;
                    selector.dispatchEvent(
                        new Event('change', { bubbles: true })
                    );

                    const dic = window.portfolioTranslations?.[idioma];
                    const paneles = [...document.querySelectorAll(
                        '#regresion-bugs .qa-panel'
                    )];
                    const panel = paneles[indice];
                    const reporte = panel.querySelector(':scope > details');

                    const elementos = [
                        ...panel.querySelectorAll('[data-i18n]')
                    ];

                    return {
                        idiomaActual: document.documentElement.lang,
                        idiomaGuardado: localStorage.getItem(
                            'portfolioLanguage'
                        ),
                        abierto: reporte.open,
                        titulo: panel.querySelector('h3')?.textContent.trim(),
                        traducciones: elementos.map(elemento => {
                            const clave = elemento.getAttribute('data-i18n');
                            return {
                                clave,
                                actual: elemento.textContent.trim(),
                                esperado: dic?.[clave]
                            };
                        })
                    };
                },
                indice,
                idioma
            );

            assert.equal(resultado.idiomaActual, idioma);
            assert.equal(resultado.idiomaGuardado, idioma);
            assert.ok(
                resultado.abierto,
                `BUG-00${indice + 1}: se cerró al cambiar idioma`
            );
            assert.ok(resultado.titulo);
            assert.ok(resultado.traducciones.length > 0);

            for (const item of resultado.traducciones) {
                assert.equal(
                    typeof item.esperado,
                    'string',
                    `Falta ${idioma}.${item.clave}`
                );
                assert.equal(
                    item.actual,
                    item.esperado.trim(),
                    `BUG-00${indice + 1}: ${idioma}.${item.clave}`
                );
            }

            console.log(
                `PASS — BUG-00${indice + 1} — ${idioma.toUpperCase()}`
            );
        }
    }

    const acordeon = await driver.executeScript(() => {
        const reportes = [...document.querySelectorAll(
            '#regresion-bugs .qa-panel > details'
        )];
        return reportes.map(reporte => reporte.open);
    });

    assert.deepEqual(
        acordeon,
        [false, false, false, false, true],
        'El acordeón no conserva un único reporte abierto'
    );
});
