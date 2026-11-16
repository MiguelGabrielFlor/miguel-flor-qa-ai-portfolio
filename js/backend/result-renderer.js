
/**
 * Presentación compartida de resultados y solicitudes
 * de los laboratorios de arquitectura, validaciones
 * y persistencia.
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

/**
 * Muestra los datos de una solicitud HTTP enviada.
 *
 * El texto del encabezado se recibe como parámetro
 * para conservar la internacionalización ES/EN/PT.
 */
function showBackendRequest(
    contenedor,
    endpoint,
    datos,
    textoEncabezado
) {
    const desplegable = document.createElement("details");
    desplegable.className = "api-solicitud-desplegable";

    const encabezado = document.createElement("summary");
    encabezado.textContent = textoEncabezado;

    const contenido = document.createElement("div");
    contenido.className = "api-solicitud-contenido";

    const ruta = document.createElement("p");
    ruta.textContent = `POST ${endpoint}`;

    const codigo = document.createElement("pre");
    const json = document.createElement("code");

    json.textContent = JSON.stringify(datos, null, 2);

    codigo.appendChild(json);
    contenido.append(ruta, codigo);
    desplegable.append(encabezado, contenido);

    contenedor.appendChild(desplegable);
}

window.BackendResultRenderer = Object.freeze({
    render: renderBackendResult,
    showRequest: showBackendRequest
});
