
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const parse5 = require('parse5');

const ROOT = path.resolve(__dirname, '../..');

const PAGES = [
    'index.html',
    'cv.html',
    'frontend.html',
    'backend.html',
    'qa.html',
    'quality-management.html'
];

const LANGUAGES = ['es', 'en', 'pt'];

const TRANSLATIONS_FILE = path.join(
    ROOT,
    'js',
    'translations.js'
);

const I18N_ATTRIBUTES = [
    'data-i18n',
    'data-i18n-placeholder',
    'data-i18n-aria-label',
    'data-i18n-title',
    'data-i18n-alt'
];

function loadTranslations() {
    const source = fs.readFileSync(
        TRANSLATIONS_FILE,
        'utf8'
    );

    const context = {
        window: {}
    };

    vm.runInNewContext(source, context, {
        filename: TRANSLATIONS_FILE,
        timeout: 5000
    });

    const translations =
        context.window.portfolioTranslations;

    assert.ok(
        translations,
        'No se encontró window.portfolioTranslations'
    );

    return translations;
}

function extractI18nKeys(html) {
    const keys = [];

    const attributes = I18N_ATTRIBUTES.join('|');

    const regex = new RegExp(
        `(?:${attributes})\\s*=\\s*(["'])(.*?)\\1`,
        'g'
    );

    let match;

    while ((match = regex.exec(html)) !== null) {
        const key = match[2].trim();

        if (!key) {
            continue;
        }

        const line = html
            .slice(0, match.index)
            .split(/\r?\n/).length;

        keys.push({
            key,
            line
        });
    }

    return keys;
}

function isValidTranslation(value) {
    return (
        typeof value === 'string' &&
        value.trim().length > 0
    );
}

test(
    'I18N-001 — Claves HTML disponibles en ES/EN/PT',
    () => {
        const translations = loadTranslations();

        const errors = [];

        let checkedKeys = 0;

        for (const page of PAGES) {
            const filePath = path.join(ROOT, page);

            assert.ok(
                fs.existsSync(filePath),
                `No existe la página ${page}`
            );

            const html = fs.readFileSync(
                filePath,
                'utf8'
            );

            const keys = extractI18nKeys(html);

            for (const { key, line } of keys) {
                checkedKeys++;

                for (const language of LANGUAGES) {
                    const dictionary =
                        translations[language];

                    if (!dictionary) {
                        errors.push(
                            `${page}:${line} | ` +
                            `No existe el diccionario ${language}`
                        );

                        continue;
                    }

                    if (
                        !Object.prototype.hasOwnProperty.call(
                            dictionary,
                            key
                        )
                    ) {
                        errors.push(
                            `${page}:${line} | ` +
                            `${language} | ` +
                            `Clave inexistente: ${key}`
                        );

                        continue;
                    }

                    if (
                        !isValidTranslation(
                            dictionary[key]
                        )
                    ) {
                        errors.push(
                            `${page}:${line} | ` +
                            `${language} | ` +
                            `Traducción vacía o inválida: ${key}`
                        );
                    }
                }
            }
        }

        console.log(
            `I18N-001 | Páginas: ${PAGES.length}`
        );

        console.log(
            `I18N-001 | Referencias verificadas: ${checkedKeys}`
        );

        console.log(
            `I18N-001 | Incidencias: ${errors.length}`
        );

        assert.equal(
            errors.length,
            0,
            '\n' + errors.join('\n')
        );
    }
);

test(
    'I18N-002 — Consistencia de diccionarios ES/EN/PT',
    () => {
        const translations = loadTranslations();

        const errors = [];

        for (const language of LANGUAGES) {
            assert.ok(
                translations[language],
                `Falta el diccionario ${language}`
            );
        }

        const allKeys = new Set();

        for (const language of LANGUAGES) {
            for (
                const key of Object.keys(
                    translations[language]
                )
            ) {
                allKeys.add(key);
            }
        }

        for (const key of allKeys) {
            for (const language of LANGUAGES) {
                const dictionary =
                    translations[language];

                if (
                    !Object.prototype.hasOwnProperty.call(
                        dictionary,
                        key
                    )
                ) {
                    errors.push(
                        `${language} | Clave faltante: ${key}`
                    );

                    continue;
                }

                if (
                    !isValidTranslation(
                        dictionary[key]
                    )
                ) {
                    errors.push(
                        `${language} | Valor vacío o inválido: ${key}`
                    );
                }
            }
        }

        console.log(
            `I18N-002 | Claves únicas: ${allKeys.size}`
        );

        console.log(
            `I18N-002 | Idiomas: ${LANGUAGES.join(', ')}`
        );

        console.log(
            `I18N-002 | Incidencias: ${errors.length}`
        );

        assert.equal(
            errors.length,
            0,
            '\n' + errors.join('\n')
        );
    }
);

