
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Builder, By, until } = require('selenium-webdriver');

const BASE_URL = 'http://127.0.0.1:5500';

const TEST_BROWSER = process.env.TEST_BROWSER || 'chrome';

const searchCases = [
    {
        id: 'SEARCH-TC-038',
        query: 'arquitectura',
        destination: 'backend.html#arquitectura',
        sectionId: 'arquitectura'
    },
    {
        id: 'SEARCH-TC-041',
        query: 'trazabilidad',
        destination: 'quality-management.html#trazabilidad',
        sectionId: 'trazabilidad'
    },
    {
        id: 'SEARCH-TC-040',
        query: 'casos de prueba',
        destination: 'qa.html#casos-prueba',
        sectionId: 'casos-prueba'
    },
    {
        id: 'SEARCH-TC-042',
        query: 'persistencia',
        destination: 'backend.html#persistencia',
        sectionId: 'persistencia'
    },
    {
        id: 'SEARCH-TC-043',
        query: 'internacionalización',
        destination: 'frontend.html#internacionalizacion',
        sectionId: 'internacionalizacion'
    },
    {
        id: 'SEARCH-TC-044',
        query: 'regresión',
        destination: 'qa.html#regresion-bugs',
        sectionId: 'regresion-bugs'
    }
];

for (const caso of searchCases) {

    test(`${caso.id} — Navegación a ${caso.destination}`, async (t) => {

        const driver = await new Builder()
            .forBrowser(TEST_BROWSER)
            .build();

        t.after(async () => {
            await driver.quit();
        });

        // 1. Abrir Gestión de calidad.
        await driver.get(`${BASE_URL}/quality-management.html`);

        // 2. Localizar el buscador.
        const searchInput = await driver.wait(
            until.elementLocated(
                By.css('.portfolio-search-input')
            ),
            10000
        );

        // 3. Ejecutar la búsqueda.
        await searchInput.sendKeys(caso.query);

        // 4. Esperar el resultado esperado.
        const result = await driver.wait(
            until.elementLocated(
                By.css(
                    `.portfolio-search-result[href="${caso.destination}"]`
                )
            ),
            10000
        );

        assert.equal(
            await result.isDisplayed(),
            true,
            `No se muestra el resultado: ${caso.destination}`
        );

        // 5. Seleccionar el resultado.
        await result.click();

        // 6. Verificar la URL.
        await driver.wait(
            until.urlContains(caso.destination),
            10000
        );

        const currentUrl = await driver.getCurrentUrl();

        assert.ok(
            currentUrl.endsWith(caso.destination),
            `URL inesperada: ${currentUrl}`
        );

        // 7. Verificar que existe la sección.
        const section = await driver.findElement(
            By.id(caso.sectionId)
        );

        assert.equal(
            await section.isDisplayed(),
            true,
            `La sección ${caso.sectionId} no está visible`
        );
        
        // 8. Verificar que el destino no quede oculto
        // detrás de la cabecera fija.
        const posicion = await driver.executeScript(`
            const section = arguments[0];
            const navbar = document.querySelector('.navbar');

            const sectionTop =
                section.getBoundingClientRect().top;

            const navbarBottom = navbar
                ? navbar.getBoundingClientRect().bottom
                : 0;

            return {
                sectionTop,
                navbarBottom
            };
        `, section);

        assert.ok(
            posicion.sectionTop >= posicion.navbarBottom - 2,
            `El destino ${caso.sectionId} queda oculto: ` +
            `posición ${posicion.sectionTop}px, ` +
            `cabecera ${posicion.navbarBottom}px`
        );


        console.log(
            `PASS — ${caso.id}: ${caso.destination}`
        );
    });
}

test('SEARCH-TC-001 — Búsquedas consecutivas sin recargar', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    const escenarios = [
        {
            query: 'repositorio',
            destination: 'index.html#github'
        },
        {
            query: 'linkedin',
            destination: 'index.html#linkedin'
        },
        {
            query: 'marketing',
            destination: 'cv.html#education'
        }
    ];

    for (const escenario of escenarios) {

        // Limpiar el campo y escribir la nueva búsqueda.
        await searchInput.clear();
        await searchInput.sendKeys(escenario.query);

        // Esperar el resultado correspondiente.
        const resultado = await driver.wait(
            until.elementLocated(
                By.css(
                    `.portfolio-search-result[href="${escenario.destination}"]`
                )
            ),
            10000
        );

        assert.equal(
            await resultado.isDisplayed(),
            true,
            `No aparece el resultado de ${escenario.query}`
        );
        
        // Comprobar que todos los resultados visibles
        // corresponden a la búsqueda actual.
        const resultadosActuales = await driver.findElements(
            By.css('.portfolio-search-result')
        );

        assert.ok(
            resultadosActuales.length > 0,
            `No hay resultados para ${escenario.query}`
        );

        // Comprobar que el campo conserva la búsqueda actual.
        assert.equal(
            await searchInput.getAttribute('value'),
            escenario.query,
            `El buscador no actualizó el texto: ${escenario.query}`
        );

        // Verificar que no quedan resultados de la
        // búsqueda anterior entre los enlaces actuales.
        const destinosAnteriores = escenarios
            .slice(0, escenarios.indexOf(escenario))
            .map(item => item.destination);

        for (const enlace of resultadosActuales) {
            const href = await enlace.getAttribute('href');

            for (const destinoAnterior of destinosAnteriores) {
                assert.ok(
                    !href.endsWith(destinoAnterior),
                    `Permanece un resultado anterior: ${destinoAnterior}`
                );
            }
        }


        console.log(`PASS — Búsqueda: ${escenario.query}`);
    }

    // Limpiar el buscador.
    await searchInput.clear();

    // Verificar que el panel se cierre.
    await driver.wait(async () => {
        const panel = await driver.findElement(
            By.css('.portfolio-search-results')
        );

        return !(await panel.isDisplayed());
    }, 10000);

    console.log('PASS — Limpieza y cierre de resultados');
});

test('SEARCH-TC-002 — Navegación con teclado', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Buscar una sección conocida.
    await searchInput.sendKeys('arquitectura');

    // 2. Esperar el resultado esperado.
    const resultado = await driver.wait(
        until.elementLocated(
            By.css(
                '.portfolio-search-result[href="backend.html#arquitectura"]'
            )
        ),
        10000
    );

    assert.equal(await resultado.isDisplayed(), true);

    // 3. Seleccionar el primer resultado con el teclado.
    await searchInput.sendKeys(
        '\uE015' // ArrowDown (WebDriver)
    );

    // 4. Navegar con Enter.
    await searchInput.sendKeys('\uE007');

    // 6. Verificar el destino.
    await driver.wait(
        until.urlContains('backend.html#arquitectura'),
        10000
    );

    assert.ok(
        (await driver.getCurrentUrl())
            .endsWith('backend.html#arquitectura')
    );

    console.log('PASS — Navegación con flecha y Enter');
});

