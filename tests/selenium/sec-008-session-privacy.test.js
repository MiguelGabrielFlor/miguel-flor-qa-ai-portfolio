
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By, Key, until } = require('selenium-webdriver');
const { createDriver } = require('./selenium-config');

const BASE = (
    process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:8000'
).replace(/\/$/, '');

const BROWSER = process.env.TEST_BROWSER || 'chrome';
const WAIT = 12000;

const LANGUAGES = [
    {
        code: 'es',
        privacy: 'Política de privacidad',
        logout: 'Salir del portfolio',
        query: 'privacy'
    },
    {
        code: 'en',
        privacy: 'Privacy Policy',
        logout: 'Exit portfolio',
        query: 'privacidad'
    },
    {
        code: 'pt',
        privacy: 'Política de Privacidade',
        logout: 'Sair do portfólio',
        query: 'privacy policy'
    }
];

async function ready(driver) {
    await driver.wait(
        () => driver.executeScript(
            'return document.readyState === "complete"'
        ),
        WAIT
    );
}

async function openHome(driver, language) {
    await driver.get(`${BASE}/index.html`);
    await ready(driver);

    await driver.executeScript(
        'localStorage.setItem("portfolioLanguage", arguments[0]);',
        language
    );

    await driver.executeScript(
        'sessionStorage.setItem("portfolioSession", JSON.stringify(arguments[0]));',
        {
            firstName: 'Selenium',
            language,
            accessType: 'guest'
        }
    );

    await driver.get(`${BASE}/home.html`);
    await ready(driver);

    await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        WAIT
    );
}

async function search(driver, query) {
    const input = await driver.findElement(
        By.css('.portfolio-search-input')
    );

    await input.clear();
    await input.sendKeys(query);

    return input;
}

for (const language of LANGUAGES) {
    test(`SEC-008 — Privacidad ${language.code} (${BROWSER})`, async t => {
        const driver = await createDriver(BROWSER);

        t.after(async () => {
            await driver.quit();
        });

        await openHome(driver, language.code);

        const input = await search(driver, language.query);

        const privacyResult = await driver.wait(
            until.elementLocated(
                By.css('[data-search-privacy]')
            ),
            WAIT
        );

        assert.equal(await privacyResult.isDisplayed(), true);

        assert.ok(
            (await privacyResult.getText()).includes(language.privacy),
            `${language.code}: título de privacidad incorrecto`
        );

        await privacyResult.click();

        const dialog = await driver.wait(
            until.elementLocated(By.id('privacyPolicyDialog')),
            WAIT
        );

        await driver.wait(
            async () => dialog.getAttribute('open'),
            WAIT
        );

        assert.ok(
            (await dialog.getText()).includes(language.privacy),
            `${language.code}: la política no aparece traducida`
        );

        await dialog.sendKeys(Key.ESCAPE);

        await driver.wait(
            async () => !(await dialog.getAttribute('open')),
            WAIT
        );

        const session = await driver.executeScript(
            'return sessionStorage.getItem("portfolioSession")'
        );

        assert.ok(session, 'Abrir privacidad eliminó la sesión');

        const storedLanguage = await driver.executeScript(
            'return localStorage.getItem("portfolioLanguage")'
        );

        assert.equal(storedLanguage, language.code);
    });
}

for (const language of LANGUAGES) {
    test(`SEC-008 — Salida ${language.code} (${BROWSER})`, async t => {
        const driver = await createDriver(BROWSER);

        t.after(async () => {
            await driver.quit();
        });

        await openHome(driver, language.code);

        const input = await search(driver, 'logout');

        const logoutResult = await driver.wait(
            until.elementLocated(
                By.css('.portfolio-search-result[data-portfolio-logout]')
            ),
            WAIT
        );

        assert.ok(
            (await logoutResult.getText()).includes(language.logout),
            `${language.code}: título de salida incorrecto`
        );

        await logoutResult.click();

        await driver.wait(
            until.urlContains('index.html'),
            WAIT
        );

        const state = await driver.executeScript(`
            return {
                session: sessionStorage.getItem("portfolioSession"),
                language: localStorage.getItem("portfolioLanguage")
            };
        `);

        assert.equal(state.session, null);
        assert.equal(state.language, language.code);
    });
}


