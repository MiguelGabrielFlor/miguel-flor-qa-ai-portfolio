'use strict';
const { createDriver } = require('./selenium-config');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By } = require('selenium-webdriver');

const BASE_URL = (process.env.TEST_BASE_URL || 'http://127.0.0.1:5500').replace(/\/$/, '');
const TIMEOUT = 20000;

async function changeLanguage(driver, language) {
    await driver.executeScript((lang) => {
        const select = document.getElementById('cv-language-select');
        select.value = lang;
        select.dispatchEvent(new Event('change', { bubbles: true }));
    }, language);
    await driver.wait(async () => driver.executeScript((lang) => {
        const select = document.getElementById('cv-language-select');
        return !select.disabled && select.value === lang &&
            document.documentElement.lang === lang &&
            localStorage.getItem('portfolioLanguage') === lang;
    }, language), TIMEOUT, `No se completó el cambio de idioma a ${language}`);
}

test('BACKEND-I18N-001 — Arquitectura API ES/EN/PT', async (t) => {
    const browser = process.env.TEST_BROWSER || 'chrome';
    const driver = await createDriver(browser);
    t.after(async () => driver.quit());
    const actual = String((await driver.getCapabilities()).get('browserName') || '').toLowerCase();
    assert.equal(actual, browser.toLowerCase() === 'edge' ? 'microsoftedge' : browser.toLowerCase());
    await driver.get(`${BASE_URL}/backend.html`);
    await driver.wait(() => driver.executeScript(() =>
        !!document.getElementById('cv-language-select') &&
        !!window.BackendAPI && !!window.BackendResultRenderer &&
        typeof window.loadPortfolioLanguage === 'function'
    ), TIMEOUT, 'No cargaron los módulos del backend');

    const scenarios = [
        { type: 'health', key: 'backendDynamic035' },
        { type: 'visitors', key: 'backendDynamic039' },
        { type: 'contact', key: 'backendDynamic043' },
        { type: 'integration', key: 'backendDynamic046' }
    ];
    for (const scenario of scenarios) {
        await changeLanguage(driver, 'es');
        await driver.executeScript((type) => {
            document.querySelector(`[data-api-prueba="${type}"]`).click();
        }, scenario.type);
        await driver.wait(() => driver.executeScript(() => {
            const result = document.getElementById('api-resultado');
            const verdict = result?.querySelector(':scope > p');
            const buttons = [...document.querySelectorAll('[data-api-prueba]')];
            return verdict?.classList.contains('backend-veredicto-pass') &&
                buttons.every(b => !b.disabled) && !!result.querySelector(':scope > pre');
        }), TIMEOUT, `${scenario.type}: la API no devolvió PASS; verificá que el backend esté activo`);

        const original = await driver.executeScript(() => {
            const result = document.getElementById('api-resultado');
            return {
                verdict: result.querySelector(':scope > p').textContent,
                json: result.querySelector(':scope > pre').textContent
            };
        });
        assert.match(original.verdict, /^PASS —/);
        for (const lang of ['es', 'en', 'pt', 'es']) {
            await changeLanguage(driver, lang);
            await driver.wait(() => driver.executeScript((language, key) => {
                const expected = window.portfolioTranslations?.[language]?.[key];
                const result = document.getElementById('api-resultado');
                return typeof expected === 'string' && expected.length > 0 &&
                    result?.textContent.includes(expected);
            }, lang, scenario.key), TIMEOUT,
            `${scenario.type}: falta traducción o actualización dinámica ${lang} (${scenario.key})`);
            const current = await driver.executeScript(() => {
                const result = document.getElementById('api-resultado');
                return {
                    verdict: result.querySelector(':scope > p').textContent,
                    json: result.querySelector(':scope > pre').textContent
                };
            });
            assert.deepEqual(current, original, `${scenario.type}: el cambio de idioma alteró HTTP/JSON`);
            console.log(`BACKEND-I18N-001 | ${actual} | ${scenario.type} | ${lang.toUpperCase()} | PASS`);
        }
    }
});