test('SEARCH-TC-003 — Cerrar resultados con Escape', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(
            By.css('.portfolio-search-input')
        ),
        10000
    );

    const results = await driver.findElement(
        By.css('.portfolio-search-results')
    );

    // 1. Escribir una búsqueda.
    await searchInput.sendKeys('arquitectura');

    // 2. Comprobar que aparecen resultados.
    await driver.wait(
        until.elementIsVisible(results),
        10000
    );

    assert.equal(await results.isDisplayed(), true);

    // 3. Presionar Escape.
    await searchInput.sendKeys('\uE00C');

    // 4. Comprobar que el panel se cierra.
    await driver.wait(
        until.elementIsNotVisible(results),
        10000
    );

    assert.equal(await results.isDisplayed(), false);

    // Verificar que Escape limpia el campo de búsqueda.
    assert.equal(
        await searchInput.getAttribute('value'),
        '',
        'Escape no limpió el campo de búsqueda'
    );

    // Verificar que el buscador informa que el panel está cerrado.
    assert.equal(
        await searchInput.getAttribute('aria-expanded'),
        'false',
        'El buscador no actualizó aria-expanded al cerrar'
    );

    // 5. Comprobar que no se produjo navegación.
    const currentUrl = await driver.getCurrentUrl();

    assert.ok(
        currentUrl.includes('quality-management.html'),
        `Navegación inesperada: ${currentUrl}`
    );

    // 6. Realizar otra búsqueda después de Escape.
    await searchInput.sendKeys('persistencia');

    // 7. Verificar que el buscador vuelve a mostrar resultados.
    await driver.wait(
        until.elementIsVisible(results),
        10000
    );

    // 8. Verificar el resultado esperado.
    const nuevoResultado = await driver.wait(
        until.elementLocated(
            By.css(
                '.portfolio-search-result[href="backend.html#persistencia"]'
            )
        ),
        10000
    );

    assert.equal(
        await nuevoResultado.isDisplayed(),
        true,
        'El buscador no mostró resultados después de Escape'
    );

    // 9. Comprobar el estado de accesibilidad.
    assert.equal(
        await searchInput.getAttribute('aria-expanded'),
        'true',
        'El buscador no actualizó aria-expanded al reabrirse'
    );

    console.log('PASS — Nueva búsqueda después de Escape');

    console.log('PASS — Escape cierra los resultados');
});


test('SEARCH-TC-004 — Búsqueda sin resultados ES/EN/PT', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    const escenarios = [
        {
            language: 'es',
            expected: 'No se encontraron resultados.'
        },
        {
            language: 'en',
            expected: 'No results found.'
        },
        {
            language: 'pt',
            expected: 'Nenhum resultado encontrado.'
        }
    ];

    for (const escenario of escenarios) {

        // Establecer el idioma que utiliza el buscador.
        await driver.executeScript(
            'document.documentElement.lang = arguments[0]',
            escenario.language
        );

        // Limpiar el campo.
        await searchInput.clear();

        // Ejecutar una búsqueda inexistente.
        await searchInput.sendKeys('zzzxxyy123456');

        // Esperar el mensaje correspondiente.
        await driver.wait(async () => {
            const mensajes = await driver.findElements(
                By.css('.portfolio-search-empty')
            );

            return mensajes.length > 0 &&
                await mensajes[0].getText() === escenario.expected;
        }, 10000);

        // Verificar que no se muestran enlaces.
        const enlaces = await driver.findElements(
            By.css('.portfolio-search-result')
        );

        assert.equal(
            enlaces.length,
            0,
            `Se encontraron enlaces inesperados en ${escenario.language}`
        );

        console.log(
            `PASS — Sin resultados: ${escenario.language.toUpperCase()}`
        );
    }
});

test('SEARCH-TC-005 — Búsqueda con y sin acentos', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    const escenarios = [
        'cierre de épica',
        'cierre de epica'
    ];

    for (const query of escenarios) {

        // Limpiar el buscador.
        await searchInput.clear();

        // Escribir la búsqueda.
        await searchInput.sendKeys(query);

        // Esperar el resultado esperado.
        const resultado = await driver.wait(
            until.elementLocated(
                By.css(
                    '.portfolio-search-result[href="quality-management.html#cierre-epica"]'
                )
            ),
            10000
        );

        assert.equal(
            await resultado.isDisplayed(),
            true,
            `No aparece el resultado para: ${query}`
        );

        console.log(`PASS — Coincidencia: ${query}`);
    }

    console.log('PASS — Búsquedas con y sin acentos');
});

test('SEARCH-TC-006 — Resultados traducidos ES/EN/PT', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    
    const idiomas = ['es', 'en', 'pt'];

    const traduccionesEsperadas = {
        es: {
            titulo: 'Arquitectura de la API',
            descripcion: 'Endpoints implementados con Node.js y Express'
        },
        en: {
            titulo: 'API architecture',
            descripcion: 'Endpoints implemented with Node.js and Express'
        },
        pt: {
            titulo: 'Arquitetura da API',
            descripcion: 'Endpoints implementados com Node.js e Express'
        }
    };


    for (const idioma of idiomas) {

        // Establecer el idioma del documento.
        await driver.executeScript(
            'document.documentElement.lang = arguments[0]',
            idioma
        );

        await searchInput.clear();
        await searchInput.sendKeys('arquitectura');

        const resultado = await driver.wait(
            until.elementLocated(
                By.css(
                    '.portfolio-search-result[href="backend.html#arquitectura"]'
                )
            ),
            10000
        );

        const titulo = await resultado.findElement(
            By.css('strong')
        ).getText();

        const descripcion = await resultado.findElement(
            By.css('small')
        ).getText();

        assert.ok(
            titulo.trim().length > 0,
            `Título vacío en ${idioma}`
        );

        assert.ok(
            descripcion.trim().length > 0,
            `Descripción vacía en ${idioma}`
        );

        
        assert.equal(
            titulo,
            traduccionesEsperadas[idioma].titulo,
            `Título incorrecto en ${idioma.toUpperCase()}`
        );

        assert.equal(
            descripcion,
            traduccionesEsperadas[idioma].descripcion,
            `Descripción incorrecta en ${idioma.toUpperCase()}`
        );


        console.log(
            `PASS — ${idioma.toUpperCase()}: ${titulo} | ${descripcion}`
        );
    }

    // Verificar que los textos cambian entre idiomas.
    
    console.log('PASS — Resultados traducidos ES/EN/PT');
});

test('SEARCH-TC-007 — Cierre y reapertura por foco', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    const results = await driver.findElement(
        By.css('.portfolio-search-results')
    );

    // 1. Realizar una búsqueda.
    await searchInput.sendKeys('arquitectura');

    await driver.wait(
        until.elementIsVisible(results),
        10000
    );
      
    // 2. Hacer clic fuera del buscador con Selenium.
    const zonaExterna = await driver.findElement(
        By.css('h1')
    );

    await zonaExterna.click();


    // 3. Verificar que se cierra el desplegable.
    await driver.wait(
        until.elementIsNotVisible(results),
        10000
    );

    assert.equal(await results.isDisplayed(), false);
    // Verificar que el texto permanece después del clic externo.
    assert.equal(
        await searchInput.getAttribute('value'),
        'arquitectura',
        'El clic externo eliminó el texto de búsqueda'
    );

    // 4. Recuperar el foco.
    await searchInput.click();

    // 5. Verificar que reaparecen los resultados.
    await driver.wait(
        until.elementIsVisible(results),
        10000
    );

    // 6. Verificar el resultado esperado.
    const resultado = await driver.findElement(
        By.css(
            '.portfolio-search-result[href="backend.html#arquitectura"]'
        )
    );

    assert.equal(await resultado.isDisplayed(), true);

    console.log('PASS — Cierre y reapertura por foco');
});

