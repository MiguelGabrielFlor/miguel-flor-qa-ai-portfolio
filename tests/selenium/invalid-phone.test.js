const { test } = require('node:test');
const { setup, fill, consent, submit, invalid, valid, defaults, expected, browser, By, assert } = require('./registration-test-helpers');

test('UI-006: teléfono demasiado corto', async t => {
    const driver = await setup(t);
    await fill(driver, {...defaults, phone: '123456'});
    await consent(driver);
    await submit(driver);
    await invalid(driver,'phoneError','phoneInvalid','phone');
    console.log('UI-006: teléfono demasiado corto' + ` | ${browser} | PASS`);
});