test(
    'I18N-003 — Claves dinámicas de los ciclos interactivos',
    () => {
        const translations = loadTranslations();

        const errors = [];
        const keys = new Set();

        const htmlPath = path.join(
            ROOT,
            'quality-management.html'
        );

        const html = fs.readFileSync(
            htmlPath,
            'utf8'
        );

        // Localizar el bloque de datos qmCycles.
        const startMarker = 'const qmCycles = {';
        const endMarker = 'const qmCycleButtons =';

        const start = html.indexOf(startMarker);
        const end = html.indexOf(endMarker, start);

        assert.ok(
            start !== -1 && end !== -1,
            'No se encontró el bloque qmCycles'
        );

        const source = html.slice(start, end);

        // Claves individuales:
        // categoryKey, titleKey, descriptionKey, labelKey.
        const singleKeyPattern =
            /\b(?:categoryKey|titleKey|descriptionKey|labelKey)\s*:\s*["']([^"']+)["']/g;

        for (const match of source.matchAll(singleKeyPattern)) {
            keys.add(match[1]);
        }

        // Claves agrupadas:
        // centerKeys, activityKeys, resultKeys, resultValueKeys.
        const arrayKeyPattern =
            /\b(?:centerKeys|activityKeys|resultKeys|resultValueKeys)\s*:\s*\[([\s\S]*?)\]/g;

        for (const match of source.matchAll(arrayKeyPattern)) {
            const values = match[1].matchAll(
                /["']([^"']+)["']/g
            );

            for (const value of values) {
                keys.add(value[1]);
            }
        }

        for (const key of keys) {
            for (const language of LANGUAGES) {
                const dictionary = translations[language];

                if (
                    !Object.prototype.hasOwnProperty.call(
                        dictionary,
                        key
                    )
                ) {
                    errors.push(
                        `${language} | Clave dinámica faltante: ${key}`
                    );

                    continue;
                }

                if (!isValidTranslation(dictionary[key])) {
                    errors.push(
                        `${language} | Traducción dinámica inválida: ${key}`
                    );
                }
            }
        }

        console.log(
            `I18N-003 | Ciclos analizados: 4`
        );

        console.log(
            `I18N-003 | Claves dinámicas únicas: ${keys.size}`
        );

        console.log(
            `I18N-003 | Incidencias: ${errors.length}`
        );

        assert.ok(
            keys.size > 0,
            'No se encontraron claves dinámicas para auditar'
        );

        assert.equal(
            errors.length,
            0,
            '\n' + errors.join('\n')
        );
    }
);


