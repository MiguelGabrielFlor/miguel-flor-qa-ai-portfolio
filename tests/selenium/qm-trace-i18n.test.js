
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Builder, By, until } = require('selenium-webdriver');
const { Select } = require('selenium-webdriver/lib/select');

const browser = process.env.SELENIUM_BROWSER || 'chrome';

const pageUrl = pathToFileURL(
    path.resolve(__dirname, '../../quality-management.html')
).href;

const languages = ['es', 'en', 'pt', 'es'];

const scenarios = [
    {
        id: 'registro',
        requirement: 'RF-02',
        story: 'HU-001',
        bdd: 'BDD-001',
        prefix: 'qmTraceRegistration',
        status: 'implemented'
    },
    {
        id: 'consentimiento',
        requirement: 'RF-03',
        story: 'HU-001',
        bdd: 'BDD-002',
        prefix: 'qmTraceConsent',
        status: 'implemented'
    },
    {
        id: 'navegacion',
        requirement: 'RF-07',
        story: 'HU-002',
        bdd: 'BDD-003',
        prefix: 'qmTraceNavigation',
        status: 'implemented'
    },
    {
        id: 'contacto',
        requirement: 'RF-04',
        story: 'HU-003',
        bdd: 'BDD-004',
        prefix: 'qmTraceContact',
        status: 'implemented'
    },
    {
        id: 'idioma',
        requirement: 'RF-05',
        story: 'HU-004',
        bdd: 'BDD-005',
        prefix: 'qmTraceLanguage',
        status: 'partial'
    },
    {
        id: 'buscador',
        requirement: 'RF-06',
        story: 'HU-005',
        bdd: 'BDD-006',
        prefix: 'qmTraceSearch',
        status: 'implemented'
    }
];

const staticKeys = [
    'qmTraceTitle',
    'qmTraceDescription',
    'qmTraceSelectorAria',
    'qmTraceRegistrationShort',
    'qmTraceConsentShort',
    'qmTraceNavigationShort',
    'qmTraceContactShort',
    'qmTraceLanguageShort',
    'qmTraceSearchShort',
    'qmTraceSelectedPath',
    'qmTraceRequirementLabel',
    'qmTraceStoryLabel',
    'qmTraceBDDLabel',
    'qmTraceVerificationTitle',
    'qmTraceMatrixSummary',
    'qmTraceTableRequirement',
    'qmTraceTableStory',
    'qmTraceTableBDD',
    'qmTraceTableVerification',
    'qmTraceTableStatus',
    'qmTraceFinalNote'    
];

const dynamicSuffixes = [
    'Title',
    'Requirement',
    'Story',
    'BDD',
    'Status',
    'Verification'
];

async function getDictionary(driver, language) {
    return driver.executeScript(`
        const language = arguments[0];
        const keys = arguments[1];
        
        const candidates = [
            window.portfolioTranslations,
            typeof portfolioTranslations !== 'undefined'
                ? portfolioTranslations : undefined,
            typeof translations !== 'undefined'
                ? translations : undefined,
            typeof TRANSLATIONS !== 'undefined'
                ? TRANSLATIONS : undefined,
            window.translations,
            window.TRANSLATIONS
        ];

        for (const source of candidates) {
            if (!source) continue;

            const dictionary = source[language];
            if (!dictionary) continue;

            const result = {};

            for (const key of keys) {
                result[key] = dictionary[key];
            }

            return result;
        }

        return null;
    `, language, [
        ...staticKeys,
        ...scenarios.flatMap(s =>
            dynamicSuffixes.map(suffix => s.prefix + suffix)
        )
    ]);
}

async function textOf(driver, selector) {
    return driver.findElement(By.css(selector)).getText();
}

async function verifyText(driver, selector, expected, context) {
    assert.equal(
        await textOf(driver, selector),
        expected,
        context
    );
}

async function changeLanguage(driver, selector, language) {
    await selector.selectByValue(language);

    await driver.wait(async () => {
        return await driver.executeScript(
            'return localStorage.getItem("portfolioLanguage") === arguments[0];',
            language
        );
    }, 10000, `No se guardó el idioma ${language}`);
}

async function selectTrace(driver, id) {
    const button = await driver.findElement(
        By.css(`[data-trace="${id}"]`)
    );

    await driver.executeScript(
        'arguments[0].scrollIntoView({block:"center",inline:"nearest"});',
        button
    );

    await button.click();

    await driver.wait(async () =>
        (await button.getAttribute('aria-pressed')) === 'true',
        10000
    );

    return button;
}

async function verifyStaticTranslations(driver, dictionary) {
    for (const key of staticKeys) {
        const expected = dictionary[key];

        assert.equal(
            typeof expected,
            'string',
            `Falta traducción: ${key}`
        );

        assert.ok(
            expected.trim().length > 0,
            `Traducción vacía: ${key}`
        );

        const element = await driver.findElement(
            By.css(`[data-i18n="${key}"],[data-i18n-aria-label="${key}"]`)
        );

        const isAria = await element.getAttribute(
            'data-i18n-aria-label'
        );

        
        const actual = isAria
            ? await element.getAttribute('aria-label')
            : await driver.executeScript(
                'return arguments[0].textContent.trim();',
                element
            );


        assert.equal(
            actual.trim(),
            expected.trim(),
            `Traducción estática incorrecta: ${key}`
        );
    }
}

