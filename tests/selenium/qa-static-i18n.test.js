
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Builder } = require('selenium-webdriver');

const browser = process.env.TEST_BROWSER || 'chrome';
const URL = 'http://127.0.0.1:8000/qa.html';

test('QA-I18N-001 — Interfaz estática ES/EN/PT', async (t) => {
    const driver = await new Builder()
        .forBrowser(browser)
        .build();

    t.after(async () => driver.quit());

    assert.equal(
        (await driver.getCapabilities()).get('browserName').toLowerCase(),
        browser.toLowerCase()
    );

    await driver.get(URL);

    const clavesTexto = [
        'qaText001',
        'qaText002',
        'qaText003',
        'qaText004',
        'qaText005',
        'qaText006',
        'qaText007',
        'qaText008',
        'qaText009',
        'qaText010',
        'qaText011',
        'qaText012',
        'qaText013',
        'qaText014',
        'qaText047',
        'qaText111'
    ];

    const clavesAria = [
        'qaLogoAria',
        'qaSearchAria',
        'qaSearchResultsAria',
        'qaIndexAria',
        'qaCaseGroupAria',
        'qaCaseDetailAria',
        'qaFooterLanguageAria'
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

        await driver.wait(() =>
            driver.executeScript((idioma) =>
                document.documentElement.lang === idioma &&
                localStorage.getItem('portfolioLanguage') === idioma,
                idioma
            ), 10000);

        const resultados = await driver.executeScript(
            (clavesTexto, clavesAria, idioma) => {
                const dic = window.portfolioTranslations?.[idioma];

                function comprobar(clave, atributo) {
                    const nombreAtributo = atributo
                        ? 'data-i18n-aria-label'
                        : 'data-i18n';

                    const elemento = [...document.querySelectorAll(
                        `[${nombreAtributo}]`
                    )].find(el =>
                        el.getAttribute(nombreAtributo) === clave
                    );

                    return {
                        clave,
                        existe: Boolean(elemento),
                        esperado: dic?.[clave] ?? null,
                        actual: elemento
                            ? (atributo
                                ? elemento.getAttribute('aria-label')
                                : elemento.textContent
                              ).trim()
                            : null
                    };
                }

                const placeholder = document.querySelector(
                    '[data-i18n-placeholder="qaSearchPlaceholder"]'
                );

                return [
                    ...clavesTexto.map(k => comprobar(k, false)),
                    ...clavesAria.map(k => comprobar(k, true)),
                    {
                        clave: 'qaSearchPlaceholder',
                        existe: Boolean(placeholder),
                        esperado: dic?.qaSearchPlaceholder ?? null,
                        actual: placeholder?.getAttribute('placeholder')
                    }
                ];
            },
            clavesTexto,
            clavesAria,
            idioma
        );

        for (const item of resultados) {
            assert.ok(item.existe, `Elemento ausente: ${item.clave}`);
            assert.ok(
                typeof item.esperado === 'string',
                `Traducción ausente ${idioma}: ${item.clave}`
            );
            assert.equal(
                item.actual,
                item.esperado,
                `Traducción incorrecta ${idioma}: ${item.clave}`
            );
        }

        console.log(`PASS — Interfaz estática — ${idioma.toUpperCase()}`);
    }
});