test(
    'I18N-004 — Detección de textos HTML sin internacionalizar',
    () => {
        
        const pages = [
            'quality-management.html',
            'index.html',
            'cv.html',
            'frontend.html',
            'backend.html',
            'qa.html'
        ];

        const findings = [];
        const dynamic = [];


        const visibleTags = new Set([
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'span', 'strong', 'small',
            'button', 'a', 'li', 'td', 'th',
            'summary', 'label'
        ]);

        const excludedTags = new Set([
            'script', 'style', 'template',
            'svg', 'noscript', 'head'
        ]);

        // Contenedores cuyos textos se generan o reemplazan
        // mediante las funciones dinámicas del portfolio.
        const dynamicContainers = new Set([
            'qm-sprint-detail',
            'qm-sprint-results'
        ]);

        const dynamicIds = new Set([
            'qm-story-detail-title',
            'qm-story-status',
            'qm-story-description',
            'qm-story-application',
            'qm-story-counter',

            'qm-bdd-detail-title',
            'qm-bdd-status',
            'qm-bdd-given',
            'qm-bdd-when',
            'qm-bdd-then',

            'qm-bug-title',
            'qm-bug-status',
            'qm-bug-description',
            'qm-bug-severity',
            'qm-bug-priority',

            'qm-wheel-label',
            'qm-wheel-title',
            'qm-wheel-subtitle',
            
            'qm-trace-title',
            'qm-trace-status',
            'qm-trace-requirement-name',
            'qm-trace-story-name',
            'qm-trace-bdd-name',
            'qm-trace-verification-text',

            'qm-defect-step-code',
            'qm-defect-step-title',
            'qm-defect-step-label',
            'qm-defect-step-description',
            'qm-defect-counter',
            'qm-bug-resolution-text'

        ]);

        const getAttribute = (node, name) =>
            node.attrs?.find(attr => attr.name === name)?.value;

        const hasTranslation = (node, page) =>
            getAttribute(node, 'data-i18n') !== undefined ||
            (
                page === 'frontend.html' &&
                getAttribute(node, 'data-demo-translation') !== undefined
            );

        const isSprintStep = node =>
            (getAttribute(node, 'class') || '')
                .split(/\s+/)
                .includes('qm-sprint-step');
        
        const isTechnicalText = text =>
            /^(?:MF|PORTFOLIO|ID|RF|RNF|QA|EC|S1(?:\.5)?|S2|\.|→|←|Sprint 1(?:\.5)?|Sprint 2|\d+(?:[./]\d+)*|(?:RF|RNF|FR|HU|BDD|BUG|TC|BL|API-TC|SEARCH-TC|UI)-\d+)$/i.test(text);
        const isProperName = text => new Set([
            'Miguel Flor',
            'Miguel Gabriel Flor'
        ]).has(text);
        const isCopyright = text =>
            /^©\s*\d{4}\s+Miguel Flor$/.test(text);
        const fixedProfessionalTitles = new Set([
            'QA Tester · AI Consultant',
            'QA · Automation · Python · AI',
            'QUALITY ASSURANCE',
            'QA Testing',
            'FRONTEND',
            'BACKEND',
            'QUALITY MANAGEMENT',
            'ARTIFICIAL INTELLIGENCE',
            'Vibe Coding',
            'AI Apps',
            'AI Test Case Generator',
            'QA · AI · Automation',
            
        ]);
        const fixedCvTexts = new Set([
            '2024 — 2026',
            'SENZA — Senza Deco S.R.L.',
            '2018 — 2024',
            'SELEMA — Global Mobili SRL',
            '2016 — 2018',
            'DIVINO — Divino SRL',
            '2015 — 2016',
            'Presta Cash YA — Feladak S.A.',
            '2012 — 2015',
            'ACC Group — ACC Group S.A.',
            'Telecom — Personal Argentina S.A., TeleCentro S.A., EDES S.A., EDEMSA S.A., EDELAP',
            'Encompass TIBA Latinoamérica S.A.',
            'Marketing Digital.',
            'QA Manager.',
            'Escuela Provincial de Enseñanza Técnica N.º 9',
            'Plottier, Neuquén, Argentina.',
            '×'
        ]);
        const isFixedCvText = (text, page) =>
            page === 'cv.html' && fixedCvTexts.has(text);

        const fixedFrontendTexts = new Set([
            'index.html',
            'accessPage',
            'accessForm',
            'css/style.css',
            'js/app.js',
            'JavaScript · showError',
            'JavaScript · applyLanguage',
            'Español',
            'English',
            'Português',
            'ES',
            'tests/selenium'
        ]);

        const isFixedFrontendText = (text, page) =>
            page === 'frontend.html' && fixedFrontendTexts.has(text);

        const fixedBackendTexts = new Set([
            'BACKEND · API TESTING',

            '1xx',
            '2xx',
            '3xx',
            '4xx',
            '5xx',

            'GET /api/health:',
            'POST /api/visitors:',
            'POST /api/contact:',

            'GET',
            'POST',

            '15 PASS',
            '0 FAIL',
            '0 SKIP'
        ]);

        const isFixedBackendText = (text, page) =>
            page === 'backend.html' && fixedBackendTexts.has(text);

        const fixedQaTexts = new Set([
            '12/12 PASS',
            '36/36 PASS',
            '33/33 PASS',
            '15/15 PASS',
            '129/129 PASS',

            'PHONE-001',
            'PHONE-002',
            'PHONE-003',
            'PHONE-004',
            'PHONE-005',
            'PHONE-006',
            'PHONE-007',
            'PHONE-008',
            'PHONE-009',

            'SEARCH',

            'RF-06 · HU-005 · BDD-006',

            'BUG-001 ·',
            'BUG-002 ·',
            'BUG-003 ·',
            'BUG-005 ·'
        ]);

        const isFixedQaText = (text, page) =>
            page === 'qa.html' && fixedQaTexts.has(text);

        
        const isFixedProfessionalTitle = text =>
            fixedProfessionalTitles.has(text);

        
        function visit(
            node,
            page,
            inheritedTranslation = false,
            inheritedDynamic = false,
            inheritedExcluded = false
        ) {

            const tag = node.tagName || '';
            const id = getAttribute(node, 'id');

            const excluded =
                inheritedExcluded ||
                excludedTags.has(tag) ||
                getAttribute(node, 'hidden') !== undefined ||
                getAttribute(node, 'aria-hidden') === 'true';

            if (excluded) return;

            const translated =
                inheritedTranslation || hasTranslation(node, page);

            
            const dynamicContent =
                inheritedDynamic ||
                (
                    page === 'quality-management.html' &&
                    (
                        dynamicContainers.has(id) ||
                        dynamicIds.has(id) ||
                        isSprintStep(node)
                    )
                );


            if (node.nodeName === '#text') {
                const content = (node.value || '')
                    .replace(/\s+/g, ' ')
                    .trim();

                if (
                    content &&
                    visibleTags.has(node.parentNode?.tagName) &&
                    !translated &&
                    !isTechnicalText(content) &&
                    !isProperName(content) &&
                    !isCopyright(content) &&
                    !isFixedProfessionalTitle(content) &&
                    !isFixedCvText(content, page) &&
                    !isFixedFrontendText(content, page) &&
                    !isFixedBackendText(content, page) &&                    
                    !isFixedQaText(content, page)
                ) {
                    const item = {
                        page,
                        line: node.sourceCodeLocation?.startLine ?? '?',
                        tag: node.parentNode.tagName,
                        text: content
                    };

                    if (dynamicContent) {
                        dynamic.push(item);
                    } else {
                        findings.push(item);
                    }
                }

                return;
            }

            for (const child of node.childNodes || []) {
                visit(
                    child,
                    page,
                    translated,
                    dynamicContent,
                    excluded
                    
                );
            }
        }

        
        for (const page of pages) {
            const html = fs.readFileSync(
                path.join(ROOT, page),
                'utf8'
            );

            const document = parse5.parse(html, {
                sourceCodeLocationInfo: true
            });

            visit(document, page);
        }


        
        console.log(
            `I18N-004 | Componentes dinámicos: ${dynamic.length}`
        );

        console.log(
            `I18N-004 | Textos para revisión: ${findings.length}`
        );

        for (const item of findings) {
            console.log(
                `REVISAR | ${item.page}:${item.line} | ` +
                `<${item.tag}> | ${item.text}`
            );
        }

        for (const item of dynamic) {
            console.log(
                `DINÁMICO | ${item.page}:${item.line} | ` +
                `<${item.tag}> | ${item.text}`
            );
        }

        
        // Validación estricta de los textos detectados.
        // La prueba falla si encuentra candidatos
        // sin internacionalización reconocida.
        
        assert.equal(
            findings.length,
            0,
            '\nTextos HTML sin internacionalización reconocida:\n' +
            findings.map(item =>
                `${item.page}:${item.line} | ` +
                `<${item.tag}> | ${item.text}`
            ).join('\n')
        );


    }
);

