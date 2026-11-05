
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Builder } = require('selenium-webdriver');

const browser = process.env.TEST_BROWSER || 'chrome';
const URL = 'http://127.0.0.1:8000/cv.html';

const clavesTexto = [
    'cvEducationEyebrow',
    'cvEducationTitle',
    'cvEducationDescription',
    'cvCredentialsEyebrow',
    'cvCredentialsTitle',
    'cvQaCertificatesEyebrow',
    'cvQaCertificatesTitle',
    'cvQaCertificatesDescription',
    'cvAiCertificatesEyebrow',
    'cvAiCertificatesTitle',
    'cvAiCertificatesDescription',
    'cvManagementEyebrow',
    'cvManagementTitle',
    'cvManagementDescription',
    'cvMarketingEyebrow',
    'cvMarketingTitle',
    'cvMarketingDescription',
    'cvSelfLearningEyebrow',
    'cvSelfLearningTitle',
    'cvSelfLearningDescription',
    'cvAcademicEyebrow',
    'cvAcademicTitle',
    'cvAcademicDescription'
];

const clavesAria = [
    'cvCredentialsAria',
    'cvQaCertificatesAria',
    'cvAiCertificatesAria',
    'cvManagementAria',
    'cvMarketingAria'
];

test('CV-I18N-002 — Formación y desarrollo ES/EN/PT', async (t) => {
    const driver = await new Builder()
        .forBrowser(browser)
        .build();

    t.after(async () => driver.quit());

    const navegadorReal = (
        await driver.getCapabilities()
    ).get('browserName');

    assert.equal(
        navegadorReal.toLowerCase(),
        browser.toLowerCase()
    );

    await driver.get(URL);

    for (const idioma of ['es', 'en', 'pt', 'es']) {
        await driver.executeScript((idioma) => {
            const selector = document.getElementById(
                'cv-language-select'
            );

            if (!selector) {
                throw new Error('Selector de idioma no encontrado');
            }

            selector.value = idioma;
            selector.dispatchEvent(
                new Event('change', { bubbles: true })
            );
        }, idioma);

        await driver.wait(async () => {
            return driver.executeScript((idioma) => {
                return document.documentElement.lang === idioma &&
                    localStorage.getItem('portfolioLanguage') === idioma;
            }, idioma);
        }, 10000);

        const resultados = await driver.executeScript(
            (clavesTexto, clavesAria, idioma) => {
                const diccionario =
                    window.portfolioTranslations?.[idioma];

                const verificar = (clave, atributo) => {
                    const selector = atributo
                        ? '[data-i18n-aria-label]'
                        : '[data-i18n]';

                    const elemento = [
                        ...document.querySelectorAll(selector)
                    ].find(el => (
                        atributo
                            ? el.getAttribute('data-i18n-aria-label')
                            : el.dataset.i18n
                    ) === clave);

                    return {
                        clave,
                        existe: Boolean(elemento),
                        esperado: diccionario?.[clave] ?? null,
                        actual: elemento
                            ? (
                                atributo
                                    ? elemento.getAttribute('aria-label')
                                    : elemento.textContent
                              )?.trim()
                            : null
                    };
                };

                return [
                    ...clavesTexto.map(clave => verificar(clave, false)),
                    ...clavesAria.map(clave => verificar(clave, true))
                ];
            },
            clavesTexto,
            clavesAria,
            idioma
        );

        for (const item of resultados) {
            assert.ok(
                item.existe,
                `Elemento no encontrado: ${item.clave}`
            );

            assert.ok(
                item.esperado,
                `Traducción ausente ${idioma}: ${item.clave}`
            );

            assert.equal(
                item.actual,
                item.esperado,
                `Traducción incorrecta ${idioma}: ${item.clave}`
            );
        }

        console.log(
            `PASS — Formación y desarrollo — ${idioma.toUpperCase()}`
        );
    }
});
