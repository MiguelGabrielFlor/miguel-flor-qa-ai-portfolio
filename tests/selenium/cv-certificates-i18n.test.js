const { createDriver } = require('./selenium-config');

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By } = require('selenium-webdriver');

const browser = process.env.TEST_BROWSER || 'chrome';
const URL = 'http://127.0.0.1:8000/cv.html';

test('CV-I18N-003 — Galería de certificados ES/EN/PT', async (t) => {
    const driver = await createDriver(browser);

    t.after(async () => driver.quit());

    assert.equal(
        (await driver.getCapabilities()).get('browserName').toLowerCase(),
        browser.toLowerCase()
    );

    await driver.get(URL);

    const categorias = [
        {
            id: 'marketing',
            titulo: 'cvMarketingTitle',
            enlace: 'cvCertificateOpenImage',
            tipo: 'img'
        },
        {
            id: 'qa',
            titulo: 'cvQaCertificatesTitle',
            enlace: 'cvCertificateOpenPdf',
            tipo: 'canvas'
        }
    ];

    for (const idioma of ['es', 'en', 'pt', 'es']) {
        await driver.executeScript((idioma) => {
            const selector = document.getElementById('cv-language-select');
            selector.value = idioma;
            selector.dispatchEvent(new Event('change', { bubbles: true }));
        }, idioma);

        await driver.wait(() =>
            driver.executeScript((idioma) =>
                document.documentElement.lang === idioma &&
                localStorage.getItem('portfolioLanguage') === idioma,
                idioma
            ), 10000);

        for (const categoria of categorias) {
            const tarjeta = await driver.findElement(
                By.css(`[data-certificate-category="${categoria.id}"]`)
            );

            await driver.executeScript(
                elemento => elemento.click(),
                tarjeta
            );

            await driver.wait(() =>
                driver.executeScript(() =>
                    document.getElementById('certificateDialog').open
                ), 10000);

            const resultado = await driver.executeScript(
                (categoria, idioma) => {
                    const dic = window.portfolioTranslations[idioma];
                    const dialog = document.getElementById('certificateDialog');
                    const items = [...dialog.querySelectorAll(
                        '.certificate-item'
                    )];

                    return {
                        titulo: document.getElementById(
                            'certificateDialogTitle'
                        ).textContent.trim(),
                        tituloEsperado: dic[categoria.titulo],
                        cantidad: items.length,
                        enlaces: items.map(item => {
                            const esImagen = Boolean(item.querySelector('img'));
                            const canvas = item.querySelector('canvas');

                            return {
                                texto: item.querySelector('a')?.textContent.trim(),
                                href: item.querySelector('a')?.getAttribute('href'),
                                elemento: esImagen || Boolean(canvas),
                                esperado: esImagen
                                    ? dic.cvCertificateOpenImage
                                    : dic.cvCertificateOpenPdf,
                                aria: canvas?.getAttribute('aria-label'),
                                esPdf: Boolean(canvas)
                            };
                        }),
                        prefijoPdf: dic.cvCertificatePreview
                    };
                },
                categoria,
                idioma
            );

            assert.ok(resultado.tituloEsperado);
            assert.equal(resultado.titulo, resultado.tituloEsperado);
            assert.ok(resultado.cantidad > 0);
            for (const enlace of resultado.enlaces) {
                assert.ok(enlace.esperado);
                assert.equal(enlace.texto, enlace.esperado);
                assert.ok(enlace.href);
                assert.ok(enlace.elemento);

                if (enlace.esPdf) {
                    assert.ok(resultado.prefijoPdf);
                    assert.ok(
                        enlace.aria?.startsWith(resultado.prefijoPdf),
                        `Etiqueta PDF incorrecta en ${idioma}`
                    );
                }
            }

            await driver.findElement(
                By.id('closeCertificateDialog')
            ).click();

            await driver.wait(() =>
                driver.executeScript(() =>
                    !document.getElementById('certificateDialog').open
                ), 10000);

            console.log(
                `PASS — ${categoria.id} — ${idioma.toUpperCase()}`
            );
        }
    }
});
