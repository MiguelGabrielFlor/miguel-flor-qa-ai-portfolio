
"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { By } = require("selenium-webdriver");
const { createDriver } = require("./selenium-config");

const BASE = (
    process.env.TEST_BASE_URL ||
    "http://127.0.0.1:5500"
).replace(/\/$/, "");

const BROWSER = process.env.TEST_BROWSER || "chrome";
const WAIT = 12000;

const EXPECTED = {
    es: {
        accessPage: {
            title: "Pantalla de acceso",
            description: "Página de acceso con dos opciones: ingreso como invitado o registro de visitante. El formulario de registro permanece inicialmente oculto.",
            tree: [
                "guestAccessButton",
                "registeredAccessButton",
                "accessForm",
                "SELECCIONADO"
            ],
            code: '<main id="accessPage">'
        },
        accessForm: {
            title: "Formulario de registro",
            description: "Formulario de visitantes registrados, inicialmente oculto. Contiene los datos personales, el consentimiento y las validaciones necesarias antes del registro.",
            tree: [
                "Nombre y apellido",
                "Correo electrónico",
                "Teléfono",
                "Consentimiento",
                "SELECCIONADO"
            ],
            code: '<form id="accessForm" novalidate hidden>'
        },
        portfolio: {
            title: "Contenido del portfolio",
            description: "Página principal home.html, separada de index.html. Presenta las secciones profesionales después de establecer una sesión válida.",
            tree: [
                'id="home"',
                'id="about"',
                'id="specialties"',
                'id="qa"',
                'id="ai"',
                'id="projects"',
                'id="contact"',
                "SELECCIONADO"
            ],
            code: '<main id="main-content">'
        }
    },

    en: {
        accessPage: {
            title: "Access screen",
            description: "Access page with two options: guest entry or visitor registration. The registration form is initially hidden.",
            tree: [
                "guestAccessButton",
                "registeredAccessButton",
                "accessForm",
                "SELECTED"
            ],
            code: '<main id="accessPage">'
        },
        accessForm: {
            title: "Registration form",
            description: "Registration form for visitors, initially hidden. It contains personal information, consent, and the validations required before registration.",
            tree: [
                "First and last name",
                "Email address",
                "Phone number",
                "Consent",
                "SELECTED"
            ],
            code: '<form id="accessForm" novalidate hidden>'
        },
        portfolio: {
            title: "Portfolio content",
            description: "Main home.html page, separate from index.html. It displays the professional sections after a valid session has been established.",
            tree: [
                'id="home"',
                'id="about"',
                'id="specialties"',
                'id="qa"',
                'id="ai"',
                'id="projects"',
                'id="contact"',
                "SELECTED"
            ],
            code: '<main id="main-content">'
        }
    },

    pt: {
        accessPage: {
            title: "Tela de acesso",
            description: "Página de acesso com duas opções: entrada como convidado ou cadastro de visitante. O formulário de cadastro fica inicialmente oculto.",
            tree: [
                "guestAccessButton",
                "registeredAccessButton",
                "accessForm",
                "SELECIONADO"
            ],
            code: '<main id="accessPage">'
        },
        accessForm: {
            title: "Formulário de cadastro",
            description: "Formulário para visitantes cadastrados, inicialmente oculto. Contém os dados pessoais, o consentimento e as validações necessárias antes do cadastro.",
            tree: [
                "Nome e sobrenome",
                "Endereço de e-mail",
                "Telefone",
                "Consentimento",
                "SELECIONADO"
            ],
            code: '<form id="accessForm" novalidate hidden>'
        },
        portfolio: {
            title: "Conteúdo do portfólio",
            description: "Página principal home.html, separada de index.html. Apresenta as seções profissionais após o estabelecimento de uma sessão válida.",
            tree: [
                'id="home"',
                'id="about"',
                'id="specialties"',
                'id="qa"',
                'id="ai"',
                'id="projects"',
                'id="contact"',
                "SELECIONADO"
            ],
            code: '<main id="main-content">'
        }
    }
};

const ELEMENT_KEYS = [
    "accessPage",
    "accessForm",
    "portfolio"
];

const LANGUAGES = ["es", "en", "pt"];

