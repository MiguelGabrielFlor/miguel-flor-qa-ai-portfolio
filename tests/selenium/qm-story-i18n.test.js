
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Builder, By, until } = require('selenium-webdriver');
const { Select } = require('selenium-webdriver/lib/select');

const browser = process.env.SELENIUM_BROWSER || 'chrome';

const translations = {
    es: {
        title: 'Registro de visitantes',
        status: 'Implementada',
        description: 'Como visitante, quiero registrar mis datos para acceder al portfolio.',
        application: 'Formulario de acceso, POST /api/visitors y persistencia de visitantes en SQLite.',
        criteria: [
            'Los campos obligatorios deben validarse.',
            'El nombre, apellido, email y teléfono deben cumplir las reglas definidas.',
            'El consentimiento debe ser obligatorio.',
            'Los datos válidos deben enviarse a la API.',
            'Un registro válido debe permitir continuar al portfolio.',
            'Los datos aceptados deben almacenarse en SQLite.'
        ]
    },

    en: {
        title: 'Visitor registration',
        status: 'Implemented',
        description: 'As a visitor, I want to register my information to access the portfolio.',
        application: 'Access form, POST /api/visitors, and visitor data persistence in SQLite.',
        criteria: [
            'Required fields must be validated.',
            'First name, last name, email, and phone number must comply with the defined validation rules.',
            'Consent must be mandatory.',
            'Valid data must be sent to the API.',
            'A valid registration must allow the visitor to proceed to the portfolio.',
            'Accepted data must be stored in SQLite.'
        ]
    },

    pt: {
        title: 'Cadastro de visitantes',
        status: 'Implementada',
        description: 'Como visitante, quero cadastrar meus dados para acessar o portfólio.',
        application: 'Formulário de acesso, POST /api/visitors e persistência dos dados dos visitantes no SQLite.',
        criteria: [
            'Os campos obrigatórios devem ser validados.',
            'Nome, sobrenome, e-mail e telefone devem atender às regras de validação definidas.',
            'O consentimento deve ser obrigatório.',
            'Os dados válidos devem ser enviados à API.',
            'Um cadastro válido deve permitir que o visitante prossiga para o portfólio.',
            'Os dados aceitos devem ser armazenados no SQLite.'
        ]
    }
};

test('HU-001 — Traducción dinámica ES/EN/PT sin cambiar de historia', async (t) => {
    const driver = await new Builder()
        .forBrowser(browser)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    const pagePath = path.resolve(
        __dirname,
        '../../quality-management.html'
    );

    await driver.get(pathToFileURL(pagePath).href);
    // Esperar a que la página y el selector estén disponibles.
    await driver.wait(async () => {
        return driver.executeScript(() => {
            return Boolean(
                window.portfolioTranslations &&
                document.querySelector('#cv-language-select') &&
                document.querySelector('#historias')
            );
        });
    }, 10000);

    // Inicializar el idioma mediante un cambio real.
    const initialSelector = new Select(
        await driver.findElement(By.id('cv-language-select'))
    );

    await initialSelector.selectByValue('en');

    await driver.wait(async () => {
        return driver.executeScript(() => {
            return localStorage.getItem('portfolioLanguage') === 'en';
        });
    }, 10000);

    const languageSelector = await driver.findElement(
        By.id('cv-language-select')
    );

    const select = new Select(languageSelector);

    const code = await driver.findElement(
        By.id('qm-story-detail-code')
    );

    const title = await driver.findElement(
        By.id('qm-story-detail-title')
    );

    const status = await driver.findElement(
        By.id('qm-story-status')
    );

    const description = await driver.findElement(
        By.id('qm-story-description')
    );

    const application = await driver.findElement(
        By.id('qm-story-application')
    );

    const criteriaList = await driver.findElement(
        By.id('qm-story-criteria-list')
    );

    // Inicializar mediante un cambio real de idioma.
    // Así se ejecuta el evento "change" y se guarda portfolioLanguage.
    await select.selectByValue('en');

    await driver.wait(async () => {
        const storedLanguage = await driver.executeScript(
            'return localStorage.getItem("portfolioLanguage");'
        );

        return storedLanguage === 'en';
    }, 10000, 'No se pudo inicializar el idioma inglés');

    const languages = ['es', 'en', 'pt', 'es'];

    for (const language of languages) {
        const expected = translations[language];

        await select.selectByValue(language);

        await driver.wait(async () => {
            const currentTitle = await title.getText();
            const currentApplication = await application.getText();

            return currentTitle === expected.title &&
                currentApplication === expected.application;
        }, 10000, `HU-001 no se actualizó al idioma ${language}`);

        assert.equal(
            (await code.getText()).trim(),
            'HU-001',
            `Código incorrecto en ${language}`
        );

        assert.equal(
            await title.getText(),
            expected.title,
            `Título incorrecto en ${language}`
        );

        assert.equal(
            await status.getText(),
            expected.status,
            `Estado incorrecto en ${language}`
        );

        assert.equal(
            await description.getText(),
            expected.description,
            `Descripción incorrecta en ${language}`
        );

        assert.equal(
            await application.getText(),
            expected.application,
            `Aplicación incorrecta en ${language}`
        );

        const criteria = await criteriaList.findElements(
            By.css('li')
        );

        assert.equal(
            criteria.length,
            6,
            `Cantidad de criterios incorrecta en ${language}`
        );

        for (let i = 0; i < criteria.length; i++) {
            assert.equal(
                await criteria[i].getText(),
                expected.criteria[i],
                `Criterio ${i + 1} incorrecto en ${language}`
            );
        }

        const selectedStory = await driver.findElement(
            By.css('[data-story="HU-001"]')
        );

        assert.equal(
            await selectedStory.getAttribute('aria-pressed'),
            'true',
            `HU-001 perdió su selección en ${language}`
        );

        const storedLanguage = await driver.executeScript(
            'return localStorage.getItem("portfolioLanguage");'
        );

        assert.equal(
            storedLanguage,
            language,
            `Idioma persistido incorrecto en ${language}`
        );

        console.log(
            `HU-001 | ${language.toUpperCase()} | 4 campos, 6 criterios y selección: PASS`
        );
    }
});