/* =========================================================
   SEC-008 — REGRESIÓN COMPLEMENTARIA
   Menú, footer y accesibilidad por teclado
   ========================================================= */

async function verifyLogout(driver, language, context) {
    await driver.wait(
        until.urlContains('index.html'),
        WAIT
    );

    const state = await driver.executeScript(`
        return {
            session: sessionStorage.getItem("portfolioSession"),
            language: localStorage.getItem("portfolioLanguage")
        };
    `);

    assert.equal(
        state.session,
        null,
        `${context}: la sesión no fue eliminada`
    );

    assert.equal(
        state.language,
        language.code,
        `${context}: el idioma no persistió`
    );
}

for (const language of LANGUAGES) {

    for (const location of ['menu', 'footer']) {

        test(
            `SEC-008 — Salida desde ${location} ${language.code} (${BROWSER})`,
            async t => {
                const driver = await createDriver(BROWSER);

                t.after(async () => {
                    await driver.quit();
                });

                await openHome(driver, language.code);

                let button;

                if (location === 'menu') {
                    const index = await driver.findElement(
                        By.css('details.showcase-index')
                    );

                    if (!(await index.getAttribute('open'))) {
                        const toggle = await index.findElement(
                            By.css('summary')
                        );
                        await toggle.click();
                    }

                    await driver.wait(
                        async () => Boolean(
                            await index.getAttribute('open')
                        ),
                        WAIT
                    );

                    button = await index.findElement(
                        By.css('[data-portfolio-logout]')
                    );
                } else {
                    button = await driver.findElement(
                        By.css('.portfolio-logout-footer[data-portfolio-logout]')
                    );

                    await driver.executeScript(
                        'arguments[0].scrollIntoView({block:"center", behavior:"instant"});',
                        button
                    );

                    await driver.sleep(300);
                }

                await driver.wait(
                    until.elementIsVisible(button),
                    WAIT
                );

                await driver.wait(
                    until.elementIsEnabled(button),
                    WAIT
                );

                await button.click();

                await verifyLogout(driver, language, location);
            }
        );
    }

    test(
        `SEC-008 — Privacidad mediante Enter ${language.code} (${BROWSER})`,
        async t => {
            const driver = await createDriver(BROWSER);

            t.after(async () => {
                await driver.quit();
            });

            await openHome(driver, language.code);

            const input = await search(driver, language.query);

            const result = await driver.wait(
                until.elementLocated(
                    By.css('[data-search-privacy]')
                ),
                WAIT
            );

            await driver.wait(
                until.elementIsVisible(result),
                WAIT
            );

            // Verificar que privacidad sea el primer resultado.
            // El buscador selecciona el índice 0 al presionar
            // Enter cuando todavía no hay selección activa.

            const firstResultIsPrivacy =
                await driver.executeScript(`
                    const first = document.querySelector(
                        ".portfolio-search-result"
                    );

                    return Boolean(
                        first &&
                        first.matches("[data-search-privacy]")
                    );
                `);

            assert.equal(
                firstResultIsPrivacy,
                true,
                `${language.code}: privacidad no es el primer resultado`
            );

            // Enviar Enter directamente desde el campo de búsqueda.
            await input.sendKeys(Key.ENTER);

            const dialog = await driver.wait(
                until.elementLocated(
                    By.id('privacyPolicyDialog')
                ),
                WAIT
            );

            await driver.wait(
                async () => Boolean(
                    await dialog.getAttribute('open')
                ),
                WAIT
            );

            assert.ok(
                (await dialog.getText()).includes(language.privacy),
                `${language.code}: política no traducida`
            );

            const session = await driver.executeScript(
                'return sessionStorage.getItem("portfolioSession")'
            );

            assert.ok(
                session,
                'Consultar privacidad eliminó la sesión'
            );
        }
    );
}
