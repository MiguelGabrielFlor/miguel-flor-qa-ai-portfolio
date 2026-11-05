
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Builder, By } = require('selenium-webdriver');

const browser = process.env.TEST_BROWSER || 'chrome';
const URL = 'http://127.0.0.1:8000/qa.html';

test('QA-I18N-002 — Biblioteca de casos ES/EN/PT', async (t) => {
    const driver = await new Builder()
        .forBrowser(browser)
        .build();

    t.after(async () => driver.quit());

    await driver.get(URL);

    for (const id of ['TC-001', 'TC-012', 'TC-020']) {
        const lomo = await driver.findElement(
            By.css(`[data-test-id="${id}"]`)
        );

        await driver.executeScript(elemento => elemento.click(), lomo);

        await driver.wait(() =>
            driver.executeScript(() =>
                !document.getElementById('test-case-detail').hidden
            ), 10000);

        for (const idioma of ['es', 'en', 'pt', 'es']) {
            await driver.executeScript((idioma) => {
                const selector = document.getElementById('cv-language-select');
                selector.value = idioma;
                selector.dispatchEvent(
                    new Event('change', { bubbles: true })
                );
            }, idioma);

            await driver.wait(() =>
                driver.executeScript((idioma) =>
                    document.documentElement.lang === idioma &&
                    localStorage.getItem('portfolioLanguage') === idioma,
                    idioma
                ), 10000);

            const resultado = await driver.executeScript((id, idioma) => {
                const dic = window.portfolioTranslations[idioma];
                const prefijo = `qaCase${id.slice(-3)}`;
                const detalle = document.getElementById('test-case-detail');
                const campos = [...detalle.querySelectorAll(':scope > div')];

                const buscarCampo = (clave) => {
                    const etiqueta = dic[clave];
                    const bloque = campos.find(div =>
                        div.querySelector('h4')?.textContent.trim() === etiqueta
                    );
                    return bloque?.querySelector('p')?.textContent.trim() ?? null;
                };

                return {
                    visible: !detalle.hidden,
                    seleccionado: document.querySelector(
                        `[data-test-id="${id}"]`
                    )?.getAttribute('aria-expanded'),
                    titulo: detalle.querySelector('h3')?.textContent.trim(),
                    tituloEsperado: `${id} — ${dic[`${prefijo}Title`]}`,
                    precondiciones: buscarCampo('qaCaseFieldPreconditions'),
                    precondicionesEsperadas: dic[`${prefijo}Preconditions`],
                    resultado: buscarCampo('qaCaseFieldExpected'),
                    resultadoEsperado: dic[`${prefijo}Expected`],
                    pasos: [...detalle.querySelectorAll('ol li')]
                        .map(el => el.textContent.trim()),
                    pasosEsperados: Array.from({ length: 20 }, (_, i) =>
                        dic[`${prefijo}Step${String(i + 1).padStart(2, '0')}`]
                    ).filter(valor => typeof valor === 'string')
                };
            }, id, idioma);

            assert.ok(resultado.visible);
            assert.equal(resultado.seleccionado, 'true');
            assert.ok(resultado.tituloEsperado);
            assert.equal(resultado.titulo, resultado.tituloEsperado);
            assert.ok(resultado.precondicionesEsperadas);
            assert.equal(
                resultado.precondiciones,
                resultado.precondicionesEsperadas
            );
            assert.ok(resultado.resultadoEsperado);
            assert.equal(resultado.resultado, resultado.resultadoEsperado);
            assert.ok(resultado.pasosEsperados.length > 0);
            assert.deepEqual(resultado.pasos, resultado.pasosEsperados);

            console.log(`PASS — ${id} — ${idioma.toUpperCase()}`);
        }

        await driver.executeScript(elemento => elemento.click(), lomo);

        assert.equal(
            await lomo.getAttribute('aria-expanded'),
            'false'
        );
    }
});
