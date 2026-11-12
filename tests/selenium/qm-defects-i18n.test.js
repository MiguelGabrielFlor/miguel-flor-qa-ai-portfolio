const { createDriver: createSharedDriver } = require('./selenium-config');

'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { By, until } = require('selenium-webdriver');

const browser = process.env.SELENIUM_BROWSER || 'chrome';

const pageUrl = pathToFileURL(
    path.resolve(__dirname, '../../quality-management.html')
).href;

const languages = ['es', 'en', 'pt', 'es'];
const stepKeys = ['01', '02', '03', '04', '05'];

const staticKeys = [
    'qmDefectsTitle',
    'qmDefectsDescription',
    'qmDefectProcessEyebrow',
    'qmDefectProcessTitle',
    'qmDefectProcessDescription',
    'qmDefectStepsAria',
    'qmDefectActivitiesTitle',
    'qmDefectPrevious',
    'qmDefectNext',
    'qmDefectRetestTitle',
    'qmDefectRetestDescription',
    'qmDefectEvidenceEyebrow',
    'qmDefectEvidenceTitle',
    'qmDefectEvidenceDescription',
    'qmBugSelectorAria',
    'qmBugRequirementLabel',
    'qmBugTestLabel',
    'qmBugSeverityLabel',
    'qmBugPriorityLabel',
    'qmBugResolutionTitle',
    'qmDefectDocumentationDescription',
    'qmDefectDocumentationLink',
    'qmDefectFinalNote',

    ...stepKeys.flatMap(number => [
        `qmDefectStep${number}Short`,
        `qmDefectStep${number}Subtitle`
    ])
];

async function createDriver(t) {
    const driver = await createSharedDriver(browser);

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(pageUrl);

    await driver.wait(
        until.elementLocated(By.id('defectos')),
        15000
    );

    return driver;
}

async function readDictionary(driver, language) {
    return driver.executeScript(function (lang) {
        const root = window.portfolioTranslations;

        if (!root || typeof root !== 'object') {
            return null;
        }

        const dictionary = root[lang];

        return dictionary && typeof dictionary === 'object'
            ? dictionary
            : null;
    }, language);
}

async function textOf(driver, selector) {
    return driver.executeScript(function (css) {
        const element = document.querySelector(css);

        return element
            ? element.textContent.trim().replace(/\s+/g, ' ')
            : null;
    }, selector);
}

async function attributeOf(driver, selector, attribute) {
    return driver.executeScript(function (css, name) {
        return document.querySelector(css)
            ?.getAttribute(name) ?? null;
    }, selector, attribute);
}

function normalized(value) {
    return String(value ?? '')
        .trim()
        .replace(/\s+/g, ' ');
}

async function waitText(driver, selector, expected) {
    const expectedNormalized = normalized(expected);

    await driver.wait(
        async () => {
            const actual = await textOf(driver, selector);

            return normalized(actual) === expectedNormalized;
        },
        10000,
        `Texto incorrecto en ${selector}: ` +
        `se esperaba «${expectedNormalized}»`
    );

    assert.equal(
        normalized(await textOf(driver, selector)),
        expectedNormalized,
        selector
    );
}

async function changeLanguage(driver, language) {
    const select = await driver.findElement(
        By.id('cv-language-select')
    );

    await driver.executeScript(
        function (element, lang) {
            element.value = lang;

            element.dispatchEvent(
                new Event('change', { bubbles: true })
            );
        },
        select,
        language
    );

    await driver.wait(
        async () => driver.executeScript(
            `return document.documentElement.lang === arguments[0]
                && localStorage.getItem("portfolioLanguage")
                    === arguments[0]`,
            language
        ),
        10000,
        `No se aplicó o persistió el idioma ${language}`
    );
}

async function checkStaticTranslations(driver, dictionary) {
    for (const key of staticKeys) {
        assert.equal(
            typeof dictionary[key],
            'string',
            `Falta traducción: ${key}`
        );

        if (key.endsWith('Aria')) {
            const selector =
                `[data-i18n-aria-label="${key}"]`;

            const actual = await attributeOf(
                driver,
                selector,
                'aria-label'
            );

            assert.notEqual(
                actual,
                null,
                `No existe ${selector}`
            );

            assert.equal(
                normalized(actual),
                normalized(dictionary[key]),
                `aria-label ${key}`
            );

        } else {
            const selector = `[data-i18n="${key}"]`;

            assert.notEqual(
                await textOf(driver, selector),
                null,
                `No existe ${selector}`
            );

            await waitText(
                driver,
                selector,
                dictionary[key]
            );
        }
    }
}

async function clickAndCheckSelected(
    driver,
    selector,
    index,
    total
) {
    const buttons = await driver.findElements(
        By.css(selector)
    );

    assert.equal(
        buttons.length,
        total,
        `Cantidad de botones ${selector}`
    );

    await driver.executeScript(
        'arguments[0].click()',
        buttons[index]
    );

    await driver.wait(
        async () => {
            const states = await Promise.all(
                buttons.map(button =>
                    button.getAttribute('aria-pressed')
                )
            );

            return states.every(
                (value, position) =>
                    value === (
                        position === index
                            ? 'true'
                            : 'false'
                    )
            );
        },
        10000,
        `Selección activa incorrecta: ${selector}[${index}]`
    );
}