test('SEARCH-TC-008 — Navegación con ArrowUp y ArrowDown', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Buscar QA.
    await searchInput.sendKeys('qa');

    // 2. Esperar al menos dos resultados.
    await driver.wait(async () => {
        const resultados = await driver.findElements(
            By.css('.portfolio-search-result')
        );

        return resultados.length >= 2;
    }, 10000);

    const resultados = await driver.findElements(
        By.css('.portfolio-search-result')
    );

    const primero = resultados[0];
    const segundo = resultados[1];

    // 3. Confirmar el orden de los resultados.
    assert.match(
        await primero.getText(),
        /evidencia verificable/i
    );

    assert.match(
        await segundo.getText(),
        /especialidades/i
    );

    // 4. Seleccionar el primer resultado.
    await searchInput.sendKeys('\uE015');

    // 5. Avanzar al segundo resultado.
    await searchInput.sendKeys('\uE015');

    // 6. Regresar al primero.
    await searchInput.sendKeys('\uE013');

    // 7. Abrir el resultado seleccionado.
    await searchInput.sendKeys('\uE007');

    // 8. Verificar la navegación.
    await driver.wait(
        until.urlContains('qa.html'),
        10000
    );

    const currentUrl = await driver.getCurrentUrl();

    assert.ok(
        currentUrl.includes('qa.html'),
        `Navegación incorrecta: ${currentUrl}`
    );

    console.log('PASS — ArrowDown, ArrowUp y Enter');
});

test('SEARCH-TC-009 — Abrir segundo resultado con teclado', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Buscar QA.
    await searchInput.sendKeys('qa');

    // 2. Esperar al menos dos resultados.
    await driver.wait(async () => {
        const resultados = await driver.findElements(
            By.css('.portfolio-search-result')
        );

        return resultados.length >= 2;
    }, 10000);

    // 3. Comprobar que el segundo resultado es Especialidades.
    const resultados = await driver.findElements(
        By.css('.portfolio-search-result')
    );

    assert.match(
        await resultados[1].getText(),
        /especialidades/i
    );
    
    // 4. Seleccionar el primer resultado.
    await searchInput.sendKeys('\uE015');

    // Esperar que el foco pase al primer enlace.
    await driver.wait(async () => {
        return await driver.executeScript(`
            return document.activeElement?.id ===
                'portfolio-search-result-0';
        `);
    }, 10000);

    // 5. Enviar ArrowDown al elemento que tiene el foco.
    const primerResultado = await driver.switchTo().activeElement();

    await primerResultado.sendKeys('\uE015');

    // 6. Esperar que el segundo resultado quede seleccionado.
    await driver.wait(async () => {
        return await driver.executeScript(`
            return document.activeElement?.id ===
                'portfolio-search-result-1';
        `);
    }, 10000);

    // 7. Abrir el segundo resultado con Enter.
    const segundoResultado = await driver.switchTo().activeElement();

    await segundoResultado.sendKeys('\uE007');


    // 6. Verificar el destino exacto.
    await driver.wait(
        until.urlContains('index.html#specialties'),
        10000
    );

    const currentUrl = await driver.getCurrentUrl();

    assert.ok(
        currentUrl.endsWith('index.html#specialties'),
        `Destino incorrecto: ${currentUrl}`
    );

    console.log('PASS — Segundo resultado abierto con teclado');
});

test('SEARCH-TC-010 — Búsqueda con espacios adicionales', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Buscar con espacios al principio y al final.
    await searchInput.sendKeys('   arquitectura   ');

    // 2. Verificar que aparece el resultado esperado.
    const resultado = await driver.wait(
        until.elementLocated(
            By.css(
                '.portfolio-search-result[href="backend.html#arquitectura"]'
            )
        ),
        10000
    );

    assert.equal(
        await resultado.isDisplayed(),
        true,
        'El resultado de arquitectura no aparece'
    );

    console.log('PASS — Resultado encontrado con espacios adicionales');

    // 3. Abrir el resultado.
    await resultado.click();

    // 4. Verificar la navegación.
    await driver.wait(
        until.urlContains('backend.html#arquitectura'),
        10000
    );

    const currentUrl = await driver.getCurrentUrl();

    assert.ok(
        currentUrl.endsWith('backend.html#arquitectura'),
        `Destino incorrecto: ${currentUrl}`
    );

    console.log('PASS — Navegación correcta con espacios adicionales');
});

test('SEARCH-TC-011 — Búsqueda sin distinguir mayúsculas y minúsculas', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    const consultas = [
        'arquitectura',
        'ARQUITECTURA',
        'ArQuItEcTuRa'
    ];

    for (const consulta of consultas) {

        // Limpiar la consulta anterior.
        await searchInput.clear();

        // Ingresar la nueva consulta.
        await searchInput.sendKeys(consulta);

        // Esperar el resultado correspondiente.
        const resultado = await driver.wait(async () => {
            const elementos = await driver.findElements(
                By.css(
                    '.portfolio-search-result[href="backend.html#arquitectura"]'
                )
            );

            if (elementos.length === 0) return false;

            return await elementos[0].isDisplayed()
                ? elementos[0]
                : false;
        }, 10000);

        assert.equal(
            await resultado.isDisplayed(),
            true,
            `No se encontró arquitectura con: ${consulta}`
        );

        console.log(`PASS — Búsqueda: ${consulta}`);
    }

    console.log('PASS — Búsquedas independientes de mayúsculas y minúsculas');
});

test('SEARCH-TC-012 — Limpiar consulta y cerrar resultados', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Realizar una búsqueda válida.
    await searchInput.sendKeys('arquitectura');

    await driver.wait(async () => {
        const resultados = await driver.findElements(
            By.css('.portfolio-search-result')
        );

        return resultados.length > 0 &&
            await resultados[0].isDisplayed();
    }, 10000);

    assert.equal(
        await searchInput.getAttribute('aria-expanded'),
        'true'
    );

    // 2. Borrar completamente la consulta.
    await searchInput.clear();

    // 3. Esperar el cierre del desplegable.
    await driver.wait(async () => {
        const expanded = await searchInput.getAttribute('aria-expanded');

        const resultados = await driver.findElements(
            By.css('.portfolio-search-result')
        );

        const visibles = [];

        for (const resultado of resultados) {
            if (await resultado.isDisplayed()) {
                visibles.push(resultado);
            }
        }

        return expanded === 'false' && visibles.length === 0;
    }, 10000);

    // 4. Verificar el campo vacío.
    assert.equal(
        await searchInput.getAttribute('value'),
        ''
    );

    console.log('PASS — Consulta vacía');
    console.log('PASS — Resultados cerrados');
    console.log('PASS — aria-expanded=false');
});

