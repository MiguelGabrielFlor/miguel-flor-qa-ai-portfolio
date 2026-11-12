const { createDriver } = require('./selenium-config');

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By, until } = require('selenium-webdriver');

const BASE_URL = 'http://127.0.0.1:8000';
const TEST_BROWSER = process.env.TEST_BROWSER || 'chrome';

const paginas = [
    'cv.html',
    'frontend.html',
    'backend.html',
    'qa.html',
    'quality-management.html'
];

test('TC-019 — Navegación entre páginas del portfolio', async (t) => {
    const driver = await createDriver(TEST_BROWSER);

    t.after(async () => {
        await driver.quit();
    });

    for (const pagina of paginas) {
        // Comprobar que la página carga y tiene contenido.
        await driver.get(`${BASE_URL}/${pagina}`);

        await driver.wait(
            until.elementLocated(By.css('body')),
            10000
        );

        const url = await driver.getCurrentUrl();

        assert.ok(
            url.endsWith(`/${pagina}`),
            `Destino incorrecto: ${url}`
        );

        const contenido = await driver.findElement(
            By.css('main')
        );

        assert.equal(
            await contenido.isDisplayed(),
            true,
            `Contenido principal no visible: ${pagina}`
        );

        console.log(`PASS — ${TEST_BROWSER}: ${pagina}`);
    }
});

test('TC-019 — Navegación mediante enlaces del portfolio', async (t) => {
    const driver = await createDriver(TEST_BROWSER);

    t.after(async () => {
        await driver.quit();
    });

    for (const pagina of paginas) {
        // Reiniciar la sesión antes de cada recorrido.
        await driver.get(`${BASE_URL}/index.html`);

        await driver.executeScript(`
            sessionStorage.removeItem('portfolioSession');
        `);

        await driver.navigate().refresh();
        // Completar el formulario de acceso al portfolio.
        await driver.findElement(By.id('firstName')).sendKeys('Miguel');
        await driver.findElement(By.id('lastName')).sendKeys('Flor');
        await driver.findElement(By.id('email')).sendKeys('selenium.test@example.com');
        await driver.findElement(By.id('phone')).sendKeys('1123456789');
        await driver.findElement(By.id('consent')).click();
        await driver.findElement(By.id('accessButton')).click();

        // Esperar a que el portfolio esté visible.
        const portfolio = await driver.wait(
            until.elementLocated(By.id('portfolio')),
            10000
        );

        await driver.wait(
            until.elementIsVisible(portfolio),
            10000
        );

        // 2. Localizar el enlace correspondiente.
        const enlace = await driver.wait(
            until.elementLocated(
                By.css(`a[href="${pagina}"]`)
            ),
            10000
        );

        // 3. Verificar que el enlace sea visible.
        assert.equal(
            await enlace.isDisplayed(),
            true,
            `Enlace no visible: ${pagina}`
        );

        // 4. Hacer clic.
        await enlace.click();

        // 5. Verificar el destino.
        await driver.wait(
            until.urlContains(`/${pagina}`),
            10000
        );

        const url = await driver.getCurrentUrl();

        assert.ok(
            url.endsWith(`/${pagina}`),
            `Navegación incorrecta: ${url}`
        );

        console.log(`PASS — ${TEST_BROWSER}: clic hacia ${pagina}`);
    }
});
test('TC-020 — Retorno al perfil desde páginas internas', async (t) => {

    const driver = await createDriver(TEST_BROWSER);

    t.after(async () => {
        await driver.quit();
    });

    for (const pagina of paginas) {

        // 1. Abrir una página interna.
        await driver.get(`${BASE_URL}/${pagina}`);

        // 2. Localizar el logo de retorno.
        const enlace = await driver.wait(
            until.elementLocated(
                By.css('a.logo[href="index.html"]')
            ),
            10000
        );

        // 3. Verificar que sea visible.
        assert.equal(
            await enlace.isDisplayed(),
            true,
            `Logo de retorno no visible: ${pagina}`
        );

        // 4. Hacer clic en el logo.
        await enlace.click();

        // 5. Verificar el regreso a index.html.
        await driver.wait(
            until.urlContains('/index.html'),
            10000
        );

        const url = await driver.getCurrentUrl();

        assert.ok(
            url.endsWith('/index.html'),
            `Retorno incorrecto desde ${pagina}: ${url}`
        );

        console.log(
            `PASS — ${TEST_BROWSER}: retorno desde ${pagina}`
        );
    }
});
test('TC-020 — Retorno mediante botones a secciones del Home', async (t) => {

    const driver = await createDriver(TEST_BROWSER);

    t.after(async () => {
        await driver.quit();
    });
    // Iniciar una sesión válida antes de verificar los retornos.
    await driver.get(`${BASE_URL}/index.html`);

    await driver.findElement(By.id('firstName')).sendKeys('Miguel');
    await driver.findElement(By.id('lastName')).sendKeys('Flor');
    await driver.findElement(By.id('email')).sendKeys('selenium.test@example.com');
    await driver.findElement(By.id('phone')).sendKeys('1123456789');
    await driver.findElement(By.id('consent')).click();
    await driver.findElement(By.id('accessButton')).click();

    const portfolio = await driver.wait(
        until.elementLocated(By.id('portfolio')),
        10000
    );

    await driver.wait(
        until.elementIsVisible(portfolio),
        10000
    );

    const retornos = [
        { pagina: 'cv.html', seccion: 'about' },
        { pagina: 'frontend.html', seccion: 'qa' },
        { pagina: 'backend.html', seccion: 'qa' },
        { pagina: 'qa.html', seccion: 'qa' },
        { pagina: 'quality-management.html', seccion: 'qa' }
    ];

    for (const { pagina, seccion } of retornos) {

        // 1. Abrir la página interna.
        await driver.get(`${BASE_URL}/${pagina}`);

        // 2. Localizar el botón de retorno.
        const boton = await driver.wait(
            until.elementLocated(
                By.css(`a.cv-back-button[href="index.html#${seccion}"]`)
            ),
            10000
        );

        // 3. Verificar que sea visible.
        assert.equal(
            await boton.isDisplayed(),
            true,
            `Botón de retorno no visible: ${pagina}`
        );

        // 4. Hacer clic.
        await boton.click();

        // 5. Verificar el destino y la sección.
        await driver.wait(
            until.urlIs(`${BASE_URL}/index.html#${seccion}`),
            10000
        );

        const url = await driver.getCurrentUrl();

        assert.equal(
            url,
            `${BASE_URL}/index.html#${seccion}`,
            `Retorno incorrecto desde ${pagina}`
        );
        
        console.log(
            `PASS — ${TEST_BROWSER}: ${pagina} → Home #${seccion}`
        );
        // Verificar que la sección de destino sea visible.
        const destino = await driver.wait(
            until.elementLocated(By.id(seccion)),
            10000
        );

        await driver.wait(
            until.elementIsVisible(destino),
            10000
        );

        assert.equal(
            await destino.isDisplayed(),
            true,
            `Sección no visible: ${seccion}`
        );
    }
});