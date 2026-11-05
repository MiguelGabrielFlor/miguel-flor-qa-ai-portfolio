
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Builder, By, until } = require('selenium-webdriver');

const browser = process.env.SELENIUM_BROWSER || 'chrome';

const pageUrl = pathToFileURL(
    path.resolve(__dirname, '../../quality-management.html')
).href;

const languages = ['es', 'en', 'pt', 'es'];


const cycles = [
    { id: 's1', prefix: 'qmS1' },
    { id: 's15', prefix: 'qmS15' },
    { id: 's2', prefix: 'qmS2' },
    { id: 'ec', prefix: 'qmEc' }
];


const staticKeys = [
    'qmSprintsTitle',
    'qmSprintsDescription',
    'qmCycleSelectorAria',
    'qmCycleS1Subtitle',
    'qmCycleS15Subtitle',
    'qmCycleS2Subtitle',
    'qmCycleEcTitle',
    'qmCycleEcSubtitle',
    'qmSprintWheelAria',
    'qmSprintResultsAria',
    'qmSprintsNote'
];


function normalize(value) {
    return String(value ?? '')
        .replace(/\s+/g, ' ')
        .trim();
}

async function createDriver(t) {
    const driver = await new Builder()
        .forBrowser(browser)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(pageUrl);

    await driver.wait(
        until.elementLocated(By.id('sprints')),
        15000
    );

    return driver;
}

async function dictionaryFor(driver, language) {
    return driver.executeScript(lang => {
        return window.portfolioTranslations?.[lang] ?? null;
    }, language);
}

async function readText(driver, selector) {
    return driver.executeScript(css => {
        const element = document.querySelector(css);

        return element
            ? element.textContent.replace(/\s+/g, ' ').trim()
            : null;
    }, selector);
}

async function waitText(driver, selector, expected) {
    await driver.wait(
        async () => {
            const actual = await readText(driver, selector);

            return normalize(actual) === normalize(expected);
        },
        10000,
        `Traducción incorrecta: ${selector}. ` +
        `Esperado: ${expected}`
    );

    assert.equal(
        normalize(await readText(driver, selector)),
        normalize(expected)
    );
}

function translation(dictionary, key) {
    assert.equal(
        typeof dictionary[key],
        'string',
        `Falta la traducción ${key}`
    );

    assert.ok(
        dictionary[key].trim(),
        `Traducción vacía: ${key}`
    );

    return dictionary[key];
}

async function changeLanguage(driver, language) {
    const selector = await driver.findElement(
        By.id('cv-language-select')
    );

    await driver.executeScript((element, lang) => {
        element.value = lang;

        element.dispatchEvent(
            new Event('change', { bubbles: true })
        );
    }, selector, language);

    await driver.wait(
        async () => driver.executeScript(lang => {
            return document.documentElement.lang === lang &&
                localStorage.getItem('portfolioLanguage') === lang;
        }, language),
        10000,
        `No se aplicó el idioma ${language}`
    );
}

async function checkStatic(driver, dictionary) {
    for (const key of staticKeys) {
        const expected = translation(dictionary, key);

        if (key.endsWith('Aria')) {
            const actual = await driver.executeScript(k => {
                return document.querySelector(
                    `[data-i18n-aria-label="${k}"]`
                )?.getAttribute('aria-label') ?? null;
            }, key);

            assert.equal(
                normalize(actual),
                normalize(expected),
                `Etiqueta accesible: ${key}`
            );

        } else {
            await waitText(
                driver,
                `[data-i18n="${key}"]`,
                expected
            );
        }
    }
}

async function selectButton(driver, selector, index, total) {
    const buttons = await driver.findElements(
        By.css(selector)
    );

    assert.equal(
        buttons.length,
        total,
        `Cantidad de botones: ${selector}`
    );

    await driver.executeScript(
        'arguments[0].click()',
        buttons[index]
    );

    await driver.wait(async () => {
        const states = await Promise.all(
            buttons.map(button =>
                button.getAttribute('aria-pressed')
            )
        );

        return states.every((state, position) =>
            state === (position === index ? 'true' : 'false')
        );
    }, 10000, `Selección activa incorrecta: ${selector}`);
}

async function checkCycle(driver, dictionary, cycle, index) {
    const prefix = cycle.prefix;

    await selectButton(
        driver,
        '.qm-cycle-button[data-cycle]',
        index,
        4
    );

    const fields = [
        ['#qm-cycle-category', 'Category'],
        ['#qm-cycle-title', 'Title'],
        ['#qm-cycle-description', 'Description'],
        ['#qm-wheel-label', 'CenterLabel'],
        ['#qm-wheel-title', 'CenterTitle'],
        ['#qm-wheel-subtitle', 'CenterSubtitle']
    ];

    for (const [selector, suffix] of fields) {
        await waitText(
            driver,
            selector,
            translation(dictionary, prefix + suffix)
        );
    }
}

