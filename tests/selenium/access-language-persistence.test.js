
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Builder, By, until } = require('selenium-webdriver');
const { Select } = require('selenium-webdriver/lib/select');

test('ACCESS-I18N-005 — Persistencia del idioma ES/EN/PT', async (t) => {
    const browser = process.env.TEST_BROWSER || 'chrome';

    const driver = await new Builder()
        .forBrowser(browser)
        .build();

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

    const indexUrl = pathToFileURL(
        path.resolve(__dirname, '../../index.html')
    ).href;

    const frontendUrl = pathToFileURL(
        path.resolve(__dirname, '../../frontend.html')
    ).href;

    await driver.get(indexUrl);

    // Aislar el caso de preferencias y sesiones anteriores.
    await driver.executeScript(`
        localStorage.removeItem('portfolioLanguage');
        sessionStorage.removeItem('portfolioSession');
    `);

    await driver.navigate().refresh();

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
        await driver.findElement(By.id('firstName')).sendKeys('Miguel');
        await driver.findElement(By.id('lastName')).sendKeys('Flor');
        await driver.findElement(By.id('email')).sendKeys(
            'selenium.test@example.com'
        );
        await driver.findElement(By.id('phone')).sendKeys('1123456789');
        await driver.findElement(By.id('consent')).click();

        await driver.findElement(By.id('accessButton')).click();

        await driver.wait(
            until.elementIsVisible(
                await driver.findElement(By.id('portfolio'))
            ),
            10000,
            `${language.code}: el portfolio no se mostró`
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

        assert.equal(
            await driver.findElement(By.id('welcomeMessage')).getText(),
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
