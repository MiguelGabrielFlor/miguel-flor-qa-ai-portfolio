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

const REQUIREMENTS = {
    RF: [
        ['RF-01', 3, false],
        ['RF-02', 3, false],
        ['RF-03', 3, false],
        ['RF-04', 3, false],
        ['RF-05', 5, true],
        ['RF-06', 7, true],
        ['RF-07', 3, false]
    ],
    RNF: [
        ['RNF-01', 3, false],
        ['RNF-02', 3, false],
        ['RNF-03', 3, false],
        ['RNF-04', 3, false]
    ]
};

const LANGUAGES = ['es', 'en', 'pt', 'es'];

function normalize(value) {
    return String(value ?? '').replace(/\s+/g, ' ').trim();
}

async function createDriver() {
    return createSharedDriver(BROWSER);
}

async function openPage(driver) {
    await driver.get(PAGE_URL);

    await driver.wait(async () => {
        return driver.executeScript(() => Boolean(
            window.portfolioTranslations &&
            document.querySelector('#cv-language-select') &&
            document.querySelector('#qm-requirement-explorer') &&
            document.querySelectorAll(
                '#qm-requirement-list-rf .qm-requirement-item'
            ).length === 7
        ));
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
            const dictionary = window.portfolioTranslations?.[lang];
            const heading = document.querySelector(
                '#requisitos [data-i18n="qmRequirementsTitle"]'
            );

            return Boolean(
                dictionary &&
                document.documentElement.lang
                    .toLowerCase().startsWith(lang) &&
                heading?.textContent.trim() ===
                    dictionary.qmRequirementsTitle
            );
        }, language);
    }, 10000);
}

async function selectRequirement(driver, type, index) {
    await driver.executeScript((category, position) => {
        const tab = document.querySelector(
            `[data-requirement-type="${category}"]`
        );

        if (tab.getAttribute('aria-pressed') !== 'true') {
            tab.click();
        }

        const listId = category === 'RF'
            ? '#qm-requirement-list-rf'
            : '#qm-requirement-list-rnf';

        const buttons = document.querySelectorAll(
            `${listId} .qm-requirement-item`
        );

        buttons[position].click();
    }, type, index);

    await driver.wait(async () => {
        return driver.executeScript((category, position) => {
            const listId = category === 'RF'
                ? '#qm-requirement-list-rf'
                : '#qm-requirement-list-rnf';

            const buttons = document.querySelectorAll(
                `${listId} .qm-requirement-item`
            );

            return buttons[position]?.getAttribute(
                'aria-pressed'
            ) === 'true';
        }, type, index);
    }, 10000);
}

