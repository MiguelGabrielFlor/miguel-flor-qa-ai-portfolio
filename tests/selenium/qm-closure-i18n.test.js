const { createDriver: createSharedDriver } = require('./selenium-config');

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { By } = require('selenium-webdriver');

const BROWSER = process.env.SELENIUM_BROWSER || 'chrome';

const PAGE_URL = pathToFileURL(
    path.resolve(__dirname, '../../quality-management.html')
).href;

const LANGUAGES = ['es', 'en', 'pt', 'es'];

const CLOSURE_KEYS = [
    'qmClosureTitle',
    'qmClosureDescription',
    'qmClosureDocumentType',
    'qmClosureStatus',
    'qmClosureHeading',
    'qmClosureIntroduction',
    'qmClosureStateLabel',
    'qmClosureStateValue',
    'qmClosureResultsTitle',
    'qmClosureResult01Title',
    'qmClosureResult01Description',
    'qmClosureResult02Title',
    'qmClosureResult02Description',
    'qmClosureResult03Title',
    'qmClosureResult03Description',
    'qmClosureResult04Title',
    'qmClosureResult04Description',
    'qmClosureEvidenceTitle',
    'qmClosureEvidenceDescription',
    'qmClosureEvidenceColumnTest',
    'qmClosureEvidenceColumnResult',
    'qmClosureEvidenceColumnStatus',
    'qmClosureEvidenceTest01',
    'qmClosureEvidenceTest02',
    'qmClosureEvidenceTest03',
    'qmClosureEvidenceTest04',
    'qmClosureEvidenceApproved',
    'qmClosureEvidenceNote',
    'qmClosureEvidenceLink',
    'qmClosurePendingTitle',
    'qmClosurePending01Title',
    'qmClosurePending01Description',
    'qmClosurePending02Title',
    'qmClosurePending02Description',
    'qmClosurePending03Title',
    'qmClosurePending03Description',
    'qmClosurePending04Title',
    'qmClosurePending04Description',
    'qmClosureConclusionTitle',
    'qmClosureConclusionHeading',
    'qmClosureConclusionParagraph01',
    'qmClosureConclusionParagraph02',
    'qmClosureFooterLabel',
    'qmClosureFooterStatus',
    'qmClosureFinalNote'
];

function normalize(value) {
    return String(value ?? '')
        .replace(/\s+/g, ' ')
        .trim();
}

async function createDriver() {
    return createSharedDriver(BROWSER);
}

async function openPage(driver) {
    await driver.get(PAGE_URL);

    await driver.wait(async () => {
        return driver.executeScript(() => {
            return Boolean(
                window.portfolioTranslations &&
                document.querySelector('#cv-language-select') &&
                document.querySelector('#cierre-epica')
            );
        });
    }, 10000);
}

async function changeLanguage(driver, language) {
    await driver.executeScript((lang) => {
        const select = document.querySelector('#cv-language-select');

        select.value = lang;
        select.dispatchEvent(
            new Event('change', { bubbles: true })
        );
    }, language);

    await driver.wait(async () => {
        return driver.executeScript((lang) => {
            const section = document.querySelector('#cierre-epica');
            const dictionary = window.portfolioTranslations?.[lang];

            if (!section || !dictionary) return false;

            const heading = section.querySelector(
                '[data-i18n="qmClosureTitle"]'
            );

            return document.documentElement.lang
                .toLowerCase()
                .startsWith(lang) &&
                heading?.textContent.trim() ===
                dictionary.qmClosureTitle;
        }, language);
    }, 10000);
}

async function getDictionary(driver, language) {
    return driver.executeScript((lang) => {
        return window.portfolioTranslations[lang];
    }, language);
}

