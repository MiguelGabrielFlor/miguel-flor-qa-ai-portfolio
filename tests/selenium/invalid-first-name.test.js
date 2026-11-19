const { test } = require('node:test');
const { setup, fill, consent, submit, invalid, valid, defaults, expected, browser, By, assert } = require('./registration-test-helpers');

test('UI-004: nombre demasiado corto', async t => {
    const driver = await setup(t);
    await fill(driver, {...defaults, firstName: 'M'});
    await consent(driver);
    await submit(driver);
    await invalid(driver,'firstNameError','firstNameInvalid','firstName');
    console.log('UI-004: nombre demasiado corto' + ` | ${browser} | PASS`);
});