test('SEARCH-TC-013 — Búsqueda con caracteres especiales', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Establecer el idioma español.
    await driver.executeScript(`
        document.documentElement.lang = 'es';
    `);

    // 2. Introducir caracteres especiales.
    await searchInput.sendKeys('@@@###%%%');

    // 3. Esperar el mensaje sin resultados.
    const mensaje = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-empty')),
        10000
    );

    await driver.wait(
        until.elementIsVisible(mensaje),
        10000
    );

    assert.equal(
        (await mensaje.getText()).trim(),
        'No se encontraron resultados.'
    );

    // 4. Comprobar que no existen resultados seleccionables.
    const resultados = await driver.findElements(
        By.css('.portfolio-search-result')
    );

    assert.equal(
        resultados.length,
        0,
        'No deberían existir resultados para esta consulta'
    );

    console.log('PASS — Caracteres especiales procesados');
    console.log('PASS — Mensaje sin resultados');
    console.log('PASS — Sin resultados seleccionables');
});

test('SEARCH-TC-014 — Actualización de resultados al cambiar consulta', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Buscar arquitectura.
    await searchInput.sendKeys('arquitectura');

    await driver.wait(async () => {
        const resultados = await driver.findElements(
            By.css(
                '.portfolio-search-result[href="backend.html#arquitectura"]'
            )
        );

        return resultados.length > 0 && await resultados[0].isDisplayed();
    }, 10000);

    console.log('PASS — Primera búsqueda: arquitectura');

    // 2. Sustituir la consulta sin recargar.
    await searchInput.clear();
    await searchInput.sendKeys('linkedin');

    // 3. Esperar el resultado de LinkedIn.
    await driver.wait(async () => {
        const resultados = await driver.findElements(
            By.css(
                '.portfolio-search-result[href="index.html#linkedin"]'
            )
        );

        return resultados.length > 0 && await resultados[0].isDisplayed();
    }, 10000);

    // 4. Comprobar que desapareció el resultado anterior.
    const resultadosAnteriores = await driver.findElements(
        By.css(
            '.portfolio-search-result[href="backend.html#arquitectura"]'
        )
    );

    assert.equal(
        resultadosAnteriores.length,
        0,
        'La búsqueda anterior continúa en los resultados'
    );

    // 5. Verificar la consulta actual.
    assert.equal(
        await searchInput.getAttribute('value'),
        'linkedin'
    );

    console.log('PASS — Segunda búsqueda: linkedin');
    console.log('PASS — Resultados anteriores eliminados');
});

test('SEARCH-TC-015 — Seleccionar segundo resultado con clic', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Buscar QA.
    await searchInput.sendKeys('qa');

    // 2. Esperar el resultado Especialidades.
    const resultado = await driver.wait(
        until.elementLocated(
            By.css(
                '.portfolio-search-result[href="index.html#specialties"]'
            )
        ),
        10000
    );

    await driver.wait(
        until.elementIsVisible(resultado),
        10000
    );

    // 3. Verificar que es el segundo resultado.
    const resultados = await driver.findElements(
        By.css('.portfolio-search-result')
    );

    assert.equal(
        await resultados[1].getAttribute('href'),
        `${BASE_URL}/index.html#specialties`
    );

    // 4. Seleccionar Especialidades mediante clic.
    await resultado.click();

    // 5. Verificar la navegación.
    await driver.wait(
        until.urlContains('index.html#specialties'),
        10000
    );

    const currentUrl = await driver.getCurrentUrl();

    assert.ok(
        currentUrl.endsWith('index.html#specialties'),
        `Destino incorrecto: ${currentUrl}`
    );

    
    // 6. Verificar que existe la sección de destino.
    const seccion = await driver.wait(
        until.elementLocated(By.id('specialties')),
        10000
    );

    assert.ok(
        seccion,
        'No se encontró la sección Especialidades'
    );

    // 7. Verificar que la URL conserva el ancla correcta.
    const hash = await driver.executeScript(
        'return window.location.hash;'
    );

    assert.equal(
        hash,
        '#specialties',
        'El ancla de navegación es incorrecta'
    );

    console.log('PASS — Segundo resultado seleccionado con clic');
    console.log('PASS — Navegación a Especialidades');
});

test('SEARCH-TC-016 — Buscar después de navegar a otra página', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    // 1. Abrir Gestión de calidad.
    await driver.get(`${BASE_URL}/quality-management.html`);

    let searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 2. Buscar arquitectura.
    await searchInput.sendKeys('arquitectura');

    const arquitectura = await driver.wait(
        until.elementLocated(
            By.css(
                '.portfolio-search-result[href="backend.html#arquitectura"]'
            )
        ),
        10000
    );

    await driver.wait(
        until.elementIsVisible(arquitectura),
        10000
    );

    // 3. Navegar a Backend.
    await arquitectura.click();

    await driver.wait(
        until.urlContains('backend.html#arquitectura'),
        10000
    );

    console.log('PASS — Navegación a Backend');

    // 4. Localizar el buscador en la nueva página.
    searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 5. Realizar una nueva búsqueda.
    await searchInput.sendKeys('trazabilidad');

    // 6. Verificar el resultado.
    const trazabilidad = await driver.wait(
        until.elementLocated(
            By.css(
                '.portfolio-search-result[href="quality-management.html#trazabilidad"]'
            )
        ),
        10000
    );

    await driver.wait(
        until.elementIsVisible(trazabilidad),
        10000
    );

    console.log('PASS — Buscador operativo en Backend');

    // 7. Navegar nuevamente a Gestión de calidad.
    await trazabilidad.click();

    await driver.wait(
        until.urlContains('quality-management.html#trazabilidad'),
        10000
    );

    const currentUrl = await driver.getCurrentUrl();

    assert.ok(
        currentUrl.endsWith('quality-management.html#trazabilidad'),
        `Destino incorrecto: ${currentUrl}`
    );

    console.log('PASS — Navegación entre páginas mediante el buscador');
});

test('SEARCH-TC-017 — Verificar orden de resultados', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Buscar QA.
    await searchInput.sendKeys('qa');

    // 2. Esperar al menos dos resultados visibles.
    await driver.wait(async () => {
        const resultados = await driver.findElements(
            By.css('.portfolio-search-result')
        );

        return resultados.length >= 2 &&
            await resultados[0].isDisplayed() &&
            await resultados[1].isDisplayed();
    }, 10000);

    // 3. Recuperar los resultados en orden.
    const resultados = await driver.findElements(
        By.css('.portfolio-search-result')
    );

    // 4. Verificar el primer destino.
    assert.ok(
        (await resultados[0].getAttribute('href'))
            .endsWith('/qa.html'),
        'El primer resultado debería ser QA'
    );

    // 5. Verificar el segundo destino.
    assert.ok(
        (await resultados[1].getAttribute('href'))
            .endsWith('/index.html#specialties'),
        'El segundo resultado debería ser Especialidades'
    );

    console.log('PASS — Primer resultado: QA');
    console.log('PASS — Segundo resultado: Especialidades');
    console.log('PASS — Orden de resultados correcto');
});

