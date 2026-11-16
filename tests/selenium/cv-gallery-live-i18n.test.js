
const { createDriver } = require('./selenium-config');

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By, until } = require('selenium-webdriver');

const browser = process.env.TEST_BROWSER || 'chrome';
const URL = 'http://127.0.0.1:8000/cv.html';

test('CV-I18N-004 — Cambio de idioma con galería abierta', async (t) => {
    const driver = await createDriver(browser);

    t.after(async () => driver.quit());

    await driver.get(URL);

    await driver.executeScript(() => {
        localStorage.setItem('portfolioLanguage', 'es');

        const selector = document.getElementById('cv-language-select');
        selector.value = 'es';
        selector.dispatchEvent(
            new Event('change', { bubbles: true })
        );
    });

    // Localizar la tarjeta y asegurar su visibilidad.
    const tarjeta = await driver.wait(
        until.elementLocated(
            By.css('[data-certificate-category="marketing"]')
        ),
        10000
    );

    await driver.wait(until.elementIsVisible(tarjeta), 10000);

    // Centrar la tarjeta para evitar interferencias
    // de elementos fijos durante el desplazamiento.
    await driver.executeScript(
        "arguments[0].scrollIntoView({block: 'center'});",
        tarjeta
    );

    // Esperar a que termine el desplazamiento.
    await driver.wait(async () => {
        const estable = await driver.executeScript((elemento) => {
            const rect = elemento.getBoundingClientRect();
            const centroX = rect.left + rect.width / 2;
            const centroY = rect.top + rect.height / 2;

            const superior = document.elementFromPoint(
                centroX,
                centroY
            );

            return superior === elemento ||
                elemento.contains(superior);
        }, tarjeta);

        return estable;
    }, 10000);

    await tarjeta.click();

    // Confirmar apertura real de la galería.
    await driver.wait(
        () => driver.executeScript(() =>
            document.getElementById('certificateDialog').open
        ),
        10000
    );

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

        console.log(
            `PASS — Galería abierta — ${idioma.toUpperCase()}`
        );
    }
});
