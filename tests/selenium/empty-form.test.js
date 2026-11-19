const { test } = require('node:test');
const { setup, fill, consent, submit, invalid, valid, defaults, expected, browser, By, assert } = require('./registration-test-helpers');

test('UI-002: formulario vacío muestra cinco errores', async t => {
    const driver = await setup(t);
    await submit(driver);
    for (const [errorId, key, fieldId] of [
        ['firstNameError','firstNameRequired','firstName'],
        ['lastNameError','lastNameRequired','lastName'],
        ['emailError','emailRequired','email'],
        ['phoneError','phoneRequired','phone'],
        ['consentError','consentRequired','consent']
    ]) await invalid(driver,errorId,key,fieldId);
    console.log(`UI-002 | ${browser} | PASS`);
});
