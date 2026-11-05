
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Builder } = require('selenium-webdriver');

const browser = process.env.TEST_BROWSER || 'chrome';
const URL = 'http://127.0.0.1:8000/qa.html';

test('QA-I18N-005 — Evidencia verificable ES/EN/PT', async (t) => {
    const driver = await new Builder().forBrowser(browser).build();
    t.after(async () => driver.quit());

    await driver.get(URL);

    const inicial = await driver.executeScript(() => {
        const seccion = document.getElementById('evidencia');
        const tarjetas = [...seccion.querySelectorAll('.evidence-card')];
        const enlaces = [...seccion.querySelectorAll('a[href]')];

        return {
            tarjetas: tarjetas.length,
            enlaces: enlaces.map(a => ({
                href: a.getAttribute('href'),
                target: a.getAttribute('target')
            })),
            evidencias: seccion.querySelectorAll(
                '.evidence-links a'
            ).length
        };
    });

    assert.equal(inicial.tarjetas, 4);
    assert.equal(inicial.evidencias, 6);

    for (const idioma of ['es', 'en', 'pt', 'es']) {
        const resultado = await driver.executeScript(
            (idioma) => {
                const selector = document.getElementById(
                    'cv-language-select'
                );

                selector.value = idioma;
                selector.dispatchEvent(
                    new Event('change', { bubbles: true })
                );

                const seccion = document.getElementById('evidencia');
                const dic = window.portfolioTranslations?.[idioma];
                const desplegable = seccion.querySelector(
                    '.evidence-disclosure'
                );

                desplegable.open = true;

                return {
                    idiomaActual: document.documentElement.lang,
                    idiomaGuardado: localStorage.getItem(
                        'portfolioLanguage'
                    ),
                    abierto: desplegable.open,
                    tarjetas: seccion.querySelectorAll(
                        '.evidence-card'
                    ).length,
                    evidencias: seccion.querySelectorAll(
                        '.evidence-links a'
                    ).length,
                    textos: [...seccion.querySelectorAll(
                        '[data-i18n]'
                    )].map(elemento => {
                        const clave = elemento.getAttribute(
                            'data-i18n'
                        );

                        return {
                            clave,
                            actual: elemento.textContent.trim(),
                            esperado: dic?.[clave]
                        };
                    }),
                    enlaces: [...seccion.querySelectorAll(
                        'a[href]'
                    )].map(a => ({
                        href: a.getAttribute('href'),
                        target: a.getAttribute('target')
                    }))
                };
            },
            idioma
        );

        assert.equal(resultado.idiomaActual, idioma);
        assert.equal(resultado.idiomaGuardado, idioma);
        assert.equal(resultado.tarjetas, 4);
        assert.equal(resultado.evidencias, 6);
        assert.ok(resultado.abierto);

        assert.ok(resultado.textos.length > 0);

        for (const item of resultado.textos) {
            assert.equal(
                typeof item.esperado,
                'string',
                `Falta ${idioma}.${item.clave}`
            );

            assert.equal(
                item.actual,
                item.esperado.trim(),
                `Traducción incorrecta: ${idioma}.${item.clave}`
            );
        }

        assert.deepEqual(
            resultado.enlaces,
            inicial.enlaces,
            `Los enlaces cambiaron en ${idioma}`
        );

        console.log(
            `PASS — Evidencia verificable — ${idioma.toUpperCase()}`
        );
    }

    const estadoFinal = await driver.executeScript(() =>
        document.querySelector(
            '#evidencia .evidence-disclosure'
        ).open
    );

    assert.ok(
        estadoFinal,
        'El desplegable de evidencias perdió su estado'
    );
});
