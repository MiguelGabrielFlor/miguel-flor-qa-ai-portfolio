"use strict";
const assert = require('node:assert/strict');
const { By, until } = require('selenium-webdriver');
const { createDriver } = require('./selenium-config');
const browser = process.env.TEST_BROWSER || 'chrome';
const baseUrl = (process.env.TEST_BASE_URL || 'http://127.0.0.1:5500').replace(/\/$/, '');

async function setup(t) {
    const driver = await createDriver(browser);
    t.after(async () => { await driver.quit(); });
    await driver.get(`${baseUrl}/index.html`);
    // Asegurar una ejecución independiente de preferencias y sesiones previas.
    await driver.executeScript(`
        localStorage.removeItem('portfolioLanguage');
        sessionStorage.removeItem('portfolioSession');
    `);
    await driver.navigate().refresh();
    await driver.wait(async () =>
        driver.executeScript(`return document.documentElement.lang === 'es' &&
            !document.getElementById('languageSelect').disabled &&
            !document.getElementById('registeredAccessButton').disabled`),
        10000, 'No se inicializó el acceso en español');
    const open = await driver.findElement(By.id('registeredAccessButton'));
    await click(driver, open);
    await driver.wait(async () => driver.executeScript(
        `return !document.getElementById('accessForm').hidden &&
                document.getElementById('registeredAccessButton').getAttribute('aria-expanded') === 'true'`
    ), 10000, 'El formulario registrado no se abrió');
    return driver;
}

async function click(driver, element) {
    await driver.executeScript(`arguments[0].scrollIntoView({block:'center',behavior:'instant'});`, element);
    await driver.wait(async () => driver.executeScript(`
        const e=arguments[0],r=e.getBoundingClientRect();
        const x=r.left+r.width/2,y=r.top+r.height/2;
        return r.width>0 && r.height>0 &&
            (document.elementFromPoint(x,y)===e || e.contains(document.elementFromPoint(x,y)));
    `, element), 10000, 'Un elemento cubre el control');
    await element.click();
}

async function fill(driver, values = {}) {
    for (const [id, value] of Object.entries(values)) {
        await driver.findElement(By.id(id)).sendKeys(value);
    }
}
async function consent(driver) {
    const box = await driver.findElement(By.id('consent'));
    if (!await box.isSelected()) await click(driver, box);
}
async function submit(driver) {
    await click(driver, await driver.findElement(By.id('accessButton')));
}
async function expected(driver, key) {
    const value = await driver.executeScript(
        'return window.portfolioTranslations?.es?.[arguments[0]]', key);
    assert.ok(value, `Falta traducción ES: ${key}`);
    return value;
}
async function invalid(driver, errorId, key, fieldId) {
    const message = await expected(driver, key);
    await driver.wait(async () =>
        (await driver.findElement(By.id(errorId)).getText()) === message,
        5000, `Error no mostrado: ${errorId}`);
    if (fieldId) assert.equal(
        await driver.findElement(By.id(fieldId)).getAttribute('aria-invalid'),
        'true', `Falta aria-invalid en ${fieldId}`);
    assert.ok((await driver.getCurrentUrl()).includes('/index.html'),
        'No debe redirigir con datos inválidos');
    assert.equal(await driver.executeScript(
        "return sessionStorage.getItem('portfolioSession')"), null,
        'No debe crear una sesión con datos inválidos');
}
async function valid(driver) {
    await driver.wait(until.urlContains('home.html'), 12000,
        'No se redirigió a home.html; comprobar backend /api/visitors');
    const session = await driver.executeScript(`
        const raw=sessionStorage.getItem('portfolioSession');
        return raw ? JSON.parse(raw) : null;
    `);
    assert.equal(session?.accessType, 'registered');
    assert.equal(session?.language, 'es');
    assert.equal(session?.firstName, 'Miguel');
    await driver.wait(async () =>
        (await driver.findElement(By.id('welcomeMessage')).getText()).includes('MIGUEL'),
        5000, 'No se mostró el saludo personalizado');
}
const defaults = {
    firstName:'Miguel', lastName:'Flor', email:'selenium.test@example.com',
    phone:'1123456789'
};
module.exports = { setup, fill, consent, submit, invalid, valid, defaults, expected, browser, By, assert };
