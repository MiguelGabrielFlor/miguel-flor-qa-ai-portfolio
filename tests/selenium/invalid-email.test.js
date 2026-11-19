const { test } = require('node:test');
const { setup, fill, consent, submit, invalid, valid, defaults, expected, browser, By, assert } = require('./registration-test-helpers');

test('UI-003: email inválido', async t => {
    const driver = await setup(t);
    await fill(driver, {...defaults, email: 'correo-invalido'});
    await consent(driver);
    await submit(driver);
    await invalid(driver,'emailError','emailInvalid','email');
    console.log('UI-003: email inválido' + ` | ${browser} | PASS`);
});