async function verifyScenario(driver, scenario, dictionary, language) {
    const expected = {};

    for (const suffix of dynamicSuffixes) {
        const key = scenario.prefix + suffix;
        expected[suffix] = dictionary[key];

        assert.equal(
            typeof expected[suffix],
            'string',
            `Falta ${key} (${language})`
        );

        assert.ok(
            expected[suffix].trim(),
            `Traducción vacía: ${key} (${language})`
        );
    }

    await driver.wait(async () =>
        (await textOf(driver, '#qm-trace-title')) === expected.Title,
        10000,
        `No se actualizó ${scenario.id} en ${language}`
    );

    await verifyText(
        driver, '#qm-trace-title', expected.Title,
        `${scenario.id}: título`
    );

    await verifyText(
        driver, '#qm-trace-status', expected.Status,
        `${scenario.id}: estado`
    );

    await verifyText(
        driver, '#qm-trace-requirement',
        scenario.requirement,
        `${scenario.id}: requisito`
    );

    await verifyText(
        driver, '#qm-trace-requirement-name',
        expected.Requirement,
        `${scenario.id}: nombre del requisito`
    );

    await verifyText(
        driver, '#qm-trace-story',
        scenario.story,
        `${scenario.id}: historia`
    );

    await verifyText(
        driver, '#qm-trace-story-name',
        expected.Story,
        `${scenario.id}: nombre de historia`
    );

    await verifyText(
        driver, '#qm-trace-bdd',
        scenario.bdd,
        `${scenario.id}: BDD`
    );

    await verifyText(
        driver, '#qm-trace-bdd-name',
        expected.BDD,
        `${scenario.id}: nombre BDD`
    );

    await verifyText(
        driver, '#qm-trace-verification-text',
        expected.Verification,
        `${scenario.id}: verificación`
    );

    assert.equal(
        await driver.findElement(
            By.id('qm-trace-status')
        ).getAttribute('data-status'),
        scenario.status,
        `${scenario.id}: estado técnico`
    );

    assert.equal(
        await driver.findElement(
            By.css(`[data-trace="${scenario.id}"]`)
        ).getAttribute('aria-pressed'),
        'true',
        `${scenario.id}: selección activa`
    );

    const activeButtons = await driver.findElements(
        By.css('.qm-trace-button[aria-pressed="true"]')
    );

    assert.equal(
        activeButtons.length,
        1,
        'Debe existir un único recorrido seleccionado'
    );

    console.log(
        `TRACE ${scenario.requirement} | ${language.toUpperCase()} | PASS`
    );
}

test('TRACE-001 — Internacionalización y trazabilidad completa ES/EN/PT', async (t) => {
    const driver = await new Builder()
        .forBrowser(browser)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(pageUrl);

    await driver.wait(
        until.elementLocated(By.id('qm-trace-selector')),
        10000
    );

    const languageSelector = new Select(
        await driver.findElement(By.id('cv-language-select'))
    );

    // Forzar un cambio efectivo antes de comenzar.
    await changeLanguage(driver, languageSelector, 'en');

    for (const language of languages) {
        await changeLanguage(driver, languageSelector, language);

        const dictionary = await getDictionary(driver, language);       

        assert.ok(
            dictionary,
            `No se encontró el diccionario ${language}`
        );

        await verifyStaticTranslations(driver, dictionary);

        for (const scenario of scenarios) {
            await selectTrace(driver, scenario.id);

            await verifyScenario(
                driver,
                scenario,
                dictionary,
                language
            );
        }
    }
});

test('TRACE-002 — Matriz documental y correspondencia de requisitos', async (t) => {
    const driver = await new Builder()
        .forBrowser(browser)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(pageUrl);

    const languageSelector = new Select(
        await driver.findElement(By.id('cv-language-select'))
    );

    await changeLanguage(driver, languageSelector, 'en');

    const details = await driver.findElement(
        By.css('.qm-trace-documentation')
    );

    const summary = await details.findElement(
        By.css('summary')
    );

    await driver.executeScript(
        'arguments[0].scrollIntoView({block:"center"});',
        summary
    );

    await summary.click();

    assert.equal(
        await details.getAttribute('open'),
        'true',
        'La matriz debe estar desplegada'
    );

    for (const language of languages) {
        await changeLanguage(driver, languageSelector, language);

        const rows = await driver.findElements(
            By.css('#qm-trace-table-body tr')
        );

        assert.ok(
            rows.length >= scenarios.length,
            `La matriz contiene menos de seis filas (${language})`
        );

        const tableText = await textOf(
            driver, '#qm-trace-table-body'
        );

        for (const scenario of scenarios) {
            assert.ok(
                tableText.includes(scenario.requirement),
                `Falta ${scenario.requirement} en la matriz (${language})`
            );

            assert.ok(
                tableText.includes(scenario.story),
                `Falta ${scenario.story} en la matriz (${language})`
            );

            assert.ok(
                tableText.includes(scenario.bdd),
                `Falta ${scenario.bdd} en la matriz (${language})`
            );
        }

        console.log(
            `MATRIZ | ${language.toUpperCase()} | PASS`
        );
    }
});