async function verifyRequirement(driver, type, index, language) {
    const [code, applicationCount, hasStatus] =
        REQUIREMENTS[type][index];

    const prefix = type === 'RF'
        ? `qmRF${code.slice(3)}`
        : `qmRNF${code.slice(4)}`;

    const result = await driver.executeScript(
        (category, position, keyPrefix) => {
            const dictionary = window.portfolioTranslations[
                document.documentElement.lang.slice(0, 2)
            ];

            const listId = category === 'RF'
                ? '#qm-requirement-list-rf'
                : '#qm-requirement-list-rnf';

            const detailId = category === 'RF'
                ? '#qm-requirement-detail-rf'
                : '#qm-requirement-detail-rnf';

            const buttons = Array.from(
                document.querySelectorAll(
                    `${listId} .qm-requirement-item`
                )
            );

            const detail = document.querySelector(detailId);

            return {
                activeType: document.querySelector(
                    '#qm-requirement-explorer'
                ).dataset.activeType,

                selectedCount: buttons.filter(
                    button => button.getAttribute(
                        'aria-pressed'
                    ) === 'true'
                ).length,

                selected: buttons[position]?.getAttribute(
                    'aria-pressed'
                ),

                code: buttons[position]?.querySelector(
                    '.qm-requirement-item-code'
                )?.textContent,

                listName: buttons[position]?.querySelector(
                    '.qm-requirement-item-name'
                )?.textContent,

                category: detail.querySelector(
                    '.qm-card-category'
                )?.textContent,

                title: detail.querySelector('h3')?.textContent,

                description: detail.querySelector('p')?.textContent,

                subtitle: detail.querySelector('h4')?.textContent,

                applications: Array.from(
                    detail.querySelectorAll('ul li')
                ).map(item => item.textContent),

                status: detail.querySelector(
                    '.qm-requirement-status'
                )?.textContent ?? null,

                expected: {
                    name: dictionary[`${keyPrefix}Name`],
                    description: dictionary[
                        `${keyPrefix}Description`
                    ],
                    category: dictionary[
                        category === 'RF'
                            ? 'qmRequirementCategoryRF'
                            : 'qmRequirementCategoryRNF'
                    ],
                    subtitle: dictionary[
                        'qmRequirementApplicationTitle'
                    ],
                    statusLabel: dictionary[
                        'qmRequirementStatusLabel'
                    ],
                    status: dictionary[`${keyPrefix}Status`]
                }
            };
        }, type, index, prefix
    );

    assert.equal(result.activeType, type);
    assert.equal(result.selectedCount, 1);
    assert.equal(result.selected, 'true');
    assert.equal(result.code, code);

    assert.ok(result.expected.name);
    assert.ok(result.expected.description);
    assert.ok(result.expected.category);
    assert.ok(result.expected.subtitle);

    assert.equal(
        normalize(result.listName),
        normalize(result.expected.name)
    );

    assert.equal(
        normalize(result.title),
        normalize(result.expected.name)
    );

    assert.equal(
        normalize(result.description),
        normalize(result.expected.description)
    );

    assert.equal(
        normalize(result.category),
        normalize(result.expected.category)
    );

    assert.equal(
        normalize(result.subtitle),
        normalize(result.expected.subtitle)
    );

    assert.equal(
        result.applications.length,
        applicationCount
    );

    const dictionary = await driver.executeScript(
        lang => window.portfolioTranslations[lang],
        language
    );

    for (let i = 0; i < applicationCount; i++) {
        const key = `${prefix}Application${String(i + 1).padStart(2, '0')}`;

        assert.ok(
            dictionary[key],
            `${language}: falta ${key}`
        );

        assert.equal(
            normalize(result.applications[i]),
            normalize(dictionary[key]),
            `${language}: aplicación incorrecta ${key}`
        );
    }

    if (hasStatus) {
        assert.ok(
            result.expected.status,
            `${language}: falta estado de ${code}`
        );

        assert.equal(
            normalize(result.status),
            normalize(
                result.expected.statusLabel +
                result.expected.status
            )
        );
    } else {
        assert.equal(result.status, null);
    }
}

test('REQ-001 — Traducción de los 11 requisitos', async (t) => {
    const driver = await createDriver();

    t.after(async () => {
        await driver.quit();
    });

    await openPage(driver);

    for (const language of ['es', 'en', 'pt']) {
        await changeLanguage(driver, language);

        for (const type of ['RF', 'RNF']) {
            for (let index = 0; index < REQUIREMENTS[type].length; index++) {
                await selectRequirement(driver, type, index);
                await verifyRequirement(driver, type, index, language);
            }
        }

        console.log(
            `REQ-001 | ${language.toUpperCase()} | ` +
            '11 REQUISITOS | PASS'
        );
    }
});

test('REQ-002 — Persistencia de selección ES/EN/PT', async (t) => {
    const driver = await createDriver();

    t.after(async () => {
        await driver.quit();
    });

    await openPage(driver);

    for (const [type, index] of [
        ['RF', 5],
        ['RNF', 3]
    ]) {
        await changeLanguage(driver, 'es');
        await selectRequirement(driver, type, index);

        for (const language of LANGUAGES) {
            await changeLanguage(driver, language);

            await verifyRequirement(
                driver, type, index, language
            );

            console.log(
                `REQ-002 | ${type}-${index + 1} | ` +
                `${language.toUpperCase()} | PASS`
            );
        }
    }
});
