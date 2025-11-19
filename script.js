// Attend que le contenu de la page soit entièrement chargé
document.addEventListener('DOMContentLoaded', function() {

    // --- SÉLECTEURS D'ÉLÉMENTS ---
    const form = document.getElementById('cv-form');
    const exportButton = document.getElementById('export-pdf');
    const addExperienceBtn = document.getElementById('add-experience');
    const addFormationBtn = document.getElementById('add-formation');
    const accentColorInput = document.getElementById('accent-color');
    const addSkillGroupBtn = document.getElementById('add-skill-group');
    const templateSelect = document.getElementById('template-select');
    const fontSelect = document.getElementById('font-select');
    const profilePicInput = document.getElementById('profile-pic');

    // --- FONCTION PRINCIPALE DE RENDU ---
    function renderPreview() {
        // Infos personnelles
        document.getElementById('preview-nom').innerText = document.getElementById('nom').value || 'Votre Nom';
        document.getElementById('preview-titre').innerText = document.getElementById('titre').value || 'Votre Titre';
        
        // Contact avec icônes
        const contactPreview = document.getElementById('preview-contact');
        let contactHTML = '';

        const email = document.getElementById('contact-email').value;
        const phone = document.getElementById('contact-phone').value;
        const address = document.getElementById('contact-address').value;

        if (email) {
            contactHTML += `<div class="contact-item"><i class="fa-solid fa-envelope"></i><span>${email}</span></div>`;
        }
        if (phone) {
            contactHTML += `<div class="contact-item"><i class="fa-solid fa-phone"></i><span>${phone}</span></div>`;
        }
        if (address) {
            contactHTML += `<div class="contact-item"><i class="fa-solid fa-location-dot"></i><span>${address}</span></div>`;
        }

        contactPreview.innerHTML = contactHTML;

        // Centres d'intérêt
        const interestsText = document.getElementById('interests').value;
        const interestsPreview = document.getElementById('preview-interests');
        const interestsList = interestsText.split('\n')
            .filter(interest => interest.trim() !== '') // Enlève les lignes vides
            .map(interest => `<li>${interest.trim()}</li>`) // Crée un élément de liste
            .join('');
        
        interestsPreview.innerHTML = interestsList ? `<ul>${interestsList}</ul>` : '';

        // Rendu des sections dynamiques (Expérience et Formation)
        renderSection('experience');
        renderSection('formation');
        renderSkills();
    }

    function renderSection(sectionName) {
        const entriesContainer = document.getElementById(`${sectionName}-entries`);
        const previewContainer = document.getElementById(`preview-${sectionName}`);
        const sectionPreviewWrapper = document.getElementById(`preview-${sectionName}-section`);

        previewContainer.innerHTML = '';

        const entries = entriesContainer.querySelectorAll('.entry');
        entries.forEach(entry => {
            const title = entry.querySelector(`[data-type="title"]`).value;
            const location = entry.querySelector(`[data-type="location"]`).value;
            const dates = entry.querySelector(`[data-type="dates"]`).value;
            const description = entry.querySelector(`[data-type="description"]`).value;

            if (title || location || dates || description) {
                const entryDiv = document.createElement('div');
                entryDiv.classList.add('cv-entry');
                entryDiv.innerHTML = `
                    <h3>${title}</h3>
                    <div class="entry-details"><span class="location">${location}</span><span class="date">${dates}</span></div>
                    <div class="description">${description.replace(/\n/g, '<br>')}</div>
                `;
                previewContainer.appendChild(entryDiv);
            }
        });

        // Masque la section entière dans l'aperçu si elle est vide
        if (sectionPreviewWrapper) {
            sectionPreviewWrapper.style.display = entries.length > 0 ? 'block' : 'none';
        }
    }

    function renderSkills() {
        const groupsContainer = document.getElementById('skill-groups-container');
        const previewContainer = document.getElementById('preview-skills');
        previewContainer.innerHTML = '';

        const groupEntries = groupsContainer.querySelectorAll('.skill-group-entry');
        groupEntries.forEach(group => {
            const groupTitle = group.querySelector('[data-type="group-title"]').value;
            const groupPreviewDiv = document.createElement('div');
            groupPreviewDiv.classList.add('skill-group-preview');
            
            if (groupTitle) {
                groupPreviewDiv.innerHTML = `<h4>${groupTitle}</h4>`;
            }

            const skillEntries = group.querySelectorAll('.skill-entry-item');
            skillEntries.forEach(skill => {
                const name = skill.querySelector('[data-type="skill-name"]').value;
                const level = skill.querySelector('[data-type="skill-level"]').value;

                if (name) {
                    const skillDiv = document.createElement('div');
                    skillDiv.classList.add('skill-entry');
                    let starsHTML = '';
                    for (let i = 1; i <= 5; i++) {
                        starsHTML += `<i class="fa-solid fa-star ${i > level ? 'empty' : ''}"></i>`;
                    }
                    skillDiv.innerHTML = `<p class="skill-name">${name}</p><div class="skill-stars">${starsHTML}</div>`;
                    groupPreviewDiv.appendChild(skillDiv);
                }
            });
            previewContainer.appendChild(groupPreviewDiv);
        });
    }

    // --- GESTION DES ÉVÉNEMENTS ---

    // Écouteur global sur le formulaire pour la mise à jour en temps réel
    document.body.addEventListener('input', renderPreview);

    // Ajout dynamique de champs
    function addEntry(sectionName, placeholderTitle, placeholderDesc) {
        const container = document.getElementById(`${sectionName}-entries`);
        const newEntry = document.createElement('div');
        newEntry.classList.add('entry');
        newEntry.innerHTML = `
            <button type="button" class="delete-entry">&times;</button>
            <input type="text" placeholder="${placeholderTitle}" data-type="title" style="font-weight: bold;">
            <div class="form-row-flex">
                <input type="text" placeholder="Lieu (ex: Paris)" data-type="location">
                <input type="text" placeholder="Dates (ex: 2020 - 2023)" data-type="dates">
            </div>
            <textarea placeholder="${placeholderDesc}" data-type="description"></textarea>
        `;
        container.appendChild(newEntry);
    }

    function addSkillGroup() {
        const container = document.getElementById('skill-groups-container');
        const newGroup = document.createElement('div');
        newGroup.classList.add('entry', 'skill-group-entry');
        newGroup.innerHTML = `
            <button type="button" class="delete-entry">&times;</button>
            <input type="text" placeholder="Nom du groupe (ex: Développement Web)" data-type="group-title">
            <div class="skills-in-group-container"></div>
            <button type="button" class="add-skill-to-group" style="background-color: #28a745;">Ajouter une compétence</button>
        `;
        container.appendChild(newGroup);
        // Ajoute une première compétence vide dans le nouveau groupe
        addSkillEntry(newGroup.querySelector('.skills-in-group-container'));
    }

    function addSkillEntry(container) {
        const newSkill = document.createElement('div');
        newSkill.classList.add('skill-entry-item');
        newSkill.innerHTML = `
            <input type="text" placeholder="Compétence (ex: JavaScript)" data-type="skill-name">
            <label>Niveau: <input type="range" min="1" max="5" value="3" data-type="skill-level"></label>
            <button type="button" class="delete-entry" style="position: static;">&times;</button>
        `;
        container.appendChild(newSkill);
    }

    addExperienceBtn.addEventListener('click', () => addEntry('experience', 'Titre du poste (ex: Développeur)', 'Description des missions...'));
    addFormationBtn.addEventListener('click', () => addEntry('formation', 'Nom du diplôme (ex: Licence Informatique)', 'Description de la formation...'));
    addSkillGroupBtn.addEventListener('click', addSkillGroup);

    // Gestion de la suppression d'une entrée (via délégation d'événement)
    document.querySelector('.form-section-letter').addEventListener('click', function(e) {
        if (e.target.classList.contains('add-skill-to-group')) {
            const container = e.target.previousElementSibling;
            addSkillEntry(container);
        }
        if (e.target.classList.contains('delete-entry')) {
            e.target.parentElement.remove();
            renderPreview(); // Mettre à jour l'aperçu après suppression
        }
    });

    // Personnalisation (couleur, police)
    accentColorInput.addEventListener('input', (e) => {
        document.documentElement.style.setProperty('--main-color', e.target.value);
    });

    fontSelect.addEventListener('change', (e) => {
        document.documentElement.style.setProperty('--main-font', e.target.value);
    });

    // Changement de modèle
    templateSelect.addEventListener('change', (e) => {
        const cvPreview = document.getElementById('cv-preview');
        cvPreview.className = e.target.value; // Applique la classe du modèle sélectionné

        // Déplace les éléments pour s'adapter au nouveau modèle
        const sidebar = cvPreview.querySelector('.cv-sidebar');
        const main = cvPreview.querySelector('.cv-main');
        const profilePic = cvPreview.querySelector('.profile-pic-container');
        const contactSection = sidebar.querySelector('.sidebar-section'); // Le premier est le contact
        const otherSections = sidebar.querySelectorAll('.sidebar-section:not(:first-child)');

        if (e.target.value === 'template-classic') {
            // Déplace la photo et le contact dans l'en-tête principal
            main.querySelector('.main-header').prepend(profilePic);
            main.querySelector('.main-header').appendChild(contactSection.querySelector('#preview-contact'));
            // Déplace les autres sections (compétences, intérêts) à la fin du corps principal
            otherSections.forEach(section => main.appendChild(section));
        } else { // Si on revient au modèle sidebar
            // On replace tout dans la sidebar
            sidebar.prepend(contactSection);
            sidebar.prepend(profilePic);
            otherSections.forEach(section => sidebar.appendChild(section));
        }
    });

    // Photo de profil
    profilePicInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('preview-profile-pic').src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // --- EXPORTATION PDF ---
    exportButton.addEventListener('click', async function() {
        const elementToExport = document.getElementById('cv-preview');
        const nomFichier = document.getElementById('nom').value || 'cv';
        const loadingOverlay = document.getElementById('loading-overlay');

        // Force une mise à jour du rendu avant l'exportation
        renderPreview();

        // Options pour html2pdf
        const opt = {
            margin:       0,
            filename:     `${nomFichier.replace(/\s+/g, '_')}.pdf`,
            // pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } est important pour les sauts de page
            pagebreak:    { mode: 'avoid-all' },
            image:        { type: 'jpeg', quality: 0.98 },
            // On augmente la qualité (scale) et on s'assure que tout le contenu est capturé
            html2canvas:  { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Affiche l'écran de chargement et désactive le bouton
        loadingOverlay.classList.add('loading');
        exportButton.disabled = true;
        exportButton.innerText = 'Génération en cours...';

        try {
            // Lance la conversion et le téléchargement
            await html2pdf().from(elementToExport).set(opt).save();
        } catch (err) {
            console.error("Erreur lors de la génération du PDF:", err);
            alert("Une erreur est survenue lors de la création du PDF. Veuillez réessayer.");
        } finally {
            // Masque l'écran de chargement et réactive le bouton, que ça réussisse ou non
            loadingOverlay.classList.remove('loading');
            exportButton.disabled = false;
            exportButton.innerText = 'Exporter en PDF';
        }
    });
    
    // --- INITIALISATION ---
    // Ajoute une première entrée vide pour guider l'utilisateur
    addEntry('experience', 'Titre du poste (ex: Développeur)', 'Description des missions...');
    addEntry('formation', 'Nom du diplôme (ex: Licence Informatique)', 'Description de la formation...');
    addSkillGroup();
    // Lance un premier rendu
    renderPreview();

});