test('CLOSURE-001 — Internacionalización ES/EN/PT', async (t) => {
    const driver = await createDriver();

    t.after(async () => {
        await driver.quit();
    });

    await openPage(driver);

    for (const language of LANGUAGES) {
        await changeLanguage(driver, language);

        const dictionary = await getDictionary(driver, language);

        assert.ok(
            dictionary,
            `Diccionario inexistente: ${language}`
        );

        const results = await driver.executeScript(() => {
            return Array.from(
                document.querySelectorAll(
                    '#cierre-epica [data-i18n]'
                )
            ).map(element => ({
                key: element.dataset.i18n,
                text: element.textContent
            }));
        });

        const actualKeys = results.map(item => item.key);

        for (const key of CLOSURE_KEYS) {
            assert.ok(
                Object.prototype.hasOwnProperty.call(
                    dictionary,
                    key
                ),
                `${language}: falta traducción ${key}`
            );

            assert.ok(
                normalize(dictionary[key]),
                `${language}: traducción vacía ${key}`
            );

            assert.ok(
                actualKeys.includes(key),
                `${language}: falta elemento HTML ${key}`
            );
        }

        for (const item of results) {
            assert.ok(
                Object.prototype.hasOwnProperty.call(
                    dictionary,
                    item.key
                ),
                `${language}: clave HTML inexistente ${item.key}`
            );

            assert.equal(
                normalize(item.text),
                normalize(dictionary[item.key]),
                `${language}: traducción incorrecta ${item.key}`
            );
        }

        console.log(
            `CLOSURE-001 | ${language.toUpperCase()} | ` +
            `${results.length} ELEMENTOS | PASS`
        );
    }
});

test('CLOSURE-002 — Resultados y condiciones de cierre', async (t) => {
    const driver = await createDriver();

    t.after(async () => {
        await driver.quit();
    });

    await openPage(driver);

    for (const language of LANGUAGES) {
        await changeLanguage(driver, language);

        const dictionary = await getDictionary(driver, language);

        const structure = await driver.executeScript(() => {
            const section = document.querySelector('#cierre-epica');

            const resultRecords = section.querySelector(
                '.qm-report-records'
            );

            const table = section.querySelector(
                '.qm-report-table'
            );

            const pendingRecords = section.querySelectorAll(
                '.qm-report-records'
            )[1];

            const link = section.querySelector(
                '.qm-report-link'
            );

            return {
                sections: section.querySelectorAll(
                    '.qm-report-section'
                ).length,

                results: resultRecords?.querySelectorAll(
                    ':scope > div'
                ).length,

                pending: pendingRecords?.querySelectorAll(
                    ':scope > div'
                ).length,

                evidence: Array.from(
                    table?.querySelectorAll('tbody tr') || []
                ).map(row => ({
                    cells: Array.from(
                        row.querySelectorAll('td')
                    ).map(cell => cell.textContent.trim())
                })),

                link: link?.getAttribute('href'),

                conclusion: section.querySelector(
                    '[data-i18n="qmClosureConclusionHeading"]'
                )?.textContent,

                status: section.querySelector(
                    '[data-i18n="qmClosureFooterStatus"]'
                )?.textContent
            };
        });

        assert.equal(
            structure.sections,
            4,
            `${language}: cantidad de apartados incorrecta`
        );

        assert.equal(
            structure.results,
            4,
            `${language}: resultados alcanzados incorrectos`
        );

        assert.equal(
            structure.pending,
            4,
            `${language}: condiciones pendientes incorrectas`
        );

        assert.equal(
            structure.evidence.length,
            4,
            `${language}: cantidad de evidencias incorrecta`
        );

        const expectedEvidence = [
            ['qmClosureEvidenceTest01', '18/18'],
            ['qmClosureEvidenceTest02', '15/15'],
            ['qmClosureEvidenceTest03', '5/5'],
            ['qmClosureEvidenceTest04', '3/3']
        ];

        for (let i = 0; i < expectedEvidence.length; i++) {
            const [key, result] = expectedEvidence[i];
            const cells = structure.evidence[i].cells;

            assert.equal(
                normalize(cells[0]),
                normalize(dictionary[key]),
                `${language}: nombre de prueba incorrecto`
            );

            assert.equal(
                cells[1],
                result,
                `${language}: resultado incorrecto`
            );

            assert.equal(
                normalize(cells[2]),
                normalize(dictionary.qmClosureEvidenceApproved),
                `${language}: estado incorrecto`
            );
        }

        assert.equal(
            structure.link,
            'qa.html',
            `${language}: enlace de evidencia incorrecto`
        );

        assert.equal(
            normalize(structure.conclusion),
            normalize(dictionary.qmClosureConclusionHeading),
            `${language}: conclusión incorrecta`
        );

        assert.equal(
            normalize(structure.status),
            normalize(dictionary.qmClosureFooterStatus),
            `${language}: estado de cierre incorrecto`
        );

        console.log(
            `CLOSURE-002 | ${language.toUpperCase()} | ` +
            '4 RESULTADOS | 4 EVIDENCIAS | ' +
            '4 PENDIENTES | PASS'
        );
    }
});
