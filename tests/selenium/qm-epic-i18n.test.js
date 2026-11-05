
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Builder, By } = require('selenium-webdriver');

const BROWSER = process.env.SELENIUM_BROWSER || 'chrome';

const PAGE_URL = pathToFileURL(
    path.resolve(__dirname, '../../quality-management.html')
).href;

const LANGUAGES = ['es', 'en', 'pt'];

const HERO_KEYS = [
    'qmHeroEyebrow',
    'qmHeroTitle',
    'qmHeroDescription'
];

const EPIC_KEYS = [
    'qmEpicTitle',
    'qmEpicDescription',
    'qmEpicDocumentLabel',
    'qmEpicDocumentStatus',
    'qmEpicDocumentTitle',
    'qmEpicDocumentDescription',
    'qmEpicBusinessTitle',
    'qmEpicBusinessDescription',
    'qmEpicBusinessValue',
    'qmEpicObjectiveTitle',
    'qmEpicObjectiveDescription',
    'qmEpicScopeTitle',
    'qmEpicScopeDescription',
    'qmEpicScopeIncludedTitle',
    'qmEpicScopeIncluded01',
    'qmEpicScopeIncluded02',
    'qmEpicScopeIncluded03',
    'qmEpicScopeIncluded04',
    'qmEpicScopeIncluded05',
    'qmEpicScopeIncluded06',
    'qmEpicScopePendingTitle',
    'qmEpicScopePending01',
    'qmEpicScopePending02',
    'qmEpicScopePending03',
    'qmEpicScopePending04',
    'qmEpicClosureTitle',
    'qmEpicClosureDescription',
    'qmEpicClosureConditions',
    'qmEpicFooterLabel',
    'qmEpicFooterStatus',
    'qmEpicFinalNote'
];

const ALL_KEYS = [...HERO_KEYS, ...EPIC_KEYS];

function normalize(text) {
    return String(text ?? '')
        .replace(/\s+/g, ' ')
        .trim();
}

async function createDriver() {
    return new Builder()
        .forBrowser(BROWSER)
        .build();
}

async function openPage(driver) {
    await driver.get(PAGE_URL);

    await driver.wait(async () => {
        return driver.executeScript(() => {
            return Boolean(
                window.portfolioTranslations &&
                document.querySelector('#cv-language-select') &&
                document.querySelector('#epica')
            );
        });
    }, 10000);
}

async function changeLanguage(driver, language) {
    await driver.executeScript(lang => {
        const selector = document.querySelector(
            '#cv-language-select'
        );

        selector.value = lang;

        selector.dispatchEvent(
            new Event('change', { bubbles: true })
        );
    }, language);

    await driver.wait(async () => {
        return driver.executeScript(lang => {
            const dictionary =
                window.portfolioTranslations?.[lang];

            const title = document.querySelector(
                '#epica [data-i18n="qmEpicTitle"]'
            );

            return Boolean(
                dictionary &&
                document.documentElement.lang
                    .toLowerCase().startsWith(lang) &&
                title?.textContent.trim() ===
                    dictionary.qmEpicTitle
            );
        }, language);
    }, 10000);
}

async function verifyTranslations(driver, language, keys) {
    const result = await driver.executeScript(
        (lang, translationKeys) => {
            const dictionary =
                window.portfolioTranslations?.[lang];

            return translationKeys.map(key => {
                const element = document.querySelector(
                    `[data-i18n="${key}"]`
                );

                return {
                    key,
                    expected: dictionary?.[key] ?? null,
                    actual: element?.textContent ?? null,
                    count: document.querySelectorAll(
                        `[data-i18n="${key}"]`
                    ).length
                };
            });
        },
        language,
        keys
    );

    for (const item of result) {
        assert.ok(
            item.expected,
            `${language}: falta traducción ${item.key}`
        );

        assert.equal(
            item.count,
            1,
            `${language}: cantidad incorrecta de elementos ${item.key}`
        );

        assert.equal(
            normalize(item.actual),
            normalize(item.expected),
            `${language}: traducción incorrecta ${item.key}`
        );
    }

    return result.length;
}

test('EPIC-001 — Traducción de cabecera y épica', async t => {
    const driver = await createDriver();

    t.after(async () => {
        await driver.quit();
    });

    await openPage(driver);

    for (const language of LANGUAGES) {
        await changeLanguage(driver, language);

        const total = await verifyTranslations(
            driver,
            language,
            ALL_KEYS
        );

        assert.equal(total, 34);

        console.log(
            `EPIC-001 | ${language.toUpperCase()} | ` +
            `${total} ELEMENTOS | PASS`
        );
    }
});

test('EPIC-002 — Persistencia e integridad ES/EN/PT', async t => {
    const driver = await createDriver();

    t.after(async () => {
        await driver.quit();
    });

    await openPage(driver);

    for (const language of ['es', 'en', 'pt', 'es']) {
        await changeLanguage(driver, language);

        await verifyTranslations(
            driver,
            language,
            ALL_KEYS
        );

        const structure = await driver.executeScript(() => {
            const section = document.querySelector('#epica');

            return {
                document: section.querySelectorAll(
                    '.qm-charter'
                ).length,

                sections: section.querySelectorAll(
                    '.qm-charter-section'
                ).length,

                included: section.querySelectorAll(
                    '[data-i18n^="qmEpicScopeIncluded0"]'
                ).length,

                pending: section.querySelectorAll(
                    '[data-i18n^="qmEpicScopePending0"]'
                ).length,

                footer: Boolean(
                    section.querySelector('.qm-charter-footer')
                ),

                selectedLanguage: localStorage.getItem(
                    'portfolioLanguage'
                )
            };
        });

        assert.equal(structure.document, 1);
        assert.equal(structure.sections, 4);
        assert.equal(structure.included, 6);
        assert.equal(structure.pending, 4);
        assert.equal(structure.footer, true);

        assert.equal(
            structure.selectedLanguage,
            language,
            `Idioma no persistido: ${language}`
        );

        console.log(
            `EPIC-002 | ${language.toUpperCase()} | ` +
            'ESTRUCTURA Y PERSISTENCIA | PASS'
        );
    }
});
