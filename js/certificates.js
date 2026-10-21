
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const dialog = document.getElementById("certificateDialog");
    const title = document.getElementById("certificateDialogTitle");
    const gallery = document.getElementById("certificateGallery");
    const closeButton = document.getElementById("closeCertificateDialog");

    if (!dialog || !title || !gallery || !closeButton) {
        console.error("No se encontraron los elementos de la galería en cv.html.");
        return;
    }

    const basePath = "assets/Cursos%20y%20certificaciones/";
    const pdfjsPromise = import(
        "../node_modules/pdfjs-dist/build/pdf.min.mjs"
    ).then(function (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
            "../node_modules/pdfjs-dist/build/pdf.worker.min.mjs";

        return pdfjsLib;
    });
    const categories = {
        qa: {
            title: "QA Testing y automatización",
            folder: "Tester%20QA/",
            files: [
                "Certificado-Análisis-Funcional-EducaciónIT.pdf",
                "Certificado-Análisis-y-Diseño-de-Casos-de-Pruebas-EducaciónIT.pdf",
                "Certificado-API-Testing-EducaciónIT.pdf",
                "Certificado-Introducción-a-Bases-de-Datos-y-SQL-EducaciónIT.pdf",
                "Certificado-Introducción-a-DevOps-EducaciónIT.pdf",
                "Certificado-Introducción-a-Java-EducaciónIT.pdf",
                "Certificado-Introducción-a-UX-EducaciónIT.pdf",
                "Certificado-Tester-QA-Experto-EducaciónIT.pdf",
                "Certificado-Tester-QA-Manual-EducaciónIT.pdf",
                "Certificado-Testing-Automation-con-Selenium-EducaciónIT.pdf"
            ]
        },
        
        credenciales: {
            title: "Credenciales profesionales",
            folder: "Credenciales%20profesionales/",
            files: [
                "Certificado-QA-Manager-EducaciónIT.pdf",
                "Certificado_Carrera_Marketing_Digital_Coderhouse.pdf"
            ]
        },

        ia: {
            title: "Inteligencia artificial y datos",
            folder: "Consultor%20de%20IA/",
            files: [
                "Certificado-Automatización-y-Agentes-IA-con-N8N-EducaciónIT.pdf",
                "Certificado-Creación-de-agentes-en-Microsoft-Copilot-Studio-(PL-7008)-EducaciónIT.pdf",
                "Certificado-Data-Analytics-&-Visualization-EducaciónIT.pdf",
                "Certificado-Gestion-del-Tiempo-con-IA-EducaciónIT.pdf",
                "Certificado-Google-AI-Studio-con-Antigravity-EducaciónIT.pdf",
                "Certificado-Inteligencia-Artificial-y-Productividad-EducaciónIT.pdf",
                "Certificado-Introducción-a-Python-EducaciónIT.pdf",
                "Certificado-Programación-orientada-a-objetos-con-IA-EducaciónIT.pdf",
                "Certificado-Vibe-Coding-EducaciónIT.pdf"
            ]
        },

        gestion: {
            title: "Gestión y negocio",
            folder: "Gestion%20y%20Negocios/",
            files: [
                "Certificado-Business-Analysis-EducaciónIT.pdf",
                "Certificado-Design-Thinking-EducaciónIT.pdf",
                "Certificado-Gestión-de-Proyectos-EducaciónIT.pdf",
                "Certificado-Liderazgo-y-Gestión-de-Equipos-EducaciónIT.pdf",
                "Certificado-Negociación-y-Comunicación-Efectiva-EducaciónIT.pdf",
                "Certificado-Power-BI-EducaciónIT.pdf",
                "Certificado-Presentaciones-Efectivas-EducaciónIT.pdf",
                "Certificado-Project-Management-PMBOK-8th-EducaciónIT.pdf",
                "Certificado-Scrum-Fundamentos-EducaciónIT.pdf"
            ]
        },

        marketing: {
            title: "Marketing digital y analítica",
            folder: "Marketing/",
            files: [
                "Certificación%20de%20Google%20Analytics.jpg",
                "Certificación%20de%20Publicidad%20en%20Búsqueda%20de%20Googla%20Ads.jpg",
                "Certificación%20de%20Publicidad%20en%20Display%20de%20Google%20Ads.jpg",
                "Certificado-Presupuesto-Digital-EducaciónIT.pdf",
                "Community%20Manager%20%26%20Publicidad%20Flex.jpg",
                "Growth%20Marketing.jpg",
                "Publicidad%20en%20Redes%20Avanzado.jpg"
            ]
        }
    };

    function getFileUrl(category, file) {
        return basePath + category.folder + file;
    }

    
    function getDisplayName(file) {
        const decodedFile = decodeURIComponent(file);

        if (decodedFile.includes("Certificado-QA-Manager")) {
            return "QA Manager";
        }
        if (decodedFile === "Certificado_Carrera_Marketing_Digital_Coderhouse.pdf") {
            return "Carrera de Marketing Digital";
        }

        return decodedFile
            .replace(/\.(pdf|jpg|jpeg)$/i, "")
            .replace(/^Certificado-/, "")
            .replace(/^Certificación de /, "")
            .replace(/^Certificación%20de%20/, "")
            .replace(/-EducaciónIT$/, "")
            .replace(/-/g, " ")
            .replace(/%20/g, " ")
            .replace(/%26/g, "&");
    }

    async function renderPdfPreview(url, canvas) {
        try {
            const pdfjsLib = await pdfjsPromise;
            const loadingTask = pdfjsLib.getDocument({ url: url });
            const pdf = await loadingTask.promise;
            const page = await pdf.getPage(1);

            const originalViewport = page.getViewport({ scale: 1 });
            const scale = 360 / originalViewport.width;
            const viewport = page.getViewport({ scale });

            canvas.width = Math.round(viewport.width);
            canvas.height = Math.round(viewport.height);

            const context = canvas.getContext("2d");

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
        } catch (error) {
            console.error("No se pudo generar la miniatura del PDF:", url, error);
            canvas.classList.add("certificate-preview-error");
            canvas.setAttribute("aria-label", "Vista previa no disponible");
        }
    }
    function renderGallery(categoryKey) {
        const category = categories[categoryKey];

        if (!category) return;

        title.textContent = category.title;
        gallery.replaceChildren();

        category.files.forEach(function (file) {
            const url = getFileUrl(category, file);
            const isImage = /\.(jpg|jpeg)$/i.test(file);
            const item = document.createElement("article");
            item.className = "certificate-item";

            if (isImage) {
                const image = document.createElement("img");
                image.src = url;
                image.alt = getDisplayName(file);
                image.loading = "lazy";
                image.tabIndex = 0;
                image.className = "certificate-image";

                function toggleImageSize() {
                    image.classList.toggle("is-enlarged");
                }

                image.addEventListener("click", toggleImageSize);

                image.addEventListener("keydown", function (event) {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggleImageSize();
                    }
                });

                item.appendChild(image);
            }
            if (!isImage) {
                const canvas = document.createElement("canvas");

                canvas.className = "certificate-pdf-preview";
                canvas.setAttribute("role", "img");
                canvas.setAttribute(
                    "aria-label",
                    "Vista previa: " + getDisplayName(file)
                );

                item.appendChild(canvas);

                renderPdfPreview(url, canvas);
            }
            const link = document.createElement("a");
            link.href = url;
            link.textContent = isImage
                ? "Abrir imagen"
                : "Ver certificado PDF";
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            const name = document.createElement("p");
            name.className = "certificate-name";
            name.textContent = getDisplayName(file);

            item.append(name, link);
            gallery.appendChild(item);
        });

        if (!dialog.open) {
            dialog.showModal();
        }
    }

    document.querySelectorAll(".cv-training-card[data-certificate-category]")
        .forEach(function (card) {
            function openCard() {
                renderGallery(card.dataset.certificateCategory);
            }

            card.addEventListener("click", openCard);

            card.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openCard();
                }
            });
        });

    closeButton.addEventListener("click", function () {
        dialog.close();
    });

    dialog.addEventListener("click", function (event) {
        if (event.target === dialog) {
            dialog.close();
        }
    });
});
