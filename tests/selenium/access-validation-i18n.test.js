const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By, until } = require('selenium-webdriver');
const { Select } = require('selenium-webdriver/lib/select');
const { createDriver } = require('./selenium-config');

const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:5500';
const browser = process.env.TEST_BROWSER || 'chrome';

async function prepare(driver) {
    await driver.get(`${baseUrl}/index.html`);
    await driver.executeScript("sessionStorage.removeItem('portfolioSession'); localStorage.removeItem('portfolioLanguage');");
    await driver.navigate().refresh();
    await driver.wait(until.elementIsEnabled(driver.findElement(By.id('languageSelect'))), 10000);
    await driver.findElement(By.id('registeredAccessButton')).click();
    const form = await driver.findElement(By.id('accessForm'));
    await driver.wait(until.elementIsVisible(form), 10000);
}

async function language(driver, code) {
    const selector = await driver.findElement(By.id('languageSelect'));
    await driver.wait(until.elementIsEnabled(selector), 10000);
    await new Select(selector).selectByValue(code);
    await driver.wait(async () => driver.executeScript(`
        return document.documentElement.lang === arguments[0] &&
               document.getElementById('languageSelect').disabled === false &&
               !!window.portfolioTranslations?.[arguments[0]];
    `, code), 10000, `Idioma ${code} no terminó de cargarse`);
}

async function checkErrors(driver, code, fields) {
    const dictionary = await driver.executeScript(
        'return window.portfolioTranslations?.[arguments[0]]', code
    );
    assert.ok(dictionary, `Diccionario ausente: ${code}`);
    for (const [errorId, key] of Object.entries(fields)) {
        assert.ok(dictionary[key], `${code}: falta la clave ${key}`);
        await driver.wait(async () => {
            const actual = await driver.findElement(By.id(errorId)).getText();
            return actual === dictionary[key];
        }, 5000, `${code}: error incorrecto en ${errorId}`);
    }
    assert.ok((await driver.getCurrentUrl()).includes('index.html'),
        `${code}: no debe acceder a home.html con datos inválidos`);
}

async function runTest(t, fn) {
    const driver = await createDriver(browser);
    t.after(async () => driver.quit());
    const actual = String((await driver.getCapabilities()).get('browserName')).toLowerCase();
    assert.equal(actual, browser.toLowerCase(), 'Navegador incorrecto');
    await fn(driver);
}

const errors = {
    firstNameError: 'firstNameRequired',
    lastNameError: 'lastNameRequired',
    emailError: 'emailRequired',
    phoneError: 'phoneRequired',
    consentError: 'consentRequired'
};

test('ACCESS-I18N-002 — Errores obligatorios ES/EN/PT', async t => {
    await runTest(t, async driver => {
        await prepare(driver);
        for (const code of ['es', 'en', 'pt', 'es']) {
            await language(driver, code);
            const accessButton = await driver.findElement(By.id('accessButton'));

            await driver.executeScript(`
                arguments[0].scrollIntoView({
                    block: 'center',
                    behavior: 'instant'
                });
            `, accessButton);

            await driver.wait(
                async () => {
                    return driver.executeScript(`
                        const button = arguments[0];
                        const rect = button.getBoundingClientRect();

                        const x = rect.left + rect.width / 2;
                        const y = rect.top + rect.height / 2;

                        return document.elementFromPoint(x, y) === button;
                    `, accessButton);
                },
                5000,
                'El botón de acceso permanece cubierto por otro elemento'
            );

            await accessButton.click();
            await checkErrors(driver, code, errors);
            for (const id of ['firstName', 'lastName', 'email', 'phone', 'consent']) {
                assert.equal(await driver.findElement(By.id(id)).getAttribute('aria-invalid'),
                    'true', `${code}: falta aria-invalid en ${id}`);
            }
            console.log(`ACCESS-I18N-002 | ${browser} | ${code.toUpperCase()} | 5 ERRORES | PASS`);
        }
    });
});
