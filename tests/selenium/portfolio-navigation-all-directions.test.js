
'use strict';

// Ejecutar con el servidor del portfolio en http://127.0.0.1:8000.
// TEST_BROWSER=chrome|firefox|MicrosoftEdge (PowerShell: $env:TEST_BROWSER='firefox').
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Builder, By, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

const BASE = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:8000';
const BROWSER = process.env.TEST_BROWSER || 'chrome';

const HOME = 'home.html';

const INTERNAL = [
    'cv.html',
    'frontend.html',
    'backend.html',
    'qa.html',
    'quality-management.html'
];

const PAGES = [HOME, ...INTERNAL];

const LANGUAGES = ['es', 'en', 'pt'];
const WAIT = 12000;

function pageName(url) {
    return new URL(url).pathname.split('/').pop() || 'index.html';
}
function destination(url) {
    const parsed = new URL(url);
    return { page: pageName(url), hash: parsed.hash };
}
async function ready(driver) {
    await driver.wait(async () => (await driver.executeScript('return document.readyState')) === 'complete', WAIT);
}

async function clickReal(driver, element) {
    await driver.executeScript(`
        arguments[0].scrollIntoView({
            behavior: "instant",
            block: "center",
            inline: "nearest"
        });
    `, element);

    await driver.wait(
        until.elementIsVisible(element),
        WAIT
    );

    await driver.wait(async () => {
        return await driver.executeScript(`
            const element = arguments[0];
            const rect = element.getBoundingClientRect();

            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            const insideViewport =
                x >= 0 &&
                y >= 0 &&
                x < window.innerWidth &&
                y < window.innerHeight;

            if (!insideViewport) return false;

            const top = document.elementFromPoint(x, y);

            return top === element || element.contains(top);
        `, element);
    }, WAIT);

    await element.click();
    await ready(driver);
}

async function enterHome(driver, language) {
    await driver.get(`${BASE}/index.html`);
    await ready(driver);

    await driver.executeScript(
        'localStorage.setItem("portfolioLanguage", arguments[0]);',
        language
    );

    await driver.navigate().refresh();
    await ready(driver);

    // Una sesión válida puede redirigir automáticamente a Home.
    if (pageName(await driver.getCurrentUrl()) !== HOME) {
        const guestButton = await driver.findElement(
            By.id('guestAccessButton')
        );

        await clickReal(driver, guestButton);
    }

    await driver.wait(
        until.urlContains('/home.html'),
        WAIT
    );

    await ready(driver);

    assert.equal(
        pageName(await driver.getCurrentUrl()),
        HOME,
        'No se llegó a Home'
    );
}


async function verifyLanguage(driver, language, label) {
    const values = await driver.executeScript('return [document.documentElement.lang,localStorage.getItem("portfolioLanguage")];');
    assert.deepEqual(values, [language, language], `${label}: idioma perdido`);
}
async function clickHomeLink(driver, target) {
    const links = await driver.findElements(By.css(`a[href^="${target}"]`));
    const visible = [];
    for (const link of links) if (await link.isDisplayed()) visible.push(link);
    assert.ok(visible.length, `Home no presenta enlace visible hacia ${target}`);

    try {
        await clickReal(driver, visible[0]);
    } catch (error) {
        const diagnostic = await driver.executeScript(`
            const link = arguments[0];
            const rect = link.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            const blocker = document.elementFromPoint(x, y);

            return {
                target: link.outerHTML.slice(0, 300),
                position: { x, y },
                blocker: blocker?.outerHTML.slice(0, 500) || null
            };
        `, visible[0]);

        console.error(
            'NAV-ALL | CLICK FAIL |',
            target,
            JSON.stringify(diagnostic, null, 2)
        );

        throw error;
    }

    assert.equal(pageName(await driver.getCurrentUrl()), target, `Enlace Home → ${target}`);
}

async function findReturn(driver) {
    // Retornos hacia secciones de Home o QA; excluye el logo.
    const links = await driver.findElements(
        By.css('a[href*="home.html#"], a[href*="qa.html#"]')
    );

    for (const link of links) {
        if (
            await link.isDisplayed() &&
            !(await link.getAttribute('class') || '')
                .split(/\s+/)
                .includes('logo')
        ) {
            return link;
        }
    }

    return null;
}

