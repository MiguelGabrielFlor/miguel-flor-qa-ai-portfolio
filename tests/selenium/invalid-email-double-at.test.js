const { test } = require('node:test');
const { setup, fill, consent, submit, invalid, valid, defaults, expected, browser, By, assert } = require('./registration-test-helpers');

const cases = [
    ['doble arroba','gabriel@@gmail.com'],
    ['dominio vacío','gabriel@'],
    ['dominio sin punto','gabriel@prueba'],
    ['usuario vacío','@gmail.com'],
    ['extensión vacía','gabriel@gmail.']
];
for (const [description, email] of cases) {
    test(`BUG-004: rechazar email con ${description}`, async t => {
        const driver = await setup(t);
        await fill(driver, {...defaults,email});
        await consent(driver);
        await submit(driver);
        await invalid(driver,'emailError','emailInvalid','email');
        console.log(`BUG-004 | ${browser} | ${description} | PASS`);
    });
}
