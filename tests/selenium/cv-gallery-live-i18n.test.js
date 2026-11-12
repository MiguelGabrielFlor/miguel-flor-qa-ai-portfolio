const { createDriver } = require('./selenium-config');

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By } = require('selenium-webdriver');

const browser = process.env.TEST_BROWSER || 'chrome';
const URL = 'http://127.0.0.1:8000/cv.html';

test('CV-I18N-004 — Cambio de idioma con galería abierta', async (t) => {
    const driver = await createDriver(browser);

    t.after(async () => driver.quit());

    await driver.get(URL);

    await driver.executeScript(() => {
        localStorage.setItem('portfolioLanguage', 'es');
        document.getElementById('cv-language-select').value = 'es';
        document.getElementById('cv-language-select')
            .dispatchEvent(new Event('change', { bubbles: true }));
    });

    await driver.findElement(
        By.css('[data-certificate-category="marketing"]')
    ).click();

    await driver.wait(() =>
        driver.executeScript(() =>
            document.getElementById('certificateDialog').open
        ), 10000);

    for (const idioma of ['en', 'pt', 'es']) {
        const resultado = await driver.executeScript((idioma) => {
            const selector = document.getElementById('cv-language-select');
            selector.value = idioma;
            selector.dispatchEvent(
                new Event('change', { bubbles: true })
            );

            const dic = window.portfolioTranslations[idioma];
            const dialog = document.getElementById('certificateDialog');

            return {
                abierto: dialog.open,
                titulo: document.getElementById(
                    'certificateDialogTitle'
                ).textContent.trim(),
                tituloEsperado: dic.cvMarketingTitle,
                enlaces: [...dialog.querySelectorAll(
                    '.certificate-item'
                )].map(item => ({
                    actual: item.querySelector('a')?.textContent.trim(),
                    esperado: item.querySelector('img')
                        ? dic.cvCertificateOpenImage
                        : dic.cvCertificateOpenPdf
                }))
            };
        }, idioma);

        assert.ok(resultado.abierto);
        assert.equal(
            resultado.titulo,
            resultado.tituloEsperado,
            `Título sin actualizar en ${idioma}`
        );

        for (const enlace of resultado.enlaces) {
            assert.equal(
                enlace.actual,
                enlace.esperado,
                `Enlace sin actualizar en ${idioma}`
            );
        }

        console.log(`PASS — Galería abierta — ${idioma.toUpperCase()}`);
    }
});
