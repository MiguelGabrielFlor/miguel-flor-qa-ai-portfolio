const { test } = require('node:test');
const { setup, fill, consent, submit, invalid, valid, defaults, expected, browser, By, assert } = require('./registration-test-helpers');

test('UI-008: registro válido permite acceder al portfolio', async t => {
    const driver = await setup(t);
    await fill(driver,defaults);
    await consent(driver);
    await submit(driver);
    await valid(driver);
    console.log(`UI-008 | ${browser} | PASS`);
});
