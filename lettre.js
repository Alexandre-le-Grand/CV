document.addEventListener('DOMContentLoaded', function() {

    const exportButton = document.getElementById('export-letter-pdf');

    // --- FONCTIONS POUR LA LETTRE DE MOTIVATION ---
    function renderLetterPreview() {
        // Fonction pour mettre à jour un champ simple
        const updateField = (inputId, previewId) => {
            const input = document.getElementById(inputId);
            document.getElementById(previewId).innerText = input.value || input.placeholder;
        };
        // Fonction pour mettre à jour un champ multiligne
        const updateTextarea = (inputId, previewId) => {
            const input = document.getElementById(inputId);
            const content = input.value || input.placeholder;
            document.getElementById(previewId).innerHTML = content.replace(/\n/g, '<br>');
        };

        updateTextarea('letter-sender', 'preview-letter-sender');
        updateTextarea('letter-recipient', 'preview-letter-recipient');
        updateField('letter-place-date', 'preview-letter-place-date');
        updateField('letter-subject', 'preview-letter-subject');
        updateTextarea('letter-body', 'preview-letter-body');
        updateField('letter-closing', 'preview-letter-closing');
        updateField('letter-signature', 'preview-letter-signature');
    }

    // Écouteur pour la mise à jour en temps réel
    document.getElementById('letter-form').addEventListener('input', renderLetterPreview);

    // --- EXPORTATION PDF ---
    exportButton.addEventListener('click', async function() {
        const elementToExport = document.getElementById('letter-preview');
        const loadingOverlay = document.getElementById('loading-overlay');

        renderLetterPreview();

        const opt = {
            margin:       10, // Marges en mm (ex: 15mm)
            filename:     'lettre_de_motivation.pdf',
            pagebreak:    { mode: 'avoid-all' },
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Affiche l'écran de chargement
        loadingOverlay.classList.add('loading');
        exportButton.disabled = true;
        exportButton.innerText = 'Génération en cours...';

        try {
            // Lance la conversion
            await html2pdf().from(elementToExport).set(opt).save();
        } catch (err) {
            console.error("Erreur lors de la génération du PDF:", err);
            alert("Une erreur est survenue lors de la création du PDF. Veuillez réessayer.");
        } finally {
            // Masque l'écran de chargement
            loadingOverlay.classList.remove('loading');
            exportButton.disabled = false;
            exportButton.innerText = 'Exporter en PDF';
        }
    });

    // --- INITIALISATION ---
    // Lance un premier rendu pour afficher les placeholders
    renderLetterPreview();

});