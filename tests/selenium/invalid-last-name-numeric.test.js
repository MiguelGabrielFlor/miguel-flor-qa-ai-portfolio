const { test } = require('node:test');
const { setup, fill, consent, submit, invalid, valid, defaults, expected, browser, By, assert } = require('./registration-test-helpers');

test('BUG-003: apellido con números', async t => {
    const driver = await setup(t);
    await fill(driver, {...defaults, lastName: 'Flor567'});
    await consent(driver);
    await submit(driver);
    await invalid(driver,'lastNameError','lastNameInvalid','lastName');
    console.log('BUG-003: apellido con números' + ` | ${browser} | PASS`);
});
