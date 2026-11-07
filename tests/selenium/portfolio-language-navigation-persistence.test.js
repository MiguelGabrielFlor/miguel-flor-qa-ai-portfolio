
'use strict';

/**
 * LANG-NAV-006 — Complemento de NAV-ALL: persistencia real ES/EN/PT.
 * Ejecutar con servidor HTTP (por defecto http://127.0.0.1:8000).
 * Requiere selenium-webdriver y navegadores instalados.
 * No modifica el estado del portfolio ni las traducciones.
 */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Builder, By, Select, until } = require('selenium-webdriver');

const BASE = (process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const BROWSER = process.env.TEST_BROWSER || 'chrome';
const WAIT = 12000;
const PAGES = ['cv.html', 'frontend.html', 'backend.html', 'qa.html', 'quality-management.html'];
const LANGUAGES = [
    { code: 'es', welcome: 'Te doy la bienvenida, MIGUEL' },
    { code: 'en', welcome: 'Welcome, MIGUEL' },
    { code: 'pt', welcome: 'Dou-lhe as boas-vindas, MIGUEL' }
];

const filename = url => new URL(url).pathname.split('/').pop() || 'index.html';

async function settled(driver) {
    await driver.wait(async () => await driver.executeScript('return document.readyState === "complete"'), WAIT);
}

async function click(driver, element) {
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', element);
    await driver.wait(until.elementIsVisible(element), WAIT);
    await element.click();
    await settled(driver);
}

async function assertLanguage(driver, code, context) {
    await driver.wait(async () => {
        const state = await driver.executeScript('return [document.documentElement.lang, localStorage.getItem("portfolioLanguage")];');
        return state[0] === code && state[1] === code;
    }, WAIT, `${context}: el idioma no se aplicó o no se conservó`);
    const [html, stored] = await driver.executeScript('return [document.documentElement.lang, localStorage.getItem("portfolioLanguage")];');
    assert.deepEqual([html, stored], [code, code], context);
}

async function openHome(driver) {
    await driver.get(`${BASE}/index.html`);
    await settled(driver);
    assert.equal(filename(await driver.getCurrentUrl()), 'index.html');
}

async function startSession(driver, language) {
    await openHome(driver);
    await driver.executeScript('localStorage.removeItem("portfolioLanguage"); sessionStorage.removeItem("portfolioSession");');
    await driver.navigate().refresh();
    await settled(driver);

    const select = await driver.findElement(By.id('languageSelect'));
    const alternative = language.code === 'es' ? 'en' : 'es';
    await new Select(select).selectByValue(alternative);
    await new Select(select).selectByValue(language.code);
    await assertLanguage(driver, language.code, 'selector de acceso');

    await driver.navigate().refresh();
    await settled(driver);
    assert.equal(await driver.findElement(By.id('languageSelect')).getAttribute('value'), language.code,
        `${language.code}: selector no persistió después de recargar`);

    for (const [id, value] of [
        ['firstName', 'Miguel'], ['lastName', 'Flor'],
        ['email', 'selenium.language@example.com'], ['phone', '1123456789']
    ]) {
        const field = await driver.findElement(By.id(id));
        await field.clear();
        await field.sendKeys(value);
    }
    const consent = await driver.findElement(By.id('consent'));
    if (!(await consent.isSelected())) await consent.click();
    await driver.findElement(By.id('accessButton')).click();
    await driver.wait(until.elementIsVisible(await driver.findElement(By.id('portfolio'))), WAIT);
    assert.equal(await driver.findElement(By.id('welcomeMessage')).getText(), language.welcome);
    const session = await driver.executeScript('return JSON.parse(sessionStorage.getItem("portfolioSession") || "null")');
    assert.ok(session, 'No se creó portfolioSession');
    assert.equal(session.language, language.code, 'Idioma incorrecto en la sesión');
    await assertLanguage(driver, language.code, 'Home con sesión');
}

async function goFromHome(driver, page) {
    const links = await driver.findElements(By.css(`a[href^="${page}"]`));
    for (const link of links) {
        if (await link.isDisplayed()) {
            await click(driver, link);
            assert.equal(filename(await driver.getCurrentUrl()), page, `No se llegó a ${page} mediante enlace`);
            return;
        }
    }
    assert.fail(`No hay enlace visible desde Home hacia ${page}`);
}

async function returnViaLogo(driver, page) {
    const logo = await driver.findElement(By.css('a.logo[href="index.html"]'));
    await click(driver, logo);
    const url = new URL(await driver.getCurrentUrl());
    assert.equal(filename(url.href), 'index.html', `${page}: logo no vuelve a Home`);
    assert.equal(url.hash, '', `${page}: logo apunta a un ancla`);
    await driver.wait(async () => await driver.executeScript('return window.scrollY <= 5'), WAIT);
}

async function visibleTranslatedTexts(driver) {
    // Lee el texto renderizado, no sólo atributos/lang o claves del diccionario.
    return await driver.executeScript(`
        const result = {};
        for (const el of document.querySelectorAll('[data-i18n]')) {
            const key = el.getAttribute('data-i18n');
            if (!key || result[key] !== undefined) continue;
            const style = getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || !el.getClientRects().length) continue;
            const value = (el.innerText || el.textContent || '').trim().replace(/\\s+/g, ' ');
            if (value && value.length <= 240) result[key] = value;
        }
        return result;
    `);
}

test('LANG-NAV-006 — ES/EN/PT, contenido visible, recarga y navegación por seis páginas', async t => {
    const driver = await new Builder().forBrowser(BROWSER).build();
    t.after(async () => driver.quit());
    const actual = String((await driver.getCapabilities()).get('browserName') || '').toLowerCase();
    const expectedBrowser = BROWSER.toLowerCase() === 'edge' ? 'msedge' : BROWSER.toLowerCase();
    assert.equal(actual, expectedBrowser, `Se solicitó ${BROWSER}, pero se abrió ${actual}`);

    const snapshots = {};
    for (const language of LANGUAGES) {
        await startSession(driver, language);
        snapshots[language.code] = {};
        snapshots[language.code]['index.html'] = await visibleTranslatedTexts(driver);
        console.log(`LANG-NAV-006 | ${actual} | ${language.code} | registro, sesión, saludo y recarga | PASS`);

        for (const page of PAGES) {
            await goFromHome(driver, page);
            await assertLanguage(driver, language.code, `${page} después de navegar`);
            snapshots[language.code][page] = await visibleTranslatedTexts(driver);
            assert.ok(Object.keys(snapshots[language.code][page]).length,
                `${page}: no hay textos visibles con data-i18n para verificar`);

            await driver.navigate().refresh();
            await settled(driver);
            await assertLanguage(driver, language.code, `${page} después de recargar`);
            const afterReload = await visibleTranslatedTexts(driver);
            const commonKeys = Object.keys(snapshots[language.code][page]).filter(k => afterReload[k] !== undefined);
            assert.ok(commonKeys.length, `${page}: no se pudieron comparar textos tras recarga`);
            for (const key of commonKeys) {
                assert.equal(afterReload[key], snapshots[language.code][page][key],
                    `${page} ${language.code}: texto ${key} cambió después de recargar`);
            }

            await returnViaLogo(driver, page);
            await assertLanguage(driver, language.code, `${page} → logo → Home`);
            assert.equal(await driver.findElement(By.id('welcomeMessage')).getText(), language.welcome,
                `${page}: saludo no conservó el idioma al volver`);
            console.log(`LANG-NAV-006 | ${actual} | ${language.code} | ${page} → recarga → logo → Home | PASS`);
        }
    }

    // Evidencia de traducción efectiva: al menos un texto visible debe variar
    // entre los tres idiomas en cada una de las seis páginas.
    for (const page of ['index.html', ...PAGES]) {
        const es = snapshots.es[page], en = snapshots.en[page], pt = snapshots.pt[page];
        const keys = Object.keys(es).filter(key => en[key] !== undefined && pt[key] !== undefined);
        const translated = keys.filter(key => new Set([es[key], en[key], pt[key]]).size === 3);
        assert.ok(translated.length,
            `${page}: no se encontró ningún texto visible distinto en ES, EN y PT; ` +
            `revisar data-i18n y traducciones reales`);
        console.log(`LANG-NAV-006 | ${actual} | ${page} | traducción visible ES/EN/PT | PASS (${translated.length} claves)`);
    }
});