test(
    'I18N-005 — Claves dinámicas de trazabilidad ES/EN/PT',
    () => {
        const translations = loadTranslations();

        const html = fs.readFileSync(
            path.join(ROOT, 'quality-management.html'),
            'utf8'
        );

        const startMarker = 'const qmTraceData = [';
        const endMarker = 'const qmTraceButtons =';

        const start = html.indexOf(startMarker);
        const end = html.indexOf(endMarker, start);

        assert.ok(
            start !== -1 && end > start,
            'No se encontró el bloque qmTraceData'
        );

        const source = html.slice(start, end);

        const context = {};

        vm.runInNewContext(
            source + '\nthis.traceData = qmTraceData;',
            context,
            { timeout: 5000 }
        );

        const traces = context.traceData;

        assert.ok(
            Array.isArray(traces),
            'qmTraceData no es un arreglo'
        );

        const requiredFields = [
            'titleKey',
            'requirementNameKey',
            'storyNameKey',
            'bddNameKey',
            'statusKey',
            'verificationKey'
        ];

        const errors = [];
        let checkedKeys = 0;

        for (const trace of traces) {
            for (const field of requiredFields) {
                const key = trace[field];

                if (
                    typeof key !== 'string' ||
                    !key.trim()
                ) {
                    errors.push(
                        `${trace.id} | Falta ${field}`
                    );
                    continue;
                }

                checkedKeys++;

                for (const language of LANGUAGES) {
                    const dictionary =
                        translations[language];

                    if (
                        !dictionary ||
                        !isValidTranslation(dictionary[key])
                    ) {
                        errors.push(
                            `${trace.id} | ${language} | ` +
                            `Clave faltante o inválida: ${key}`
                        );
                    }
                }
            }
        }

        // Traducción utilizada cuando no hay pruebas.
        const pendingKey = 'qmTracePendingVerification';

        for (const language of LANGUAGES) {
            if (
                !isValidTranslation(
                    translations[language]?.[pendingKey]
                )
            ) {
                errors.push(
                    `${language} | Clave faltante: ${pendingKey}`
                );
            }
        }

        console.log(
            `I18N-005 | Recorridos: ${traces.length}`
        );

        console.log(
            `I18N-005 | Claves de recorridos: ${checkedKeys}`
        );

        console.log(
            `I18N-005 | Incidencias: ${errors.length}`
        );

        assert.equal(
            traces.length,
            6,
            'Se esperaban 6 recorridos de trazabilidad'
        );

        assert.equal(
            errors.length,
            0,
            '\n' + errors.join('\n')
        );
    }
);