test('SEARCH-TC-018 — Navegación con Tab y Enter', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Buscar QA.
    await searchInput.sendKeys('qa');

    // 2. Esperar el primer resultado.
    await driver.wait(async () => {
        const resultados = await driver.findElements(
            By.css('.portfolio-search-result')
        );

        return resultados.length > 0 &&
            await resultados[0].isDisplayed();
    }, 10000);
    
    // 3. Navegar con Tab desde el buscador.
    await searchInput.sendKeys('\uE004');

    let elementoActivo = await driver.switchTo().activeElement();

    // Firefox puede enfocar primero el contenedor desplazable.
    const esContenedor = await driver.executeScript(`
        return document.activeElement?.id ===
            'portfolio-search-results';
    `);

    if (esContenedor) {
        await elementoActivo.sendKeys('\uE004');
    }

    // 4. Verificar que Tab llega al primer resultado.
    await driver.wait(async () => {
        return await driver.executeScript(`
            return document.activeElement?.classList.contains(
                'portfolio-search-result'
            ) === true;
        `);
    }, 10000);
          
    const resultadoActivo = await driver.switchTo().activeElement();

    assert.ok(
        (await resultadoActivo.getAttribute('href'))
            .endsWith('/qa.html'),
        'Tab no seleccionó el primer resultado esperado'
    );

    console.log('PASS — Tab selecciona el primer resultado');

    // 5. Abrir el resultado con Enter.
    await resultadoActivo.sendKeys('\uE007');

    // 6. Verificar la navegación.
    await driver.wait(
        until.urlContains('/qa.html'),
        10000
    );

    const currentUrl = await driver.getCurrentUrl();

    assert.ok(
        currentUrl.endsWith('/qa.html'),
        `Destino incorrecto: ${currentUrl}`
    );

    console.log('PASS — Enter abre el resultado seleccionado');
});

test('SEARCH-TC-019 — Navegación inversa con Shift + Tab', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Buscar QA.
    await searchInput.sendKeys('qa');

    // 2. Esperar al menos dos resultados.
    await driver.wait(async () => {
        const resultados = await driver.findElements(
            By.css('.portfolio-search-result')
        );

        return resultados.length >= 2 &&
            await resultados[1].isDisplayed();
    }, 10000);
    
    // 3. Avanzar al primer resultado con Tab.
    await searchInput.sendKeys('\uE004');

    let elementoActivo = await driver.switchTo().activeElement();

    // Firefox puede enfocar primero el contenedor desplazable.
    const esContenedor = await driver.executeScript(`
        return document.activeElement?.id ===
            'portfolio-search-results';
    `);

    if (esContenedor) {
        await elementoActivo.sendKeys('\uE004');
    }

    // Verificar que el foco llegue al primer resultado.
    await driver.wait(async () => {
        return await driver.executeScript(`
            return document.activeElement?.id ===
                'portfolio-search-result-0';
        `);
    }, 10000);

    // 4. Avanzar al segundo resultado con Tab.
    let resultadoActivo = await driver.switchTo().activeElement();

    await resultadoActivo.sendKeys('\uE004');

    await driver.wait(async () => {
        return await driver.executeScript(`
            return document.activeElement?.id ===
                'portfolio-search-result-1';
        `);
    }, 10000);

    console.log('PASS — Foco en el segundo resultado');

    // 5. Regresar al primero con Shift + Tab.
    resultadoActivo = await driver.switchTo().activeElement();

    await resultadoActivo.sendKeys('\uE008', '\uE004');

    await driver.wait(async () => {
        return await driver.executeScript(`
            return document.activeElement?.id ===
                'portfolio-search-result-0';
        `);
    }, 10000);

    console.log('PASS — Shift + Tab regresa al primer resultado');

    // 6. Abrir el primer resultado con Enter.
    resultadoActivo = await driver.switchTo().activeElement();

    await resultadoActivo.sendKeys('\uE007');

    await driver.wait(
        until.urlContains('/qa.html'),
        10000
    );

    assert.ok(
        (await driver.getCurrentUrl()).endsWith('/qa.html'),
        'La navegación no llegó a QA'
    );

    console.log('PASS — Enter abre el primer resultado');
});

test('SEARCH-TC-020 — Recorrido de resultados con flechas', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Buscar QA.
    await searchInput.sendKeys('qa');

    // 2. Esperar al menos tres resultados.
    await driver.wait(async () => {
        const resultados = await driver.findElements(
            By.css('.portfolio-search-result')
        );

        return resultados.length >= 3 &&
            await resultados[2].isDisplayed();
    }, 10000);

    // 3. Seleccionar el primer resultado.
    await searchInput.sendKeys('\uE015');

    const verificarFoco = async (indice) => {
        await driver.wait(async () => {
            return await driver.executeScript(
                'return document.activeElement?.id;',
            ) === `portfolio-search-result-${indice}`;
        }, 10000);
    };

    await verificarFoco(0);
    console.log('PASS — ArrowDown selecciona resultado 1');

    // 4. Avanzar al segundo resultado.
    let activo = await driver.switchTo().activeElement();
    await activo.sendKeys('\uE015');

    await verificarFoco(1);
    console.log('PASS — ArrowDown selecciona resultado 2');

    // 5. Avanzar al tercer resultado.
    activo = await driver.switchTo().activeElement();
    await activo.sendKeys('\uE015');

    await verificarFoco(2);
    console.log('PASS — ArrowDown selecciona resultado 3');

    // 6. Regresar al segundo resultado.
    activo = await driver.switchTo().activeElement();
    await activo.sendKeys('\uE013');

    await verificarFoco(1);
    console.log('PASS — ArrowUp regresa al resultado 2');

    // 7. Regresar al primer resultado.
    activo = await driver.switchTo().activeElement();
    await activo.sendKeys('\uE013');

    await verificarFoco(0);
    console.log('PASS — ArrowUp regresa al resultado 1');

    // 8. Verificar que seguimos en la misma página.
    assert.ok(
        (await driver.getCurrentUrl())
            .includes('/quality-management.html'),
        'La navegación cambió de página inesperadamente'
    );

    console.log('PASS — Recorrido completo sin navegación');
});

