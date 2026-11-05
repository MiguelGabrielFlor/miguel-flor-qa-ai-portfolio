
/* =========================================
   BUSCADOR GLOBAL DEL PORTFOLIO
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const search = document.querySelector(".portfolio-search");
    if (!search) return;

    const input = search.querySelector(".portfolio-search-input");
    const results = search.querySelector(".portfolio-search-results");

    if (!input || !results) return;

    // Obtener el idioma activo del portfolio.
    function getSearchLanguage() {
        const language =
            document.documentElement.lang ||
            localStorage.getItem("portfolioLanguage") ||
            "es";

        return ["es", "en", "pt"].includes(language)
            ? language
            : "es";
    }

    // Índice de páginas y secciones reales.
    const searchIndex = [
        {
            title: "Inicio",
            description: "Presentación del Portfolio QA & AI",

            translations: {
                es: {
                    title: "Inicio",
                    description: "Presentación del Portfolio QA & AI"
                },
                en: {
                    title: "Home",
                    description: "Introduction to the QA & AI Portfolio"
                },
                pt: {
                    title: "Início",
                    description: "Apresentação do Portfólio QA & AI"
                }
            },

            keywords: "home inicio portfolio perfil",
            url: "index.html#home"
        },
        {
            title: "Sobre mí",
            description: "Perfil y trayectoria profesional",

            translations: {
                es: {
                    title: "Sobre mí",
                    description: "Perfil y trayectoria profesional"
                },
                en: {
                    title: "About me",
                    description: "Professional profile and career background"
                },
                pt: {
                    title: "Sobre mim",
                    description: "Perfil e trajetória profissional"
                }
            },

            keywords: "experiencia perfil trayectoria",
            url: "index.html#about"
        },        
        {
            title: "Especialidades",
            description: "QA Testing e inteligencia artificial",

            translations: {
                es: {
                    title: "Especialidades",
                    description: "QA Testing e inteligencia artificial"
                },
                en: {
                    title: "Specialties",
                    description: "QA Testing and artificial intelligence"
                },
                pt: {
                    title: "Especialidades",
                    description: "QA Testing e inteligência artificial"
                }
            },

            keywords: "qa inteligencia artificial ai testing",
            url: "index.html#specialties"
        },
        {
            title: "Proyectos",
            description: "Desarrollo y aplicaciones prácticas",

            translations: {
                es: {
                    title: "Proyectos",
                    description: "Desarrollo y aplicaciones prácticas"
                },
                en: {
                    title: "Projects",
                    description: "Development and practical applications"
                },
                pt: {
                    title: "Projetos",
                    description: "Desenvolvimento e aplicações práticas"
                }
            },

            keywords: "proyectos desarrollo portfolio",
            url: "index.html#projects"
        },
        {
            title: "Contacto",
            description: "Formulario y vías de comunicación",

            translations: {
                es: {
                    title: "Contacto",
                    description: "Formulario y vías de comunicación"
                },
                en: {
                    title: "Contact",
                    description: "Contact form and communication channels"
                },
                pt: {
                    title: "Contato",
                    description: "Formulário e canais de comunicação"
                }
            },

            keywords: "contacto mensaje email",
            url: "index.html#contact"
        },        
        {
            title: "Currículum y trayectoria",
            description: "Experiencia laboral y formación",

            translations: {
                es: {
                    title: "Currículum y trayectoria",
                    description: "Experiencia laboral y formación"
                },
                en: {
                    title: "Resume and career",
                    description: "Professional experience and education"
                },
                pt: {
                    title: "Currículo e trajetória",
                    description: "Experiência profissional e formação"
                }
            },

            keywords: "cv curriculum experiencia educación formación",
            url: "cv.html"
        },
        {
            title: "Backend · APIs y datos",
            description: "Endpoints, validaciones y persistencia SQLite",

            translations: {
                es: {
                    title: "Backend · APIs y datos",
                    description: "Endpoints, validaciones y persistencia SQLite"
                },
                en: {
                    title: "Backend · APIs and data",
                    description: "Endpoints, validation and SQLite persistence"
                },
                pt: {
                    title: "Backend · APIs e dados",
                    description: "Endpoints, validações e persistência SQLite"
                }
            },

            keywords: "backend api express node sqlite base de datos",
            url: "backend.html"
        },
        {
            title: "QA · Evidencia verificable",
            description: "Casos de prueba, automatización y defectos",

            translations: {
                es: {
                    title: "QA · Evidencia verificable",
                    description: "Casos de prueba, automatización y defectos"
                },
                en: {
                    title: "QA · Verifiable evidence",
                    description: "Test cases, automation and defects"
                },
                pt: {
                    title: "QA · Evidências verificáveis",
                    description: "Casos de teste, automação e defeitos"
                }
            },

            keywords: "qa testing selenium pruebas bugs evidencia",
            url: "qa.html"
        },        
        {
            title: "Casos de prueba",
            description: "Biblioteca de casos funcionales",

            translations: {
                es: {
                    title: "Casos de prueba",
                    description: "Biblioteca de casos funcionales"
                },
                en: {
                    title: "Test cases",
                    description: "Library of functional test cases"
                },
                pt: {
                    title: "Casos de teste",
                    description: "Biblioteca de casos de teste funcionais"
                }
            },

            keywords: "tc casos funcionales validaciones",
            url: "qa.html#casos-prueba"
        },
        {
            title: "Automatización con Selenium",
            description: "Pruebas automatizadas de interfaz",

            translations: {
                es: {
                    title: "Automatización con Selenium",
                    description: "Pruebas automatizadas de interfaz"
                },
                en: {
                    title: "Selenium automation",
                    description: "Automated user interface testing"
                },
                pt: {
                    title: "Automação com Selenium",
                    description: "Testes automatizados de interface"
                }
            },

            keywords: "selenium webdriver automatización ui",
            url: "qa.html#automatizacion"
        },
        {
            title: "Gestión de calidad",
            description: "Requisitos, historias, BDD y trazabilidad",

            translations: {
                es: {
                    title: "Gestión de calidad",
                    description: "Requisitos, historias, BDD y trazabilidad"
                },
                en: {
                    title: "Quality management",
                    description: "Requirements, user stories, BDD and traceability"
                },
                pt: {
                    title: "Gestão da qualidade",
                    description: "Requisitos, histórias de usuário, BDD e rastreabilidade"
                }
            },

            keywords: "quality management requisitos scrum bdd",
            url: "quality-management.html"
        },        
        {
            title: "Gestión de defectos",
            description: "Seguimiento y resolución de defectos",

            translations: {
                es: {
                    title: "Gestión de defectos",
                    description: "Seguimiento y resolución de defectos"
                },
                en: {
                    title: "Defect management",
                    description: "Defect tracking and resolution"
                },
                pt: {
                    title: "Gestão de defeitos",
                    description: "Acompanhamento e resolução de defeitos"
                }
            },

            keywords: "bugs defectos incidencias",
            url: "quality-management.html#defectos"
        },
        {
            title: "Backlog y riesgos",
            description: "Prioridades y planificación de mejoras",

            translations: {
                es: {
                    title: "Backlog y riesgos",
                    description: "Prioridades y planificación de mejoras"
                },
                en: {
                    title: "Backlog and risks",
                    description: "Priorities and improvement planning"
                },
                pt: {
                    title: "Backlog e riscos",
                    description: "Prioridades e planejamento de melhorias"
                }
            },

            keywords: "backlog riesgos prioridades",
            url: "quality-management.html#backlog"
        },
        {
            title: "Resultados y cierre de la épica",
            description: "Evaluación y evidencia de aceptación",

            translations: {
                es: {
                    title: "Resultados y cierre de la épica",
                    description: "Evaluación y evidencia de aceptación"
                },
                en: {
                    title: "Epic results and closure",
                    description: "Evaluation and acceptance evidence"
                },
                pt: {
                    title: "Resultados e encerramento da épica",
                    description: "Avaliação e evidências de aceitação"
                }
            },

            keywords: "resultados cierre epica cierre de epica aceptación",
            url: "quality-management.html#cierre-epica"
        },        
        {
            title: "Formación y desarrollo",
            description: "Estudios, cursos y certificaciones profesionales",

            translations: {
                es: {
                    title: "Formación y desarrollo",
                    description: "Estudios, cursos y certificaciones profesionales"
                },
                en: {
                    title: "Education and development",
                    description: "Education, courses and professional certifications"
                },
                pt: {
                    title: "Formação e desenvolvimento",
                    description: "Estudos, cursos e certificações profissionais"
                }
            },

            keywords: "formacion educacion estudios certificados cursos",
            url: "cv.html#education"
        },
        {
            title: "Trayectoria profesional",
            description: "Experiencia laboral y evolución profesional",

            translations: {
                es: {
                    title: "Trayectoria profesional",
                    description: "Experiencia laboral y evolución profesional"
                },
                en: {
                    title: "Professional career",
                    description: "Work experience and professional development"
                },
                pt: {
                    title: "Trajetória profissional",
                    description: "Experiência de trabalho e evolução profissional"
                }
            },

            keywords: "experiencia laboral trabajos trayectoria cv",
            url: "cv.html#experience"
        },
        {
            title: "Regresión y bugs",
            description: "Defectos detectados, corregidos y verificados",

            translations: {
                es: {
                    title: "Regresión y bugs",
                    description: "Defectos detectados, corregidos y verificados"
                },
                en: {
                    title: "Regression and bugs",
                    description: "Detected, fixed and verified defects"
                },
                pt: {
                    title: "Regressão e bugs",
                    description: "Defeitos identificados, corrigidos e verificados"
                }
            },

            keywords: "regresion bugs defectos correcciones",
            url: "qa.html#regresion-bugs"
        },        
        {
            title: "Evidencia verificable",
            description: "Documentación y resultados de las pruebas",

            translations: {
                es: {
                    title: "Evidencia verificable",
                    description: "Documentación y resultados de las pruebas"
                },
                en: {
                    title: "Verifiable evidence",
                    description: "Test documentation and results"
                },
                pt: {
                    title: "Evidências verificáveis",
                    description: "Documentação e resultados dos testes"
                }
            },

            keywords: "evidencia reportes documentacion resultados qa",
            url: "qa.html#evidencia"
        },
        {
            title: "Arquitectura de la API",
            description: "Endpoints implementados con Node.js y Express",

            translations: {
                es: {
                    title: "Arquitectura de la API",
                    description: "Endpoints implementados con Node.js y Express"
                },
                en: {
                    title: "API architecture",
                    description: "Endpoints implemented with Node.js and Express"
                },
                pt: {
                    title: "Arquitetura da API",
                    description: "Endpoints implementados com Node.js e Express"
                }
            },

            keywords: "arquitectura api endpoints node express",
            url: "backend.html#arquitectura"
        },
        {
            title: "Validaciones y reglas",
            description: "Verificación de datos y respuestas HTTP",

            translations: {
                es: {
                    title: "Validaciones y reglas",
                    description: "Verificación de datos y respuestas HTTP"
                },
                en: {
                    title: "Validations and rules",
                    description: "Data validation and HTTP responses"
                },
                pt: {
                    title: "Validações e regras",
                    description: "Validação de dados e respostas HTTP"
                }
            },

            keywords: "validaciones reglas errores http backend",
            url: "backend.html#validaciones"
        },        
        {
            title: "Persistencia de datos",
            description: "Operaciones y restricciones en SQLite",

            translations: {
                es: {
                    title: "Persistencia de datos",
                    description: "Operaciones y restricciones en SQLite"
                },
                en: {
                    title: "Data persistence",
                    description: "Operations and constraints in SQLite"
                },
                pt: {
                    title: "Persistência de dados",
                    description: "Operações e restrições no SQLite"
                }
            },

            keywords: "persistencia sqlite base datos registros",
            url: "backend.html#persistencia"
        },
        {
            title: "Pruebas automatizadas de API",
            description: "Escenarios y resultados de pruebas del backend",

            translations: {
                es: {
                    title: "Pruebas automatizadas de API",
                    description: "Escenarios y resultados de pruebas del backend"
                },
                en: {
                    title: "Automated API testing",
                    description: "Backend test scenarios and results"
                },
                pt: {
                    title: "Testes automatizados de API",
                    description: "Cenários e resultados dos testes de backend"
                }
            },

            keywords: "api automatizacion pruebas backend node",
            url: "backend.html#pruebas-api"
        },
        {
            title: "Definición y alcance",
            description: "Épica principal y objetivos del proyecto",

            translations: {
                es: {
                    title: "Definición y alcance",
                    description: "Épica principal y objetivos del proyecto"
                },
                en: {
                    title: "Definition and scope",
                    description: "Main epic and project objectives"
                },
                pt: {
                    title: "Definição e escopo",
                    description: "Épica principal e objetivos do projeto"
                }
            },

            keywords: "epica alcance objetivos gestion calidad",
            url: "quality-management.html#epica"
        },
        {
            title: "Requisitos",
            description: "Requisitos funcionales y no funcionales",

            translations: {
                es: {
                    title: "Requisitos",
                    description: "Requisitos funcionales y no funcionales"
                },
                en: {
                    title: "Requirements",
                    description: "Functional and non-functional requirements"
                },
                pt: {
                    title: "Requisitos",
                    description: "Requisitos funcionais e não funcionais"
                }
            },

            keywords: "requisitos funcionales no funcionales rf rnf",
            url: "quality-management.html#requisitos"
        },
        {
            title: "Historias de usuario",
            description: "Necesidades y criterios de aceptación",

            translations: {
                es: {
                    title: "Historias de usuario",
                    description: "Necesidades y criterios de aceptación"
                },
                en: {
                    title: "User stories",
                    description: "User needs and acceptance criteria"
                },
                pt: {
                    title: "Histórias de usuário",
                    description: "Necessidades e critérios de aceitação"
                }
            },

            keywords: "historias usuario criterios aceptacion",
            url: "quality-management.html#historias"
        },
        {
            title: "Escenarios BDD",
            description: "Comportamientos definidos y verificables",

            translations: {
                es: {
                    title: "Escenarios BDD",
                    description: "Comportamientos definidos y verificables"
                },
                en: {
                    title: "BDD scenarios",
                    description: "Defined and verifiable behaviors"
                },
                pt: {
                    title: "Cenários BDD",
                    description: "Comportamentos definidos e verificáveis"
                }
            },

            keywords: "bdd gherkin escenarios comportamiento",
            url: "quality-management.html#bdd"
        },
        {
            title: "Trazabilidad",
            description: "Relaciones entre requisitos y artefactos QA",

            translations: {
                es: {
                    title: "Trazabilidad",
                    description: "Relaciones entre requisitos y artefactos QA"
                },
                en: {
                    title: "Traceability",
                    description: "Relationships between requirements and QA artifacts"
                },
                pt: {
                    title: "Rastreabilidade",
                    description: "Relações entre requisitos e artefatos de QA"
                }
            },

            keywords: "trazabilidad matriz requisitos pruebas",
            url: "quality-management.html#trazabilidad"
        },
        {
            title: "Sprints y evolución",
            description: "Ciclos de trabajo y mejoras del proyecto",

            translations: {
                es: {
                    title: "Sprints y evolución",
                    description: "Ciclos de trabajo y mejoras del proyecto"
                },
                en: {
                    title: "Sprints and evolution",
                    description: "Work cycles and project improvements"
                },
                pt: {
                    title: "Sprints e evolução",
                    description: "Ciclos de trabalho e melhorias do projeto"
                }
            },

            keywords: "sprints scrum iteraciones evolucion",
            url: "quality-management.html#sprints"
        },
        {
            title: "Frontend · Interfaz bajo prueba",
            description: "Estructura, validaciones e internacionalización",

            translations: {
                es: {
                    title: "Frontend · Interfaz bajo prueba",
                    description: "Estructura, validaciones e internacionalización"
                },
                en: {
                    title: "Frontend · Interface under test",
                    description: "Structure, validations and internationalization"
                },
                pt: {
                    title: "Frontend · Interface em teste",
                    description: "Estrutura, validações e internacionalização"
                }
            },

            keywords: "frontend html css javascript interfaz",
            url: "frontend.html"
        },
        {
            title: "Estructura HTML",
            description: "Organización de la interfaz del portfolio",

            translations: {
                es: {
                    title: "Estructura HTML",
                    description: "Organización de la interfaz del portfolio"
                },
                en: {
                    title: "HTML structure",
                    description: "Organization of the portfolio interface"
                },
                pt: {
                    title: "Estrutura HTML",
                    description: "Organização da interface do portfólio"
                }
            },

            keywords: "estructura html frontend semantica",
            url: "frontend.html#estructura-html"
        },
        {
            title: "Validación y estilos",
            description: "Validaciones de formularios y estados visuales",

            translations: {
                es: {
                    title: "Validación y estilos",
                    description: "Validaciones de formularios y estados visuales"
                },
                en: {
                    title: "Validation and styles",
                    description: "Form validations and visual states"
                },
                pt: {
                    title: "Validação e estilos",
                    description: "Validações de formulários e estados visuais"
                }
            },

            keywords: "validacion estilos css formularios errores",
            url: "frontend.html#validacion"
        },
        {
            title: "Internacionalización",
            description: "Idiomas español, inglés y portugués",

            translations: {
                es: {
                    title: "Internacionalización",
                    description: "Idiomas español, inglés y portugués"
                },
                en: {
                    title: "Internationalization",
                    description: "Spanish, English and Portuguese languages"
                },
                pt: {
                    title: "Internacionalização",
                    description: "Idiomas espanhol, inglês e português"
                }
            },

            keywords: "internacionalizacion idiomas traducciones i18n",
            url: "frontend.html#internacionalizacion"
        },
        {
            title: "Selector de idioma",
            description: "Cambiar el idioma del portfolio: Español, English o Português",

            translations: {
                es: {
                    title: "Selector de idioma",
                    description: "Cambiar el idioma del portfolio: Español, English o Português"
                },
                en: {
                    title: "Language selector",
                    description: "Change the portfolio language: Español, English or Português"
                },
                pt: {
                    title: "Seletor de idioma",
                    description: "Alterar o idioma do portfólio: Español, English ou Português"
                }
            },

            keywords: "idioma language idioma selector traduccion translation traducao",
            url: "index.html#footerLanguageSelect"
        },
        {
            title: "Pruebas automatizadas de Frontend",
            description: "Escenarios y pruebas Selenium",

            translations: {
                es: {
                    title: "Pruebas automatizadas de Frontend",
                    description: "Escenarios y pruebas Selenium"
                },
                en: {
                    title: "Automated Frontend Testing",
                    description: "Selenium test scenarios and tests"
                },
                pt: {
                    title: "Testes automatizados de Frontend",
                    description: "Cenários e testes com Selenium"
                }
            },

            keywords: "frontend automatizacion selenium webdriver",
            url: "frontend.html#pruebas-automatizadas"
        },
        {
            title: "LinkedIn",
            description: "Tarjeta de LinkedIn en el portfolio",

            translations: {
                es: {
                    title: "LinkedIn",
                    description: "Tarjeta de LinkedIn en el portfolio"
                },
                en: {
                    title: "LinkedIn",
                    description: "LinkedIn card in the portfolio"
                },
                pt: {
                    title: "LinkedIn",
                    description: "Cartão do LinkedIn no portfólio"
                }
            },

            keywords: "linkedin perfil profesional red profesional empleo contactos",
            url: "index.html#linkedin"
        },        
        {
            title: "GitHub",
            description: "Tarjeta de GitHub en el portfolio",

            translations: {
                es: {
                    title: "GitHub",
                    description: "Tarjeta de GitHub en el portfolio"
                },
                en: {
                    title: "GitHub",
                    description: "GitHub card in the portfolio"
                },
                pt: {
                    title: "GitHub",
                    description: "Cartão do GitHub no portfólio"
                }
            },

            keywords: "github repositorio repositorios codigo fuente proyectos git desarrollo",
            url: "index.html#github"
        }

    ];
    
    /* =========================================
    PALABRAS CLAVE AMPLIADAS
    ========================================= */

    const searchKeywords = {
        
        // HOME
        "index.html#home": [
            "inicio", "bienvenida", "presentación",
            "portfolio profesional", "portafolio",
            "miguel flor", "qa tester", "ai consultant",
            "consultor ia", "perfil profesional",

            // Inglés
            "home", "welcome", "introduction",
            "professional portfolio", "professional profile",
            "ai consultant",

            // Portugués
            "início", "boas-vindas", "apresentação",
            "portfólio profissional", "perfil profissional",
            "consultor de ia"
        ],

        "index.html#about": [
            "sobre mí", "biografía", "experiencia",
            "perfil", "trayectoria", "competencias",
            "habilidades", "freelance", "trabajo",
            "búsqueda laboral", "empleo",

            // Inglés
            "about me", "biography", "experience",
            "skills", "abilities", "career",
            "work experience", "job search", "employment",

            // Portugués
            "sobre mim", "biografia", "experiência",
            "perfil", "trajetória", "competências",
            "habilidades", "trabalho",
            "experiência profissional", "emprego"
        ],

        "index.html#specialties": [
            "especialidades", "qa", "testing",
            "inteligencia artificial", "ia",
            "automatización", "consultoría",
            "calidad de software", "tecnología",

            // Inglés
            "specialties", "specializations",
            "artificial intelligence", "ai",
            "automation", "consulting",
            "software quality", "technology",

            // Portugués
            "especialidades", "inteligência artificial",
            "automação", "consultoria",
            "qualidade de software", "tecnologia"
        ],

        "index.html#projects": [
            "proyectos", "portfolio testing",
            "desarrollo tecnológico",
            "aplicaciones prácticas",
            "proyectos qa", "proyectos ia",

            // Inglés
            "projects", "portfolio projects",
            "technology development",
            "practical applications",
            "qa projects", "ai projects",
            "software projects",

            // Portugués
            "projetos", "projetos do portfólio",
            "desenvolvimento tecnológico",
            "aplicações práticas",
            "projetos de qa", "projetos de ia",
            "projetos de software"
        ],

        "index.html#contact": [
            "contacto", "mensaje", "correo",
            "email", "formulario", "consultas",
            "comunicación",

            // Inglés
            "contact", "contact me", "message",
            "email address", "contact form",
            "inquiries", "communication",
            "get in touch",

            // Portugués
            "contato", "contacto", "mensagem",
            "correio eletrônico", "formulário",
            "consultas", "comunicação",
            "entre em contato"
        ],

        "index.html#footerLanguageSelect": [
            "idioma", "idiomas", "selector de idioma",
            "cambiar idioma", "cambio de idioma",
            "español", "espanol", "castellano",
            "inglés", "ingles", "english",
            "portugués", "portugues", "português",
            "language", "change language",
            "language selector", "languages",
            "traducción", "traduccion",
            "translation", "translate",
            "tradução", "traducao",
            "i18n", "multilingüe", "multilingual",

            // Inglés
            "select language", "switch language",
            "language settings", "language options",
            "multilingual support",

            // Portugués
            "seletor de idioma", "selecionar idioma",
            "alterar idioma", "mudar idioma",
            "troca de idioma", "opções de idioma",
            "suporte multilíngue"
        ],

        // CV Y FORMACIÓN
        "cv.html": [
            "curriculum", "currículum vitae", "cv",
            "experiencia laboral", "trayectoria",
            "historial profesional", "formación",
            "certificados", "credenciales",

            // Inglés
            "resume", "résumé", "professional resume",
            "work experience", "career history",
            "professional background",
            "education", "certificates", "credentials",

            // Portugués
            "currículo", "currículo profissional",
            "experiência profissional", "trajetória",
            "histórico profissional", "formação",
            "certificados", "credenciais"
        ],

        "cv.html#experience": [
            "experiencia", "empleos", "trabajos",
            "trayectoria profesional", "freelance",
            "senza", "selema", "divino",
            "presta cash ya", "acc group",
            "ventas", "gestión comercial",
            "atención al cliente", "negocios",

            // Inglés
            "experience", "employment", "jobs",
            "professional career", "work history",
            "sales", "commercial management",
            "customer service", "business",

            // Portugués
            "experiência", "empregos", "trabalhos",
            "trajetória profissional",
            "histórico de trabalho", "vendas",
            "gestão comercial",
            "atendimento ao cliente", "negócios"
        ],

        "cv.html#education": [
            // Formación general
            "educación", "estudios", "formación",
            "certificados", "certificaciones",
            "credenciales", "diplomas", "cursos",
            "capacitación", "aprendizaje",
            "desarrollo profesional",

            // QA
            "qa manager", "tester manual",
            "tester experto", "análisis funcional",
            "casos de prueba", "selenium",
            "api testing", "postman", "sql",
            "java", "devops",

            // Inteligencia artificial
            "inteligencia artificial", "ia",
            "agentes", "agentes ia", "ai agents",
            "automatización con ia",
            "microsoft copilot studio",
            "copilot", "azure", "ai-901",
            "ai-103", "pl-7008",
            "python para agentes",
            "machine learning", "ml",
            "google ai studio", "antigravity",
            "claude", "n8n", "vibe coding",
            "data analytics",

            // Marketing
            "marketing", "marketing digital",
            "growth marketing", "coderhouse",
            "power bi", "ux", "experiencia de usuario",

            // Gestión y negocios
            "project management", "pmbok",
            "scrum", "liderazgo", "negociación",
            "gestión de proyectos", "design thinking",
            "presupuesto digital",
            "gestión del tiempo",
            "presentaciones",

            // Formación técnica
            "técnico mecánico electricista",
            "epet 9", "bases de datos",
            "programación orientada a objetos",
            "poo", "python",

            // Inglés
            "education", "training", "certifications",
            "professional development",
            "learning", "courses", "diplomas",
            "manual testing", "functional analysis",
            "test cases", "artificial intelligence",
            "ai automation", "ai agents",
            "user experience", "leadership",
            "negotiation", "project management",
            "time management", "databases",
            "object oriented programming",
            "electromechanical technician",

            // Portugués
            "educação", "formação profissional",
            "certificações", "capacitação",
            "aprendizagem", "desenvolvimento profissional",
            "testes manuais", "análise funcional",
            "casos de teste", "inteligência artificial",
            "agentes de ia", "automação com ia",
            "experiência do usuário", "liderança",
            "negociação", "gestão de projetos",
            "gestão do tempo", "bancos de dados",
            "programação orientada a objetos",
            "técnico mecânico eletricista"
        ],

        // FRONTEND
        "frontend.html": [
            "frontend", "front end", "interfaz",
            "html", "css", "javascript",
            "dom", "responsive", "accesibilidad",
            "formularios", "validaciones",
            "internacionalización", "i18n",

            // Inglés
            "user interface", "web interface",
            "accessibility", "responsive design",
            "forms", "form validation",
            "internationalization",
            "frontend development",

            // Portugués
            "interface", "interface web",
            "acessibilidade", "design responsivo",
            "formulários", "validações",
            "validação de formulários",
            "internacionalização",
            "desenvolvimento frontend"
        ],

        "frontend.html#estructura-html": [
            "html5", "estructura html", "semántica",
            "etiquetas", "elementos", "documento",
            "interfaz web",

            // Inglés
            "html structure", "semantic html",
            "html tags", "html elements",
            "document structure",
            "web page structure",
            "semantic markup",

            // Portugués
            "estrutura html", "semântica",
            "html semântico", "etiquetas html",
            "elementos html", "documento",
            "estrutura da página",
            "marcação semântica"
        ],

        "frontend.html#validacion": [
            "validación", "formularios", "nombre",
            "apellido", "email", "teléfono",
            "consentimiento", "errores",
            "estados visuales", "css",
            "validación de campos",

            // Inglés
            "validation", "form validation",
            "first name", "last name",
            "phone number", "consent",
            "validation errors",
            "visual states", "field validation",
            "input validation",

            // Portugués
            "validação", "formulários",
            "nome", "sobrenome",
            "telefone", "consentimento",
            "erros de validação",
            "estados visuais",
            "validação de campos",
            "validação de formulários"
        ],

        "frontend.html#internacionalizacion": [
            "idiomas", "traducciones", "i18n",
            "internacionalización", "español",
            "inglés", "portugués", "multidioma",
            "selector de idioma",

            // Inglés
            "internationalization", "localization",
            "languages", "translations",
            "multilingual", "language support",
            "spanish", "english", "portuguese",
            "language switching",

            // Portugués
            "internacionalização", "localização",
            "idiomas", "traduções",
            "multilíngue", "suporte a idiomas",
            "espanhol", "inglês", "português",
            "alternância de idioma"
        ],

        "frontend.html#pruebas-automatizadas": [
            "selenium", "webdriver",
            "automatización frontend",
            "pruebas ui", "chrome",
            "firefox", "edge", "regresión",

            // Inglés
            "frontend automation",
            "automated frontend testing",
            "automated ui tests",
            "browser automation",
            "regression testing",
            "selenium tests",
            "user interface testing",

            // Portugués
            "automação frontend",
            "testes automatizados de frontend",
            "testes de interface",
            "automação de navegadores",
            "testes de regressão",
            "testes com selenium",
            "testes de interface do usuário"
        ],

        // BACKEND
        "backend.html": [
            "backend", "back end", "node",
            "node.js", "express", "javascript",
            "api", "api rest", "servidor",
            "sqlite", "base de datos",
            "persistencia", "smtp",

            // Inglés
            "server", "server side",
            "backend development",
            "rest api", "database",
            "data persistence",
            "server architecture",
            "backend services",

            // Portugués
            "servidor", "lado do servidor",
            "desenvolvimento backend",
            "api rest", "banco de dados",
            "persistência de dados",
            "arquitetura do servidor",
            "serviços backend"
        ],

        "backend.html#arquitectura": [
            "arquitectura", "endpoints",
            "api health", "api visitors",
            "api contact", "get", "post",
            "express", "node.js",
            "health check", "servicios",

            // Inglés
            "api architecture", "backend architecture",
            "api endpoints", "rest endpoints",
            "server architecture", "services",
            "health endpoint", "visitor endpoint",
            "contact endpoint",

            // Portugués
            "arquitetura da api", "arquitetura backend",
            "endpoints da api", "serviços",
            "arquitetura do servidor",
            "verificação de integridade",
            "endpoint de visitantes",
            "endpoint de contato"
        ],

        "backend.html#validaciones": [
            "validadores", "validaciones",
            "nombre", "apellido", "email",
            "teléfono", "consentimiento",
            "http 400", "http 503",
            "errores", "datos inválidos",
            "reglas de negocio",

            // Inglés
            "validators", "validations",
            "first name", "last name",
            "phone number", "consent",
            "validation errors", "invalid data",
            "business rules", "http responses",
            "request validation",

            // Portugués
            "validadores", "validações",
            "nome", "sobrenome", "telefone",
            "consentimento", "erros",
            "dados inválidos",
            "regras de negócio",
            "respostas http",
            "validação de requisições"
        ],

        "backend.html#persistencia": [
            "sqlite", "sql", "base de datos",
            "registro de visitantes",
            "inserción", "tabla visitors",
            "restricciones", "consentimiento",
            "integridad de datos",

            // Inglés
            "data persistence", "database",
            "visitor registration",
            "data insertion", "visitors table",
            "database constraints",
            "data integrity", "stored records",
            "sqlite database",

            // Portugués
            "persistência de dados",
            "banco de dados",
            "registro de visitantes",
            "inserção de dados",
            "tabela visitors",
            "restrições do banco de dados",
            "integridade dos dados",
            "registros armazenados",
            "banco de dados sqlite"
        ],

        "backend.html#pruebas-api": [
            "pruebas api", "api testing",
            "postman", "node test",
            "test runner", "http",
            "status code", "201", "400",
            "500", "503", "smtp",
            "automatización backend",

            // Inglés
            "automated api testing",
            "backend testing",
            "api test cases",
            "api test results",
            "http status codes",
            "automated backend tests",
            "endpoint testing",
            "api test automation",

            // Portugués
            "testes de api",
            "testes automatizados de api",
            "testes de backend",
            "casos de teste de api",
            "resultados dos testes",
            "códigos de status http",
            "automação de testes backend",
            "testes de endpoints"
        ],

        // QA
        "qa.html": [
            "qa", "quality assurance",
            "testing", "calidad",
            "evidencias", "casos de prueba",
            "automatización", "selenium",
            "bugs", "defectos", "regresión",

            // Inglés
            "software quality",
            "quality assurance testing",
            "test evidence",
            "test cases",
            "test automation",
            "software testing",
            "regression testing",
            "defect tracking",

            // Portugués
            "garantia da qualidade",
            "qualidade de software",
            "testes de software",
            "evidências de teste",
            "casos de teste",
            "automação de testes",
            "testes de regressão",
            "rastreamento de defeitos"
        ],

        "qa.html#casos-prueba": [
            "tc-001", "tc-018",
            "casos de prueba", "test cases",
            "pruebas funcionales",
            "pruebas negativas",
            "pruebas positivas",
            "resultados esperados",
            "precondiciones", "prioridad",

            // Inglés
            "functional test cases",
            "functional testing",
            "negative testing",
            "positive testing",
            "expected results",
            "preconditions",
            "test priority",
            "test scenarios",

            // Portugués
            "casos de teste",
            "casos de teste funcionais",
            "testes funcionais",
            "testes negativos",
            "testes positivos",
            "resultados esperados",
            "pré-condições",
            "prioridade dos testes",
            "cenários de teste"
        ],

        "qa.html#automatizacion": [
            "selenium", "webdriver",
            "node test runner",
            "pruebas automatizadas",
            "ui testing", "chrome",
            "firefox", "edge",
            "automatización qa",

            // Inglés
            "selenium automation",
            "automated testing",
            "test automation",
            "automated ui testing",
            "browser testing",
            "browser automation",
            "selenium webdriver",
            "automated test execution",

            // Portugués
            "automação com selenium",
            "testes automatizados",
            "automação de testes",
            "testes automatizados de interface",
            "testes em navegadores",
            "automação de navegadores",
            "execução automatizada de testes"
        ],

        "qa.html#regresion-bugs": [
            "regresión", "bugs", "defectos",
            "bug-001", "bug-002",
            "bug-003", "bug-004",
            "bug-005", "retest",
            "correcciones", "incidencias",

            // Inglés
            "regression testing",
            "bug tracking",
            "software defects",
            "bug fixes",
            "defect verification",
            "retesting",
            "resolved bugs",
            "regression tests",

            // Portugués
            "testes de regressão",
            "rastreamento de bugs",
            "defeitos de software",
            "correções de bugs",
            "verificação de defeitos",
            "reteste",
            "bugs corrigidos",
            "testes de regressão"
        ],

        "qa.html#evidencia": [
            "evidencias", "reportes",
            "test report", "test plan",
            "bug reports", "documentación",
            "capturas", "resultados",
            "trazabilidad",

            // Inglés
            "test evidence",
            "verifiable evidence",
            "test documentation",
            "test results",
            "test execution report",
            "test screenshots",
            "traceability",
            "quality assurance reports",

            // Portugués
            "evidências de teste",
            "evidências verificáveis",
            "documentação de testes",
            "resultados dos testes",
            "relatório de execução",
            "capturas de tela",
            "rastreabilidade",
            "relatórios de qualidade"
        ],
        
        // GESTIÓN DE CALIDAD
        "quality-management.html": [
            "quality management", "gestión de calidad",
            "qa management", "planificación",
            "requisitos", "historias",
            "bdd", "trazabilidad", "sprints",
            "backlog", "defectos",

            // Inglés
            "quality planning",
            "quality assurance management",
            "requirements management",
            "user story management",
            "quality processes",
            "software quality management",
            "defect management",
            "project quality",

            // Portugués
            "gestão da qualidade",
            "gestão de qa",
            "planejamento da qualidade",
            "gestão de requisitos",
            "gestão de histórias de usuário",
            "processos de qualidade",
            "qualidade de software",
            "gestão de defeitos",
            "qualidade do projeto"
        ],

        "quality-management.html#epica": [
            "épica", "epic", "alcance",
            "objetivos", "definición",
            "criterios", "proyecto",

            // Inglés
            "epic definition",
            "project scope",
            "project objectives",
            "scope definition",
            "acceptance criteria",
            "project goals",
            "main epic",

            // Portugués
            "épica", "definição da épica",
            "escopo do projeto",
            "objetivos do projeto",
            "definição de escopo",
            "critérios de aceitação",
            "metas do projeto",
            "épica principal"
        ],

        "quality-management.html#requisitos": [
            "requisitos", "rf", "rnf",
            "funcionales", "no funcionales",
            "especificaciones", "necesidades",

            // Inglés
            "requirements",
            "functional requirements",
            "non-functional requirements",
            "requirement specifications",
            "software requirements",
            "business requirements",
            "system requirements",

            // Portugués
            "requisitos funcionais",
            "requisitos não funcionais",
            "especificações",
            "necessidades",
            "requisitos de software",
            "requisitos de negócio",
            "requisitos do sistema"
        ],

        "quality-management.html#historias": [
            "historias de usuario",
            "user stories", "hu-001",
            "criterios de aceptación",
            "necesidades", "funcionalidades",

            // Inglés
            "user story",
            "user requirements",
            "acceptance criteria",
            "user needs",
            "software features",
            "functional specifications",
            "story acceptance",

            // Portugués
            "histórias de usuário",
            "história de usuário",
            "requisitos do usuário",
            "critérios de aceitação",
            "necessidades do usuário",
            "funcionalidades",
            "aceitação de histórias"
        ],

        "quality-management.html#bdd": [
            "bdd", "gherkin", "given",
            "when", "then", "dado",
            "cuando", "entonces",
            "escenarios", "comportamiento",

            // Inglés
            "behavior driven development",
            "bdd scenarios",
            "behavior scenarios",
            "given when then",
            "expected behavior",
            "acceptance scenarios",
            "behavior specifications",

            // Portugués
            "desenvolvimento orientado por comportamento",
            "cenários bdd",
            "cenários de comportamento",
            "dado quando então",
            "comportamento esperado",
            "cenários de aceitação",
            "especificações de comportamento"
        ],

        "quality-management.html#trazabilidad": [
            "matriz de trazabilidad",
            "requisitos", "historias",
            "escenarios", "casos",
            "cobertura", "relaciones",
            "artefactos",

            // Inglés
            "traceability matrix",
            "requirements traceability",
            "test coverage",
            "requirement mapping",
            "qa artifacts",
            "relationships",
            "test case mapping",
            "coverage analysis",

            // Portugués
            "matriz de rastreabilidade",
            "rastreabilidade de requisitos",
            "cobertura de testes",
            "mapeamento de requisitos",
            "artefatos de qa",
            "relações",
            "mapeamento de casos de teste",
            "análise de cobertura"
        ],

        "quality-management.html#defectos": [
            "defectos", "bugs",
            "ciclo de vida", "severidad",
            "prioridad", "estado",
            "resolución", "seguimiento",

            // Inglés
            "defect management",
            "bug management",
            "defect lifecycle",
            "bug lifecycle",
            "severity", "priority",
            "defect status",
            "defect resolution",
            "defect tracking",
            "issue management",

            // Portugués
            "gestão de defeitos",
            "gestão de bugs",
            "ciclo de vida dos defeitos",
            "ciclo de vida dos bugs",
            "severidade", "prioridade",
            "estado do defeito",
            "resolução de defeitos",
            "acompanhamento de defeitos",
            "gestão de incidentes"
        ],

        "quality-management.html#sprints": [
            "sprints", "scrum",
            "iteraciones", "evolución",
            "ciclos", "planificación",
            "revisión", "retrospectiva",

            // Inglés
            "iterations",
            "project evolution",
            "work cycles",
            "sprint planning",
            "sprint review",
            "sprint retrospective",
            "agile development",
            "iterative development",

            // Portugués
            "iterações",
            "evolução do projeto",
            "ciclos de trabalho",
            "planejamento de sprint",
            "revisão de sprint",
            "retrospectiva de sprint",
            "desenvolvimento ágil",
            "desenvolvimento iterativo"
        ],

        "quality-management.html#backlog": [
            "backlog", "bl-01", "bl-02",
            "bl-03", "bl-04",
            "prioridades", "riesgos",
            "dependencias", "mejoras",
            "buscador global",

            // Inglés
            "product backlog",
            "project backlog",
            "priorities", "risks",
            "dependencies", "improvements",
            "global search",
            "risk management",
            "backlog items",
            "improvement planning",

            // Portugués
            "backlog do produto",
            "backlog do projeto",
            "prioridades", "riscos",
            "dependências", "melhorias",
            "busca global",
            "gestão de riscos",
            "itens do backlog",
            "planejamento de melhorias"
        ],

        "quality-management.html#cierre-epica": [
            "resultados", "cierre",
            "aceptación", "métricas",
            "reporte ejecutivo",
            "estado de la épica",
            "criterios de cierre",

            // Inglés
            "epic results",
            "epic closure",
            "project results",
            "acceptance",
            "acceptance evidence",
            "metrics",
            "executive report",
            "epic status",
            "closure criteria",
            "project completion",

            // Portugués
            "resultados da épica",
            "encerramento da épica",
            "resultados do projeto",
            "aceitação",
            "evidências de aceitação",
            "métricas",
            "relatório executivo",
            "estado da épica",
            "critérios de encerramento",
            "conclusão do projeto"
        ]

    };
    
    const normalize = value =>
        value.toLocaleLowerCase("es")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    
    function closeResults(clearInput = false) {
        results.hidden = true;
        input.setAttribute("aria-expanded", "false");
        
        results.replaceChildren();
        activeResultIndex = -1;

        if (clearInput) {
            input.value = "";
        }
    }

    function showResults(query) {

        activeResultIndex = -1;
        results.replaceChildren();

        const term = normalize(query.trim());

        if (!term) {
            closeResults();
            return;
        }
        
        
        const matches = searchIndex
            .map(item => {

                // Buscar utilizando también los textos del idioma activo.
                const language = getSearchLanguage();

                const translatedItem =
                    item.translations?.[language] || item;

                const title = normalize(translatedItem.title);
                const description = normalize(translatedItem.description);

                const keywords = [
                    ...(item.keywords ? [item.keywords] : []),
                    ...(searchKeywords[item.url] || [])
                ].map(normalize);

                let score = 0;

                // Coincidencias en el título
                if (title === term) {
                    score = 100;
                } else if (title.startsWith(term)) {
                    score = 80;
                } else if (title.includes(term)) {
                    score = 60;
                }

                // Coincidencias en palabras clave
                if (keywords.some(keyword => keyword === term)) {
                    score = Math.max(score, 50);
                } else if (
                    keywords.some(keyword => keyword.startsWith(term))
                ) {
                    score = Math.max(score, 35);
                } else if (
                    keywords.some(keyword => keyword.includes(term))
                ) {
                    score = Math.max(score, 10);
                }

                // Coincidencias en la descripción
                if (description.includes(term)) {
                    score = Math.max(score, 20);
                }

                return { ...item, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score);

        if (!matches.length) {
            const empty = document.createElement("p");
            empty.className = "portfolio-search-empty";

            const emptyMessages = {
                es: "No se encontraron resultados.",
                en: "No results found.",
                pt: "Nenhum resultado encontrado."
            };

            empty.textContent =
                emptyMessages[getSearchLanguage()];

            results.append(empty);
        }
        else {
            matches.forEach((item, index) => {

                const link = document.createElement("a");
                link.className = "portfolio-search-result";
                link.href = item.url;

                link.id = `portfolio-search-result-${index}`;                

                // Obtener los textos correspondientes al idioma activo.
                const language = getSearchLanguage();

                const translatedItem =
                    item.translations?.[language] || item;

                const title = document.createElement("strong");
                title.textContent = translatedItem.title;

                const description = document.createElement("small");
                description.textContent = translatedItem.description;

                link.append(title, description);
                results.append(link);
            });
        }

        results.hidden = false;
        input.setAttribute("aria-expanded", "true");
    }

    input.addEventListener("input", () => {
        activeResultIndex = -1;
        showResults(input.value);
    });

    input.addEventListener("focus", () => {
        if (input.value.trim()) {
            showResults(input.value);
        }
    });
    
    /* =========================================
    NAVEGACIÓN POR TECLADO
    ========================================= */

    let activeResultIndex = -1;

    function updateActiveResult() {

        const links = Array.from(
            results.querySelectorAll(".portfolio-search-result")
        );

        links.forEach((link, index) => {

            const isActive = index === activeResultIndex;

            link.classList.toggle(
                "portfolio-search-result-active",
                isActive
            );

            if (isActive) {

                link.focus();

                link.scrollIntoView({
                    block: "nearest"
                });
            }
        });
    }

    input.addEventListener("keydown", event => {

        const links = Array.from(
            results.querySelectorAll(".portfolio-search-result")
        );

        if (event.key === "Escape") {
            closeResults();
            activeResultIndex = -1;
            input.blur();
            return;
        }

        if (results.hidden || !links.length) {
            return;
        }

        if (event.key === "ArrowDown") {

            event.preventDefault();

            activeResultIndex =
                (activeResultIndex + 1) % links.length;

            updateActiveResult();
        }

        if (event.key === "ArrowUp") {

            event.preventDefault();

            activeResultIndex =
                (activeResultIndex - 1 + links.length)
                % links.length;

            updateActiveResult();
        }
        
        if (event.key === "Enter") {

            event.preventDefault();

            const selectedIndex =
                activeResultIndex >= 0
                    ? activeResultIndex
                    : 0;

            const selectedLink = links[selectedIndex];

            if (selectedLink) {
                const destination = selectedLink.href;

                closeResults(true);

                window.location.assign(destination);
            } else {
                closeResults(true);
            }

            return;
        }

    });

    results.addEventListener("keydown", event => {

        const links = Array.from(
            results.querySelectorAll(".portfolio-search-result")
        );

        if (!links.length) return;

        const currentIndex = links.indexOf(document.activeElement);

        if (currentIndex === -1) return;

        if (event.key === "ArrowDown") {

            event.preventDefault();

            activeResultIndex =
                (currentIndex + 1) % links.length;

            updateActiveResult();
        }

        if (event.key === "ArrowUp") {

            event.preventDefault();

            activeResultIndex =
                (currentIndex - 1 + links.length)
                % links.length;

            updateActiveResult();
        }

        if (event.key === "Escape") {

            event.preventDefault();

            input.focus();

            closeResults();

            return;
        }

    });

    search.addEventListener("focusout", event => {

        const nextElement = event.relatedTarget;

        if (nextElement && search.contains(nextElement)) {
            return;
        }

        closeResults();

    });

    results.addEventListener("focusout", event => {

        const nextElement = event.relatedTarget;

        if (nextElement && results.contains(nextElement)) {
            return;
        }

        activeResultIndex = -1;

        results.querySelectorAll(
            ".portfolio-search-result-active"
        ).forEach(link => {
            link.classList.remove(
                "portfolio-search-result-active"
            );
        });

    });

    results.addEventListener("focusin", event => {

        const link = event.target.closest(
            ".portfolio-search-result"
        );

        if (!link) return;

        const links = Array.from(
            results.querySelectorAll(".portfolio-search-result")
        );

        activeResultIndex = links.indexOf(link);

        updateActiveResult();

    });

    document.addEventListener("pointerdown", event => {
        if (!search.contains(event.target)) {
            closeResults();
        }
    });
    
    /* Cerrar el buscador al cambiar de sección */

    window.addEventListener("hashchange", () => {
        closeResults(true);
    });

    /* Limpiar al seleccionar un resultado */

    results.addEventListener("click", event => {

        const link = event.target.closest(
            ".portfolio-search-result"
        );

        if (!link) return;

        closeResults(true);
    });


});