async function verifyAnchor(driver, hash) {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const target = await driver.findElements(By.id(id));
    assert.ok(target.length, `No existe sección de destino ${hash}`);
    assert.ok(await target[0].isDisplayed(), `Sección ${hash} no visible`);
}

test('NAV-ALL — navegación entre seis páginas, logo y retornos ES/EN/PT', async t => {

    const builder = new Builder().forBrowser(BROWSER);

    if (BROWSER === 'firefox') {
        const options = new firefox.Options().setBinary(
            'C:\\Program Files\\WindowsApps\\Mozilla.Firefox_159.0.1.0_x64__n80bbvh6b1yt2\\VFS\\ProgramFiles\\Firefox Package Root\\firefox.exe'
        );

        builder.setFirefoxOptions(options);
    }

    const driver = await builder.build();

    t.after(async () => driver.quit());
    const actual = String((await driver.getCapabilities()).get('browserName')).toLowerCase();
    assert.equal(actual, BROWSER.toLowerCase(), `Navegador solicitado ${BROWSER}; abierto ${actual}`);

    for (const language of LANGUAGES) {
        await enterHome(driver, language);
        await verifyLanguage(driver, language, 'Home');

        // Cinco salidas desde Home; retorno por el logo siempre al inicio.
        for (const target of INTERNAL) {
            await enterHome(driver, language);
            await clickHomeLink(driver, target);
            await verifyLanguage(driver, language, target);
            const logos = await driver.findElements(By.css('a.logo[href="home.html"]'));
            assert.ok(logos.length, `${target}: falta logo de retorno`);
            await clickReal(driver, logos[0]);
            const url = await driver.getCurrentUrl();
            assert.equal(pageName(url), HOME, `${target}: logo no vuelve a Home`);
            assert.equal(new URL(url).hash, '', `${target}: logo no debe apuntar a una sección`);
            await driver.wait(async () => (await driver.executeScript('return window.scrollY')) <= 5, WAIT);
            await verifyLanguage(driver, language, `${target} → logo`);
            console.log(`NAV-ALL | ${actual} | ${language} | Home → ${target} → logo/Home | PASS`);
        }

        // Botones de retorno: deben tener ancla de sección y esta debe existir.
        for (const target of INTERNAL) {
            await enterHome(driver, language);
            await clickHomeLink(driver, target);
            const back = await findReturn(driver);
            assert.ok(back, `${target}: no se encontró botón/enlace Volver hacia su sección de origen`);
            const expected = destination(await back.getAttribute('href'));
            assert.ok(
                [HOME, 'qa.html'].includes(expected.page),
                `${target}: retorno inesperado ${expected.page}`
            );
            assert.ok(expected.hash, `${target}: Volver no tiene sección de destino`);
            await clickReal(driver, back);
            const url = await driver.getCurrentUrl();
            assert.equal(pageName(url), expected.page);
            assert.equal(new URL(url).hash, expected.hash, `${target}: Volver no respetó el ancla`);
            await verifyAnchor(driver, expected.hash);
            await verifyLanguage(driver, language, `${target} → Volver`);
            console.log(`NAV-ALL | ${actual} | ${language} | ${target} → ${expected.hash} | PASS`);
        }

        // Todos los pares ordenados de páginas distintas (6×5=30),
        // utilizando enlaces reales. Para páginas internas, el logo lleva
        // a Home y desde allí se selecciona el destino.

        for (const from of PAGES) {
            for (const to of PAGES) {
                if (from === to) continue;

                await enterHome(driver, language);

                // Navegar desde Home hasta la página de origen.
                if (from !== HOME) {
                    await clickHomeLink(driver, from);
                }

                // Regresar a Home mediante el logo.
                if (from !== HOME) {
                    const logo = await driver.findElement(
                        By.css('a.logo[href="home.html"]')
                    );

                    await clickReal(driver, logo);

                    assert.equal(
                        pageName(await driver.getCurrentUrl()),
                        HOME
                    );
                }

                // Navegar desde Home hasta el destino.
                if (to !== HOME) {
                    await clickHomeLink(driver, to);
                }

                assert.equal(
                    pageName(await driver.getCurrentUrl()),
                    to,
                    `${from} → ${to}`
                );

                await verifyLanguage(
                    driver,
                    language,
                    `${from} → ${to}`
                );

                console.log(
                    `NAV-ALL | ${actual} | ${language} | ${from} → ${to} | PASS`
                );
            }
        }

    }
});