async function readExplorer(driver) {
    return driver.executeScript(() => {
        const value = id =>
            document.getElementById(id)?.textContent.trim() ?? null;

        return {
            language: document.documentElement.lang,
            storedLanguage: localStorage.getItem("portfolioLanguage"),
            title: value("html-lab-title"),
            description: value("html-lab-description"),
            tree: value("html-lab-tree"),
            code: value("html-lab-code"),
            selectedLines: document.querySelectorAll(
                "#html-lab-tree .html-tree-line.selected"
            ).length,
            tabs: [
                ...document.querySelectorAll(
                    "#html-lab [data-html-element]"
                )
            ].map(tab => ({
                key: tab.dataset.htmlElement,
                active: tab.classList.contains("active"),
                pressed: tab.getAttribute("aria-pressed")
            }))
        };
    });
}

async function waitForExplorer(driver, language, key) {
    const expected = EXPECTED[language][key];

    await driver.wait(async () => {
        const state = await readExplorer(driver);

        const tab = state.tabs.find(
            item => item.key === key
        );

        return (
            state.language === language &&
            state.storedLanguage === language &&
            state.title === expected.title &&
            state.description === expected.description &&
            tab?.active === true &&
            tab?.pressed === "true"
        );
    }, WAIT, `${language}/${key}: el explorador no alcanzó el estado esperado`);
}

async function changeLanguage(driver, language, activeKey) {
    await driver.executeScript(code => {
        const select = document.getElementById(
            "cv-language-select"
        );

        if (!select) {
            throw new Error(
                "No existe #cv-language-select"
            );
        }

        select.value = code;

        select.dispatchEvent(
            new Event("change", { bubbles: true })
        );
    }, language);

    await waitForExplorer(driver, language, activeKey);
}

async function selectElement(driver, key, language) {
    const tab = await driver.findElement(
        By.css(
            `#html-lab [data-html-element="${key}"]`
        )
    );

    await driver.executeScript(
        "arguments[0].click();",
        tab
    );

    await waitForExplorer(driver, language, key);
}

async function assertExplorer(driver, language, key) {
    const expected = EXPECTED[language][key];

    await waitForExplorer(driver, language, key);

    const result = await readExplorer(driver);

    assert.equal(
        result.title,
        expected.title,
        `${language}/${key}: título`
    );

    assert.equal(
        result.description,
        expected.description,
        `${language}/${key}: descripción`
    );

    assert.equal(
        result.code,
        expected.code,
        `${language}/${key}: ejemplo HTML`
    );

    assert.ok(
        result.tree,
        `${language}/${key}: árbol vacío`
    );

    for (const text of expected.tree) {
        assert.ok(
            result.tree.includes(text),
            `${language}/${key}: falta "${text}" en el árbol`
        );
    }

    assert.equal(
        result.tabs.length,
        ELEMENT_KEYS.length,
        "Cantidad de pestañas inesperada"
    );

    for (const tab of result.tabs) {
        const active = tab.key === key;

        assert.equal(
            tab.active,
            active,
            `${language}/${key}: clase activa de ${tab.key}`
        );

        assert.equal(
            tab.pressed,
            String(active),
            `${language}/${key}: aria-pressed de ${tab.key}`
        );
    }

    assert.equal(
        result.selectedLines,
        1,
        `${language}/${key}: debe existir una línea seleccionada`
    );
}

test(
    "FRONTEND-HTML-I18N-001 — explorador HTML dinámico ES/EN/PT",
    async t => {
        const driver = await createDriver(BROWSER);

        t.after(async () => {
            await driver.quit();
        });

        await driver.get(`${BASE}/frontend.html`);

        await driver.wait(
            () => driver.executeScript(() => (
                document.readyState === "complete" &&
                !!document.getElementById("html-lab-title") &&
                !!document.getElementById("cv-language-select")
            )),
            WAIT,
            "El laboratorio HTML no se inicializó"
        );

        for (const language of LANGUAGES) {
            const current = await readExplorer(driver);

            const activeKey = current.tabs.find(
                tab => tab.active
            )?.key || "accessPage";

            await changeLanguage(
                driver,
                language,
                activeKey
            );

            for (const key of ELEMENT_KEYS) {
                await selectElement(
                    driver,
                    key,
                    language
                );

                await assertExplorer(
                    driver,
                    language,
                    key
                );

                console.log(
                    `FRONTEND-HTML-I18N-001 | ${BROWSER} | ` +
                    `${language} | ${key} | PASS`
                );
            }

            const nextLanguage = {
                es: "en",
                en: "pt",
                pt: "es"
            }[language];

            await changeLanguage(
                driver,
                nextLanguage,
                "portfolio"
            );

            await assertExplorer(
                driver,
                nextLanguage,
                "portfolio"
            );

            console.log(
                `FRONTEND-HTML-I18N-001 | ${BROWSER} | ` +
                `${language} → ${nextLanguage} | ` +
                "selección conservada | PASS"
            );
        }
    }
);
