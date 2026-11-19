const { test } = require('node:test');
const { setup, fill, consent, submit, invalid, valid, defaults, expected, browser, By, assert } = require('./registration-test-helpers');

test('UI-007: sin consentimiento no se permite el registro', async t => {
    const driver = await setup(t);
    await fill(driver,defaults);
    assert.equal(await driver.findElement(By.id('consent')).isSelected(),false);
    await submit(driver);
    await invalid(driver,'consentError','consentRequired','consent');
    console.log(`UI-007 | ${browser} | PASS`);
});
