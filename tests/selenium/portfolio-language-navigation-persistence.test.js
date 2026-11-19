
"use strict";

/**
 * LANG-NAV-006 — Persistencia ES/EN/PT.
 * Arquitectura: index.html (acceso), home.html (inicio)
 * y cinco páginas internas.
 */

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { By, until } = require("selenium-webdriver");
const { createDriver } = require("./selenium-config");

const BASE = (
    process.env.TEST_BASE_URL ||
    process.env.PORTFOLIO_BASE_URL ||
    "http://127.0.0.1:5500"
).replace(/\/$/, "");

const BROWSER = process.env.TEST_BROWSER || "chrome";
const WAIT = 12000;

const PAGES = [
    "cv.html",
    "frontend.html",
    "backend.html",
    "qa.html",
    "quality-management.html"
];

const LANGUAGES = ["es", "en", "pt"];

function filename(url) {
    return new URL(url).pathname.split("/").pop() || "index.html";
}

async function settled(driver) {
    await driver.wait(
        () => driver.executeScript(
            'return document.readyState === "complete"'
        ),
        WAIT
    );
}

async function assertLanguage(driver, language, context) {
    await driver.wait(async () => {
        const state = await driver.executeScript(`
            return [
                document.documentElement.lang,
                localStorage.getItem("portfolioLanguage")
            ];
        `);

        return state[0] === language && state[1] === language;
    }, WAIT, `${context}: idioma incorrecto`);

    const state = await driver.executeScript(`
        return [
            document.documentElement.lang,
            localStorage.getItem("portfolioLanguage")
        ];
    `);

    assert.deepEqual(state, [language, language], context);
}

async function visibleTranslatedTexts(driver) {
    return driver.executeScript(`
        const result = {};

        for (const el of document.querySelectorAll("[data-i18n]")) {
            const key = el.getAttribute("data-i18n");

            if (!key || result[key] !== undefined) continue;

            const style = getComputedStyle(el);

            if (
                style.display === "none" ||
                style.visibility === "hidden" ||
                !el.getClientRects().length
            ) continue;

            const value = (
                el.innerText || el.textContent || ""
            ).trim().replace(/\\s+/g, " ");

            if (value && value.length <= 240) {
                result[key] = value;
            }
        }

        return result;
    `);
}


async function initializeSession(driver, language) {
    // Abrir el origen para acceder a su almacenamiento.
    await driver.get(`${BASE}/index.html`);
    await settled(driver);

    // Limpiar la sesión anterior antes de iniciar
    // una nueva iteración de idioma.
    await driver.executeScript(`
        sessionStorage.removeItem("portfolioSession");
        localStorage.removeItem("portfolioLanguage");
    `);

    // Volver al acceso sin una sesión activa.
    await driver.get(`${BASE}/index.html`);
    await settled(driver);

    assert.equal(
        filename(await driver.getCurrentUrl()),
        "index.html",
        "No se pudo restablecer la página de acceso"
    );

    // Preparar una sesión de invitado independiente.
    await driver.executeScript(function (code) {
        localStorage.setItem("portfolioLanguage", code);

        sessionStorage.setItem(
            "portfolioSession",
            JSON.stringify({
                accessType: "guest",
                language: code
            })
        );
    }, language);

    await driver.get(`${BASE}/home.html`);
    await settled(driver);

    await driver.wait(
        until.urlContains("/home.html"),
        WAIT
    );

    assert.equal(
        filename(await driver.getCurrentUrl()),
        "home.html"
    );

    await assertLanguage(
        driver,
        language,
        "Inicio con sesión"
    );

    const session = await driver.executeScript(`
        return JSON.parse(
            sessionStorage.getItem("portfolioSession") || "null"
        );
    `);

    assert.ok(session, "No existe portfolioSession");
    assert.equal(session.accessType, "guest");
    assert.equal(session.language, language);
}

async function goFromHome(driver, page) {
    const links = await driver.findElements(
        By.css(`a[href^="${page}"]`)
    );

    for (const link of links) {
        if (!(await link.isDisplayed())) continue;

        await driver.executeScript(
            'arguments[0].scrollIntoView({block:"center"});',
            link
        );

        // Activar el enlace desde el DOM para evitar
        // intercepciones por elementos superpuestos.
        await driver.executeScript(
            'arguments[0].click();',
            link
        );

        await driver.wait(async () => {
            return filename(await driver.getCurrentUrl()) === page;
        }, WAIT, `No se navegó desde Home hacia ${page}`);

        await settled(driver);

        assert.equal(
            filename(await driver.getCurrentUrl()),
            page,
            `Home no navegó a ${page}`
        );

        return;
    }

    assert.fail(
        `No existe enlace visible desde Home hacia ${page}`
    );
}

