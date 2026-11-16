(() => {
            const guide = document.getElementById("guia-http");
            if (!guide) return;

            const buttons = guide.querySelectorAll("[data-http-family]");
            const detail = document.getElementById("http-guide-detail");
            let activeFamily = null;
            const title = document.getElementById("http-guide-family-title");
            const description = document.getElementById("http-guide-description");
            const examples = document.getElementById("http-guide-examples");

            const obtenerFamiliasHTTP = () => ({
                "1xx": {
                    title: backendText("backendDynamic000", "1xx — Respuestas informativas"),
                    description: backendText("backendDynamic001", "El servidor recibió la solicitud y comunica información sobre su procesamiento."),
                    codes: [
                        ["100", backendText("backendDynamic002", "Continue — El cliente puede continuar enviando la solicitud.")],
                        ["101", backendText("backendDynamic003", "Switching Protocols — El servidor acepta cambiar de protocolo.")],
                        ["103", backendText("backendDynamic004", "Early Hints — Permite anticipar recursos que podrían necesitarse.")]
                    ]
                },

                "2xx": {
                    title: backendText("backendDynamic005", "2xx — Respuestas exitosas"),
                    description: backendText("backendDynamic006", "La solicitud se recibió, comprendió y procesó correctamente."),
                    codes: [
                        ["200", backendText("backendDynamic007", "OK — La solicitud se completó correctamente.")],
                        ["201", backendText("backendDynamic008", "Created — Se creó un nuevo recurso.")],
                        ["202", backendText("backendDynamic009", "Accepted — La solicitud fue aceptada para su procesamiento.")],
                        ["204", backendText("backendDynamic010", "No Content — La operación fue exitosa y no devuelve contenido.")]
                    ]
                },

                "3xx": {
                    title: backendText("backendDynamic011", "3xx — Redirecciones"),
                    description: backendText("backendDynamic012", "Se requiere una acción adicional para completar la solicitud o utilizar una respuesta almacenada."),
                    codes: [
                        ["301", backendText("backendDynamic013", "Moved Permanently — El recurso cambió de ubicación permanentemente.")],
                        ["302", backendText("backendDynamic014", "Found — El recurso se encuentra temporalmente en otra ubicación.")],
                        ["304", backendText("backendDynamic015", "Not Modified — Puede reutilizarse una respuesta almacenada en caché.")],
                        ["307", backendText("backendDynamic016", "Temporary Redirect — Redirección temporal que conserva el método HTTP.")]
                    ]
                },

                "4xx": {
                    title: backendText("backendDynamic017", "4xx — Errores del cliente"),
                    description: backendText("backendDynamic018", "La solicitud presenta un problema, como datos inválidos, falta de autorización o un recurso inexistente."),
                    codes: [
                        ["400", backendText("backendDynamic019", "Bad Request — La solicitud no puede procesarse por un problema del cliente.")],
                        ["401", backendText("backendDynamic020", "Unauthorized — Se requiere autenticación válida.")],
                        ["403", backendText("backendDynamic021", "Forbidden — El servidor rechaza el acceso al recurso.")],
                        ["404", backendText("backendDynamic022", "Not Found — No se encontró el recurso solicitado.")],
                        ["405", backendText("backendDynamic023", "Method Not Allowed — El método HTTP no está permitido.")],
                        ["409", backendText("backendDynamic024", "Conflict — La solicitud entra en conflicto con el estado actual del recurso.")],
                        ["422", backendText("backendDynamic025", "Unprocessable Content — El contenido es correcto en formato, pero no puede procesarse según sus instrucciones.")],
                        ["429", backendText("backendDynamic026", "Too Many Requests — Se excedió el límite de solicitudes.")]
                    ]
                },

                "5xx": {
                    title: backendText("backendDynamic027", "5xx — Errores del servidor"),
                    description: backendText("backendDynamic028", "El servidor no pudo completar correctamente la solicitud debido a un error o una condición del servicio."),
                    codes: [
                        ["500", backendText("backendDynamic029", "Internal Server Error — Se produjo un error interno inesperado.")],
                        ["501", backendText("backendDynamic030", "Not Implemented — El servidor no admite la funcionalidad necesaria.")],
                        ["502", backendText("backendDynamic031", "Bad Gateway — Un servidor intermediario recibió una respuesta inválida.")],
                        ["503", backendText("backendDynamic032", "Service Unavailable — El servicio no está disponible temporalmente.")],
                        ["504", backendText("backendDynamic033", "Gateway Timeout — Un servidor intermediario no recibió respuesta a tiempo.")]
                    ]
                },

            });

            function showFamily(familyId) {
                const family = obtenerFamiliasHTTP()[familyId];
                if (!family) return;

                activeFamily = familyId;
                detail.hidden = false;

                title.textContent = family.title;
                description.textContent = family.description;

                examples.replaceChildren();

                family.codes.forEach(([code, meaning]) => {
                    const item = document.createElement("div");
                    item.className = "http-guide-example";

                    const number = document.createElement("strong");
                    number.textContent = code;

                    const text = document.createElement("span");
                    text.textContent = meaning;

                    item.append(number, text);
                    examples.appendChild(item);
                });

                buttons.forEach(button => {
                    const active = button.dataset.httpFamily === familyId;

                    button.classList.toggle("active", active);
                    button.setAttribute("aria-pressed", String(active));
                });
            }

            buttons.forEach(button => {
                button.addEventListener("click", () => {
                    const selectedFamily = button.dataset.httpFamily;

                    if (activeFamily === selectedFamily) {
                        activeFamily = null;
                        detail.hidden = true;

                        buttons.forEach(item => {
                            item.classList.remove("active");
                            item.setAttribute("aria-pressed", "false");
                            item.setAttribute("aria-expanded", "false");
                        });

                        return;
                    }

                    showFamily(selectedFamily);

                    buttons.forEach(item => {
                        item.setAttribute(
                            "aria-expanded",
                            String(item.dataset.httpFamily === selectedFamily)
                        );
                    });
                });

                button.setAttribute("aria-controls", "http-guide-detail");
                button.setAttribute("aria-expanded", "false");
            });
            // Actualizar la familia HTTP seleccionada al cambiar de idioma.
            document.addEventListener("portfolio:languagechange", () => {

                // Si no hay una familia seleccionada, mantener el panel cerrado.
                if (!activeFamily || detail.hidden) return;

                // Reconstruir los textos utilizando el idioma actual.
                showFamily(activeFamily);
            });

            /* Estado inicial: todos los paneles cerrados */
            detail.hidden = true;
            activeFamily = null;

            buttons.forEach(button => {
                button.classList.remove("active");
                button.setAttribute("aria-pressed", "false");
            });
        })();