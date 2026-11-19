const { test } = require('node:test');
const { setup, fill, consent, submit, invalid, valid, defaults, expected, browser, By, assert } = require('./registration-test-helpers');

test('UI-005: apellido demasiado corto', async t => {
    const driver = await setup(t);
    await fill(driver, {...defaults, lastName: 'F'});
    await consent(driver);
    await submit(driver);
    await invalid(driver,'lastNameError','lastNameInvalid','lastName');
    console.log('UI-005: apellido demasiado corto' + ` | ${browser} | PASS`);
});