test('HU-002 — Cobertura completa de las cinco historias ES/EN/PT', async (t) => {
    const driver = await new Builder()
        .forBrowser(browser)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    const pagePath = path.resolve(
        __dirname,
        '../../quality-management.html'
    );

    await driver.get(pathToFileURL(pagePath).href);

    const storyCodes = [
        'HU-001',
        'HU-002',
        'HU-003',
        'HU-004',
        'HU-005'
    ];

    const criteriaCounts = [6, 5, 5, 5, 7];

    const normalize = value =>
        String(value ?? '').replace(/\s+/g, ' ').trim();

    const selector = await driver.findElement(
        By.id('cv-language-select')
    );

    const languageSelect = new Select(selector);

    // Comprobar los textos directamente contra translations.js.
    async function verifyStory(code, index, language) {
        const result = await driver.executeScript(
            (storyCode, storyIndex, lang) => {
                const dictionary =
                    window.portfolioTranslations?.[lang];

                const prefix = 'qm' + storyCode.replace('-', '');

                const selectedButton = document.querySelector(
                    `[data-story="${storyCode}"]`
                );

                const criteria = Array.from(
                    document.querySelectorAll(
                        '#qm-story-criteria-list li'
                    )
                ).map(item => item.textContent);

                return {
                    dictionaryAvailable: Boolean(dictionary),

                    code: document.querySelector(
                        '#qm-story-detail-code'
                    )?.textContent,

                    title: document.querySelector(
                        '#qm-story-detail-title'
                    )?.textContent,

                    status: document.querySelector(
                        '#qm-story-status'
                    )?.textContent,

                    description: document.querySelector(
                        '#qm-story-description'
                    )?.textContent,

                    application: document.querySelector(
                        '#qm-story-application'
                    )?.textContent,

                    criteria,

                    selected: selectedButton?.getAttribute(
                        'aria-pressed'
                    ),

                    selectedCount: document.querySelectorAll(
                        '.qm-story-step[aria-pressed="true"]'
                    ).length,

                    counter: document.querySelector(
                        '#qm-story-counter'
                    )?.textContent,

                    previousDisabled: document.querySelector(
                        '#qm-story-prev'
                    )?.disabled,

                    nextDisabled: document.querySelector(
                        '#qm-story-next'
                    )?.disabled,

                    storedLanguage: localStorage.getItem(
                        'portfolioLanguage'
                    ),

                    expected: dictionary ? {
                        title: dictionary[`${prefix}Title`],
                        status: dictionary[`${prefix}Status`],
                        description: dictionary[
                            `${prefix}Description`
                        ],
                        application: dictionary[
                            `${prefix}Application`
                        ],
                        criteria: Array.from(
                            { length: 7 },
                            (_, i) => dictionary[
                                `${prefix}Criterion${String(i + 1)
                                    .padStart(2, '0')}`
                            ]
                        )
                    } : null
                };
            },
            code,
            index,
            language
        );

        assert.ok(
            result.dictionaryAvailable,
            `Diccionario inexistente: ${language}`
        );

        assert.equal(normalize(result.code), code);
        assert.equal(result.selected, 'true');
        assert.equal(result.selectedCount, 1);

        for (const field of [
            'title',
            'status',
            'description',
            'application'
        ]) {
            assert.ok(
                result.expected[field],
                `${language} ${code}: falta ${field}`
            );

            assert.equal(
                normalize(result[field]),
                normalize(result.expected[field]),
                `${language} ${code}: ${field} incorrecto`
            );
        }

        assert.equal(
            result.criteria.length,
            criteriaCounts[index],
            `${language} ${code}: cantidad incorrecta de criterios`
        );

        for (let i = 0; i < criteriaCounts[index]; i++) {
            assert.ok(
                result.expected.criteria[i],
                `${language} ${code}: falta criterio ${i + 1}`
            );

            assert.equal(
                normalize(result.criteria[i]),
                normalize(result.expected.criteria[i]),
                `${language} ${code}: criterio ${i + 1} incorrecto`
            );
        }

        assert.equal(
            result.previousDisabled,
            index === 0,
            `${code}: estado incorrecto del botón Anterior`
        );

        assert.equal(
            result.nextDisabled,
            index === storyCodes.length - 1,
            `${code}: estado incorrecto del botón Siguiente`
        );

        assert.equal(result.storedLanguage, language);
    }

    async function changeLanguage(language) {

        const currentValue = await selector.getAttribute('value');

        // Forzar un cambio real cuando el idioma solicitado
        // ya coincide con el seleccionado.
        if (currentValue === language) {
            const alternative = language === 'en' ? 'es' : 'en';
            await languageSelect.selectByValue(alternative);
        }

        await languageSelect.selectByValue(language);

        await driver.wait(async () => {
            const result = await driver.executeScript(lang => {

                const dictionary = window.portfolioTranslations?.[lang];

                const title = document.querySelector(
                    '#historias [data-i18n="qmStoriesTitle"]'
                );

                return {
                    storedLanguage: localStorage.getItem('portfolioLanguage'),
                    actualTitle: title?.textContent.trim(),
                    expectedTitle: dictionary?.qmStoriesTitle
                };

            }, language);

            return (
                result.storedLanguage === language &&
                result.actualTitle === result.expectedTitle
            );

        }, 10000, `No se aplicó correctamente el idioma ${language}`);
    }

    async function selectStory(code) {

        const storyButton = await driver.findElement(
            By.css(`[data-story="${code}"]`)
        );

        // Desplazar la tarjeta a una zona visible,
        // alejada del footer fijo.
        await driver.executeScript(`
            arguments[0].scrollIntoView({
                behavior: 'instant',
                block: 'center',
                inline: 'nearest'
            });
        `, storyButton);

        await driver.wait(
            until.elementIsVisible(storyButton),
            10000
        );

        await driver.wait(
            until.elementIsEnabled(storyButton),
            10000
        );

        // Clic real de Selenium: no omitir la interacción.
        await storyButton.click();

        await driver.wait(async () => {
            const currentCode = await driver.findElement(
                By.id('qm-story-detail-code')
            ).getText();

            return currentCode.trim() === code;
        }, 10000, `No se seleccionó correctamente ${code}`);
    }
    async function clickStoryNavigation(buttonId) {

        const button = await driver.findElement(
            By.id(buttonId)
        );

        // Centrar el botón para evitar la superposición
        // con el footer fijo.
        await driver.executeScript(`
            arguments[0].scrollIntoView({
                behavior: 'instant',
                block: 'center',
                inline: 'nearest'
            });
        `, button);

        await driver.wait(
            until.elementIsVisible(button),
            10000
        );

        await driver.wait(
            until.elementIsEnabled(button),
            10000
        );

        // Mantener un clic real de Selenium.
        await button.click();
    }
    // Cada historia se comprueba sin cambiar su selección
    // durante el recorrido de idiomas.
    for (let index = 0; index < storyCodes.length; index++) {
        const code = storyCodes[index];

        console.log(`INICIO | ${code}`);

        console.log(`${code} | Cambiando a ES`);
        await changeLanguage('es');

        console.log(`${code} | Seleccionando historia`);
        await selectStory(code);

        console.log(`${code} | Historia seleccionada`);

        for (const language of ['es', 'en', 'pt', 'es']) {
            console.log(`${code} | Cambiando a ${language.toUpperCase()}`);

            await changeLanguage(language);

            console.log(`${code} | Verificando ${language.toUpperCase()}`);

            await verifyStory(code, index, language);

            console.log(
                `${code} | ${language.toUpperCase()} | ` +
                `${criteriaCounts[index]} CRITERIOS | PASS`
            );
        }
    }

    // Comprobar navegación siguiente y anterior.
    await changeLanguage('es');
    await selectStory('HU-001');

    for (let index = 1; index < storyCodes.length; index++) {
        await clickStoryNavigation('qm-story-next');

        await driver.wait(async () => {
            return (
                await driver.findElement(
                    By.id('qm-story-detail-code')
                ).getText()
            ).trim() === storyCodes[index];
        }, 10000);

        await verifyStory(storyCodes[index], index, 'es');
    }

    for (let index = storyCodes.length - 2; index >= 0; index--) {
        await clickStoryNavigation('qm-story-prev');

        await driver.wait(async () => {
            return (
                await driver.findElement(
                    By.id('qm-story-detail-code')
                ).getText()
            ).trim() === storyCodes[index];
        }, 10000);

        await verifyStory(storyCodes[index], index, 'es');
    }

    console.log(
        'HU-002 | NAVEGACIÓN ANTERIOR/SIGUIENTE | PASS'
    );
});
