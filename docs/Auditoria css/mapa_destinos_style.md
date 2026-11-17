# Auditoría CSS — propuesta de destinos

Archivo fuente: `style.css` compartido el 17/11/2026.

Se mantuvieron todas las reglas y su orden original; **no se trasladó físicamente ninguna** para evitar alterar la cascada sin validar las hojas específicas.

Correcciones: `*background*` → `background` en la transición del buscador; `clamp(45px, 8vw, 38px)` → `clamp(38px, 8vw, 45px)` en hero móvil.

La atribución HTML se infiere de selectores presentes en el HTML del ZIP de referencia; las clases dinámicas de JS requieren comprobación antes del traslado.

## Recuento preliminar de bloques por destino

- `css/cv.css`: 4 bloques
- `css/home.css`: 107 bloques
- `css/index.css`: 17 bloques
- `css/qa.css`: 12 bloques
- `css/quality-management.css`: 1 bloques
- `css/style.css`: 127 bloques

## Índice de bloques y destino propuesto

| Bloque | Selector / grupo | Destino | HTML identificado |
|---|---|---|---|
| 001 | `*` | `css/style.css` | TODOS |
| 002 | `html` | `css/style.css` | TODOS |
| 003 | `:root` | `css/style.css` | TODOS |
| 004 | `body` | `css/style.css` | TODOS |
| 005 | `a` | `css/style.css` | TODOS |
| 006 | `.hidden` | `css/style.css` | TODOS / JS |
| 007 | `.access-page` | `css/index.css` | index.html |
| 008 | `.eyebrow` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, index.html, quality-management.html |
| 009 | `.subtitle` | `css/index.css` | index.html |
| 010 | `.form-group` | `css/style.css` | home.html, index.html |
| 011 | `.form-group label` | `css/style.css` | home.html, index.html |
| 012 | `input[type="text"], input[type="email"], input[type="tel"]` | `css/style.css` | TODOS |
| 013 | `#accessForm input[type="text"]::placeholder, #accessForm input[type="email"]::placeholder, #accessFo` | `css/index.css` | index.html |
| 014 | `input:focus` | `css/style.css` | TODOS |
| 015 | `input.input-error` | `css/style.css` | TODOS |
| 016 | `.error-message` | `css/style.css` | home.html, index.html |
| 017 | `.consent` | `css/index.css` | index.html |
| 018 | `.consent label` | `css/index.css` | index.html |
| 019 | `#accessPage button` | `css/index.css` | index.html |
| 020 | `#accessPage #accessForm button:hover, #accessPage #accessForm button:focus-visible` | `css/index.css` | index.html |
| 021 | `#portfolio button, #portfolio .button` | `css/style.css` | home.html, index.html |
| 022 | `.navbar` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 023 | `.nav-container` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 024 | `.logo` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 025 | `.logo-initials` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 026 | `.logo-dot` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 027 | `.logo-divider` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 028 | `.logo-label` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 029 | `nav` | `css/style.css` | TODOS |
| 030 | `nav a` | `css/style.css` | TODOS |
| 031 | `#portfolio .navbar .nav-container > nav > a` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 032 | `#portfolio .navbar .nav-container > nav > a:hover` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 033 | `#portfolio .navbar .nav-container > nav > a:focus-visible` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 034 | `.navbar .showcase-index` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 035 | `.navbar .index-toggle` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 036 | `.navbar .index-toggle::-webkit-details-marker` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 037 | `.navbar .index-toggle::after` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 038 | `.navbar .showcase-index[open] .index-toggle::after` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 039 | `.navbar .index-toggle:hover` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 040 | `.navbar .index-toggle:focus-visible` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 041 | `.navbar .showcase-index[open] > .index-toggle` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 042 | `.navbar .index-grid` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 043 | `.navbar .index-link` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 044 | `body:has(#cv) .navbar .index-grid` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 045 | `body:has(#cv) .navbar .index-link` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 046 | `body:has(#cv) .navbar .index-link strong` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 047 | `body:has(#cv) .navbar .index-link small` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 048 | `body:has(#cv) .navbar .index-grid` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 049 | `.navbar .index-link:hover` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 050 | `.navbar .index-link:focus-visible` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 051 | `.navbar .index-number` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 052 | `.navbar .index-link strong` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 053 | `.navbar .index-link small` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 054 | `.navbar .index-toggle ; .navbar .index-grid ; .navbar .index-link` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 055 | `.navbar .index-toggle, .navbar .index-link ; .navbar .index-link:hover, .navbar .index-link:focus-vi` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 056 | `.section` | `css/style.css` | cv.html, home.html |
| 057 | `#specialties` | `css/home.css` | home.html |
| 058 | `#qa` | `css/home.css` | home.html |
| 059 | `.dark-section` | `css/style.css` | cv.html, home.html |
| 060 | `.section-heading` | `css/style.css` | cv.html, home.html |
| 061 | `.section-heading h2` | `css/style.css` | cv.html, home.html |
| 062 | `.section-heading p` | `css/style.css` | cv.html, home.html |
| 063 | `.hero` | `css/home.css` | home.html |
| 064 | `.hero-content` | `css/home.css` | home.html |
| 065 | `.hero h1` | `css/home.css` | home.html |
| 066 | `#home .hero h1, #home h1` | `css/home.css` | home.html |
| 067 | `#home .hero h1 span, #home h1 span` | `css/home.css` | home.html |
| 068 | `#home .hero h1 span:last-of-type, #home h1 span:last-of-type` | `css/home.css` | home.html |
| 069 | `.hero-description` | `css/home.css` | home.html |
| 070 | `#portfolio .button-brace, #portfolio nav .button-brace` | `css/home.css` | home.html |
| 071 | `.button.primary, .button.secondary` | `css/style.css` | home.html, index.html |
| 072 | `.hero-panel` | `css/home.css` | home.html |
| 073 | `.hero-panel:hover` | `css/home.css` | home.html |
| 074 | `.hero-panel::before` | `css/home.css` | home.html |
| 075 | `.hero-panel > *` | `css/home.css` | home.html |
| 076 | `from ; to` | `css/style.css` | TODOS |
| 077 | `.hero-panel-title` | `css/home.css` | home.html |
| 078 | `.hero-panel-item` | `css/home.css` | home.html |
| 079 | `.hero-panel-item + .hero-panel-item` | `css/home.css` | home.html |
| 080 | `.hero-panel-item strong` | `css/home.css` | home.html |
| 081 | `.hero-panel-item p` | `css/home.css` | home.html |
| 082 | `.hero-panel::before` | `css/home.css` | home.html |
| 083 | `.info-card, .experience-card, .skill-card, .ai-card, .project-card, .access-card, .access-option-car` | `css/style.css` | home.html, index.html |
| 084 | `.info-card::before, .experience-card::before, .skill-card::before, .ai-card::before, .project-card::` | `css/style.css` | home.html, index.html |
| 085 | `.info-card > *, .experience-card > *, .skill-card > *, .ai-card > *, .project-card > *, .access-card` | `css/style.css` | home.html, index.html |
| 086 | `.info-card::before, .experience-card::before, .skill-card::before, .ai-card::before, .project-card::` | `css/style.css` | home.html, index.html |
| 087 | `.two-column` | `css/home.css` | home.html |
| 088 | `.two-column > div > p` | `css/home.css` | home.html |
| 089 | `.info-card` | `css/home.css` | home.html |
| 090 | `.info-card span, .skill-card span, .ai-card span, .experience-card span, .project-card span` | `css/home.css` | home.html |
| 091 | `.info-card h3` | `css/home.css` | home.html |
| 092 | `.info-card p` | `css/home.css` | home.html |
| 093 | `.cards-grid` | `css/home.css` | home.html |
| 094 | `.experience-card, .skill-card, .ai-card` | `css/home.css` | home.html |
| 095 | `.experience-card h3, .skill-card h3, .ai-card h3` | `css/home.css` | home.html |
| 096 | `.experience-card p, .skill-card p, .ai-card p` | `css/home.css` | home.html |
| 097 | `.project-card` | `css/home.css` | home.html |
| 098 | `.project-card h3` | `css/home.css` | home.html |
| 099 | `.project-card p` | `css/home.css` | home.html |
| 100 | `.project-status span` | `css/home.css` | home.html |
| 101 | `.contact-section` | `css/home.css` | home.html |
| 102 | `.contact-section h2` | `css/home.css` | home.html |
| 103 | `.contact-section p` | `css/home.css` | home.html |
| 104 | `.contact-form` | `css/home.css` | home.html |
| 105 | `.contact-form .form-group` | `css/style.css` | home.html, index.html |
| 106 | `.contact-form label` | `css/home.css` | home.html |
| 107 | `.contact-form textarea` | `css/home.css` | home.html |
| 108 | `.contact-form textarea::placeholder` | `css/home.css` | home.html |
| 109 | `.contact-form textarea:focus` | `css/home.css` | home.html |
| 110 | `.contact-form textarea.input-error` | `css/home.css` | home.html |
| 111 | `.required-asterisk` | `css/home.css` | home.html |
| 112 | `.contact-form .field-hint` | `css/style.css` | home.html, index.html |
| 113 | `#contactMessageError` | `css/home.css` | home.html |
| 114 | `#contactStatus` | `css/home.css` | home.html |
| 115 | `.contact-form #contactButton` | `css/home.css` | home.html |
| 116 | `#contactButton:disabled` | `css/home.css` | home.html |
| 117 | `.contact-form textarea` | `css/home.css` | home.html |
| 118 | `.main-footer` | `css/home.css` | home.html |
| 119 | `.hero-panel ; .hero ; .cards-grid ; .two-column ; nav` | `css/home.css` | home.html |
| 120 | `.section ; .dark-section ; .cards-grid ; .nav-container ; .nav-container > nav ; .hero h1 ; .project` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 121 | `.field-hint` | `css/style.css` | home.html, index.html |
| 122 | `.language-selector` | `css/index.css` | index.html |
| 123 | `.language-selector label` | `css/index.css` | index.html |
| 124 | `.language-selector select` | `css/index.css` | index.html |
| 125 | `.language-selector select:focus-visible` | `css/index.css` | index.html |
| 126 | `.main-footer .footer-language` | `css/home.css` | home.html |
| 127 | `.main-footer .footer-language label` | `css/home.css` | home.html |
| 128 | `.main-footer .footer-language select` | `css/home.css` | home.html |
| 129 | `.main-footer .footer-language select:focus-visible` | `css/home.css` | home.html |
| 130 | `#firstName` | `css/index.css` | index.html |
| 131 | `#lastName` | `css/index.css` | index.html |
| 132 | `#email` | `css/index.css` | index.html |
| 133 | `#phone` | `css/index.css` | index.html |
| 134 | `#guestEmail` | `css/home.css` | home.html |
| 135 | `#contactMessage` | `css/home.css` | home.html |
| 136 | `.welcome-message` | `css/home.css` | home.html |
| 137 | `.linkedin-card, .github-card` | `css/home.css` | home.html |
| 138 | `.linkedin-card` | `css/home.css` | home.html |
| 139 | `.github-card` | `css/home.css` | home.html |
| 140 | `.linkedin-card:hover, .github-card:hover` | `css/home.css` | home.html |
| 141 | `.linkedin-card:focus-visible, .github-card:focus-visible` | `css/home.css` | home.html |
| 142 | `.linkedin-info, .github-info` | `css/home.css` | home.html |
| 143 | `.linkedin-identity, .github-identity` | `css/home.css` | home.html |
| 144 | `.linkedin-identity-text, .github-identity-text` | `css/home.css` | home.html |
| 145 | `.linkedin-info h3, .github-info h3` | `css/home.css` | home.html |
| 146 | `.linkedin-label, .github-label` | `css/home.css` | home.html |
| 147 | `.linkedin-label` | `css/home.css` | home.html |
| 148 | `.github-label` | `css/home.css` | home.html |
| 149 | `.linkedin-avatar` | `css/home.css` | home.html |
| 150 | `.linkedin-logo` | `css/home.css` | home.html |
| 151 | `.github-logo` | `css/home.css` | home.html |
| 152 | `.github-logo svg` | `css/home.css` | home.html |
| 153 | `.github-complement` | `css/home.css` | home.html |
| 154 | `.github-headline` | `css/home.css` | home.html |
| 155 | `.linkedin-button, .github-button` | `css/home.css` | home.html |
| 156 | `.linkedin-button` | `css/home.css` | home.html |
| 157 | `.github-button` | `css/home.css` | home.html |
| 158 | `#portfolio .button.github-button:focus-visible` | `css/style.css` | home.html, index.html |
| 159 | `.linkedin-card, .github-card ; .linkedin-card ; .linkedin-avatar ; .linkedin-info ; .linkedin-identi` | `css/home.css` | home.html |
| 160 | `.linkedin-card, .github-card ; .linkedin-card:hover, .github-card:hover` | `css/home.css` | home.html |
| 161 | `#portfolio #contactButton, #about .info-card-link .button, #portfolio .linkedin-card .linkedin-butto` | `css/style.css` | home.html, index.html |
| 162 | `#portfolio #contactButton:hover, #about .info-card-link:hover .button, #portfolio .linkedin-card:hov` | `css/style.css` | home.html, index.html |
| 163 | `#portfolio #contactButton:focus-visible, #about .info-card-link:focus-visible .button, #portfolio .l` | `css/style.css` | home.html, index.html |
| 164 | `#portfolio #contactButton, #about .info-card-link .button, #portfolio .linkedin-card .linkedin-butto` | `css/style.css` | home.html, index.html |
| 165 | `.cv-bottom-bar` | `css/style.css` | backend.html, cv.html, frontend.html, qa.html, quality-management.html |
| 166 | `.cv-bottom-bar .cv-back-button` | `css/style.css` | backend.html, cv.html, frontend.html, qa.html, quality-management.html |
| 167 | `.cv-bottom-bar .cv-back-button:hover` | `css/style.css` | backend.html, cv.html, frontend.html, qa.html, quality-management.html |
| 168 | `.cv-bottom-bar .cv-back-button:focus-visible` | `css/style.css` | backend.html, cv.html, frontend.html, qa.html, quality-management.html |
| 169 | `.cv-bottom-bar .cv-back-button` | `css/style.css` | backend.html, cv.html, frontend.html, qa.html, quality-management.html |
| 170 | `body:has(.cv-bottom-bar)` | `css/style.css` | backend.html, cv.html, frontend.html, qa.html, quality-management.html |
| 171 | `#cv #experience , #cv #education` | `css/cv.css` | cv.html |
| 172 | `.cv-experience-card .eyebrow` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, index.html, quality-management.html |
| 173 | `.cv-experience-card p:not(.eyebrow)` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, index.html, quality-management.html |
| 174 | `#about .info-card` | `css/home.css` | home.html |
| 175 | `#about .info-card .button` | `css/style.css` | home.html, index.html |
| 176 | `#cv .section-heading, #cv .cv-experience` | `css/style.css` | cv.html, home.html |
| 177 | `#cv .section-heading` | `css/style.css` | cv.html, home.html |
| 178 | `#cv .section-heading h1, #cv .section-heading > p:not(.eyebrow)` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, index.html, quality-management.html |
| 179 | `#cv .section-heading > p:not(.eyebrow)` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, index.html, quality-management.html |
| 180 | `#cv .section-heading, #cv .cv-experience` | `css/style.css` | cv.html, home.html |
| 181 | `#about .two-column > div:first-child p` | `css/home.css` | home.html |
| 182 | `#about .info-card-link` | `css/home.css` | home.html |
| 183 | `#about .info-card-link:focus-visible` | `css/home.css` | home.html |
| 184 | `.info-card, .experience-card, .skill-card, .ai-card, .project-card` | `css/home.css` | home.html |
| 185 | `a.info-card:hover, a.experience-card:hover, a.skill-card:hover, a.ai-card:hover, a.project-card:hove` | `css/style.css` | TODOS |
| 186 | `#qa a.skill-card` | `css/home.css` | home.html |
| 187 | `#qa a.skill-card:hover` | `css/home.css` | home.html |
| 188 | `#qa a.skill-card:focus-visible` | `css/home.css` | home.html |
| 189 | `a.info-card, a.experience-card, a.skill-card, a.ai-card, a.project-card, #qa a.skill-card ; a.info-c` | `css/home.css` | home.html |
| 190 | `a.info-card-link` | `css/style.css` | TODOS |
| 191 | `a.info-card-link:hover` | `css/style.css` | TODOS |
| 192 | `a.info-card-link:focus-visible` | `css/style.css` | TODOS |
| 193 | `.info-card:not(a), .experience-card:not(a), .skill-card:not(a), .ai-card:not(a), .project-card:not(a` | `css/home.css` | home.html |
| 194 | `.info-card:not(a):hover, .experience-card:not(a):hover, .skill-card:not(a):hover, .ai-card:not(a):ho` | `css/home.css` | home.html |
| 195 | `a.info-card-link, .info-card:not(a), .experience-card:not(a), .skill-card:not(a), .ai-card:not(a), .` | `css/home.css` | home.html |
| 196 | `#about a.info-card-link` | `css/home.css` | home.html |
| 197 | `#about a.info-card-link p` | `css/home.css` | home.html |
| 198 | `#about a.info-card-link h3` | `css/home.css` | home.html |
| 199 | `#cv .cv-experience-card.cv-training-card` | `css/cv.css` | cv.html |
| 200 | `#cv .cv-experience-card.cv-training-card:hover` | `css/cv.css` | cv.html |
| 201 | `#cv .cv-experience-card.cv-training-card ; #cv .cv-experience-card.cv-training-card:hover, #cv .cv-e` | `css/cv.css` | cv.html |
| 202 | `.certificate-dialog-header .eyebrow` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, index.html, quality-management.html |
| 203 | `body:has(> .navbar) .navbar .button` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, index.html, qa.html, quality-management.html |
| 204 | `body:has(> .navbar) .navbar .button:hover` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, index.html, qa.html, quality-management.html |
| 205 | `#qa` | `css/home.css` | home.html |
| 206 | `.portfolio-search` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 207 | `.portfolio-search-field` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 208 | `.portfolio-search-field:focus-within` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 209 | `.portfolio-search-field svg` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 210 | `.portfolio-search-input` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 211 | `.portfolio-search-input::placeholder` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 212 | `.portfolio-search-results` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 213 | `.portfolio-search-results[hidden]` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 214 | `.portfolio-search-result` | `css/style.css` | TODOS / JS |
| 215 | `.portfolio-search-result:hover, .portfolio-search-result:focus-visible` | `css/style.css` | TODOS / JS |
| 216 | `.portfolio-search-result strong` | `css/style.css` | TODOS / JS |
| 217 | `.portfolio-search-result small` | `css/style.css` | TODOS / JS |
| 218 | `.portfolio-search-empty` | `css/style.css` | TODOS / JS |
| 219 | `.portfolio-search ; .portfolio-search-field ; .portfolio-search-input` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 220 | `.portfolio-search-result-active` | `css/style.css` | TODOS / JS |
| 221 | `.portfolio-search-result-active strong` | `css/style.css` | TODOS / JS |
| 222 | `#linkedin, #github` | `css/home.css` | home.html |
| 223 | `html ; .showcase-section, #home, #about, #specialties, #projects, #contact, #experience, #education` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 224 | `.navbar .logo-label ; .navbar .logo-divider ; .navbar .logo ; .navbar .showcase-index` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 225 | `.qm-backlog-completed` | `css/quality-management.css` | quality-management.html |
| 226 | `.main-footer .footer-language` | `css/home.css` | home.html |
| 227 | `#specialties + #qa` | `css/home.css` | home.html |
| 228 | `.specialties-intro` | `css/home.css` | home.html |
| 229 | `.specialties-intro p` | `css/home.css` | home.html |
| 230 | `.specialties-intro h3` | `css/home.css` | home.html |
| 231 | `.specialties-intro .specialties-closing` | `css/home.css` | home.html |
| 232 | `.specialties-intro p ; .specialties-intro h3` | `css/home.css` | home.html |
| 233 | `a.hero-panel.hero-panel-link` | `css/style.css` | TODOS |
| 234 | `a.hero-panel.hero-panel-link:hover` | `css/style.css` | TODOS |
| 235 | `a.hero-panel.hero-panel-link:focus-visible` | `css/style.css` | TODOS |
| 236 | `a.hero-panel.hero-panel-link ; a.hero-panel.hero-panel-link:hover, a.hero-panel.hero-panel-link:focu` | `css/style.css` | TODOS |
| 237 | `.cv-language-selector` | `css/style.css` | backend.html, cv.html, frontend.html, qa.html |
| 238 | `.cv-language-select` | `css/style.css` | backend.html, cv.html, frontend.html, qa.html |
| 239 | `.cv-language-select:focus-visible` | `css/style.css` | backend.html, cv.html, frontend.html, qa.html |
| 240 | `.cv-language-selector ; .cv-bottom-bar .cv-back-button` | `css/style.css` | backend.html, cv.html, frontend.html, qa.html, quality-management.html |
| 241 | `.selenium-phone-coverage table` | `css/qa.css` | qa.html |
| 242 | `.selenium-phone-coverage th` | `css/qa.css` | qa.html |
| 243 | `.selenium-phone-coverage td` | `css/qa.css` | qa.html |
| 244 | `.selenium-phone-coverage tbody tr:last-child td` | `css/qa.css` | qa.html |
| 245 | `.selenium-phone-coverage tbody tr:hover` | `css/qa.css` | qa.html |
| 246 | `.selenium-phone-coverage td:first-child` | `css/qa.css` | qa.html |
| 247 | `.selenium-phone-coverage td code` | `css/qa.css` | qa.html |
| 248 | `.selenium-phone-coverage td:last-child` | `css/qa.css` | qa.html |
| 249 | `.selenium-phone-coverage th, .selenium-phone-coverage td` | `css/qa.css` | qa.html |
| 250 | `.bug-observation-text` | `css/qa.css` | qa.html |
| 251 | `#regresion-bugs [data-i18n="qaObservationTraceability004"]` | `css/qa.css` | qa.html |
| 252 | `#regresion-bugs [data-i18n="qaRequirementAmbiguity004"], #regresion-bugs [data-i18n="qaObservationAc` | `css/qa.css` | qa.html |
| 253 | `.navbar .nav-container ; .navbar .logo ; .navbar .logo-initials ; .navbar .logo-label ; .navbar .log` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, qa.html, quality-management.html |
| 254 | `.hero-description` | `css/home.css` | home.html |
| 255 | `#portfolio .hero-description, #portfolio #about p, #portfolio #specialties p, #portfolio #projects p` | `css/home.css` | home.html |
| 256 | `.cv-bottom-bar ; .cv-language-selector ; .cv-back-button ; .cv-language-select` | `css/style.css` | backend.html, cv.html, frontend.html, qa.html, quality-management.html |
| 257 | `body:has(.showcase) .showcase-section > p, body:has(.showcase) .section-description` | `css/style.css` | backend.html, frontend.html, qa.html, quality-management.html |
| 258 | `.access-option-card .button` | `css/style.css` | home.html, index.html |
| 259 | `#accessForm[hidden]` | `css/index.css` | index.html |
| 260 | `#accessPage .access-option-card .button, #accessPage #accessForm button` | `css/style.css` | home.html, index.html |
| 261 | `#accessPage .access-option-card:hover .button, #accessPage .access-option-card:focus-within .button` | `css/style.css` | home.html, index.html |
| 262 | `#accessPage #accessForm button:hover, #accessPage #accessForm button:focus-visible` | `css/index.css` | index.html |
| 263 | `#accessPage .access-option-card .button:hover, #accessPage .access-option-card .button:focus-visible` | `css/style.css` | home.html, index.html |
| 264 | `#accessPage .access-option-card .button, #accessPage #accessForm button` | `css/style.css` | home.html, index.html |
| 265 | `.access-card, .access-option-card, .access-option-icon, #accessPage .access-option-card .button` | `css/style.css` | home.html, index.html |
| 266 | `[data-i18n="specialtiesQaParagraph1"], [data-i18n="specialtiesQaParagraph2"]` | `css/style.css` | TODOS |
| 267 | `.skip-link` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, index.html, qa.html, quality-management.html |
| 268 | `.skip-link:focus, .skip-link:focus-visible` | `css/style.css` | backend.html, cv.html, frontend.html, home.html, index.html, qa.html, quality-management.html |