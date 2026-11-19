'use strict';
const assert = require('node:assert/strict');
const { By } = require('selenium-webdriver');
const BASE = process.env.TEST_BASE_URL || 'http://127.0.0.1:5500';

async function openHome(driver, accessType = 'guest') {
  await driver.get(`${BASE}/index.html`);
  await driver.executeScript(`
    localStorage.setItem('portfolioLanguage', 'es');
    sessionStorage.setItem('portfolioSession', JSON.stringify(arguments[0]));
  `, accessType === 'guest'
    ? { accessType: 'guest', language: 'es' }
    : { accessType: 'registered', firstName: 'Miguel', lastName: 'Flor', email: 'selenium.test@example.com', phone: '1123456789', language: 'es' });
  await driver.get(`${BASE}/home.html`);
  await driver.wait(async () => driver.executeScript(`
    return location.pathname.endsWith('/home.html') &&
      document.documentElement.lang === 'es' &&
      !!document.getElementById('contactForm') &&
      !!document.getElementById('contactButton') &&
      !!window.portfolioTranslations?.es?.contactSuccess;
  `), 10000, 'Home o diccionario español no disponible');
  await driver.wait(async () => driver.executeScript(`
    return document.getElementById('contactButton') &&
      !document.getElementById('contactButton').disabled;
  `), 10000);
}

async function installContactMock(driver, status) {
  // Reemplazo explícito, sin alterar solicitudes ajenas.
  await driver.executeScript(`
    window.__contactCalls = [];
    const previousFetch = window.fetch;
    window.fetch = async (url, options) => {
      if (String(url).endsWith('/api/contact')) {
        window.__contactCalls.push({ url: String(url), method: options.method, body: JSON.parse(options.body) });
        return { ok: arguments[0] >= 200 && arguments[0] < 300, status: arguments[0] };
      }
      return previousFetch(url, options);
    };
  `, status);
}

async function expectedTranslation(driver, key) {
  const value = await driver.executeScript('return window.portfolioTranslations?.es?.[arguments[0]]', key);
  assert.ok(typeof value === 'string' && value.length > 0, `Falta traducción ES: ${key}`);
  return value;
}

async function submitContact(driver) {
  const button = await driver.findElement(By.id('contactButton'));
  await driver.executeScript('arguments[0].scrollIntoView({block:"center",behavior:"instant"})', button);
  await driver.wait(async () => driver.executeScript(`
    const e = arguments[0], r = e.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2);
    return hit === e || e.contains(hit);
  `, button), 7000, 'El botón de contacto está cubierto');
  await button.click();
}
module.exports = { openHome, installContactMock, expectedTranslation, submitContact };