test('SEARCH-TC-021 — Escape desde un resultado seleccionado', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Buscar QA.
    await searchInput.sendKeys('qa');

    // 2. Esperar resultados.
    await driver.wait(async () => {
        const resultados = await driver.findElements(
            By.css('.portfolio-search-result')
        );

        return resultados.length >= 2 &&
            await resultados[0].isDisplayed();
    }, 10000);

    // 3. Seleccionar el primer resultado con ArrowDown.
    await searchInput.sendKeys('\uE015');

    await driver.wait(async () => {
        return await driver.executeScript(`
            return document.activeElement?.id ===
                'portfolio-search-result-0';
        `);
    }, 10000);

    // 4. Presionar Escape desde el resultado seleccionado.
    const resultadoActivo = await driver.switchTo().activeElement();

    await resultadoActivo.sendKeys('\uE00C');

    // 5. Verificar el cierre del desplegable.
    await driver.wait(async () => {
        return await searchInput.getAttribute('aria-expanded') === 'false';
    }, 10000);

    // 6. Verificar que no quedan resultados visibles.
    const resultados = await driver.findElements(
        By.css('.portfolio-search-result')
    );

    for (const resultado of resultados) {
        assert.equal(
            await resultado.isDisplayed(),
            false,
            'El desplegable conserva resultados visibles'
        );
    }

    // 7. Verificar que no hubo navegación.
    assert.ok(
        (await driver.getCurrentUrl())
            .includes('/quality-management.html'),
        'Escape provocó una navegación inesperada'
    );

    console.log('PASS — Escape cierra resultados desde un enlace');
    console.log('PASS — Sin navegación inesperada');
});

test('SEARCH-TC-022 — Nueva búsqueda después de Escape desde un resultado', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Buscar QA.
    await searchInput.sendKeys('qa');

    // 2. Esperar el primer resultado.
    await driver.wait(async () => {
        const resultados = await driver.findElements(
            By.css('.portfolio-search-result')
        );

        return resultados.length > 0 &&
            await resultados[0].isDisplayed();
    }, 10000);

    // 3. Seleccionar el primer resultado.
    await searchInput.sendKeys('\uE015');

    await driver.wait(async () => {
        return await driver.executeScript(`
            return document.activeElement?.id ===
                'portfolio-search-result-0';
        `);
    }, 10000);

    // 4. Cerrar mediante Escape desde el resultado.
    const activo = await driver.switchTo().activeElement();
    await activo.sendKeys('\uE00C');

    await driver.wait(async () => {
        return await searchInput.getAttribute('aria-expanded') === 'false';
    }, 10000);

    console.log('PASS — Escape cierra el desplegable');

    // 5. Volver al campo de búsqueda y escribir otra consulta.
    await searchInput.clear();
    await searchInput.sendKeys('persistencia');

    // 6. Comprobar que aparece el nuevo resultado.
    const resultado = await driver.wait(
        until.elementLocated(
            By.css(
                '.portfolio-search-result[href="backend.html#persistencia"]'
            )
        ),
        10000
    );

    await driver.wait(
        until.elementIsVisible(resultado),
        10000
    );

    assert.equal(
        await searchInput.getAttribute('aria-expanded'),
        'true'
    );

    assert.equal(
        await searchInput.getAttribute('value'),
        'persistencia'
    );

    console.log('PASS — Nueva búsqueda después de Escape');
    console.log('PASS — Resultados reabiertos correctamente');
});

test('SEARCH-TC-023 — Estado aria-expanded del buscador', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Verificar el estado inicial.
    assert.equal(
        await searchInput.getAttribute('aria-expanded'),
        'false',
        'El buscador debería comenzar cerrado'
    );

    console.log('PASS — Estado inicial cerrado');

    // 2. Introducir una consulta válida.
    await searchInput.sendKeys('arquitectura');

    await driver.wait(async () => {
        return await searchInput.getAttribute('aria-expanded') === 'true';
    }, 10000);

    const resultados = await driver.findElements(
        By.css('.portfolio-search-result')
    );

    assert.ok(
        resultados.length > 0,
        'No aparecen resultados al abrir el buscador'
    );

    console.log('PASS — aria-expanded=true con resultados');

    // 3. Limpiar la consulta.
    await searchInput.clear();

    await driver.wait(async () => {
        return await searchInput.getAttribute('aria-expanded') === 'false';
    }, 10000);

    console.log('PASS — aria-expanded=false después de limpiar');

    // 4. Realizar otra búsqueda.
    await searchInput.sendKeys('persistencia');

    await driver.wait(async () => {
        return await searchInput.getAttribute('aria-expanded') === 'true';
    }, 10000);

    console.log('PASS — aria-expanded=true al reabrir');
});

test('SEARCH-TC-024 — Integridad de enlaces y títulos', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Realizar la búsqueda.
    await searchInput.sendKeys('qa');

    // 2. Esperar resultados visibles.
    await driver.wait(async () => {
        const resultados = await driver.findElements(
            By.css('.portfolio-search-result')
        );

        return resultados.length > 0 &&
            await resultados[0].isDisplayed();
    }, 10000);

    const resultados = await driver.findElements(
        By.css('.portfolio-search-result')
    );

    // 3. Verificar cada resultado.
    for (const [indice, resultado] of resultados.entries()) {

        const href = await resultado.getAttribute('href');
        const texto = (await resultado.getText()).trim();

        assert.ok(
            href && href.trim().length > 0,
            `El resultado ${indice + 1} no tiene enlace`
        );

        assert.ok(
            texto.length > 0,
            `El resultado ${indice + 1} no tiene texto visible`
        );

        assert.ok(
            href.startsWith(BASE_URL),
            `El resultado ${indice + 1} apunta fuera del portfolio: ${href}`
        );

        console.log(
            `PASS — Resultado ${indice + 1}: enlace y texto válidos`
        );
    }

    console.log(
        `PASS — ${resultados.length} resultados verificados`
    );
});

test('SEARCH-TC-025 — Verificar resultados sin destinos duplicados', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Buscar QA.
    await searchInput.sendKeys('qa');

    // 2. Esperar resultados visibles.
    await driver.wait(async () => {
        const resultados = await driver.findElements(
            By.css('.portfolio-search-result')
        );

        return resultados.length > 0 &&
            await resultados[0].isDisplayed();
    }, 10000);

    // 3. Recuperar los destinos.
    const resultados = await driver.findElements(
        By.css('.portfolio-search-result')
    );

    const destinos = [];

    for (const resultado of resultados) {
        destinos.push(await resultado.getAttribute('href'));
    }

    // 4. Comparar destinos originales y únicos.
    const destinosUnicos = new Set(destinos);

    assert.equal(
        destinosUnicos.size,
        destinos.length,
        'Se encontraron destinos duplicados en los resultados'
    );

    console.log(
        `PASS — ${destinos.length} resultados sin destinos duplicados`
    );
});

