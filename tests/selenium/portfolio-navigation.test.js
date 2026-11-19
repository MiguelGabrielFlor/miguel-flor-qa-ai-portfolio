const { createDriver } = require('./selenium-config');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By, until } = require('selenium-webdriver');

const BASE_URL = (process.env.TEST_BASE_URL || 'http://127.0.0.1:5500').replace(/\/$/, '');
const TEST_BROWSER = process.env.TEST_BROWSER || 'chrome';
const paginas = ['cv.html', 'frontend.html', 'backend.html', 'qa.html', 'quality-management.html'];

async function iniciarAccesoDirecto(driver) {
    await driver.get(`${BASE_URL}/index.html`);
    // Una sesión vigente puede redirigir automáticamente index.html a home.html.
    await driver.wait(async () => {
        const url = await driver.getCurrentUrl();
        if (url.includes('/home.html')) return true;
        return driver.findElements(By.id('guestAccessButton')).then(elements => elements.length > 0);
    }, 10000, 'No apareció el acceso directo ni la redirección a Home');

    if (!(await driver.getCurrentUrl()).includes('/home.html')) {
        const acceso = await driver.wait(until.elementLocated(By.id('guestAccessButton')), 10000);
        await driver.wait(until.elementIsVisible(acceso), 10000);
        await acceso.click();
        await driver.wait(until.urlContains('/home.html'), 10000);
    }
    assert.ok((await driver.getCurrentUrl()).includes('/home.html'), 'El acceso directo no llegó a Home');
}

async function abrirDesdeHome(driver, pagina) {
    await iniciarAccesoDirecto(driver);
    const enlace = await driver.wait(until.elementLocated(By.css(`a[href="${pagina}"]`)), 10000);
    await driver.executeScript(el => el.scrollIntoView({block: 'center', behavior: 'instant'}), enlace);
    await driver.wait(until.elementIsVisible(enlace), 10000);
    assert.equal(await enlace.isDisplayed(), true, `Enlace no visible: ${pagina}`);
    // Esperar a que finalice el desplazamiento y el centro del enlace no esté cubierto.
    await driver.wait(async () => driver.executeScript(el => {
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) return false;
        const top = document.elementFromPoint(x, y);
        return top === el || el.contains(top);
    }, enlace), 10000, `Enlace cubierto o fuera del viewport: ${pagina}`);
    await enlace.click();
    await driver.wait(until.urlContains(`/${pagina}`), 10000);
    assert.ok((await driver.getCurrentUrl()).endsWith(`/${pagina}`), `Destino incorrecto: ${pagina}`);
}

test('TC-019 — Navegación entre páginas del portfolio', async t => {
    const driver = await createDriver(TEST_BROWSER);
    t.after(async () => driver.quit());
    for (const pagina of paginas) {
        await driver.get(`${BASE_URL}/${pagina}`);
        const main = await driver.wait(until.elementLocated(By.css('main')), 10000);
        assert.equal(await main.isDisplayed(), true, `Contenido no visible: ${pagina}`);
        assert.ok((await driver.getCurrentUrl()).endsWith(`/${pagina}`));
        console.log(`PASS — ${TEST_BROWSER}: ${pagina}`);
    }
});

test('TC-019 — Navegación mediante enlaces del portfolio', async t => {
    const driver = await createDriver(TEST_BROWSER);
    t.after(async () => driver.quit());
    for (const pagina of paginas) {
        await abrirDesdeHome(driver, pagina);
        console.log(`PASS — ${TEST_BROWSER}: clic hacia ${pagina}`);
    }
});

test('TC-020 — Retorno al perfil desde páginas internas', async t => {
    const driver = await createDriver(TEST_BROWSER);
    t.after(async () => driver.quit());
    await iniciarAccesoDirecto(driver);
    for (const pagina of paginas) {
        await driver.get(`${BASE_URL}/${pagina}`);
        const enlace = await driver.wait(until.elementLocated(By.css('a.logo[href="home.html"]')), 10000);
        assert.equal(await enlace.isDisplayed(), true, `Logo no visible: ${pagina}`);
        await enlace.click();
        await driver.wait(until.urlContains('/home.html'), 10000);
        assert.ok((await driver.getCurrentUrl()).includes('/home.html'), `Retorno incorrecto: ${pagina}`);
        console.log(`PASS — ${TEST_BROWSER}: retorno desde ${pagina}`);
    }
});

test('TC-020 — Retorno mediante botones a secciones del Home', async t => {
    const driver = await createDriver(TEST_BROWSER);
    t.after(async () => driver.quit());
    await iniciarAccesoDirecto(driver);
    const retornos = [
        {pagina: 'cv.html', seccion: 'about'},
        {pagina: 'frontend.html', seccion: 'qa'},
        {pagina: 'backend.html', seccion: 'qa'},
        {pagina: 'qa.html', seccion: 'qa'},
        {pagina: 'quality-management.html', seccion: 'qa'}
    ];
    for (const {pagina, seccion} of retornos) {
        await driver.get(`${BASE_URL}/${pagina}`);
        const boton = await driver.wait(until.elementLocated(By.css(`a.cv-back-button[href="home.html#${seccion}"]`)), 10000);
        assert.equal(await boton.isDisplayed(), true, `Botón no visible: ${pagina}`);
        await boton.click();
        await driver.wait(until.urlContains(`/home.html#${seccion}`), 10000);
        const url = await driver.getCurrentUrl();
        assert.equal(url, `${BASE_URL}/home.html#${seccion}`, `Retorno incorrecto: ${pagina}`);
        const destino = await driver.wait(until.elementLocated(By.id(seccion)), 10000);
        await driver.wait(until.elementIsVisible(destino), 10000);
        assert.equal(await destino.isDisplayed(), true, `Sección no visible: ${seccion}`);
        console.log(`PASS — ${TEST_BROWSER}: ${pagina} → Home #${seccion}`);
    }
});
