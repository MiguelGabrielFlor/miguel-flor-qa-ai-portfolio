
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Builder, By, until } = require('selenium-webdriver');

const casosTelefono = [
    { id: 'PHONE-001', descripcion: 'mínimo de 7 dígitos', valor: '1234567', valido: true },
    { id: 'PHONE-002', descripcion: '8 dígitos', valor: '12345678', valido: true },
    { id: 'PHONE-003', descripcion: 'máximo de 15 dígitos', valor: '123456789012345', valido: true },
    { id: 'BUG-005', descripcion: '16 dígitos', valor: '1234567890123456', valido: false },
    { id: 'BUG-001', descripcion: 'caracteres alfabéticos', valor: '12345abc', valido: false },
    { id: 'PHONE-004', descripcion: 'espacios permitidos', valor: '11 2345 6789', valido: true },
    { id: 'PHONE-005', descripcion: 'guiones permitidos', valor: '11-2345-6789', valido: true },
    { id: 'PHONE-006', descripcion: 'paréntesis permitidos', valor: '(11) 2345-6789', valido: true },
    { id: 'PHONE-007', descripcion: 'prefijo internacional', valor: '+54 11 2345-6789', valido: true },
    { id: 'PHONE-008', descripcion: 'símbolo no permitido', valor: '12345@6789', valido: false },
    { id: 'PHONE-009', descripcion: 'solo símbolos', valor: '+-()', valido: false }
];

for (const caso of casosTelefono) {
    test(`${caso.id}: teléfono con ${caso.descripcion}`, async (t) => {
        const browser = process.env.TEST_BROWSER || 'chrome';
        const driver = await new Builder().forBrowser(browser).build();

        t.after(async () => {
            await driver.quit();
        });

        const indexPath = path.resolve(__dirname, '../../index.html');
        await driver.get(pathToFileURL(indexPath).href);

        await driver.findElement(By.id('firstName')).sendKeys('Miguel');
        await driver.findElement(By.id('lastName')).sendKeys('Flor');
        await driver.findElement(By.id('email')).sendKeys('miguel@example.com');
        await driver.findElement(By.id('phone')).sendKeys(caso.valor);
        await driver.findElement(By.id('consent')).click();

        await driver.findElement(By.id('accessButton')).click();

        const phoneError = await driver.findElement(By.id('phoneError'));
        const portfolio = await driver.findElement(By.id('portfolio'));

        if (caso.valido) {
            assert.equal(
                await phoneError.getText(),
                '',
                `No debe mostrarse un error para ${caso.valor}`
            );

            await driver.wait(
                until.elementIsVisible(portfolio),
                10000,
                `El portfolio no se mostró con el teléfono ${caso.valor}`
            );

            assert.equal(
                await portfolio.isDisplayed(),
                true,
                `Debe permitirse el acceso con ${caso.valor}`
            );
        } else {
            assert.equal(
                await phoneError.getText(),
                'Ingresá un teléfono válido.',
                `Debe rechazarse ${caso.valor}`
            );

            assert.equal(
                await portfolio.isDisplayed(),
                false,
                `El portfolio debe permanecer oculto para ${caso.valor}`
            );
        }
    });
}
