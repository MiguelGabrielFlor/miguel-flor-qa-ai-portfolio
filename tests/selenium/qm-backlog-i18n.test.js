
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Builder, By } = require('selenium-webdriver');

const BROWSER = process.env.SELENIUM_BROWSER || 'chrome';

const PAGE_URL = pathToFileURL(
    path.resolve(__dirname, '../../quality-management.html')
).href;

const LANGUAGES = ['es', 'en', 'pt', 'es'];

const BACKLOG_KEYS = [
    'qmBacklogTitle',
    'qmBacklogDescription',
    'qmBacklogDocumentType',
    'qmBacklogStatus',
    'qmBacklogHeading',
    'qmBacklogIntroduction',
    'qmBacklogInitiativesTitle',
    'qmBacklogInitiativesDescription',
    'qmBacklogColumnInitiative',
    'qmBacklogColumnPriority',
    'qmBacklogColumnStatus',
    'qmBacklogColumnReference',
    'qmBacklogPriorityHigh',
    'qmBacklogPriorityMedium',
    'qmBacklogStatusPending',
    'qmBacklogStatusCompleted',
    'qmBacklogStatusReview',
    'qmBacklogBL01Title',
    'qmBacklogBL01Description',
    'qmBacklogBL02Title',
    'qmBacklogBL02Description',
    'qmBacklogBL02Validation',
    'qmBacklogBL02Results',
    'qmBacklogTestCases',
    'qmBacklogExecutionReport',
    'qmBacklogBL03Title',
    'qmBacklogBL03Description',
    'qmBacklogBL03Reference',
    'qmBacklogBL04Title',
    'qmBacklogBL04Description',
    'qmBacklogQualityManagement',
    'qmBacklogCriteriaTitle',
    'qmBacklogCriteriaDescription',
    'qmBacklogImpactTitle',
    'qmBacklogImpactDescription',
    'qmBacklogRiskTitle',
    'qmBacklogRiskDescription',
    'qmBacklogEffortTitle',
    'qmBacklogEffortDescription',
    'qmBacklogDependenciesTitle',
    'qmBacklogDependenciesDescription',
    'qmBacklogRisksTitle',
    'qmBacklogRisksColumnRisk',
    'qmBacklogRisksColumnDescription',
    'qmBacklogRisksColumnMitigation',
    'qmBacklogRisk01Title',
    'qmBacklogRisk01Description',
    'qmBacklogRisk01Mitigation',
    'qmBacklogRisk02Title',
    'qmBacklogRisk02Description',
    'qmBacklogRisk02Mitigation',
    'qmBacklogRisk03Title',
    'qmBacklogRisk03Description',
    'qmBacklogRisk03Mitigation',
    'qmBacklogDecisionsTitle',
    'qmBacklogDecisionsDescription',
    'qmBacklogDecision01Title',
    'qmBacklogDecision01Description',
    'qmBacklogDecision02Title',
    'qmBacklogDecision02Description',
    'qmBacklogDecision03Title',
    'qmBacklogDecision03Description',
    'qmBacklogFooterLabel',
    'qmBacklogFooterStatus',
    'qmBacklogFinalNote'
];

function normalize(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
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
                document.querySelector('#backlog')
            );
        });
    }, 10000);
}

async function changeLanguage(driver, language) {
    await driver.executeScript((lang) => {
        const select = document.querySelector('#cv-language-select');

        select.value = lang;
        select.dispatchEvent(new Event('change', { bubbles: true }));
    }, language);

    await driver.wait(async () => {
        const current = await driver.executeScript(() => {
            return document.documentElement.lang;
        });

        return current.toLowerCase().startsWith(language);
    }, 10000);
}

async function getDictionary(driver, language) {
    return driver.executeScript((lang) => {
        return window.portfolioTranslations[lang];
    }, language);
}

