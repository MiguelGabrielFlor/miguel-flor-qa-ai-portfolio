
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Builder, By } = require('selenium-webdriver');
const { Select } = require('selenium-webdriver/lib/select');

const browser = process.env.SELENIUM_BROWSER || 'chrome';

const translations = {
    es: {
        title: 'Registro válido',
        status: 'Implementado',
        givenLabel: 'DADO',
        whenLabel: 'CUANDO',
        thenLabel: 'ENTONCES',
        given: 'Que el visitante completa correctamente los datos obligatorios y acepta el consentimiento.',
        when: 'Envía el formulario de registro.',
        then: 'El sistema valida los datos, acepta el registro y permite continuar al portfolio.'
    },

    en: {
        title: 'Valid registration',
        status: 'Implemented',
        givenLabel: 'GIVEN',
        whenLabel: 'WHEN',
        thenLabel: 'THEN',
        given: 'The visitor correctly completes the required fields and accepts the consent requirement.',
        when: 'The visitor submits the registration form.',
        then: 'The system validates the data, accepts the registration, and allows the visitor to proceed to the portfolio.'
    },

    pt: {
        title: 'Cadastro válido',
        status: 'Implementado',
        givenLabel: 'DADO',
        whenLabel: 'QUANDO',
        thenLabel: 'ENTÃO',
        given: 'O visitante preenche corretamente os campos obrigatórios e aceita o consentimento.',
        when: 'O visitante envia o formulário de cadastro.',
        then: 'O sistema valida os dados, aceita o cadastro e permite que o visitante prossiga para o portfólio.'
    }
};

const translationsBDD002 = {
    es: {
        title: 'Registro sin consentimiento',
        status: 'Implementado',
        given: 'Que el visitante completa los datos requeridos sin aceptar el consentimiento.',
        when: 'Intenta enviar el formulario de registro.',
        then: 'El sistema rechaza el registro e informa que debe aceptar el consentimiento.'
    },

    en: {
        title: 'Registration without consent',
        status: 'Implemented',
        given: 'The visitor completes the required fields without accepting the consent requirement.',
        when: 'The visitor attempts to submit the registration form.',
        then: 'The system rejects the registration and informs the visitor that consent must be accepted.'
    },

    pt: {
        title: 'Cadastro sem consentimento',
        status: 'Implementado',
        given: 'O visitante preenche os campos obrigatórios sem aceitar o consentimento.',
        when: 'O visitante tenta enviar o formulário de cadastro.',
        then: 'O sistema rejeita o cadastro e informa que é necessário aceitar o consentimento.'
    }
};

const translationsBDD003 = {
    es: {
        title: 'Navegación por el portfolio',
        status: 'Implementado',
        given: 'Que el visitante accedió correctamente al portfolio.',
        when: 'Selecciona una sección desde el menú de navegación.',
        then: 'El sistema muestra la sección correspondiente.'
    },

    en: {
        title: 'Portfolio navigation',
        status: 'Implemented',
        given: 'The visitor has successfully accessed the portfolio.',
        when: 'The visitor selects a section from the navigation menu.',
        then: 'The system displays the corresponding section.'
    },

    pt: {
        title: 'Navegação pelo portfólio',
        status: 'Implementado',
        given: 'O visitante acessou o portfólio com sucesso.',
        when: 'O visitante seleciona uma seção no menu de navegação.',
        then: 'O sistema exibe a seção correspondente.'
    }
};

const translationsBDD004 = {
    es: {
        title: 'Mensaje de contacto vacío',
        status: 'Implementado',
        given: 'Que el visitante accede al formulario de contacto.',
        when: 'Intenta enviar un mensaje vacío.',
        then: 'El sistema rechaza la solicitud e informa el error de validación.'
    },

    en: {
        title: 'Empty contact message',
        status: 'Implemented',
        given: 'The visitor accesses the contact form.',
        when: 'The visitor attempts to send an empty message.',
        then: 'The system rejects the request and displays the validation error.'
    },

    pt: {
        title: 'Mensagem de contato vazia',
        status: 'Implementado',
        given: 'O visitante acessa o formulário de contato.',
        when: 'O visitante tenta enviar uma mensagem vazia.',
        then: 'O sistema rejeita a solicitação e informa o erro de validação.'
    }
};