test(
    'I18N-006 — Claves dinámicas de gestión de defectos ES/EN/PT',
    () => {
        const translations = loadTranslations();

        const html = fs.readFileSync(
            path.join(ROOT, 'quality-management.html'),
            'utf8'
        );

        const errors = [];
        let checkedKeys = 0;

        function extractData(startMarker, endMarker, variable) {
            const start = html.indexOf(startMarker);
            const end = html.indexOf(endMarker, start);

            assert.ok(
                start !== -1 && end > start,
                `No se encontró ${variable}`
            );

            const source = html.slice(start, end);
            const context = {};

            vm.runInNewContext(
                source + `\nthis.data = ${variable};`,
                context,
                { timeout: 5000 }
            );

            return context.data;
        }

        function checkKey(key, context) {
            if (typeof key !== 'string' || !key.trim()) {
                errors.push(`${context} | Clave ausente`);
                return;
            }

            checkedKeys++;

            for (const language of LANGUAGES) {
                if (
                    !isValidTranslation(
                        translations[language]?.[key]
                    )
                ) {
                    errors.push(
                        `${context} | ${language} | ${key}`
                    );
                }
            }
        }

        const steps = extractData(
            'const qmDefectSteps = [',
            'const qmDefectStepButtons =',
            'qmDefectSteps'
        );

        assert.equal(
            steps.length,
            5,
            'Se esperaban cinco etapas'
        );

        steps.forEach((step, index) => {
            const context = `Etapa ${index + 1}`;

            checkKey(step.titleKey, `${context} | título`);
            checkKey(step.labelKey, `${context} | etiqueta`);
            checkKey(
                step.descriptionKey,
                `${context} | descripción`
            );

            if (
                !Array.isArray(step.activities) ||
                !Array.isArray(step.activityKeys) ||
                step.activities.length !== step.activityKeys.length
            ) {
                errors.push(
                    `${context} | Actividades y claves desalineadas`
                );
                return;
            }

            step.activityKeys.forEach((key, activityIndex) => {
                checkKey(
                    key,
                    `${context} | actividad ${activityIndex + 1}`
                );
            });
        });

        const bugs = extractData(
            'const qmBugs = [',
            'const qmBugButtons =',
            'qmBugs'
        );

        assert.equal(
            bugs.length,
            5,
            'Se esperaban cinco defectos'
        );

        const bugFields = [
            'titleKey',
            'descriptionKey',
            'severityKey',
            'priorityKey',
            'statusKey',
            'resolutionKey'
        ];

        bugs.forEach(bug => {
            bugFields.forEach(field => {
                checkKey(
                    bug[field],
                    `${bug.id} | ${field}`
                );
            });

            if (
                typeof bug.test === 'string' &&
                !/^(?:TC|API-TC|SEARCH-TC|UI)-\d+$/i.test(bug.test)
            ) {
                checkKey(
                    bug.testKey,
                    `${bug.id} | testKey`
                );
            }
        });

        checkKey(
            'qmDefectStepCodePrefix',
            'Prefijo de etapa'
        );

        checkKey(
            'qmDefectCounterOf',
            'Contador'
        );

        console.log(
            `I18N-006 | Etapas: ${steps.length}`
        );

        console.log(
            `I18N-006 | Defectos: ${bugs.length}`
        );

        console.log(
            `I18N-006 | Referencias verificadas: ${checkedKeys}`
        );

        console.log(
            `I18N-006 | Incidencias: ${errors.length}`
        );

        assert.equal(
            errors.length,
            0,
            '\n' + errors.join('\n')
        );
    }
);

