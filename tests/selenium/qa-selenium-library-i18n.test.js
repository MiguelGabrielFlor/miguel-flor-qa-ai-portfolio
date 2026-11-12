const { createDriver } = require('./selenium-config');

const { test } = require('node:test');
const assert = require('node:assert/strict');

const browser = process.env.TEST_BROWSER || 'chrome';
const URL = 'http://127.0.0.1:8000/qa.html';

test('QA-I18N-003 — Biblioteca Selenium ES/EN/PT', async (t) => {
    const driver = await createDriver(browser);
    t.after(async () => driver.quit());

    await driver.get(URL);

    const escenarios = await driver.executeScript(() =>
        [...document.querySelectorAll(
            '#selenium-library > details.selenium-test'
        )].map((elemento, indice) => ({
            indice,
            id: elemento.querySelector('.selenium-test-id')
                ?.textContent.trim()
        }))
    );

    assert.ok(escenarios.length > 0, 'No hay escenarios Selenium');

    for (const escenario of escenarios) {
        const original = await driver.executeScript((indice) => {
            const detalles = [...document.querySelectorAll(
                '#selenium-library > details.selenium-test'
            )];
            const actual = detalles[indice];
            actual.open = true;

            return [...actual.querySelectorAll('pre code')]
                .map(elemento => elemento.textContent);
        }, escenario.indice);

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
                    const detalles = [...document.querySelectorAll(
                        '#selenium-library > details.selenium-test'
                    )];
                    const actual = detalles[indice];

                    const textos = [...actual.querySelectorAll('[data-i18n]')]
                        .filter(elemento =>
                            !elemento.closest('pre, code')
                        )
                        .map(elemento => {
                            const clave = elemento.getAttribute('data-i18n');
                            return {
                                clave,
                                actual: elemento.textContent.trim(),
                                esperado: dic?.[clave]
                            };
                        });

                    return {
                        idiomaActual: document.documentElement.lang,
                        idiomaGuardado: localStorage.getItem(
                            'portfolioLanguage'
                        ),
                        abierto: actual.open,
                        textos,
                        codigo: [...actual.querySelectorAll('pre code')]
                            .map(elemento => elemento.textContent)
                    };
                },
                escenario.indice,
                idioma
            );

            assert.equal(resultado.idiomaActual, idioma);
            assert.equal(resultado.idiomaGuardado, idioma);
            assert.ok(
                resultado.abierto,
                `${escenario.id}: se cerró al cambiar idioma`
            );
            assert.ok(
                resultado.textos.length > 0,
                `${escenario.id}: sin textos traducibles`
            );

            for (const texto of resultado.textos) {
                assert.equal(
                    typeof texto.esperado,
                    'string',
                    `${escenario.id}: falta ${idioma}.${texto.clave}`
                );
                assert.equal(
                    texto.actual,
                    texto.esperado.trim(),
                    `${escenario.id}: traducción ${idioma}.${texto.clave}`
                );
            }

            assert.deepEqual(
                resultado.codigo,
                original,
                `${escenario.id}: el código cambió con el idioma`
            );
        }

        console.log(`PASS — ${escenario.id} — ES/EN/PT`);
    }
});
