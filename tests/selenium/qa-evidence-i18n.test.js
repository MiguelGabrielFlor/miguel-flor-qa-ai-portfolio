const { createDriver } = require('./selenium-config');

const { test } = require('node:test');
const assert = require('node:assert/strict');

const browser = process.env.TEST_BROWSER || 'chrome';
const URL = `${(process.env.TEST_BASE_URL || 'http://127.0.0.1:5500').replace(/\/$/, '')}/qa.html`;


async function changeLanguage(driver, idioma) {
    await driver.wait(async () => driver.executeScript(() => {
        const selector = document.getElementById('cv-language-select');
        return Boolean(selector && !selector.disabled && window.portfolioTranslations);
    }), 15000);
    await driver.executeScript(lang => {
        const selector = document.getElementById('cv-language-select');
        selector.value = lang;
        selector.dispatchEvent(new Event('change', { bubbles: true }));
    }, idioma);
    await driver.wait(async () => driver.executeScript(lang => {
        const dic = window.portfolioTranslations?.[lang];
        const selector = document.getElementById('cv-language-select');
        return Boolean(dic && selector && !selector.disabled &&
            document.documentElement.lang === lang &&
            localStorage.getItem('portfolioLanguage') === lang &&
            [...document.querySelectorAll('[data-i18n]')].every(el =>
                typeof dic[el.dataset.i18n] !== 'string' ||
                el.textContent.trim() === dic[el.dataset.i18n].trim()));
    }, idioma), 15000, `No finalizó la traducción a ${idioma}`);
}

test('QA-I18N-005 — Evidencia verificable ES/EN/PT', async (t) => {
    const driver = await createDriver(browser);
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
        await changeLanguage(driver, idioma);
            const resultado = await driver.executeScript(
            (idioma) => {
                const selector = document.getElementById(
                    'cv-language-select'
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
