
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By, until } = require('selenium-webdriver');
const { createDriver } = require('./selenium-config');

const browser = process.env.TEST_BROWSER || 'chrome';
const BASE_URL = 'http://127.0.0.1:8000';

const documentos = [
    'docs/test-cases.md',
    'docs/test-plan.md',
    'docs/test-report.md',
    'docs/bug-reports.md'
];

test('QA-MOD-001-MD — Visor Markdown ES/EN/PT', async (t) => {
    const driver = await createDriver(browser);

    t.after(async () => {
        await driver.quit();
    });

    // Acceso real al portfolio como invitado.
    await driver.get(`${BASE_URL}/index.html`);

    const guestButton = await driver.wait(
        until.elementLocated(By.id('guestAccessButton')),
        10000
    );

    await guestButton.click();

    await driver.wait(
        until.urlContains('home.html'),
        10000
    );

    await driver.get(`${BASE_URL}/qa.html`);



    for (const idioma of ['es', 'en', 'pt']) {
        await driver.executeScript(
            'localStorage.setItem("portfolioLanguage", arguments[0]);',
            idioma
        );

        await driver.navigate().refresh();

        const dialog = await driver.findElement(By.id('qaMarkdownDialog'));
        const content = await driver.findElement(By.id('qaMarkdownContent'));
        const closeButton = await driver.findElement(By.id('qaMarkdownClose'));

        for (const documento of documentos) {
            const enlace = await driver.findElement(
                By.css(`a.qa-markdown-link[href="${documento}"]`)
            );

            await driver.executeScript(
                'arguments[0].scrollIntoView({block:"center"});',
                enlace
            );

            await driver.executeScript(
                'arguments[0].click();',
                enlace
            );

            await driver.wait(
                async () => dialog.getAttribute('open'),
                10000
            );

            await driver.wait(async () => {
                const resultado = await driver.executeScript(
                    `
                    const content = document.getElementById(
                        "qaMarkdownContent"
                    );

                    return {
                        texto: content.textContent.trim(),
                        html: content.innerHTML,
                        encabezados: content.querySelectorAll(
                            "h1, h2, h3"
                        ).length
                    };
                    `
                );

                const errores = [
                    'No se pudo cargar el documento.',
                    'Could not load the document.',
                    'Não foi possível carregar o documento.'
                ];

                const cargando = [
                    'Cargando documento...',
                    'Loading document...',
                    'Carregando documento...'
                ];

                return (
                    resultado.texto.length > 0 &&
                    !errores.includes(resultado.texto) &&
                    !cargando.includes(resultado.texto) &&
                    resultado.encabezados > 0
                );
            }, 15000);

            assert.equal(
                await dialog.getAttribute('open'),
                'true'
            );

            assert.ok(
                (await content.getText()).trim().length > 0,
                `Documento vacío: ${documento}`
            );

            await closeButton.click();

            await driver.wait(
                async () => !(await dialog.getAttribute('open')),
                10000
            );

            console.log(
                `PASS — ${documento} — ${idioma.toUpperCase()}`
            );
        }
    }
});