const translationsBDD005 = {
    es: {
        title: 'Persistencia del idioma',
        status: 'Parcialmente implementado',
        given: 'El visitante selecciona portugués durante el ingreso de sus datos.',
        when: 'El visitante accede al portfolio y navega desde la página de inicio hasta la página del currículum.',
        then: 'El sistema debe mantener el idioma seleccionado durante la navegación y mostrar en portugués los contenidos correspondientes en las páginas de inicio y trayectoria profesional. La verificación integral de este comportamiento permanece pendiente.'
    },

    en: {
        title: 'Language persistence',
        status: 'Partially implemented',
        given: 'The visitor selects Portuguese while entering their details.',
        when: 'The visitor accesses the portfolio and navigates from the home page to the CV page.',
        then: 'The system must preserve the selected language during navigation and display the corresponding content in Portuguese on the home and professional experience pages. Full verification of this behavior remains pending.'
    },

    pt: {
        title: 'Persistência do idioma',
        status: 'Parcialmente implementado',
        given: 'O visitante seleciona português durante o preenchimento dos dados.',
        when: 'O visitante acessa o portfólio e navega da página inicial até a página do currículo.',
        then: 'O sistema deve manter o idioma selecionado durante a navegação e exibir em português os conteúdos correspondentes nas páginas inicial e do currículo. A verificação integral desse comportamento permanece pendente.'
    }
};

const translationsBDD006 = {
    es: {
        title: 'Búsqueda global',
        status: 'Implementado',
        given: 'El visitante se encuentra en cualquier página del portfolio.',
        when: 'El visitante introduce el término API en el buscador global.',
        then: 'El sistema muestra una lista de secciones relacionadas con las APIs, indicando la página correspondiente y permitiendo acceder directamente a cada resultado.'
    },

    en: {
        title: 'Global search',
        status: 'Implemented',
        given: 'The visitor is on any page of the portfolio.',
        when: 'The visitor enters the term API in the global search field.',
        then: 'The system displays a list of sections related to APIs, indicating the corresponding page and allowing direct access to each result.'
    },

    pt: {
        title: 'Busca global',
        status: 'Implementado',
        given: 'O visitante está em qualquer página do portfólio.',
        when: 'O visitante insere o termo API no campo de busca global.',
        then: 'O sistema exibe uma lista de seções relacionadas às APIs, indicando a página correspondente e permitindo acessar diretamente cada resultado.'
    }
};


