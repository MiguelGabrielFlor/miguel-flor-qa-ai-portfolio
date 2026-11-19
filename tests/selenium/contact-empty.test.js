'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By } = require('selenium-webdriver');
const { createDriver } = require('./selenium-config');
const { openHome, installContactMock, expectedTranslation, submitContact } = require('./contact-test-helpers');

test('UI-011: un mensaje vacío no permite enviar el formulario de contacto', async t => {
  const browser = process.env.TEST_BROWSER || 'chrome';
  const driver = await createDriver(browser);
  t.after(async () => driver.quit());
  await openHome(driver, 'registered');
  await installContactMock(driver, 200);
  await submitContact(driver);
  const expected = await expectedTranslation(driver, 'contactRequiredError');
  await driver.wait(async () => (await driver.findElement(By.id('contactMessageError')).getText()) === expected, 5000);
  assert.equal(await driver.findElement(By.id('contactMessage')).getAttribute('aria-invalid'), 'true');
  assert.equal(await driver.findElement(By.id('contactStatus')).getText(), '');
  assert.equal(await driver.executeScript('return window.__contactCalls.length'), 0, 'No debe enviarse solicitud HTTP');
  assert.match(await driver.getCurrentUrl(), /\/home\.html(?:[?#]|$)/);
  console.log(`UI-011 | ${browser} | PASS`);
});
