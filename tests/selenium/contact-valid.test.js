'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By } = require('selenium-webdriver');
const { createDriver } = require('./selenium-config');
const { openHome, installContactMock, expectedTranslation, submitContact } = require('./contact-test-helpers');

test('UI-010: un mensaje válido muestra la confirmación de envío', async t => {
  const browser = process.env.TEST_BROWSER || 'chrome';
  const driver = await createDriver(browser);
  t.after(async () => driver.quit());
  await openHome(driver, 'registered');
  await installContactMock(driver, 200);
  const message = 'Prueba automatizada Selenium: consulta de contacto válida.';
  await driver.findElement(By.id('contactMessage')).sendKeys(message);
  await submitContact(driver);
  const expected = await expectedTranslation(driver, 'contactSuccess');
  await driver.wait(async () => (await driver.findElement(By.id('contactStatus')).getText()) === expected, 10000);
  assert.equal(await driver.findElement(By.id('contactMessage')).getAttribute('value'), '');
  assert.equal(await driver.findElement(By.id('contactButton')).isEnabled(), true);
  const calls = await driver.executeScript('return window.__contactCalls');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].body.mensaje, message);
  assert.equal(calls[0].body.email, 'selenium.test@example.com');
  console.log(`UI-010 | ${browser} | PASS`);
});