test('BDD-001 — Traducción dinámica ES/EN/PT sin cambiar de escenario', async (t) => {
    const driver = await new Builder()
        .forBrowser(browser)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    const pagePath = path.resolve(
        __dirname,
        '../../quality-management.html'
    );

    await driver.get(pathToFileURL(pagePath).href);

    const selector = new Select(
        await driver.findElement(By.id('cv-language-select'))
    );

    const code = await driver.findElement(
        By.id('qm-bdd-detail-code')
    );

    const title = await driver.findElement(
        By.id('qm-bdd-detail-title')
    );

    const status = await driver.findElement(
        By.id('qm-bdd-status')
    );

    const given = await driver.findElement(
        By.id('qm-bdd-given')
    );

    const when = await driver.findElement(
        By.id('qm-bdd-when')
    );

    const then = await driver.findElement(
        By.id('qm-bdd-then')
    );
    // Etiquetas BDD traducidas mediante data-i18n.
    const givenLabel = await driver.findElement(
        By.css('[data-i18n="qmBDDGiven"]')
    );

    const whenLabel = await driver.findElement(
        By.css('[data-i18n="qmBDDWhen"]')
    );

    const thenLabel = await driver.findElement(
        By.css('[data-i18n="qmBDDThen"]')
    );

    // Inicializar mediante un cambio efectivo de idioma.
    await selector.selectByValue('en');

    await driver.wait(async () => {
        return await driver.executeScript(
            'return localStorage.getItem("portfolioLanguage") === "en";'
        );
    }, 10000, 'No se pudo inicializar el idioma inglés');

    for (const language of ['es', 'en', 'pt', 'es']) {
        const expected = translations[language];

        await selector.selectByValue(language);

        await driver.wait(async () => {
            return (await title.getText()) === expected.title &&
                (await then.getText()) === expected.then;
        }, 10000, `BDD-001 no se actualizó al idioma ${language}`);

        assert.equal((await code.getText()).trim(), 'BDD-001');
        assert.equal(await title.getText(), expected.title);
        assert.equal(await status.getText(), expected.status);
        assert.equal(await given.getText(), expected.given);
        assert.equal(await when.getText(), expected.when);
        assert.equal(await then.getText(), expected.then);
        // Verificar las etiquetas visibles DADO / CUANDO / ENTONCES.
        assert.equal(
            await givenLabel.getText(),
            expected.givenLabel,
            `Etiqueta DADO incorrecta en ${language}`
        );

        assert.equal(
            await whenLabel.getText(),
            expected.whenLabel,
            `Etiqueta CUANDO incorrecta en ${language}`
        );

        assert.equal(
            await thenLabel.getText(),
            expected.thenLabel,
            `Etiqueta ENTONCES incorrecta en ${language}`
        );

        const activeButton = await driver.findElement(
            By.css('[data-bdd="BDD-001"]')
        );

        assert.equal(
            await activeButton.getAttribute('aria-pressed'),
            'true',
            `BDD-001 perdió su selección en ${language}`
        );

        const storedLanguage = await driver.executeScript(
            'return localStorage.getItem("portfolioLanguage");'
        );

        assert.equal(
            storedLanguage,
            language,
            `Idioma persistido incorrecto en ${language}`
        );

        console.log(
            `BDD-001 | ${language.toUpperCase()} | Título, estado, GIVEN/WHEN/THEN y selección: PASS`
        );
    }
});

test('BDD-002 — Traducción dinámica ES/EN/PT sin cambiar de escenario', async (t) => {
    const driver = await new Builder()
        .forBrowser(browser)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    const pagePath = path.resolve(
        __dirname,
        '../../quality-management.html'
    );

    await driver.get(pathToFileURL(pagePath).href);

    const selector = new Select(
        await driver.findElement(By.id('cv-language-select'))
    );

    const bdd002Button = await driver.findElement(
        By.css('[data-bdd="BDD-002"]')
    );

    const code = await driver.findElement(
        By.id('qm-bdd-detail-code')
    );

    const title = await driver.findElement(
        By.id('qm-bdd-detail-title')
    );

    const status = await driver.findElement(
        By.id('qm-bdd-status')
    );

    const given = await driver.findElement(
        By.id('qm-bdd-given')
    );

    const when = await driver.findElement(
        By.id('qm-bdd-when')
    );

    const then = await driver.findElement(
        By.id('qm-bdd-then')
    );

    const givenLabel = await driver.findElement(
        By.css('[data-i18n="qmBDDGiven"]')
    );

    const whenLabel = await driver.findElement(
        By.css('[data-i18n="qmBDDWhen"]')
    );

    const thenLabel = await driver.findElement(
        By.css('[data-i18n="qmBDDThen"]')
    );

    // Inicializar el idioma mediante un cambio efectivo.
    await selector.selectByValue('en');

    await driver.wait(async () => {
        return await driver.executeScript(
            'return localStorage.getItem("portfolioLanguage") === "en";'
        );
    }, 10000);

    // Desplazar BDD-002 al centro de la ventana
    // para evitar la superposición del footer fijo.
    await driver.executeScript(
        'arguments[0].scrollIntoView({block: "center", inline: "nearest"});',
        bdd002Button
    );

    // Seleccionar BDD-002 mediante una interacción real.
    await bdd002Button.click();

    assert.equal(
        await bdd002Button.getAttribute('aria-pressed'),
        'true'
    );

    for (const language of ['es', 'en', 'pt', 'es']) {
        const expected = translationsBDD002[language];
        const labels = translations[language];

        await selector.selectByValue(language);

        await driver.wait(async () => {
            return (await title.getText()) === expected.title &&
                (await then.getText()) === expected.then;
        }, 10000, `BDD-002 no se actualizó a ${language}`);

        assert.equal(await code.getText(), 'BDD-002');
        assert.equal(await title.getText(), expected.title);
        assert.equal(await status.getText(), expected.status);
        assert.equal(await given.getText(), expected.given);
        assert.equal(await when.getText(), expected.when);
        assert.equal(await then.getText(), expected.then);

        // Verificar las etiquetas traducidas.
        assert.equal(
            await givenLabel.getText(),
            labels.givenLabel
        );

        assert.equal(
            await whenLabel.getText(),
            labels.whenLabel
        );

        assert.equal(
            await thenLabel.getText(),
            labels.thenLabel
        );

        // Verificar que BDD-002 continúa seleccionado.
        assert.equal(
            await bdd002Button.getAttribute('aria-pressed'),
            'true'
        );

        // Verificar persistencia del idioma.
        const storedLanguage = await driver.executeScript(
            'return localStorage.getItem("portfolioLanguage");'
        );

        assert.equal(storedLanguage, language);

        console.log(
            `BDD-002 | ${language.toUpperCase()} | Traducción y selección: PASS`
        );
    }
});