test('SEARCH-TC-026 — Eliminar resultados anteriores cuando no hay coincidencias', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Establecer español.
    await driver.executeScript(
        "document.documentElement.lang = 'es';"
    );

    // 2. Realizar una búsqueda con resultados.
    await searchInput.sendKeys('qa');

    await driver.wait(async () => {
        const resultados = await driver.findElements(
            By.css('.portfolio-search-result')
        );

        return resultados.length > 0 &&
            await resultados[0].isDisplayed();
    }, 10000);

    console.log('PASS — Búsqueda inicial con resultados');

    // 3. Sustituir por una consulta sin coincidencias.
    await searchInput.clear();
    await searchInput.sendKeys('zzzxxyy123456');

    // 4. Esperar el mensaje sin resultados.
    await driver.wait(async () => {
        const mensajes = await driver.findElements(
            By.css('.portfolio-search-empty')
        );

        return mensajes.length > 0 &&
            await mensajes[0].isDisplayed();
    }, 10000);

    // 5. Comprobar el mensaje.
    const mensaje = await driver.findElement(
        By.css('.portfolio-search-empty')
    );

    assert.equal(
        (await mensaje.getText()).trim(),
        'No se encontraron resultados.'
    );

    // 6. Verificar que desaparecieron los enlaces anteriores.
    const resultados = await driver.findElements(
        By.css('.portfolio-search-result')
    );

    assert.equal(
        resultados.length,
        0,
        'Permanecen resultados de la búsqueda anterior'
    );

    console.log('PASS — Resultados anteriores eliminados');
    console.log('PASS — Mensaje sin coincidencias visible');
});

test('SEARCH-TC-027 — Recuperación después de una búsqueda sin resultados', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Buscar un término inexistente.
    await searchInput.sendKeys('zzzxxyy123456');

    await driver.wait(async () => {
        const mensajes = await driver.findElements(
            By.css('.portfolio-search-empty')
        );

        return mensajes.length > 0 &&
            await mensajes[0].isDisplayed();
    }, 10000);

    console.log('PASS — Búsqueda inicial sin resultados');

    // 2. Sustituir la consulta por una válida.
    await searchInput.clear();
    await searchInput.sendKeys('arquitectura');

    // 3. Esperar el resultado correspondiente.
    const resultado = await driver.wait(
        until.elementLocated(
            By.css(
                '.portfolio-search-result[href="backend.html#arquitectura"]'
            )
        ),
        10000
    );

    await driver.wait(
        until.elementIsVisible(resultado),
        10000
    );

    // 4. Verificar que desapareció el mensaje anterior.
    const mensajes = await driver.findElements(
        By.css('.portfolio-search-empty')
    );

    for (const mensaje of mensajes) {
        assert.equal(
            await mensaje.isDisplayed(),
            false,
            'El mensaje sin resultados continúa visible'
        );
    }

    // 5. Verificar que el desplegable está abierto.
    assert.equal(
        await searchInput.getAttribute('aria-expanded'),
        'true'
    );

    console.log('PASS — Resultados recuperados correctamente');
    console.log('PASS — Mensaje anterior eliminado');
});

test('SEARCH-TC-028 — Búsqueda por término parcial', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Buscar utilizando parte del término.
    await searchInput.sendKeys('arquitect');

    // 2. Esperar el resultado esperado.
    const resultado = await driver.wait(
        until.elementLocated(
            By.css(
                '.portfolio-search-result[href="backend.html#arquitectura"]'
            )
        ),
        10000
    );

    await driver.wait(
        until.elementIsVisible(resultado),
        10000
    );

    // 3. Verificar el destino.
    assert.ok(
        (await resultado.getAttribute('href'))
            .endsWith('/backend.html#arquitectura'),
        'La búsqueda parcial no encontró Arquitectura'
    );

    // 4. Verificar el estado del desplegable.
    assert.equal(
        await searchInput.getAttribute('aria-expanded'),
        'true'
    );

    console.log('PASS — Búsqueda parcial: arquitect');
    console.log('PASS — Resultado Arquitectura encontrado');
});

test('SEARCH-TC-029 — Búsqueda por descripción', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Buscar un término presente en la descripción.
    await searchInput.sendKeys('Express');

    // 2. Esperar el resultado de Arquitectura.
    const resultado = await driver.wait(
        until.elementLocated(
            By.css(
                '.portfolio-search-result[href="backend.html#arquitectura"]'
            )
        ),
        10000
    );

    await driver.wait(
        until.elementIsVisible(resultado),
        10000
    );

    // 3. Verificar que el término aparece en la descripción.
    const descripcion = await resultado.getText();

    assert.match(
        descripcion,
        /express/i,
        'El término no aparece en el resultado encontrado'
    );

    // 4. Verificar el destino.
    assert.ok(
        (await resultado.getAttribute('href'))
            .endsWith('/backend.html#arquitectura'),
        'El resultado no corresponde a Arquitectura'
    );

    console.log('PASS — Búsqueda por descripción: Express');
    console.log('PASS — Resultado Arquitectura encontrado');
});

test('SEARCH-TC-030 — Búsqueda con varias palabras', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Buscar utilizando varias palabras.
    await searchInput.sendKeys('arquitectura api');

    // 2. Esperar el resultado correspondiente.
    const resultado = await driver.wait(
        until.elementLocated(
            By.css(
                '.portfolio-search-result[href="backend.html#arquitectura"]'
            )
        ),
        10000
    );

    await driver.wait(
        until.elementIsVisible(resultado),
        10000
    );

    // 3. Verificar el destino.
    assert.ok(
        (await resultado.getAttribute('href'))
            .endsWith('/backend.html#arquitectura'),
        'La búsqueda no encontró Arquitectura de la API'
    );

    // 4. Verificar que el desplegable está abierto.
    assert.equal(
        await searchInput.getAttribute('aria-expanded'),
        'true'
    );

    console.log('PASS — Búsqueda con varias palabras');
    console.log('PASS — Resultado Arquitectura de la API encontrado');
});

test('SEARCH-TC-031 — Búsqueda con espacios internos repetidos', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Buscar con varios espacios entre palabras.
    await searchInput.sendKeys('arquitectura   api');

    // 2. Esperar el resultado de Arquitectura.
    const resultado = await driver.wait(
        until.elementLocated(
            By.css(
                '.portfolio-search-result[href="backend.html#arquitectura"]'
            )
        ),
        10000
    );

    await driver.wait(
        until.elementIsVisible(resultado),
        10000
    );

    // 3. Verificar que el resultado corresponde al destino esperado.
    assert.ok(
        (await resultado.getAttribute('href'))
            .endsWith('/backend.html#arquitectura'),
        'La búsqueda con espacios internos no encontró Arquitectura'
    );

    // 4. Verificar el estado del desplegable.
    assert.equal(
        await searchInput.getAttribute('aria-expanded'),
        'true'
    );

    console.log('PASS — Consulta con espacios internos repetidos');
    console.log('PASS — Resultado Arquitectura encontrado');
});

test('SEARCH-TC-032 — Búsqueda con tabulaciones entre palabras', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Introducir una consulta con tabulaciones.
    // Se asigna el valor directamente para evitar que
    // Selenium interprete TAB como navegación de foco.
    await driver.executeScript(
        `
        const input = arguments[0];
        input.value = "arquitectura\\t\\tapi";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        `,
        searchInput
    );

    // 2. Verificar que el valor contiene dos tabulaciones.
    const valor = await searchInput.getAttribute('value');

    assert.equal(
        valor,
        'arquitectura\t\tapi',
        'El campo no contiene las tabulaciones esperadas'
    );

    // 3. Esperar el resultado de Arquitectura.
    const resultado = await driver.wait(
        until.elementLocated(
            By.css(
                '.portfolio-search-result[href="backend.html#arquitectura"]'
            )
        ),
        10000
    );

    await driver.wait(
        until.elementIsVisible(resultado),
        10000
    );

    // 4. Verificar el destino.
    assert.ok(
        (await resultado.getAttribute('href'))
            .endsWith('/backend.html#arquitectura'),
        'La búsqueda con tabulaciones no encontró Arquitectura'
    );

    // 5. Verificar el estado del buscador.
    assert.equal(
        await searchInput.getAttribute('aria-expanded'),
        'true'
    );

    console.log('PASS — Tabulaciones normalizadas correctamente');
    console.log('PASS — Resultado Arquitectura encontrado');
});