async function checkStep(driver, dictionary, index) {
    const number = stepKeys[index];
    const prefix = `qmDefectStep${number}`;

    const suffixes = [
        'Title',
        'Label',
        'Description',
        'Activity01',
        'Activity02',
        'Activity03',
        'Activity04'
    ];

    for (const suffix of suffixes) {
        assert.equal(
            typeof dictionary[prefix + suffix],
            'string',
            `Falta ${prefix + suffix}`
        );
    }

    await clickAndCheckSelected(
        driver,
        '.qm-defect-step-button[data-defect-step]',
        index,
        5
    );

    await waitText(
        driver,
        '#qm-defect-step-title',
        dictionary[prefix + 'Title']
    );

    await waitText(
        driver,
        '#qm-defect-step-label',
        dictionary[prefix + 'Label']
    );

    await waitText(
        driver,
        '#qm-defect-step-description',
        dictionary[prefix + 'Description']
    );

    await waitText(
        driver,
        '#qm-defect-step-code',
        `${dictionary.qmDefectStepCodePrefix} ${number}`
    );

    await waitText(
        driver,
        '#qm-defect-counter',
        `${index + 1} ${dictionary.qmDefectCounterOf} 5`
    );

    const activities = await driver.executeScript(() => {
        return [
            ...document.querySelector(
                '#qm-defect-activities-grid'
            ).children
        ].map(element =>
            element.textContent.trim().replace(/\s+/g, ' ')
        );
    });

    assert.equal(
        activities.length,
        4,
        `La etapa ${number} debe mostrar cuatro actividades`
    );

    for (let activity = 1; activity <= 4; activity++) {
        const key = `${prefix}Activity0${activity}`;

        assert.equal(
            activities[activity - 1],
            normalized(dictionary[key]),
            `Actividad ${activity} de etapa ${number}`
        );
    }

    assert.equal(
        await attributeOf(
            driver,
            '#qm-defect-prev',
            'disabled'
        ) !== null,
        index === 0,
        `Estado Anterior en etapa ${number}`
    );

    assert.equal(
        await attributeOf(
            driver,
            '#qm-defect-next',
            'disabled'
        ) !== null,
        index === 4,
        `Estado Siguiente en etapa ${number}`
    );
}

async function checkBug(driver, dictionary, index) {
    const number = String(index + 1).padStart(3, '0');
    const id = `BUG-${number}`;
    const prefix = `qmBug${number}`;

    for (const suffix of [
        'Title',
        'Description',
        'Resolution'
    ]) {
        assert.equal(
            typeof dictionary[prefix + suffix],
            'string',
            `Falta ${prefix + suffix}`
        );
    }

    await clickAndCheckSelected(
        driver,
        '.qm-bug-button[data-bug]',
        index,
        5
    );

    await waitText(
        driver,
        '#qm-bug-code',
        id
    );

    await waitText(
        driver,
        '#qm-bug-title',
        dictionary[prefix + 'Title']
    );

    await waitText(
        driver,
        '#qm-bug-description',
        dictionary[prefix + 'Description']
    );

    await waitText(
        driver,
        '#qm-bug-resolution-text',
        dictionary[prefix + 'Resolution']
    );

    await waitText(
        driver,
        '#qm-bug-status',
        dictionary.qmBugStatusClosed
    );

    const metadataSelectors = [
        '#qm-bug-requirement',
        '#qm-bug-test',
        '#qm-bug-severity',
        '#qm-bug-priority'
    ];

    for (const selector of metadataSelectors) {
        const value = await textOf(driver, selector);

        assert.ok(
            value && normalized(value).length > 0,
            `Campo vacío: ${id} ${selector}`
        );
    }
}

// =====================================================
// DEFECT-001 — PROCESO DE GESTIÓN DE DEFECTOS
// =====================================================

test(
    'DEFECT-001 — Cinco etapas, navegación e internacionalización ES/EN/PT',
    async t => {
        const driver = await createSharedDriver(t);

        for (const language of languages) {
            await changeLanguage(driver, language);

            const dictionary = await readDictionary(
                driver,
                language
            );

            assert.ok(
                dictionary,
                `No se encontró window.portfolioTranslations.${language}`
            );

            await checkStaticTranslations(
                driver,
                dictionary
            );

            for (let index = 0; index < 5; index++) {
                await checkStep(
                    driver,
                    dictionary,
                    index
                );

                console.log(
                    `ETAPA ${stepKeys[index]} | ` +
                    `${language.toUpperCase()} | PASS`
                );
            }

            // Verificar navegación Anterior y Siguiente.

            const previous = await driver.findElement(
                By.id('qm-defect-prev')
            );

            await driver.executeScript(
                'arguments[0].click()',
                previous
            );

            await waitText(
                driver,
                '#qm-defect-step-title',
                dictionary.qmDefectStep04Title
            );

            const next = await driver.findElement(
                By.id('qm-defect-next')
            );

            await driver.executeScript(
                'arguments[0].click()',
                next
            );

            await waitText(
                driver,
                '#qm-defect-step-title',
                dictionary.qmDefectStep05Title
            );
        }
    }
);

// =====================================================
// DEFECT-002 — DEFECTOS DOCUMENTADOS
// =====================================================

test(
    'DEFECT-002 — Cinco bugs documentados e internacionalización ES/EN/PT',
    async t => {
        const driver = await createSharedDriver(t);

        for (const language of languages) {
            await changeLanguage(driver, language);

            const dictionary = await readDictionary(
                driver,
                language
            );

            assert.ok(
                dictionary,
                `No se encontró window.portfolioTranslations.${language}`
            );

            await checkStaticTranslations(
                driver,
                dictionary
            );

            for (let index = 0; index < 5; index++) {
                await checkBug(
                    driver,
                    dictionary,
                    index
                );

                console.log(
                    `BUG-${String(index + 1).padStart(3, '0')} | ` +
                    `${language.toUpperCase()} | PASS`
                );
            }
        }
    }
);
