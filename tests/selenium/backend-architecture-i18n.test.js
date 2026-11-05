
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Builder, By, until } = require('selenium-webdriver');

test('BACKEND-I18N-001 — Arquitectura API ES/EN/PT', async (t) => {
    const browser = process.env.TEST_BROWSER || 'chrome';

    const driver = await new Builder()
        .forBrowser(browser)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    const actualBrowser = String(
        (await driver.getCapabilities()).get('browserName') || ''
    ).toLowerCase();

    assert.equal(
        actualBrowser,
        browser.toLowerCase(),
        `Se solicitó ${browser}, pero Selenium abrió ${actualBrowser}`
    );

    await driver.get('http://127.0.0.1:8000/backend.html');

    const selectorIdioma = await driver.findElement(
        By.id('cv-language-select')
    );

    const escenarios = [
        { tipo: 'health', clave: 'backendDynamic035' },
        { tipo: 'visitors', clave: 'backendDynamic039' },
        { tipo: 'contact', clave: 'backendDynamic043' },
        { tipo: 'integration', clave: 'backendDynamic046' }
    ];

    for (const escenario of escenarios) {
        // Comenzar cada escenario en español.
        await driver.executeScript(
            `
            const selector = arguments[0];
            selector.value = 'es';
            selector.dispatchEvent(new Event('change', { bubbles: true }));
            `,
            selectorIdioma
        );

        const boton = await driver.findElement(
            By.css(`[data-api-prueba="${escenario.tipo}"]`)
        );

        await driver.executeScript(
            'arguments[0].click();',
            boton
        );

        const resultado = await driver.findElement(
            By.id('api-resultado')
        );

        // Esperar a que termine la solicitud HTTP.
        
        await driver.wait(async () => {
            return await driver.executeScript(() => {
                const contenedor = document.getElementById('api-resultado');
                const parrafo = contenedor?.querySelector(':scope > p');

                if (!parrafo) return false;

                const texto = parrafo.textContent.trim();

                return texto.startsWith('PASS —') ||
                    texto.startsWith('FAIL —');
            });
        }, 15000);


        const veredictoOriginal = await resultado.findElement(
            By.css(':scope > p')
        ).getText();

        assert.ok(
            veredictoOriginal.startsWith('PASS —'),
            `${escenario.tipo}: resultado esperado PASS`
        );

        const jsonOriginal = await resultado.findElement(
            By.css(':scope > pre')
        ).getText();

        // Verificar los tres idiomas y regresar a español.
        for (const idioma of ['es', 'en', 'pt', 'es']) {
            await driver.executeScript(
                `
                const selector = arguments[0];
                selector.value = arguments[1];
                selector.dispatchEvent(
                    new Event('change', { bubbles: true })
                );
                `,
                selectorIdioma,
                idioma
            );

            const comprobacion = await driver.executeScript(
                `
                const idioma = arguments[0];
                const clave = arguments[1];

                const resultado = document.getElementById('api-resultado');

                const traduccion =
                    window.portfolioTranslations?.[idioma]?.[clave];

                return {
                    idiomaDocumento: document.documentElement.lang,
                    idiomaGuardado:
                        localStorage.getItem('portfolioLanguage'),
                    traduccion,
                    textoResultado: resultado.innerText
                };
                `,
                idioma,
                escenario.clave
            );

            assert.equal(
                comprobacion.idiomaDocumento,
                idioma
            );

            assert.equal(
                comprobacion.idiomaGuardado,
                idioma
            );

            assert.equal(
                typeof comprobacion.traduccion,
                'string',
                `${escenario.tipo}: falta traducción ${idioma}`
            );

            assert.ok(
                comprobacion.textoResultado.includes(
                    comprobacion.traduccion
                ),
                `${escenario.tipo}: no se actualizó la explicación ${idioma}`
            );

            const veredictoActual = await resultado.findElement(
                By.css(':scope > p')
            ).getText();

            const jsonActual = await resultado.findElement(
                By.css(':scope > pre')
            ).getText();

            assert.equal(
                veredictoActual,
                veredictoOriginal,
                `${escenario.tipo}: cambió el veredicto HTTP`
            );

            assert.equal(
                jsonActual,
                jsonOriginal,
                `${escenario.tipo}: cambió la respuesta JSON`
            );

            console.log(
                `BACKEND-I18N-001 | ${actualBrowser} | ${escenario.tipo} | ${idioma.toUpperCase()} | PASS`
            );
        }
    }
});