test('BDD-003 — Traducción dinámica ES/EN/PT sin cambiar de escenario', async (t) => {
    const driver = await new Builder()
        .forBrowser(browser)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    const pagePath = path.resolve(
        __dirname,
        '../../quality-management.html'
    );

    await driver.get(pathToFileURL(pagePath).href);

    const selector = new Select(
        await driver.findElement(By.id('cv-language-select'))
    );

    const bdd003Button = await driver.findElement(
        By.css('[data-bdd="BDD-003"]')
    );

    const code = await driver.findElement(
        By.id('qm-bdd-detail-code')
    );

    const title = await driver.findElement(
        By.id('qm-bdd-detail-title')
    );

    const status = await driver.findElement(
        By.id('qm-bdd-status')
    );

    const given = await driver.findElement(
        By.id('qm-bdd-given')
    );

    const when = await driver.findElement(
        By.id('qm-bdd-when')
    );

    const then = await driver.findElement(
        By.id('qm-bdd-then')
    );

    const story = await driver.findElement(
        By.id('qm-bdd-story')
    );

    const givenLabel = await driver.findElement(
        By.css('[data-i18n="qmBDDGiven"]')
    );

    const whenLabel = await driver.findElement(
        By.css('[data-i18n="qmBDDWhen"]')
    );

    const thenLabel = await driver.findElement(
        By.css('[data-i18n="qmBDDThen"]')
    );

    // Inicializar el idioma mediante un cambio efectivo.
    await selector.selectByValue('en');

    await driver.wait(async () => {
        return await driver.executeScript(
            'return localStorage.getItem("portfolioLanguage") === "en";'
        );
    }, 10000);

    // Desplazar el botón al centro para evitar el footer fijo.
    await driver.executeScript(
        'arguments[0].scrollIntoView({block: "center", inline: "nearest"});',
        bdd003Button
    );

    // Seleccionar BDD-003 mediante Selenium.
    await bdd003Button.click();

    assert.equal(
        await bdd003Button.getAttribute('aria-pressed'),
        'true'
    );

    for (const language of ['es', 'en', 'pt', 'es']) {
        const expected = translationsBDD003[language];
        const labels = translations[language];

        await selector.selectByValue(language);

        await driver.wait(async () => {
            return (await title.getText()) === expected.title &&
                (await then.getText()) === expected.then;
        }, 10000, `BDD-003 no se actualizó a ${language}`);

        // Identificación y contenido del escenario.
        assert.equal(await code.getText(), 'BDD-003');
        assert.equal(await title.getText(), expected.title);
        assert.equal(await status.getText(), expected.status);
        assert.equal(await given.getText(), expected.given);
        assert.equal(await when.getText(), expected.when);
        assert.equal(await then.getText(), expected.then);

        // Etiquetas traducidas.
        assert.equal(
            await givenLabel.getText(),
            labels.givenLabel
        );

        assert.equal(
            await whenLabel.getText(),
            labels.whenLabel
        );

        assert.equal(
            await thenLabel.getText(),
            labels.thenLabel
        );

        // Trazabilidad con la historia de usuario.
        assert.equal(await story.getText(), 'HU-002');

        // El escenario debe permanecer seleccionado.
        assert.equal(
            await bdd003Button.getAttribute('aria-pressed'),
            'true'
        );

        // Persistencia del idioma.
        const storedLanguage = await driver.executeScript(
            'return localStorage.getItem("portfolioLanguage");'
        );

        assert.equal(storedLanguage, language);

        console.log(
            `BDD-003 | ${language.toUpperCase()} | Traducción, trazabilidad y selección: PASS`
        );
    }
});

