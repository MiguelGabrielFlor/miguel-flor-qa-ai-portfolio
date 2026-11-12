
const { test } = require('node:test');
const assert = require('node:assert/strict');

const { By, until } = require('selenium-webdriver');
const { createDriver } = require('./selenium-config');
const { Select } = require('selenium-webdriver/lib/select');

test('ACCESS-I18N-005 — Persistencia del idioma ES/EN/PT', async (t) => {
    const browser = process.env.TEST_BROWSER || 'chrome';

    const driver = await createDriver(browser);

    t.after(async () => {
        await driver.quit();
    });

    const actualBrowser = String(
        (await driver.getCapabilities()).get('browserName') || ''
    ).toLowerCase();

    assert.equal(
        actualBrowser,
        browser.toLowerCase(),
        `Se solicitó ${browser}, pero Selenium abrió ${actualBrowser}`
    );

    const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:5500';

    const indexUrl = `${baseUrl}/index.html`;
    const frontendUrl = `${baseUrl}/frontend.html`;

    await driver.get(indexUrl);

    // Aislar el caso de preferencias y sesiones anteriores.
    await driver.executeScript(`
        localStorage.removeItem('portfolioLanguage');
        sessionStorage.removeItem('portfolioSession');
    `);

    await driver.navigate().refresh();

    // HU-004 / Criterio 05: idioma predeterminado sin preferencia guardada.
    const defaultLanguage = await driver.findElement(
        By.id('languageSelect')
    ).getAttribute('value');

    assert.equal(
        defaultLanguage,
        'es',
        'El idioma predeterminado debe ser español'
    );

    assert.equal(
        await driver.executeScript(
            'return document.documentElement.lang'
        ),
        'es',
        'El documento debe iniciar en español'
    );

    console.log(
        `ACCESS-I18N-005 | ${actualBrowser} | DEFAULT ES | PASS`
    );

    const languages = [
        { code: 'es', welcome: 'Te doy la bienvenida, MIGUEL' },
        { code: 'en', welcome: 'Welcome, MIGUEL' },
        { code: 'pt', welcome: 'Dou-lhe as boas-vindas, MIGUEL' }
    ];

    for (const language of languages) {
        // Comenzar cada escenario sin una sesión activa.
        await driver.executeScript(
            "sessionStorage.removeItem('portfolioSession')"
        );

        await driver.navigate().refresh();

        const languageSelect = await driver.findElement(
            By.id('languageSelect')
        );

        
        // Forzar un cambio real del selector antes de elegir
        // el idioma que se desea verificar.
        const alternativeLanguage =
            language.code === 'es' ? 'en' : 'es';

        await new Select(languageSelect).selectByValue(
            alternativeLanguage
        );

        await new Select(languageSelect).selectByValue(
            language.code
        );

        const storedLanguage = await driver.executeScript(
            "return localStorage.getItem('portfolioLanguage')"
        );


        assert.equal(
            storedLanguage,
            language.code,
            `${language.code}: idioma incorrecto en localStorage`
        );

        // Verificar persistencia después de recargar.
        await driver.navigate().refresh();

        assert.equal(
            await driver.findElement(By.id('languageSelect')).getAttribute('value'),
            language.code,
            `${language.code}: el selector no conservó el idioma`
        );

        // Completar el formulario de acceso.
        // Abrir el formulario de registro del flujo actual.
        await driver.findElement(
            By.id('registeredAccessButton')
        ).click();

        await driver.wait(
            until.elementIsVisible(
                await driver.findElement(By.id('accessForm'))
            ),
            10000,
            'El formulario de registro no se mostró'
        );

        // Completar el formulario de acceso.
        await driver.findElement(By.id('firstName')).sendKeys('Miguel');
        await driver.findElement(By.id('lastName')).sendKeys('Flor');
        await driver.findElement(By.id('email')).sendKeys(
            'selenium.test@example.com'
        );
        await driver.findElement(By.id('phone')).sendKeys('1123456789');
        const consentCheckbox = await driver.findElement(By.id('consent'));

        await driver.executeScript(
            "arguments[0].scrollIntoView({ block: 'center', behavior: 'instant' });",
            consentCheckbox
        );

        await driver.wait(
            until.elementIsVisible(consentCheckbox),
            10000
        );

        await driver.wait(
            until.elementIsEnabled(consentCheckbox),
            10000
        );

        await consentCheckbox.click();

        assert.equal(
            await consentCheckbox.isSelected(),
            true,
            'La casilla de consentimiento debe quedar seleccionada'
        );

        await driver.findElement(By.id('accessButton')).click();

        await driver.wait(
            until.urlContains('home.html'),
            10000,
            `${language.code}: no se produjo la redirección a home.html`
        );

        await driver.wait(
            async () => {
                const currentLanguage = await driver.executeScript(
                    'return document.documentElement.lang'
                );

                return currentLanguage === language.code;
            },
            10000,
            `${language.code}: home.html no aplicó el idioma esperado`
        );

        assert.equal(
            await driver.executeScript(
                'return document.documentElement.lang'
            ),
            language.code,
            `${language.code}: home.html no conservó el idioma`
        );

        const session = await driver.executeScript(`
            const value = sessionStorage.getItem('portfolioSession');
            return value ? JSON.parse(value) : null;
        `);

        assert.ok(session, `${language.code}: sesión inexistente`);

        assert.equal(
            session.language,
            language.code,
            `${language.code}: idioma incorrecto en sessionStorage`
        );

        const welcomeMessage = await driver.findElement(
            By.id('welcomeMessage')
        );

        await driver.wait(
            async () => {
                const text = await welcomeMessage.getText();
                return text.trim() !== '';
            },
            10000,
            `${language.code}: el saludo no se cargó`
        );

        assert.equal(
            await welcomeMessage.getText(),
            language.welcome,
            `${language.code}: saludo incorrecto`
        );

        console.log(
            `ACCESS-I18N-005 | ${actualBrowser} | ${language.code.toUpperCase()} | ACCESO | PASS`
        );

        // Navegar a una página técnica.
        await driver.get(frontendUrl);

        const technicalLanguage = await driver.executeScript(
            "return document.documentElement.lang"
        );

        assert.equal(
            technicalLanguage,
            language.code,
            `${language.code}: frontend.html no conservó el idioma`
        );

        assert.equal(
            await driver.executeScript(
                "return localStorage.getItem('portfolioLanguage')"
            ),
            language.code,
            `${language.code}: se perdió la preferencia al navegar`
        );

        console.log(
            `ACCESS-I18N-005 | ${actualBrowser} | ${language.code.toUpperCase()} | NAVEGACIÓN | PASS`
        );

        await driver.get(indexUrl);
    }
});