async function returnViaLogo(driver, page) {
    const logo = await driver.findElement(
        By.css('a.logo[href="home.html"]')
    );

    await driver.executeScript(
        'arguments[0].scrollIntoView({block:"center"});',
        logo
    );

    await logo.click();
    await settled(driver);

    await driver.wait(
        until.urlContains("/home.html"),
        WAIT
    );

    const url = new URL(await driver.getCurrentUrl());

    assert.equal(
        filename(url.href),
        "home.html",
        `${page}: el logo no regresó a Home`
    );

    assert.equal(
        url.hash,
        "",
        `${page}: el logo apunta a un ancla`
    );

    await driver.wait(
        () => driver.executeScript("return window.scrollY <= 5"),
        WAIT
    );
}

test(
    "LANG-NAV-006 — ES/EN/PT, recarga y navegación entre seis páginas",
    async (t) => {
        const driver = await createDriver(BROWSER);

        t.after(async () => {
            await driver.quit();
        });

        const actual = String(
            (await driver.getCapabilities()).get("browserName")
        ).toLowerCase();
        
        const requestedBrowser = BROWSER.toLowerCase();

        const acceptedNames = requestedBrowser === "edge"
            ? ["msedge", "microsoftedge"]
            : [requestedBrowser];

        assert.ok(
            acceptedNames.includes(actual),
            `Navegador solicitado: ${BROWSER}; navegador abierto: ${actual}`
        );

        const snapshots = {};

        for (const language of LANGUAGES) {
            await initializeSession(driver, language);

            snapshots[language] = {};

            // Inicio: conservar evidencia de traducción visible.
            snapshots[language]["home.html"] =
                await visibleTranslatedTexts(driver);

            assert.ok(
                Object.keys(snapshots[language]["home.html"]).length,
                "Home no presenta textos traducibles visibles"
            );

            // Recarga de Home.
            await driver.navigate().refresh();
            await settled(driver);

            await assertLanguage(
                driver,
                language,
                "Home después de recargar"
            );

            const homeReload = await visibleTranslatedTexts(driver);

            for (const [key, value] of Object.entries(
                snapshots[language]["home.html"]
            )) {
                if (homeReload[key] !== undefined) {
                    assert.equal(homeReload[key], value);
                }
            }

            for (const page of PAGES) {
                await goFromHome(driver, page);

                await assertLanguage(
                    driver,
                    language,
                    `${page} después de navegar`
                );

                const before = await visibleTranslatedTexts(driver);

                assert.ok(
                    Object.keys(before).length,
                    `${page}: no hay textos traducibles visibles`
                );

                snapshots[language][page] = before;

                await driver.navigate().refresh();
                await settled(driver);

                await assertLanguage(
                    driver,
                    language,
                    `${page} después de recargar`
                );

                const after = await visibleTranslatedTexts(driver);

                const commonKeys = Object.keys(before).filter(
                    key => after[key] !== undefined
                );

                assert.ok(
                    commonKeys.length,
                    `${page}: no hay textos comparables tras recargar`
                );

                for (const key of commonKeys) {
                    assert.equal(
                        after[key],
                        before[key],
                        `${page}: cambió ${key} después de recargar`
                    );
                }

                await returnViaLogo(driver, page);

                await assertLanguage(
                    driver,
                    language,
                    `${page} → Home`
                );

                const session = await driver.executeScript(`
                    return JSON.parse(
                        sessionStorage.getItem("portfolioSession") || "null"
                    );
                `);

                assert.ok(session, "Se perdió la sesión");
                assert.equal(session.language, language);

                console.log(
                    `LANG-NAV-006 | ${actual} | ${language} | ` +
                    `${page} → recarga → Home | PASS`
                );
            }
        }

        // Comparación efectiva de contenido visible entre idiomas.
        for (const page of ["home.html", ...PAGES]) {
            const es = snapshots.es[page];
            const en = snapshots.en[page];
            const pt = snapshots.pt[page];

            const keys = Object.keys(es).filter(
                key => en[key] !== undefined &&
                       pt[key] !== undefined
            );

            const translated = keys.filter(
                key => new Set([
                    es[key],
                    en[key],
                    pt[key]
                ]).size === 3
            );

            assert.ok(
                translated.length,
                `${page}: no hay diferencias visibles ES/EN/PT`
            );

            console.log(
                `LANG-NAV-006 | ${actual} | ${page} | ` +
                `traducción ES/EN/PT | PASS`
            );
        }
    }
);