test('BDD-004 — Traducción dinámica ES/EN/PT sin cambiar de escenario', async (t) => {
    const driver = await new Builder()
        .forBrowser(browser)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    const pagePath = path.resolve(
        __dirname,
        '../../quality-management.html'
    );

    await driver.get(pathToFileURL(pagePath).href);

    const selector = new Select(
        await driver.findElement(By.id('cv-language-select'))
    );

    const bdd004Button = await driver.findElement(
        By.css('[data-bdd="BDD-004"]')
    );

    const code = await driver.findElement(
        By.id('qm-bdd-detail-code')
    );

    const title = await driver.findElement(
        By.id('qm-bdd-detail-title')
    );

    const status = await driver.findElement(
        By.id('qm-bdd-status')
    );

    const given = await driver.findElement(
        By.id('qm-bdd-given')
    );

    const when = await driver.findElement(
        By.id('qm-bdd-when')
    );

    const then = await driver.findElement(
        By.id('qm-bdd-then')
    );

    const story = await driver.findElement(
        By.id('qm-bdd-story')
    );

    const givenLabel = await driver.findElement(
        By.css('[data-i18n="qmBDDGiven"]')
    );

    const whenLabel = await driver.findElement(
        By.css('[data-i18n="qmBDDWhen"]')
    );

    const thenLabel = await driver.findElement(
        By.css('[data-i18n="qmBDDThen"]')
    );

    // Inicializar el idioma mediante un cambio efectivo.
    await selector.selectByValue('en');

    await driver.wait(async () => {
        return await driver.executeScript(
            'return localStorage.getItem("portfolioLanguage") === "en";'
        );
    }, 10000);

    // Centrar el botón para evitar la superposición del footer.
    await driver.executeScript(
        'arguments[0].scrollIntoView({block: "center", inline: "nearest"});',
        bdd004Button
    );

    // Seleccionar BDD-004 mediante Selenium.
    await bdd004Button.click();

    assert.equal(
        await bdd004Button.getAttribute('aria-pressed'),
        'true'
    );

    for (const language of ['es', 'en', 'pt', 'es']) {
        const expected = translationsBDD004[language];
        const labels = translations[language];

        await selector.selectByValue(language);

        await driver.wait(async () => {
            return (await title.getText()) === expected.title &&
                (await then.getText()) === expected.then;
        }, 10000, `BDD-004 no se actualizó a ${language}`);

        // Identificación y contenido del escenario.
        assert.equal(await code.getText(), 'BDD-004');
        assert.equal(await title.getText(), expected.title);
        assert.equal(await status.getText(), expected.status);
        assert.equal(await given.getText(), expected.given);
        assert.equal(await when.getText(), expected.when);
        assert.equal(await then.getText(), expected.then);

        // Etiquetas BDD traducidas.
        assert.equal(
            await givenLabel.getText(),
            labels.givenLabel
        );

        assert.equal(
            await whenLabel.getText(),
            labels.whenLabel
        );

        assert.equal(
            await thenLabel.getText(),
            labels.thenLabel
        );

        // Trazabilidad con la historia de usuario.
        assert.equal(await story.getText(), 'HU-003');

        // Verificar que BDD-004 permanece seleccionado.
        assert.equal(
            await bdd004Button.getAttribute('aria-pressed'),
            'true'
        );

        // Persistencia del idioma.
        const storedLanguage = await driver.executeScript(
            'return localStorage.getItem("portfolioLanguage");'
        );

        assert.equal(storedLanguage, language);

        console.log(
            `BDD-004 | ${language.toUpperCase()} | Traducción, trazabilidad y selección: PASS`
        );
    }
});

