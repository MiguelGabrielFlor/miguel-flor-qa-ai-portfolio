"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const dialog = document.getElementById("certificateDialog");
    const title = document.getElementById("certificateDialogTitle");
    const gallery = document.getElementById("certificateGallery");
    const closeButton = document.getElementById("closeCertificateDialog");
    const imageViewer = document.getElementById("certificateImageViewer");
    const imageViewerTitle = document.getElementById("certificateImageViewerTitle");
    const imageViewerImg = document.getElementById("certificateImageViewerImg");
    const closeImageViewer = document.getElementById("closeCertificateImageViewer");

    if (!dialog || !title || !gallery || !closeButton ||
        !imageViewer || !imageViewerTitle || !imageViewerImg || !closeImageViewer) {
        console.error("Faltan elementos de la galería de certificados en cv.html.");
        return;
    }

    // Única fuente para miniaturas, visor y enlaces: JPG.
    const imageBasePath = "assets/certificates-jpg/";
    let imagenQueAbrioVisor = null;
    let categoriaActiva = null;

    function cerrarVisorImagen() {
        if (imageViewer.open) imageViewer.close();
    }

    function abrirVisorImagen(image, certificateName) {
        if (!image.complete || image.naturalWidth === 0) return;
        imagenQueAbrioVisor = image;
        imageViewerTitle.textContent = certificateName;
        imageViewerImg.src = image.currentSrc || image.src;
        imageViewerImg.alt = certificateName;
        imageViewer.showModal();
        closeImageViewer.focus();
    }

    closeImageViewer.addEventListener("click", cerrarVisorImagen);
    imageViewer.addEventListener("close", function () {
        imageViewerImg.removeAttribute("src");
        if (imagenQueAbrioVisor?.isConnected) imagenQueAbrioVisor.focus();
        imagenQueAbrioVisor = null;
    });

    // Cinco categorías originales; todos los archivos son JPG.
    const categories = {
        qa: {
            title: "QA Testing y automatización",
            folder: "Tester%20QA/",
            files: [
                "Certificado-Análisis-Funcional-EducaciónIT.jpeg",
                "Certificado-Análisis-y-Diseño-de-Casos-de-Pruebas-EducaciónIT.jpeg",
                "Certificado-API-Testing-EducaciónIT.jpeg",
                "Certificado-Introducción-a-Bases-de-Datos-y-SQL-EducaciónIT.jpeg",
                "Certificado-Introducción-a-DevOps-EducaciónIT.jpeg",
                "Certificado-Introducción-a-Java-EducaciónIT.jpeg",
                "Certificado-Introducción-a-UX-EducaciónIT.jpeg",
                "Certificado-Tester-QA-Experto-EducaciónIT.jpeg",
                "Certificado-Tester-QA-Manual-EducaciónIT.jpeg",
                "Certificado-Testing-Automation-con-Selenium-EducaciónIT.jpeg"
            ]
        },

        credenciales: {
            title: "Credenciales profesionales",
            folder: "Credenciales%20profesionales/",
            files: [
                "Certificado-QA-Manager-EducaciónIT.jpeg",
                "Certificado_Carrera_Marketing_Digital_Coderhouse.jpg"
            ]
        },

        ia: {
            title: "Inteligencia artificial y datos",
            folder: "Consultor%20de%20IA/",
            files: [
                "Certificado-Automatización-y-Agentes-IA-con-N8N-EducaciónIT.jpeg",
                "Certificado-Creación-de-agentes-en-Microsoft-Copilot-Studio-(PL-7008)-EducaciónIT.jpeg",
                "Certificado-Data-Analytics-&-Visualization-EducaciónIT.jpeg",
                "Certificado-Gestion-del-Tiempo-con-IA-EducaciónIT.jpeg",
                "Certificado-Google-AI-Studio-con-Antigravity-EducaciónIT.jpeg",
                "Certificado-Inteligencia-Artificial-y-Productividad-EducaciónIT.jpeg",
                "Certificado-Introducción-a-Python-EducaciónIT.jpeg",
                "Certificado-Programación-orientada-a-objetos-con-IA-EducaciónIT.jpeg",
                "Certificado-Vibe-Coding-EducaciónIT.jpeg"
            ]
        },

        gestion: {
            title: "Gestión y negocio",
            folder: "Gestion%20y%20Negocios/",
            files: [
                "Certificado-Business-Analysis-EducaciónIT.jpeg",
                "Certificado-Design-Thinking-EducaciónIT.jpeg",
                "Certificado-Gestión-de-Proyectos-EducaciónIT.jpeg",
                "Certificado-Liderazgo-y-Gestión-de-Equipos-EducaciónIT.jpeg",
                "Certificado-Negociación-y-Comunicación-Efectiva-EducaciónIT.jpeg",
                "Certificado-Power-BI-EducaciónIT.jpeg",
                "Certificado-Presentaciones-Efectivas-EducaciónIT.jpeg",
                "Certificado-Project-Management-PMBOK-8th-EducaciónIT.jpeg",
                "Certificado-Scrum-Fundamentos-EducaciónIT.jpeg"
            ]
        },

        marketing: {
            title: "Marketing digital y analítica",
            folder: "Marketing/",
            files: [
                "Certificación%20de%20Google%20Analytics.jpg",
                "Certificación%20de%20Publicidad%20en%20Búsqueda%20de%20Googla%20Ads.jpg",
                "Certificación%20de%20Publicidad%20en%20Display%20de%20Google%20Ads.jpg",
                "Certificado-Presupuesto-Digital-EducaciónIT.jpeg",
                "Community%20Manager%20%26%20Publicidad%20Flex.jpg",
                "Growth%20Marketing.jpg",
                "Publicidad%20en%20Redes%20Avanzado.jpg"
            ]
        }
    };

    const titleKeys = {
        credenciales: "cvCredentialsTitle",
        qa: "cvQaCertificatesTitle",
        ia: "cvAiCertificatesTitle",
        gestion: "cvManagementTitle",
        marketing: "cvMarketingTitle"
    };

    function traducirCertificado(clave, textoAlternativo = "") {
        const idioma =
            localStorage.getItem("portfolioLanguage") || "es";

        const diccionario =
            window.portfolioTranslations?.[idioma] ||
            window.portfolioTranslations?.es ||
            {};

        return diccionario[clave] || textoAlternativo;
    }

    function getDisplayName(file) {
        const decodedFile = decodeURIComponent(file);

        if (decodedFile.includes("Certificado-QA-Manager")) {
            return "QA Manager";
        }

        if (
            decodedFile ===
            "Certificado_Carrera_Marketing_Digital_Coderhouse.jpg"
        ) {
            return "Carrera de Marketing Digital";
        }

        return decodedFile
            .replace(/\.(jpg|jpeg)$/i, "")
            .replace(/^Certificado-/, "")
            .replace(/^Certificación de /, "")
            .replace(/^Certificación%20de%20/, "")
            .replace(/-EducaciónIT$/, "")
            .replace(/-/g, " ")
            .replace(/%20/g, " ")
            .replace(/%26/g, "&");
    }

    function getImageUrl(category, file) {
        // Codifica correctamente tildes, espacios, & y paréntesis.
        return imageBasePath + encodeURIComponent(decodeURIComponent(category.folder.replace(/\/$/, "")))
            + "/" + encodeURIComponent(decodeURIComponent(file));
    }

    function renderGallery(categoryKey) {
        const category = categories[categoryKey];
        if (!category) return;
        categoriaActiva = categoryKey;
        title.textContent = traducirCertificado(titleKeys[categoryKey], category.title);
        gallery.replaceChildren();

        category.files.forEach(function (file) {
            const imageUrl = getImageUrl(category, file);
            const certificateName = getDisplayName(file);
            const item = document.createElement("article");
            item.className = "certificate-item";

            const image = document.createElement("img");
            image.className = "certificate-image";
            image.src = imageUrl;
            image.alt = certificateName;
            image.loading = "lazy";
            image.decoding = "async";
            image.tabIndex = 0;
            image.setAttribute("role", "button");
            image.setAttribute("aria-label", traducirCertificado(
                "cvCertificateEnlargeImage", "Ampliar imagen"
            ) + ": " + certificateName);

            image.addEventListener("click", function () {
                abrirVisorImagen(image, certificateName);
            });
            image.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    abrirVisorImagen(image, certificateName);
                }
            });
            image.addEventListener("error", function () {
                console.error("JPG no encontrado (verificar nombre y carpeta):", imageUrl);
                image.classList.add("certificate-preview-error");
                image.removeAttribute("role");
                image.removeAttribute("tabindex");
                image.setAttribute("aria-label", traducirCertificado(
                    "cvCertificatePreviewError", "Vista previa no disponible"
                ) + ": " + certificateName);
            });

            const link = document.createElement("a");
            link.href = imageUrl;
            link.textContent = traducirCertificado("cvCertificateOpenImage", "Abrir imagen");
            link.setAttribute("aria-label", link.textContent + ": " + certificateName);
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            const name = document.createElement("p");
            name.className = "certificate-name";
            name.textContent = certificateName;
            item.append(image, name, link);
            gallery.appendChild(item);
        });

        if (!dialog.open) dialog.showModal();
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

    closeButton.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (event) {
        if (event.target === dialog) dialog.close();
    });
    document.addEventListener("portfolio:languagechange", function () {
        if (dialog.open && categoriaActiva) renderGallery(categoriaActiva);
    });
});