test('BACKLOG-001 — Traducciones completas ES/EN/PT', async (t) => {
    const driver = await createDriver();

    t.after(async () => {
        await driver.quit();
    });

    await openPage(driver);

    for (const language of LANGUAGES) {
        await changeLanguage(driver, language);

        const dictionary = await getDictionary(driver, language);

        assert.ok(dictionary, `Diccionario inexistente: ${language}`);

        const elements = await driver.findElements(
            By.css('#backlog [data-i18n]')
        );

        const actualKeys = await driver.executeScript(() => {
            return Array.from(
                document.querySelectorAll('#backlog [data-i18n]')
            ).map(element => element.dataset.i18n);
        });

        assert.equal(
            elements.length,
            actualKeys.length,
            'Cantidad inconsistente de elementos traducibles'
        );

        for (const key of BACKLOG_KEYS) {
            assert.ok(
                Object.prototype.hasOwnProperty.call(dictionary, key),
                `${language}: falta la clave ${key}`
            );

            assert.ok(
                normalize(dictionary[key]),
                `${language}: traducción vacía en ${key}`
            );

            assert.ok(
                actualKeys.includes(key),
                `${language}: falta el elemento HTML ${key}`
            );
        }

        for (const key of actualKeys) {
            assert.ok(
                Object.prototype.hasOwnProperty.call(dictionary, key),
                `${language}: clave HTML sin traducción ${key}`
            );
        }

        const results = await driver.executeScript(() => {
            const section = document.querySelector('#backlog');

            return Array.from(
                section.querySelectorAll('[data-i18n]')
            ).map(element => ({
                key: element.dataset.i18n,
                text: element.textContent
            }));
        });

        for (const item of results) {
            assert.equal(
                normalize(item.text),
                normalize(dictionary[item.key]),
                `${language}: traducción incorrecta en ${item.key}`
            );
        }

        console.log(
            `BACKLOG-001 | ${language.toUpperCase()} | ` +
            `${results.length} ELEMENTOS | PASS`
        );
    }
});

test('BACKLOG-002 — Iniciativas, estados, riesgos y enlaces', async (t) => {
    const driver = await createDriver();

    t.after(async () => {
        await driver.quit();
    });

    await openPage(driver);

    for (const language of LANGUAGES) {
        await changeLanguage(driver, language);

        const dictionary = await getDictionary(driver, language);

        const rows = await driver.executeScript(() => {
            return Array.from(
                document.querySelectorAll(
                    '#backlog .qm-planning-table tbody tr'
                )
            ).map(row => ({
                id: row.querySelector('td')?.textContent.trim(),
                text: row.textContent.replace(/\s+/g, ' ').trim()
            }));
        });

        const initiatives = rows.filter(row =>
            /^BL-\d+$/.test(row.id)
        );

        assert.deepEqual(
            initiatives.map(row => row.id),
            ['BL-01', 'BL-02', 'BL-03', 'BL-04'],
            `${language}: iniciativas incorrectas`
        );

        const expected = [
            {
                id: 'BL-01',
                title: 'qmBacklogBL01Title',
                priority: 'qmBacklogPriorityHigh',
                status: 'qmBacklogStatusPending'
            },
            {
                id: 'BL-02',
                title: 'qmBacklogBL02Title',
                priority: 'qmBacklogPriorityMedium',
                status: 'qmBacklogStatusCompleted'
            },
            {
                id: 'BL-03',
                title: 'qmBacklogBL03Title',
                priority: 'qmBacklogPriorityMedium',
                status: 'qmBacklogStatusReview'
            },
            {
                id: 'BL-04',
                title: 'qmBacklogBL04Title',
                priority: 'qmBacklogPriorityHigh',
                status: 'qmBacklogStatusPending'
            }
        ];

        for (const initiative of expected) {
            const row = initiatives.find(item =>
                item.id === initiative.id
            );

            for (const key of [
                initiative.title,
                initiative.priority,
                initiative.status
            ]) {
                assert.ok(
                    row.text.includes(normalize(dictionary[key])),
                    `${language}: ${initiative.id} no contiene ${key}`
                );
            }
        }

        const structure = await driver.executeScript(() => {
            const section = document.querySelector('#backlog');

            return {
                tables: section.querySelectorAll(
                    '.qm-planning-table'
                ).length,

                criteria: section.querySelectorAll(
                    '.qm-planning-criteria > div'
                ).length,

                risks: section.querySelectorAll(
                    '.qm-planning-table'
                )[1]?.querySelectorAll('tbody tr').length,

                decisions: section.querySelectorAll(
                    '.qm-planning-decisions > div'
                ).length
            };
        });

        assert.equal(structure.tables, 2);
        assert.equal(structure.criteria, 4);
        assert.equal(structure.risks, 3);
        assert.equal(structure.decisions, 3);

        const links = await driver.executeScript(() => {
            return Array.from(
                document.querySelectorAll('#backlog a[href]')
            ).map(link => ({
                href: link.getAttribute('href'),
                target: link.getAttribute('target'),
                rel: link.getAttribute('rel') || ''
            }));
        });

        for (const href of [
            'docs/test-cases.md',
            'docs/test-report.md'
        ]) {
            const link = links.find(item => item.href === href);

            assert.ok(link, `Falta enlace ${href}`);
            assert.equal(link.target, '_blank');
            assert.ok(link.rel.includes('noopener'));
        }

        console.log(
            `BACKLOG-002 | ${language.toUpperCase()} | ` +
            '4 INICIATIVAS | 3 RIESGOS | 3 DECISIONES | PASS'
        );
    }
});
