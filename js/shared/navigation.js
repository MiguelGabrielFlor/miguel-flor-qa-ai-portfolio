
document.addEventListener("DOMContentLoaded", () => {
    const menu = document.getElementById("indice-contenidos");
    const buscador = document.getElementById("portfolio-search-input");

    if (!menu) return;

    const menuToggle = menu.querySelector("summary");

    // Cerrar el índice al seleccionar una sección.
    menu.querySelectorAll(".index-link").forEach(link => {
        link.addEventListener("click", () => {
            menu.open = false;
        });
    });

    // Cerrar el índice al utilizar el buscador.
    if (buscador) {
        const cerrarMenu = () => {
            if (menu.open) {
                menu.open = false;
            }
        };

        buscador.addEventListener("focus", cerrarMenu);
        buscador.addEventListener("input", cerrarMenu);
    }

    // NFR-005 — Cerrar el menú cuando el foco
    // abandona completamente el componente.
    menu.addEventListener("focusout", (event) => {
        const siguienteElemento = event.relatedTarget;

        if (
            menu.open &&
            (!siguienteElemento || !menu.contains(siguienteElemento))
        ) {
            menu.open = false;
        }
    });

    // NFR-005 — Cerrar con Escape y devolver
    // el foco al control de apertura.
    menu.addEventListener("keydown", (event) => {
        if (event.key !== "Escape" || !menu.open) {
            return;
        }

        event.preventDefault();
        menu.open = false;

        if (menuToggle) {
            menuToggle.focus();
        }
    });
});