async function checkWheelLabels(driver, dictionary, cycle) {

    const buttons = await driver.findElements(
        By.css('.qm-sprint-step[data-step]')
    );

    assert.equal(
        buttons.length,
        6,
        `${cycle.id}: deben existir seis botones`
    );

    for (let index = 0; index < 6; index++) {

        const key = `${cycle.prefix}Step${index + 1}Label`;

        const expected = translation(dictionary, key);

        const actual = await buttons[index]
            .findElement(By.css('strong'))
            .getText();

        assert.equal(
            normalize(actual),
            normalize(expected),
            `${cycle.id}: etiqueta incorrecta ` +
            `en etapa ${index + 1}`
        );
    }
}


async function checkStep(
    driver,
    dictionary,
    cycle,
    stepIndex
) {
    const stepNumber = stepIndex + 1;
    const prefix = `${cycle.prefix}Step${stepNumber}`;

    await selectButton(
        driver,
        '.qm-sprint-step[data-step]',
        stepIndex,
        6
    );

    const expectedTitle = translation(
        dictionary,
        prefix + 'Title'
    );

    const expectedDescription = translation(
        dictionary,
        prefix + 'Description'
    );

    await driver.wait(async () => {
        const content = await readText(
            driver,
            '#qm-sprint-detail'
        );

        return normalize(content).includes(
            normalize(expectedTitle)
        ) && normalize(content).includes(
            normalize(expectedDescription)
        );
    }, 10000, `No se actualizó ${prefix}`);

    const detail = await readText(
        driver,
        '#qm-sprint-detail'
    );

    for (const [name, expected] of [
        ['título', expectedTitle],
        ['descripción', expectedDescription]
    ]) {
        assert.ok(
            normalize(detail).includes(normalize(expected)),
            `${prefix}: falta ${name}: ${expected}`
        );
    }

    let activity = 1;
    let activityCount = 0;

    while (Object.hasOwn(
        dictionary,
        `${prefix}Activity${activity}`
    )) {
        const expected = translation(
            dictionary,
            `${prefix}Activity${activity}`
        );

        assert.ok(
            normalize(detail).includes(normalize(expected)),
            `${prefix}: falta actividad ${activity}`
        );

        activityCount++;
        activity++;
    }

    assert.ok(
        activityCount >= 3,
        `${prefix}: se esperaban al menos 3 actividades`
    );
}

async function checkResults(driver, dictionary, cycle) {
    const container = await readText(
        driver,
        '#qm-sprint-results'
    );

    assert.ok(
        container,
        `No hay resultados para ${cycle.id}`
    );

    for (let index = 1; index <= 3; index++) {
        const key = `${cycle.prefix}Result${index}`;

        const expected = translation(dictionary, key);

        assert.ok(
            normalize(container).includes(normalize(expected)),
            `${cycle.id}: falta resultado ${key}`
        );
    }
}

// =====================================================
// SPRINT-001 — CICLOS Y ETAPAS
// =====================================================

test(
    'SPRINT-001 — Cuatro ciclos y 24 etapas ES/EN/PT',
    async t => {
        const driver = await createDriver(t);

        for (const language of languages) {
            await changeLanguage(driver, language);

            const dictionary = await dictionaryFor(
                driver,
                language
            );

            assert.ok(
                dictionary,
                `No se encontró el diccionario ${language}`
            );

            await checkStatic(driver, dictionary);

            for (let index = 0; index < cycles.length; index++) {
                const cycle = cycles[index];
                
                await checkCycle(
                    driver,
                    dictionary,
                    cycle,
                    index
                );

                await checkWheelLabels(
                    driver,
                    dictionary,
                    cycle
                );

                for (let step = 0; step < 6; step++) {

                    await checkStep(
                        driver,
                        dictionary,
                        cycle,
                        step
                    );

                    console.log(
                        `${cycle.id.toUpperCase()} | ` +
                        `ETAPA ${step + 1} | ` +
                        `${language.toUpperCase()} | PASS`
                    );
                }
            }
        }
    }
);

// =====================================================
// SPRINT-002 — RESULTADOS Y SELECTORES
// =====================================================

test(
    'SPRINT-002 — Resultados documentados y selectores ES/EN/PT',
    async t => {
        const driver = await createDriver(t);

        for (const language of languages) {
            await changeLanguage(driver, language);

            const dictionary = await dictionaryFor(
                driver,
                language
            );

            assert.ok(
                dictionary,
                `No se encontró el diccionario ${language}`
            );

            await checkStatic(driver, dictionary);

            for (let index = 0; index < cycles.length; index++) {
                const cycle = cycles[index];

                await checkCycle(
                    driver,
                    dictionary,
                    cycle,
                    index
                );

                await checkResults(
                    driver,
                    dictionary,
                    cycle
                );

                console.log(
                    `RESULTADOS ${cycle.id.toUpperCase()} | ` +
                    `${language.toUpperCase()} | PASS`
                );
            }

            const continuous = await driver.findElement(
                By.css('[data-cycle="ec"]')
            );

            assert.equal(
                await continuous.isDisplayed(),
                true,
                'No se muestra Evolución continua'
            );

            await waitText(
                driver,
                '[data-i18n="qmCycleEcTitle"]',
                translation(dictionary, 'qmCycleEcTitle')
            );

            await waitText(
                driver,
                '[data-i18n="qmCycleEcSubtitle"]',
                translation(dictionary, 'qmCycleEcSubtitle')
            );

            console.log(
                `SELECTOR EC | ${language.toUpperCase()} | PASS`
            );
        }
    }
);
