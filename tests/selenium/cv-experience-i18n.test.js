const { createDriver } = require('./selenium-config');

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By } = require('selenium-webdriver');

const browser = process.env.TEST_BROWSER || 'chrome';
const URL = 'http://127.0.0.1:8000/cv.html';

test('CV-I18N-001 — Trayectoria profesional ES/EN/PT', async (t) => {
    const driver = await createDriver(browser);

    t.after(async () => driver.quit());

    const navegadorReal = (
        await driver.getCapabilities()
    ).get('browserName');

    assert.equal(
        navegadorReal.toLowerCase(),
        browser.toLowerCase()
    );

    await driver.get(URL);

    const claves = [
        'cvHeroEyebrow',
        'cvHeroTitle',
        'cvHeroDescription',
        'cvTechPeriod',
        'cvTechTitle',
        'cvTechSubtitle',
        'cvTechIntro',
        'cvTechQaTitle',
        'cvTechQaDescription1',
        'cvTechQaDescription2',
        'cvTechAiTitle',
        'cvTechAiDescription1',
        'cvTechAiDescription2',
        'cvTechProjectLabel',
        'cvTechProjectDescription',
        'cvSenzaRole',
        'cvSenzaDescription1',
        'cvSenzaDescription2',
        'cvSelemaRole',
        'cvSelemaDescription1',
        'cvSelemaDescription2',
        'cvDivinoRole',
        'cvDivinoDescription1',
        'cvDivinoDescription2',
        'cvPrestaCashRole',
        'cvPrestaCashDescription1',
        'cvPrestaCashDescription2',
        'cvAccRole',
        'cvAccDescription1',
        'cvAccClientsIntro',
        'cvAccClientsAnd',
        'cvAccDescription3'
    ];

    for (const idioma of ['es', 'en', 'pt', 'es']) {
        await driver.executeScript((idioma) => {
            const selector = document.getElementById(
                'cv-language-select'
            );

            selector.value = idioma;
            selector.dispatchEvent(
                new Event('change', { bubbles: true })
            );
        }, idioma);

        await driver.wait(async () =>
            driver.executeScript((idioma) =>
                document.documentElement.lang === idioma &&
                localStorage.getItem('portfolioLanguage') === idioma,
                idioma
            ), 10000
        );

        const resultado = await driver.executeScript((claves, idioma) => {
            const diccionario = window.portfolioTranslations?.[idioma];

            return claves.map(clave => {
                const elemento = [...document.querySelectorAll(
                    '[data-i18n]'
                )].find(el => el.dataset.i18n === clave);

                return {
                    clave,
                    existe: Boolean(elemento),
                    esperado: diccionario?.[clave] ?? null,
                    actual: elemento?.textContent.trim() ?? null
                };
            });
        }, claves, idioma);

        for (const item of resultado) {
            assert.ok(item.existe, `Falta elemento: ${item.clave}`);
            assert.ok(item.esperado, `Falta traducción ${idioma}: ${item.clave}`);
            assert.equal(
                item.actual,
                item.esperado,
                `Traducción incorrecta ${idioma}: ${item.clave}`
            );
        }

        console.log(`PASS — Trayectoria profesional — ${idioma.toUpperCase()}`);
    }
});
