'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By } = require('selenium-webdriver');
const { createDriver } = require('./selenium-config');
const { openHome, installContactMock, expectedTranslation, submitContact } = require('./contact-test-helpers');

test('UI-015: el formulario gestiona un error HTTP 500', async t => {
  const browser = process.env.TEST_BROWSER || 'chrome';
  const driver = await createDriver(browser);
  t.after(async () => driver.quit());
  await openHome(driver, 'registered');
  await installContactMock(driver, 500);
  const message = 'Prueba Selenium: error HTTP 500 simulado.';
  await driver.findElement(By.id('contactMessage')).sendKeys(message);
  await submitContact(driver);
  const expected = await expectedTranslation(driver, 'contactSendError');
  await driver.wait(async () => (await driver.findElement(By.id('contactStatus')).getText()) === expected, 10000);
  assert.equal(await driver.findElement(By.id('contactMessage')).getAttribute('value'), message);
  assert.equal(await driver.findElement(By.id('contactButton')).isEnabled(), true);
  const calls = await driver.executeScript('return window.__contactCalls');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].body.mensaje, message);
  console.log(`UI-015 | ${browser} | PASS`);
});
