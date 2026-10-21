document.querySelectorAll(".copy-code").forEach(function (button) {
    button.addEventListener("click", async function () {
        const code = button
            .closest(".code-block")
            .querySelector("pre code")
            .textContent;

        try {
            await navigator.clipboard.writeText(code);
            button.textContent = "¡Copiado!";
        } catch (error) {
            button.textContent = "No se pudo copiar";
        }

        window.setTimeout(function () {
            button.textContent = "Copiar código";
        }, 2000);
    });
});
