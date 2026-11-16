
document.addEventListener("DOMContentLoaded", () => {

    // Normalizar la indentación visual de los ejemplos Selenium.
    document.querySelectorAll(
        ".selenium-test-detail pre code"
    ).forEach((bloque) => {
        const lineas = bloque.textContent
            .replace(/\r\n?/g, "\n")
            .split("\n");

        const espacios = lineas
            .filter((linea) => linea.trim() !== "")
            .map((linea) => linea.match(/^[ \t]*/)[0].length);

        const minimo = Math.min(...espacios);

        if (!Number.isFinite(minimo)) return;

        bloque.textContent = lineas
            .map((linea) => linea.slice(minimo))
            .join("\n")
            .trim();
    });

    // Acordeón Selenium: ventanas principales y subventanas.
    const seleniumLibrary = document.getElementById("selenium-library");

    if (!seleniumLibrary) return;

    // Mantener una sola ventana principal abierta.
    const seleniumPrincipales = seleniumLibrary.querySelectorAll(
        ":scope > details.selenium-test"
    );

    seleniumPrincipales.forEach((principal) => {
        principal.addEventListener("toggle", () => {
            if (!principal.open) return;

            seleniumPrincipales.forEach((otra) => {
                if (otra !== principal) {
                    otra.open = false;
                }
            });
        });
    });

    // Mantener una sola subventana SEARCH-TC abierta.
    const seleniumSubventanas = seleniumLibrary.querySelectorAll(
        ".selenium-search-suite > .selenium-test-detail > details.selenium-test"
    );

    seleniumSubventanas.forEach((subventana) => {
        subventana.addEventListener("toggle", () => {
            if (!subventana.open) return;

            seleniumSubventanas.forEach((otra) => {
                if (otra !== subventana) {
                    otra.open = false;
                }
            });
        });
    });
});
