
/* =========================================================
   NFR-005 — VISOR ACCESIBLE DE EVIDENCIAS QA
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
    const viewer = document.getElementById("qaEvidenceViewer");
    const image = document.getElementById("qaEvidenceViewerImage");
    const original = document.getElementById("qaEvidenceViewerOriginal");
    const closeButton = document.getElementById("qaEvidenceViewerClose");

    if (!viewer || !image || !original || !closeButton) return;

    
    const evidenceLinks = document.querySelectorAll(
        "#evidencia .evidence-links a[href], " +
        "#regresion-bugs details a[href$='.jpg'], " +
        "#regresion-bugs details a[href$='.png']"
    );


    let opener = null;

    function openEvidence(link) {
        opener = link;

        const url = link.getAttribute("href");
        const name = link.textContent.trim();

        image.src = url;
        image.alt = name;
        original.href = url;

        if (!viewer.open) {
            viewer.showModal();
        }

        closeButton.focus();
    }

    function closeEvidence() {
        if (viewer.open) {
            viewer.close();
        }
    }

    evidenceLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            openEvidence(link);
        });

        link.addEventListener("keydown", function (event) {
            if (event.code === "Space" || event.key === " ") {
                event.preventDefault();
                openEvidence(link);
            }
        });
    });

    closeButton.addEventListener("click", closeEvidence);

    viewer.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            event.preventDefault();
            closeEvidence();
            return;
        }

        if (
            document.activeElement === closeButton &&
            (event.key === "Enter" ||
             event.key === " " ||
             event.code === "Space")
        ) {
            event.preventDefault();
            closeEvidence();
        }
    });

    viewer.addEventListener("close", function () {
        image.removeAttribute("src");

        if (opener && opener.isConnected) {
            opener.focus();
        }

        opener = null;
    });
});