test('SEARCH-TC-033 — Normalización de caracteres Unicode', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // Representación Unicode descompuesta:
    // letra "o" seguida de acento combinante.
    const consulta = 'internacionalizacio\u0301n';

    await searchInput.sendKeys(consulta);

    // Verificar que el resultado correspondiente aparece.
    const resultado = await driver.wait(
        until.elementLocated(
            By.css(
                '.portfolio-search-result[href="frontend.html#internacionalizacion"]'
            )
        ),
        10000
    );

    await driver.wait(
        until.elementIsVisible(resultado),
        10000
    );

    // Verificar el destino.
    assert.ok(
        (await resultado.getAttribute('href'))
            .endsWith('/frontend.html#internacionalizacion'),
        'La búsqueda Unicode no encontró Internacionalización'
    );

    // Verificar el estado del desplegable.
    assert.equal(
        await searchInput.getAttribute('aria-expanded'),
        'true'
    );

    console.log('PASS — Normalización Unicode correcta');
    console.log('PASS — Resultado Internacionalización encontrado');
});


test('SEARCH-TC-034 — Tratamiento de saltos de línea en el input', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Asignar una consulta con un salto de línea.
    const valorReal = await driver.executeScript(`
        const input = arguments[0];

        input.value = "arquitectura\\napi";

        input.dispatchEvent(
            new Event("input", { bubbles: true })
        );

        return input.value;
    `, searchInput);

    // 2. Verificar la sanitización del input HTML.
    assert.equal(
        valorReal,
        'arquitecturaapi',
        'El input no eliminó el salto de línea como se esperaba'
    );

    // 3. Comprobar que el buscador no presenta
    // resultados para el valor realmente recibido.
    const mensaje = await driver.wait(
        until.elementLocated(
            By.css('.portfolio-search-empty')
        ),
        10000
    );

    await driver.wait(
        until.elementIsVisible(mensaje),
        10000
    );

    assert.match(
        await mensaje.getText(),
        /No se encontraron resultados/i
    );

    // 4. Verificar que el desplegable permanece abierto.
    assert.equal(
        await searchInput.getAttribute('aria-expanded'),
        'true'
    );

    console.log('PASS — El input elimina el salto de línea');
    console.log('PASS — El buscador procesa el valor real del campo');
});

test('SEARCH-TC-035 — Consulta compuesta únicamente por espacios', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Introducir únicamente espacios.
    await searchInput.sendKeys('     ');

    // 2. Verificar que el valor permanece en el campo.
    assert.equal(
        await searchInput.getAttribute('value'),
        '     ',
        'El campo no conserva los espacios ingresados'
    );

    // 3. Verificar que el desplegable está cerrado.
    assert.equal(
        await searchInput.getAttribute('aria-expanded'),
        'false',
        'El desplegable debería permanecer cerrado'
    );

    // 4. Verificar que no existen resultados visibles.
    const resultados = await driver.findElements(
        By.css('.portfolio-search-result')
    );

    assert.equal(
        resultados.length,
        0,
        'No deberían generarse resultados para una consulta vacía'
    );

    // 5. Verificar que el contenedor está oculto.
    const contenedor = await driver.findElement(
        By.css('.portfolio-search-results')
    );

    assert.equal(
        await contenedor.getAttribute('hidden'),
        'true',
        'El contenedor de resultados debería estar oculto'
    );

    console.log('PASS — Consulta con espacios tratada como vacía');
    console.log('PASS — Sin resultados y desplegable cerrado');
});

test('SEARCH-TC-036 — Caracteres especiales combinados con texto válido', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Introducir una consulta con símbolos adicionales.
    await searchInput.sendKeys('arquitectura@@@');

    // 2. Verificar que no aparecen coincidencias incorrectas.
    const mensaje = await driver.wait(
        until.elementLocated(
            By.css('.portfolio-search-empty')
        ),
        10000
    );

    await driver.wait(
        until.elementIsVisible(mensaje),
        10000
    );

    assert.match(
        await mensaje.getText(),
        /No se encontraron resultados/i,
        'La búsqueda debería informar que no hay coincidencias'
    );

    // 3. Verificar que no se generan enlaces de resultados.
    const resultados = await driver.findElements(
        By.css('.portfolio-search-result')
    );

    assert.equal(
        resultados.length,
        0,
        'No deberían existir resultados para esta consulta'
    );

    // 4. Verificar que el desplegable está abierto
    // mostrando el mensaje de ausencia de resultados.
    assert.equal(
        await searchInput.getAttribute('aria-expanded'),
        'true'
    );

    console.log('PASS — Consulta con símbolos sin coincidencias');
    console.log('PASS — Mensaje de ausencia de resultados correcto');
});

test('SEARCH-TC-037 — Recuperación tras caracteres especiales', async (t) => {

    const driver = await new Builder()
        .forBrowser(TEST_BROWSER)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    await driver.get(`${BASE_URL}/quality-management.html`);

    const searchInput = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-input')),
        10000
    );

    // 1. Realizar una búsqueda sin coincidencias.
    await searchInput.sendKeys('arquitectura@@@');

    const mensaje = await driver.wait(
        until.elementLocated(By.css('.portfolio-search-empty')),
        10000
    );

    await driver.wait(until.elementIsVisible(mensaje), 10000);

    assert.match(
        await mensaje.getText(),
        /No se encontraron resultados/i
    );

    // 2. Reemplazar la consulta sin recargar la página.
    await searchInput.clear();
    await searchInput.sendKeys('arquitectura');

    // 3. Comprobar que aparece el resultado válido.
    const resultado = await driver.wait(
        until.elementLocated(
            By.css(
                '.portfolio-search-result[href="backend.html#arquitectura"]'
            )
        ),
        10000
    );

    await driver.wait(until.elementIsVisible(resultado), 10000);

    // 4. Comprobar que desaparece el mensaje anterior.
    const mensajesVacios = await driver.findElements(
        By.css('.portfolio-search-empty')
    );

    assert.equal(
        mensajesVacios.length,
        0,
        'El mensaje anterior debería desaparecer'
    );

    // 5. Verificar el estado del desplegable.
    assert.equal(
        await searchInput.getAttribute('aria-expanded'),
        'true'
    );

    console.log('PASS — Recuperación tras consulta con símbolos');
    console.log('PASS — Resultado válido y estado actualizado');
});
