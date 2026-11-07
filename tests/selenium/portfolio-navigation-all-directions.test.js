
'use strict';

// Ejecutar con el servidor del portfolio en http://127.0.0.1:8000.
// TEST_BROWSER=chrome|firefox|MicrosoftEdge (PowerShell: $env:TEST_BROWSER='firefox').
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Builder, By, until } = require('selenium-webdriver');

const BASE = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:8000';
const BROWSER = process.env.TEST_BROWSER || 'chrome';
const PAGES = ['index.html', 'cv.html', 'frontend.html', 'backend.html', 'qa.html', 'quality-management.html'];
const INTERNAL = PAGES.slice(1);
const LANGUAGES = ['es', 'en', 'pt'];
const WAIT = 12000;

function pageName(url) {
    return new URL(url).pathname.split('/').pop() || 'index.html';
}
function destination(url) {
    const parsed = new URL(url);
    return { page: pageName(url), hash: parsed.hash };
}
async function ready(driver) {
    await driver.wait(async () => (await driver.executeScript('return document.readyState')) === 'complete', WAIT);
}
async function clickReal(driver, element) {
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', element);
    await driver.wait(until.elementIsVisible(element), WAIT);
    await element.click();
    await ready(driver);
}
async function enterHome(driver, language) {
    await driver.get(`${BASE}/index.html`);
    await ready(driver);
    await driver.executeScript('localStorage.setItem("portfolioLanguage", arguments[0]);', language);
    await driver.navigate().refresh();
    await ready(driver);
    const portfolio = await driver.findElements(By.id('portfolio'));
    if (portfolio.length && !(await portfolio[0].isDisplayed())) {
        const select = await driver.findElements(By.id('languageSelect'));
        if (select.length) {
            const { Select } = require('selenium-webdriver');
            await new Select(select[0]).selectByValue(language);
        }
        for (const [id, value] of [
            ['firstName','Selenium'], ['lastName','Tester'],
            ['email','navigation.test@example.com'], ['phone','1123456789']
        ]) {
            const field = await driver.findElement(By.id(id));
            await field.clear(); await field.sendKeys(value);
        }
        const consent = await driver.findElement(By.id('consent'));
        if (!(await consent.isSelected())) await consent.click();
        await driver.findElement(By.id('accessButton')).click();
        await driver.wait(until.elementIsVisible(portfolio[0]), WAIT);
    }
    assert.equal(pageName(await driver.getCurrentUrl()), 'index.html');
}
async function verifyLanguage(driver, language, label) {
    const values = await driver.executeScript('return [document.documentElement.lang,localStorage.getItem("portfolioLanguage")];');
    assert.deepEqual(values, [language, language], `${label}: idioma perdido`);
}
async function clickHomeLink(driver, target) {
    const links = await driver.findElements(By.css(`a[href^="${target}"]`));
    const visible = [];
    for (const link of links) if (await link.isDisplayed()) visible.push(link);
    assert.ok(visible.length, `Home no presenta enlace visible hacia ${target}`);
    await clickReal(driver, visible[0]);
    assert.equal(pageName(await driver.getCurrentUrl()), target, `Enlace Home → ${target}`);
}
async function findReturn(driver) {
    // Enlaces de retorno con ancla a Home o a la página QA; no el logo.
    const links = await driver.findElements(By.css('a[href*="index.html#"], a[href*="qa.html#"]'));
    for (const link of links) {
        if (await link.isDisplayed() && !(await link.getAttribute('class') || '').split(/\s+/).includes('logo')) return link;
    }
    return null;
}
async function verifyAnchor(driver, hash) {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const target = await driver.findElements(By.id(id));
    assert.ok(target.length, `No existe sección de destino ${hash}`);
    assert.ok(await target[0].isDisplayed(), `Sección ${hash} no visible`);
}

test('NAV-ALL — navegación entre seis páginas, logo y retornos ES/EN/PT', async t => {
    const driver = await new Builder().forBrowser(BROWSER).build();
    t.after(async () => driver.quit());
    const actual = String((await driver.getCapabilities()).get('browserName')).toLowerCase();
    assert.equal(actual, BROWSER.toLowerCase(), `Navegador solicitado ${BROWSER}; abierto ${actual}`);

    for (const language of LANGUAGES) {
        await enterHome(driver, language);
        await verifyLanguage(driver, language, 'Home');

        // Cinco salidas desde Home; retorno por el logo siempre al inicio.
        for (const target of INTERNAL) {
            await enterHome(driver, language);
            await clickHomeLink(driver, target);
            await verifyLanguage(driver, language, target);
            const logos = await driver.findElements(By.css('a.logo[href="index.html"]'));
            assert.ok(logos.length, `${target}: falta logo de retorno`);
            await clickReal(driver, logos[0]);
            const url = await driver.getCurrentUrl();
            assert.equal(pageName(url), 'index.html', `${target}: logo no vuelve a Home`);
            assert.equal(new URL(url).hash, '', `${target}: logo no debe apuntar a una sección`);
            await driver.wait(async () => (await driver.executeScript('return window.scrollY')) <= 5, WAIT);
            await verifyLanguage(driver, language, `${target} → logo`);
            console.log(`NAV-ALL | ${actual} | ${language} | Home → ${target} → logo/Home | PASS`);
        }

        // Botones de retorno: deben tener ancla de sección y esta debe existir.
        for (const target of INTERNAL) {
            await enterHome(driver, language);
            await clickHomeLink(driver, target);
            const back = await findReturn(driver);
            assert.ok(back, `${target}: no se encontró botón/enlace Volver hacia su sección de origen`);
            const expected = destination(await back.getAttribute('href'));
            assert.ok(['index.html', 'qa.html'].includes(expected.page), `${target}: retorno inesperado ${expected.page}`);
            assert.ok(expected.hash, `${target}: Volver no tiene sección de destino`);
            await clickReal(driver, back);
            const url = await driver.getCurrentUrl();
            assert.equal(pageName(url), expected.page);
            assert.equal(new URL(url).hash, expected.hash, `${target}: Volver no respetó el ancla`);
            await verifyAnchor(driver, expected.hash);
            await verifyLanguage(driver, language, `${target} → Volver`);
            console.log(`NAV-ALL | ${actual} | ${language} | ${target} → ${expected.hash} | PASS`);
        }

        // Todos los pares ordenados de páginas distintas (6×5=30),
        // utilizando enlaces reales. Para páginas internas, el logo lleva
        // a Home y desde allí se selecciona el destino.
        for (const from of PAGES) {
            for (const to of PAGES) {
                if (from === to) continue;
                await enterHome(driver, language);
                if (from !== 'index.html') await clickHomeLink(driver, from);
                if (from !== 'index.html') {
                    const logo = await driver.findElement(By.css('a.logo[href="index.html"]'));
                    await clickReal(driver, logo);
                    assert.equal(pageName(await driver.getCurrentUrl()), 'index.html');
                }
                if (to !== 'index.html') await clickHomeLink(driver, to);
                assert.equal(pageName(await driver.getCurrentUrl()), to, `${from} → ${to}`);
                await verifyLanguage(driver, language, `${from} → ${to}`);
                console.log(`NAV-ALL | ${actual} | ${language} | ${from} → ${to} | PASS`);
            }
        }
    }
});