test('BDD-005 — Traducción dinámica ES/EN/PT y estado parcial', async (t) => {
    const driver = await new Builder()
        .forBrowser(browser)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    const pagePath = path.resolve(
        __dirname,
        '../../quality-management.html'
    );

    await driver.get(pathToFileURL(pagePath).href);

    const selector = new Select(
        await driver.findElement(By.id('cv-language-select'))
    );

    const bdd005Button = await driver.findElement(
        By.css('[data-bdd="BDD-005"]')
    );

    const code = await driver.findElement(
        By.id('qm-bdd-detail-code')
    );

    const title = await driver.findElement(
        By.id('qm-bdd-detail-title')
    );

    const status = await driver.findElement(
        By.id('qm-bdd-status')
    );

    const given = await driver.findElement(
        By.id('qm-bdd-given')
    );

    const when = await driver.findElement(
        By.id('qm-bdd-when')
    );

    const then = await driver.findElement(
        By.id('qm-bdd-then')
    );

    const story = await driver.findElement(
        By.id('qm-bdd-story')
    );

    const givenLabel = await driver.findElement(
        By.css('[data-i18n="qmBDDGiven"]')
    );

    const whenLabel = await driver.findElement(
        By.css('[data-i18n="qmBDDWhen"]')
    );

    const thenLabel = await driver.findElement(
        By.css('[data-i18n="qmBDDThen"]')
    );

    // Inicializar el idioma mediante un cambio efectivo.
    await selector.selectByValue('en');

    await driver.wait(async () => {
        return await driver.executeScript(
            'return localStorage.getItem("portfolioLanguage") === "en";'
        );
    }, 10000);

    // Centrar el botón para evitar el footer fijo.
    await driver.executeScript(
        'arguments[0].scrollIntoView({block: "center", inline: "nearest"});',
        bdd005Button
    );

    // Seleccionar BDD-005 mediante Selenium.
    await bdd005Button.click();

    assert.equal(
        await bdd005Button.getAttribute('aria-pressed'),
        'true'
    );

    for (const language of ['es', 'en', 'pt', 'es']) {
        const expected = translationsBDD005[language];
        const labels = translations[language];

        await selector.selectByValue(language);

        await driver.wait(async () => {
            return (await title.getText()) === expected.title &&
                (await then.getText()) === expected.then;
        }, 10000, `BDD-005 no se actualizó a ${language}`);

        // Identificación y contenido del escenario.
        assert.equal(await code.getText(), 'BDD-005');
        assert.equal(await title.getText(), expected.title);
        assert.equal(await status.getText(), expected.status);
        assert.equal(await given.getText(), expected.given);
        assert.equal(await when.getText(), expected.when);
        assert.equal(await then.getText(), expected.then);

        // Verificar el estado técnico del escenario.
        assert.equal(
            await status.getAttribute('data-status'),
            'partial',
            `Estado técnico incorrecto en ${language}`
        );

        // Etiquetas BDD traducidas.
        assert.equal(
            await givenLabel.getText(),
            labels.givenLabel
        );

        assert.equal(
            await whenLabel.getText(),
            labels.whenLabel
        );

        assert.equal(
            await thenLabel.getText(),
            labels.thenLabel
        );

        // Trazabilidad con la historia de usuario.
        assert.equal(await story.getText(), 'HU-004');

        // Verificar que BDD-005 permanece seleccionado.
        assert.equal(
            await bdd005Button.getAttribute('aria-pressed'),
            'true'
        );

        // Persistencia del idioma seleccionado.
        const storedLanguage = await driver.executeScript(
            'return localStorage.getItem("portfolioLanguage");'
        );

        assert.equal(storedLanguage, language);

        console.log(
            `BDD-005 | ${language.toUpperCase()} | Traducción, estado parcial y trazabilidad: PASS`
        );
    }
});

