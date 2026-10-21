
/**
 * Presentación compartida de resultados de los
 * laboratorios de arquitectura, validaciones y persistencia.
 */
function renderBackendResult(contenedor, aprobado, estado, datos) {
    contenedor.replaceChildren();

    const veredicto = document.createElement('p');

    veredicto.style.cssText = `
        margin: 0;
        font-weight: bold;
        color: ${aprobado ? '#6A9955' : '#CE9178'};
    `;

    veredicto.textContent =
        `${aprobado ? 'PASS' : 'FAIL'} — ${estado}`;

    const detalle = document.createElement('pre');

    detalle.style.cssText = `
        margin: 12px 0 0;
        color: #9CDCFE;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        font-family: Consolas, monospace;
    `;

    detalle.textContent = JSON.stringify(datos, null, 2);

    contenedor.append(veredicto, detalle);
}

window.BackendResultRenderer = Object.freeze({
    render: renderBackendResult
});
