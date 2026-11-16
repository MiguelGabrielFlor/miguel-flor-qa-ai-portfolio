
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By, until } = require('selenium-webdriver');
const { createDriver } = require('./selenium-config');

const BASE_URL = 'http://127.0.0.1:8000';
const browser = process.env.TEST_BROWSER || 'chrome';

async function abrirAcceso(driver) {
    await driver.get(`${BASE_URL}/index.html`);

    await driver.wait(
        until.elementLocated(By.id('guestAccessButton')),
        10000
    );

    await driver.executeScript(() => {
        sessionStorage.clear();
        localStorage.removeItem('portfolioLanguage');
    });

    await driver.navigate().refresh();
}

async function esperarHome(driver, accessType) {
    await driver.wait(
        async () => {
            const url = await driver.getCurrentUrl();
            return new URL(url).pathname === '/home.html';
        },
        15000,
        `No se produjo la redirección a Home (${accessType})`
    );

    const menu = await driver.wait(
        until.elementLocated(By.id('indice-contenidos')),
        10000
    );

    const session = await driver.executeScript(() => {
        const saved = sessionStorage.getItem('portfolioSession');
        return saved ? JSON.parse(saved) : null;
    });

    assert.ok(session, 'No existe una sesión válida');
    assert.equal(session.accessType, accessType);

    return menu;
}

async function verificarIndice(driver) {
    const menu = await driver.findElement(
        By.id('indice-contenidos')
    );

    const buscador = await driver.findElement(
        By.id('portfolio-search-input')
    );

    assert.ok(await buscador.isDisplayed());

    // 1. Cierre al seleccionar una sección.
    await driver.executeScript(() => {
        document.getElementById('indice-contenidos').open = true;
    });

    assert.equal(
        await menu.getAttribute('open'),
        'true'
    );

    await driver.executeScript(() => {
        document.querySelector(
            '#indice-contenidos .index-link[href="#about"]'
        ).click();
    });

    await driver.wait(
        async () => !(await menu.getAttribute('open')),
        5000,
        'El índice no se cerró al seleccionar una sección'
    );

    assert.equal(
        new URL(await driver.getCurrentUrl()).hash,
        '#about'
    );

    console.log('PASS — Selección de sección');

    // 2. Cierre al enfocar el buscador.
    await driver.executeScript(() => {
        document.activeElement?.blur();
        document.getElementById('indice-contenidos').open = true;
    });

    await driver.executeScript(() => {
        document.getElementById(
            'portfolio-search-input'
        ).focus();
    });

    await driver.wait(
        async () => !(await menu.getAttribute('open')),
        5000,
        'El índice no se cerró al enfocar el buscador'
    );

    console.log('PASS — Enfoque del buscador');

    // 3. Cierre al introducir una búsqueda.
    await driver.executeScript(() => {
        const input = document.getElementById(
            'portfolio-search-input'
        );

        input.blur();
        input.value = '';
        document.getElementById('indice-contenidos').open = true;
    });

    await driver.executeScript(() => {
        const input = document.getElementById(
            'portfolio-search-input'
        );

        input.value = 'QA';
        input.dispatchEvent(
            new Event('input', { bubbles: true })
        );
    });

    await driver.wait(
        async () => !(await menu.getAttribute('open')),
        5000,
        'El índice no se cerró al introducir una búsqueda'
    );

    console.log('PASS — Entrada en el buscador');
}

test('HOME-MOD-001 — Acceso directo e índice', async (t) => {
    const driver = await createDriver(browser);

    t.after(async () => {
        await driver.quit();
    });

    await abrirAcceso(driver);

    const guestButton = await driver.findElement(
        By.id('guestAccessButton')
    );

    await guestButton.click();

    await esperarHome(driver, 'guest');

    console.log('PASS — Acceso directo a Home');

    await verificarIndice(driver);
});

test('HOME-MOD-001 — Acceso registrado e índice', async (t) => {
    const driver = await createDriver(browser);

    t.after(async () => {
        await driver.quit();
    });

    await abrirAcceso(driver);

    const registeredButton = await driver.findElement(
        By.id('registeredAccessButton')
    );

    await registeredButton.click();

    const form = await driver.findElement(
        By.id('accessForm')
    );

    await driver.wait(
        until.elementIsVisible(form),
        10000
    );

    await driver.findElement(By.id('firstName'))
        .sendKeys('Tester');

    await driver.findElement(By.id('lastName'))
        .sendKeys('QA');

    await driver.findElement(By.id('email'))
        .sendKeys('qa.home@example.com');

    await driver.findElement(By.id('phone'))
        .sendKeys('1123456789');

    await driver.findElement(By.id('consent'))
        .click();

    await driver.findElement(By.id('accessButton'))
        .click();

    await esperarHome(driver, 'registered');

    console.log('PASS — Acceso registrado a Home');

    await verificarIndice(driver);
});