test('BDD-006 — Traducción dinámica ES/EN/PT y búsqueda global', async (t) => {
    const driver = await new Builder()
        .forBrowser(browser)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    const pagePath = path.resolve(
        __dirname,
        '../../quality-management.html'
    );

    await driver.get(pathToFileURL(pagePath).href);

    const selector = new Select(
        await driver.findElement(By.id('cv-language-select'))
    );

    const bdd006Button = await driver.findElement(
        By.css('[data-bdd="BDD-006"]')
    );

    const code = await driver.findElement(
        By.id('qm-bdd-detail-code')
    );

    const title = await driver.findElement(
        By.id('qm-bdd-detail-title')
    );

    const status = await driver.findElement(
        By.id('qm-bdd-status')
    );

    const given = await driver.findElement(
        By.id('qm-bdd-given')
    );

    const when = await driver.findElement(
        By.id('qm-bdd-when')
    );

    const then = await driver.findElement(
        By.id('qm-bdd-then')
    );

    const story = await driver.findElement(
        By.id('qm-bdd-story')
    );

    const givenLabel = await driver.findElement(
        By.css('[data-i18n="qmBDDGiven"]')
    );

    const whenLabel = await driver.findElement(
        By.css('[data-i18n="qmBDDWhen"]')
    );

    const thenLabel = await driver.findElement(
        By.css('[data-i18n="qmBDDThen"]')
    );

    // Inicializar el idioma mediante un cambio efectivo.
    await selector.selectByValue('en');

    await driver.wait(async () => {
        return await driver.executeScript(
            'return localStorage.getItem("portfolioLanguage") === "en";'
        );
    }, 10000);

    // Centrar el botón para evitar la superposición del footer.
    await driver.executeScript(
        'arguments[0].scrollIntoView({block: "center", inline: "nearest"});',
        bdd006Button
    );

    // Seleccionar BDD-006 mediante Selenium.
    await bdd006Button.click();

    assert.equal(
        await bdd006Button.getAttribute('aria-pressed'),
        'true'
    );

    for (const language of ['es', 'en', 'pt', 'es']) {
        const expected = translationsBDD006[language];
        const labels = translations[language];

        await selector.selectByValue(language);

        await driver.wait(async () => {
            return (await title.getText()) === expected.title &&
                (await then.getText()) === expected.then;
        }, 10000, `BDD-006 no se actualizó a ${language}`);

        // Identificación y contenido del escenario.
        assert.equal(await code.getText(), 'BDD-006');
        assert.equal(await title.getText(), expected.title);
        assert.equal(await status.getText(), expected.status);
        assert.equal(await given.getText(), expected.given);
        assert.equal(await when.getText(), expected.when);
        assert.equal(await then.getText(), expected.then);

        // Verificar el estado técnico del escenario.
        assert.equal(
            await status.getAttribute('data-status'),
            'implemented',
            `Estado técnico incorrecto en ${language}`
        );

        // Etiquetas BDD traducidas.
        assert.equal(
            await givenLabel.getText(),
            labels.givenLabel
        );

        assert.equal(
            await whenLabel.getText(),
            labels.whenLabel
        );

        assert.equal(
            await thenLabel.getText(),
            labels.thenLabel
        );

        // Trazabilidad con la historia de usuario.
        assert.equal(await story.getText(), 'HU-005');

        // Verificar que BDD-006 permanece seleccionado.
        assert.equal(
            await bdd006Button.getAttribute('aria-pressed'),
            'true'
        );

        // Persistencia del idioma.
        const storedLanguage = await driver.executeScript(
            'return localStorage.getItem("portfolioLanguage");'
        );

        assert.equal(storedLanguage, language);

        console.log(
            `BDD-006 | ${language.toUpperCase()} | Traducción, estado y trazabilidad: PASS`
        );
    }
});
