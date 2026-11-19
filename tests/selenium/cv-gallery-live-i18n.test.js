'use strict';
const { createDriver } = require('./selenium-config');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By } = require('selenium-webdriver');
const BASE_URL = (process.env.TEST_BASE_URL || 'http://127.0.0.1:5500').replace(/\/$/, '');
const TIMEOUT = 20000;

test('CV-I18N-004 — Cambio de idioma con galería abierta', async (t) => {
    const browser = process.env.TEST_BROWSER || 'chrome';
    const driver = await createDriver(browser);
    t.after(async () => driver.quit());
    const actual = String((await driver.getCapabilities()).get('browserName') || '').toLowerCase();
    assert.equal(actual, browser.toLowerCase() === 'edge' ? 'microsoftedge' : browser.toLowerCase());
    await driver.get(`${BASE_URL}/cv.html`);
    await driver.wait(() => driver.executeScript(() =>
        !!document.getElementById('certificateDialog') &&
        !!document.querySelector('[data-certificate-category="marketing"]') &&
        !!document.getElementById('cv-language-select') &&
        typeof window.loadPortfolioLanguage === 'function'
    ), TIMEOUT);

    async function changeLanguage(lang) {
        await driver.executeScript((language) => {
            const selector = document.getElementById('cv-language-select');
            selector.value = language;
            selector.dispatchEvent(new Event('change', { bubbles: true }));
        }, lang);
        await driver.wait(() => driver.executeScript((language) => {
            const select = document.getElementById('cv-language-select');
            return !select.disabled && select.value === language &&
                document.documentElement.lang === language &&
                localStorage.getItem('portfolioLanguage') === language;
        }, lang), TIMEOUT, `No se completó el idioma ${lang}`);
    }

    await changeLanguage('es');
    const card = await driver.findElement(By.css('[data-certificate-category="marketing"]'));
    await driver.executeScript((element) => {
        element.scrollIntoView({ block: 'center' });
        element.click();
    }, card);
    await driver.wait(() => driver.executeScript(() =>
        document.getElementById('certificateDialog').open &&
        document.querySelectorAll('#certificateGallery .certificate-item').length > 0
    ), TIMEOUT, 'La galería de Marketing no abrió');

    const initialCount = await driver.executeScript(() =>
        document.querySelectorAll('#certificateGallery .certificate-item').length);
    for (const lang of ['en', 'pt', 'es']) {
        await changeLanguage(lang);
        await driver.wait(() => driver.executeScript((language, count) => {
            const dict = window.portfolioTranslations?.[language];
            const dialog = document.getElementById('certificateDialog');
            const items = [...document.querySelectorAll('#certificateGallery .certificate-item')];
            return !!dict && dialog.open &&
                document.getElementById('certificateDialogTitle').textContent.trim() === dict.cvMarketingTitle &&
                items.length === count &&
                items.every(item => item.querySelector('a')?.textContent.trim() === dict.cvCertificateOpenImage &&
                    item.querySelector('img')?.getAttribute('aria-label')?.startsWith(dict.cvCertificateEnlargeImage + ': '));
        }, lang, initialCount), TIMEOUT, `Galería sin traducir correctamente en ${lang}`);
        const check = await driver.executeScript(() => ({
            open: document.getElementById('certificateDialog').open,
            count: document.querySelectorAll('#certificateGallery .certificate-item').length,
            urls: [...document.querySelectorAll('#certificateGallery .certificate-item img')].map(img => img.getAttribute('src'))
        }));
        assert.ok(check.open);
        assert.equal(check.count, initialCount);
        assert.ok(check.urls.every(Boolean), `${lang}: imágenes sin URL`);
        console.log(`CV-I18N-004 | ${actual} | Galería abierta | ${lang.toUpperCase()} | PASS`);
    }
});
