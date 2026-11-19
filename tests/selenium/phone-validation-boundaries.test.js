const { test } = require('node:test');
const { setup, fill, consent, submit, invalid, valid, defaults, expected, browser, By, assert } = require('./registration-test-helpers');

const cases = [
    ['PHONE-001','mínimo de 7 dígitos','1234567',true],
    ['PHONE-002','8 dígitos','12345678',true],
    ['PHONE-003','máximo de 15 dígitos','123456789012345',true],
    ['BUG-005','16 dígitos','1234567890123456',false],
    ['BUG-001','caracteres alfabéticos','12345abc',false],
    ['PHONE-004','espacios permitidos','11 2345 6789',true],
    ['PHONE-005','guiones permitidos','11-2345-6789',true],
    ['PHONE-006','paréntesis permitidos','(11) 2345-6789',true],
    ['PHONE-007','prefijo internacional','+54 11 2345-6789',true],
    ['PHONE-008','símbolo no permitido','12345@6789',false],
    ['PHONE-009','solo símbolos','+-()',false]
];
for (const [id, description, phone, accepted] of cases) {
    test(`${id}: teléfono con ${description}`, async t => {
        const driver = await setup(t);
        await fill(driver,{...defaults,phone});
        await consent(driver);
        await submit(driver);
        if (accepted) {
            await valid(driver);
        } else {
            await invalid(driver,'phoneError','phoneInvalid','phone');
        }
        console.log(`${id} | ${browser} | PASS`);
    });
}
