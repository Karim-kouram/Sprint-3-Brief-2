
import {
    afficherPokemon,
    afficherDetail,
    fermerDetail,
    AfficherEquipe,
    supprimerEquipe,
    updateTeamButtons,
    showLoading,
    hideLoading,
    showMessage,
    hideMessage,
    

} from "./ui.js";

import {
    chargerPokemon,
    getCreature,
    getCreatureById,
    FiltrerPokemon,
    FiltrerApi,
    ajouterCreature,
    modifierCreature,
    supprimerCreature
} from "./api.js";

import { setinitialCreatures, setCreatures, getinitialCreatures, getCreatures, addCreatures } from "./state.js";


async function main() {
    showLoading();
    hideMessage();

    try {
        // Charger toutes les créatures depuis l'API
        const data = await chargerPokemon();

        setinitialCreatures(data);
        setCreatures(data);

        // Récupérer le dernier filtre
        const lastFiltre = localStorage.getItem("lastFiltre") || "Tous";

        // Récupérer les éléments
        const filterType = document.getElementById("filters");

        // Activer le filtre sauvegardé
        filterType.querySelectorAll(".chip").forEach(chip => {
            chip.classList.remove("Active");

            if (chip.textContent.trim() === lastFiltre) {
                chip.classList.add("Active");
            }
        });

        // Afficher les créatures selon le filtre sauvegardé
        const filteredCreatures = await getCreature("", lastFiltre);

        afficherPokemon(filteredCreatures);

        updateTeamButtons();

    } catch (error) {
        console.error("Erreur lors du chargement :", error);

        showMessage(
            "Impossible de charger les créatures. Vérifiez que l'API est démarrée."
        );

    } finally {
        hideLoading();
    }
}

await main();

let initialcreatures = getinitialCreatures();
let creatures = getCreatures();



// let currentPage = 1;
// const limit = 12;

// const pagination = document.getElementById("pagination");

// pagination.addEventListener("click", async function (e) {

//     const button = e.target.closest(".page-btn");

//     if (!button) return;

//     currentPage = Number(button.dataset.page);

//     try {
//         const newCreatures = await chargerPokemon(limit, currentPage);

//         setCreatures(newCreatures);

//         afficherPokemon(newCreatures);

//         updateTeamButtons();

//         updatePagination(currentPage);

//     } catch (error) {
//         console.error("Erreur :", error);
//     }
// });

// // Page 1 au démarrage
// updatePagination(currentPage);

async function rechargerGrille() {
    const search = searchNom.value.trim();

    const filtreActif = document.querySelector("#filters .chip.Active");

    const type = filtreActif
        ? filtreActif.textContent.trim()
        : "Tous";

    const sort = sortSelect.value;

    const data = await FiltrerApi(search, type, sort);

    setCreatures(data);
    afficherPokemon(data);

    updateTeamButtons();
}

// -------------------------------------------------------------
// 6. MON ÉQUIPE
// Boutons « Ajouter à l'équipe » et « Retirer », gérés avec UN SEUL
// écouteur sur la grille et UN SEUL sur l'équipe (délégation).
// -------------------------------------------------------------
let favoris = JSON.parse(localStorage.getItem("favoris")) || [];

const Section = document.getElementById("detail");
const cardsSection = document.getElementById("grid");
const team = document.getElementById("team");

Section.innerHTML = `
        <div class="text-center">
            <p class="font-display text-xl font-extrabold">
                Aucun Pokémon sélectionné.
            </p>
        </div>
    `;


// =====================================================
// CLIC SUR LES CARDS
// =====================================================

cardsSection.addEventListener("click", async function (e) {

    const card = e.target.closest(".card");

    const favoriteButton = e.target.closest(".btn-favorite");

    if (!card || !cardsSection.contains(card)) return;

    const id = card.dataset.id;

    const pokemon = getCreatures().find(p => String(p.id) === String(id));

    if (!pokemon) return;


    // FAVORIS
    if (favoriteButton) {

        if (favoris.includes(id)) {
            favoris = favoris.filter(fav => fav !== id);
        } else {
            favoris.push(id);
        }

        localStorage.setItem("favoris", JSON.stringify(favoris));

        afficherPokemon(getCreatures());

        return;
    }


    // AJOUTER À L'ÉQUIPE
    if (e.target.closest(".btn-add-team")) {

        AfficherEquipe(pokemon);

        updateTeamButtons();

        return;
    }


    // FICHE DETAILLEE
    const isActive = card.classList.contains("active");

    document.querySelectorAll(".card.active").forEach(a => {
        a.classList.remove("active");
    });

    if (isActive) {

        fermerDetail();

        return;
    }

    card.classList.add("active");

    // Message de chargement
    Section.innerHTML = `
        <div class="text-center p-6">
            <p class="text-xl font-bold">
                Chargement…
            </p>
        </div>
    `;

    try {

        // GET /creatures/:id
        const detailPokemon = await getCreatureById(id);

        afficherDetail(detailPokemon);

    } catch (error) {

        console.error("Erreur fiche détaillée :", error);

        if (error.message.includes("404")) {

            Section.innerHTML = `
                <div class="text-center p-6">
                    <p class="text-xl font-bold text-red-500">
                        Créature introuvable
                    </p>
                </div>
            `;

        } else {

            Section.innerHTML = `
                <div class="text-center p-6">
                    <p class="text-xl font-bold text-red-500">
                        Impossible de charger la créature.
                    </p>
                </div>
            `;
        }
    }
});


// Événement du bouton fermer
Section.addEventListener("click", function (e) {
    
    if (e.target.closest(".Annule")) {
        fermerDetail();
        return;

    }

    const button = e.target.closest(".btn-add-team");

    if (!button) return;

    const article = e.target.closest(".card");

    if (!article || !Section.contains(article)) return;

    const id = article.dataset.id;
    const pokemon = getCreatures().find(p => String(p.id) === String(id));

    if (!pokemon) return;

    const count = document.querySelectorAll("#team article").length;

    if (count >= 6) {
        button.disabled = true;
        return;
    }

    AfficherEquipe(pokemon);
    updateTeamButtons();



});


cardsSection.addEventListener("click", async function (e) {
    const btnDelete = e.target.closest(".btn-delete");

    if (!btnDelete) return;

    const id = btnDelete.dataset.id;

    // Confirmation
    const confirmation = confirm(
        "Voulez-vous vraiment supprimer cette créature ?"
    );

    if (!confirmation) return;

    try {
        // État : envoi
        btnDelete.disabled = true;

        // DELETE depuis l'API
        await supprimerCreature(id);

        // Recharger les créatures
        const data = await chargerPokemon();

        setinitialCreatures(data);
        setCreatures(data);

        // Afficher la liste actualisée
        afficherPokemon(data);

        updateTeamButtons();

        // État : succès
        showMessage("Créature supprimée avec succès !");

        // Recharger en gardant recherche, filtre et tri
        await rechargerGrille();
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);

        showMessage("Erreur lors de la suppression de la créature.");
    } finally {
        // Fin de l'opération
        btnDelete.disabled = false;
    }
});

// =====================================================
// APPLIQUER RECHERCHE + FILTRE + TRI
// =====================================================

async function appliquerFiltres() {
    showLoading();
    hideMessage();

    try {
        const search = searchNom.value.trim();

        const activeChip = filterType.querySelector(".Active");

        const type = activeChip
            ? activeChip.textContent.trim()
            : "Tous";

        const sort = sortSelect.value;

        // Recherche + filtre + tri
        const newCreatures = await FiltrerApi(
            search,
            type,
            sort
        );

        // Aucune créature trouvée
        if (newCreatures.length === 0) {
            afficherPokemon([]);

            showMessage(
                "Aucune créature ne correspond à votre recherche."
            );

            return;
        }

        hideMessage();

        afficherPokemon(newCreatures);
        updateTeamButtons();

    } catch (error) {
        console.error("Erreur :", error);

        showMessage(
            "Impossible de récupérer les créatures. Vérifiez votre API."
        );

    } finally {
        hideLoading();
    }
}

// =====================================================
// FILTRE
// =====================================================

const filterType = document.getElementById("filters");

filterType.addEventListener("click", async function (e) {
    const button = e.target.closest(".chip");

    if (!button) return;

    // Retirer Active des autres chips
    filterType.querySelectorAll(".chip").forEach(chip => {
        chip.classList.remove("Active");
    });

    // Activer le bouton sélectionné
    button.classList.add("Active");

    const type = button.textContent.trim();

    // Sauvegarder le filtre
    localStorage.setItem("lastFiltre", type);

    // Favoris : filtre local
    if (type === "favoris") {
        const pokemonFavoris = creatures.filter(pokemon =>
            favoris.includes(pokemon.id)
        );

        afficherPokemon(pokemonFavoris);
        updateTeamButtons();

        if (pokemonFavoris.length === 0) {
            showMessage("Aucun Pokémon dans les favoris.");
        } else {
            hideMessage();
        }

        return;
    }

    // Tous les autres filtres passent par l'API
    await appliquerFiltres();
});


// =====================================================
// RECHERCHE
// =====================================================

const searchNom = document.getElementById("search");

searchNom.addEventListener("input", async function () {
    await appliquerFiltres();
});


// =====================================================
// TRI
// =====================================================

const sortSelect = document.getElementById("sortSelect");

sortSelect.addEventListener("change", async function () {
    await appliquerFiltres();
});

// =====================================================
// VALIDATION D'UNE CREATURE
// =====================================================

export function validateCreature(data) {

    const errors = {};

    // Nom obligatoire
    if (!data.name || data.name.trim() === "") {
        errors.name = "Le nom est obligatoire.";
    }

    // Type obligatoire
    if (!data.type || data.type === "") {
        errors.type = "Veuillez choisir un type.";
    }

    // HP
    if (
        data.stats.hp < 1 ||
        data.stats.hp > 255 ||
        !Number.isInteger(data.stats.hp)
    ) {
        errors.hp = "HP doit être entre 1 et 255.";
    }

    // Attack
    if (
        data.stats.attack < 1 ||
        data.stats.attack > 255 ||
        !Number.isInteger(data.stats.attack)
    ) {
        errors.attack = "Attack doit être entre 1 et 255.";
    }

    // defense
    if (
        data.stats.defense < 1 ||
        data.stats.defense > 255 ||
        !Number.isInteger(data.stats.defense)
    ) {
        errors.defense = "defense doit être entre 1 et 255.";
    }

    return errors;
}



// =====================================================
// AJOUTER UNE CREATURE
// =====================================================

const form = document.getElementById("creature-form");

const id = document.querySelector('[name="id"]');
const name = document.querySelector('[name="name"]');
const type = document.querySelector('[name="type"]');
const level = document.querySelector('[name="level"]');

const stat = document.querySelectorAll('[name="stat"]');

const image = document.querySelector('[name="image"]');
const description = document.querySelector('[name="description"]');

const errorMessage = document.querySelectorAll(".error-message");

const button = document.querySelector('button[type="submit"]');


// =====================================================
// BROUILLON SESSION STORAGE
// =====================================================

const FORM_STORAGE_KEY = "creatureDraft";


// Récupérer les champs du formulaire
function getFormData() {

    return {
        id: id.value,
        numero : `#${String(id.value).padStart(3, "0")}`,
        name: name.value,
        type: type.value,
        level: level.value,

        stats: {
            hp: stat[0].value,
            attack: stat[1].value,
            defense: stat[2].value
        },

        image: image.value,
        description: description.value
    };
}


// Sauvegarder le brouillon
function saveDraft() {

    const draft = getFormData();

    sessionStorage.setItem(
        FORM_STORAGE_KEY,
        JSON.stringify(draft)
    );
}


// Restaurer le brouillon
function restoreDraft() {

    const draft = sessionStorage.getItem(FORM_STORAGE_KEY);

    if (!draft) return;

    const data = JSON.parse(draft);

    id.value = data.id || "";
    name.value = data.name || "";
    type.value = data.type || "";
    level.value = data.level || "";

    stat[0].value = data.stats?.hp || "";
    stat[1].value = data.stats?.attack || "";
    stat[2].value = data.stats?.defense || "";

    image.value = data.image || "";
    description.value = data.description || "";
}


// Restaurer au démarrage
restoreDraft();

// =====================================================
// VALIDATION
// =====================================================

function validateForm() {

    const data = getFormData();

    // Convertir les statistiques en nombres
    data.stats.hp = Number(data.stats.hp);
    data.stats.attack = Number(data.stats.attack);
    data.stats.defense = Number(data.stats.defense);

    const errors = validateCreature(data);

    // Effacer les anciens messages
    errorMessage.forEach(message => {
        message.textContent = "";
    });

    // Nom
    if (errors.name) {
        errorMessage[1].textContent = errors.name;
        name.style.border = "2px solid red";
    } else {
        name.style.border = "2px solid green";
    }

    // Type
    if (errors.type) {
        errorMessage[2].textContent = errors.type;
        type.style.border = "2px solid red";
    } else {
        type.style.border = "2px solid green";
    }

    // HP
    if (errors.hp) {
        errorMessage[4].textContent = errors.hp;
        stat[0].style.border = "2px solid red";
    } else {
        stat[0].style.border = "2px solid green";
    }

    // Attack
    if (errors.attack) {
        errorMessage[5].textContent = errors.attack;
        stat[1].style.border = "2px solid red";
    } else {
        stat[1].style.border = "2px solid green";
    }

    // defense
    if (errors.defense) {
        errorMessage[6].textContent = errors.defense;
        stat[2].style.border = "2px solid red";
    } else {
        stat[2].style.border = "2px solid green";
    }

    // Bouton
    button.disabled = Object.keys(errors).length > 0;

    return Object.keys(errors).length === 0;
}



// =====================================================
// MODE MODIFICATION
// =====================================================

let editingCreatureId = null;

// =====================================================
// MODIFIER UNE CREATURE
// =====================================================

const idInput = id;
const nameInput = name;
const typeInput = type;
const levelInput = level;

const statInputs = stat;

const imageInput = image;
const descriptionInput = description;

cardsSection.addEventListener("click", async function (e) {

    const editButton = e.target.closest(".btn-edit");

    if (!editButton) return;

    const id = editButton.dataset.id;

    try {

        showLoading();
        hideMessage();

        // GET /creatures/:id
        const pokemon = await getCreatureById(id);

        // Activer le mode modification
        editingCreatureId = pokemon.id;

        // Remplir le formulaire
        idInput.value = pokemon.id;
        nameInput.value = pokemon.name;
        typeInput.value = pokemon.type;
        levelInput.value = pokemon.level;

        statInputs[0].value = pokemon.stats.hp;
        statInputs[1].value = pokemon.stats.attack;
        statInputs[2].value = pokemon.stats.defense;

        imageInput.value = pokemon.image;
        descriptionInput.value = pokemon.description;

        // Modifier le titre du formulaire
        const formTitle = form.querySelector("h2");

        if (formTitle) {
            formTitle.textContent = "Modifier une créature";
        }

        // Modifier le bouton submit
        button.textContent = "Modifier";

        // Afficher le formulaire
        form.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        // Valider les données chargées
        validateForm();

    } catch (error) {

        console.error("Erreur :", error);

        showMessage(
            "Impossible de récupérer la créature."
        );

    } finally {

        hideLoading();
    }
});

// =====================================================
// INPUT : VALIDATION + SESSION STORAGE
// =====================================================

form.addEventListener("input", function () {

    saveDraft();

    validateForm();

});

// =====================================================
// SUBMIT : AJOUT OU MODIFICATION
// =====================================================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    // Vérification de la validation
    if (!validateForm()) {
        return;
    }

    const data = getFormData();

    // Convertir les statistiques en nombres
    data.stats.hp = Number(data.stats.hp);
    data.stats.attack = Number(data.stats.attack);
    data.stats.defense = Number(data.stats.defense);

    button.disabled = true;

    showLoading();
    hideMessage();

    try {

        let result;

        // ==========================================
        // MODE MODIFICATION
        // ==========================================

        if (editingCreatureId !== null) {

            // PUT /creatures/:id
            result = await modifierCreature(
                editingCreatureId,
                data
            );

            showMessage(
                "Créature modifiée avec succès !"
            );

        }

        // ==========================================
        // MODE AJOUT
        // ==========================================

        else {

            // POST /creatures
            result = await ajouterCreature(data);

            showMessage(
                "Créature ajoutée avec succès !"
            );
        }


        // ==========================================
        // METTRE À JOUR LES DONNÉES
        // ==========================================

        const updatedCreatures = await chargerPokemon();

        setCreatures(updatedCreatures);

        creatures = getCreatures();

        setinitialCreatures(updatedCreatures);

        initialcreatures = getinitialCreatures();


        // ==========================================
        // RAFRAÎCHIR L'AFFICHAGE
        // ==========================================

        await appliquerFiltres();

        updateTeamButtons();


        // ==========================================
        // SUPPRIMER LE BROUILLON
        // ==========================================

        sessionStorage.removeItem(FORM_STORAGE_KEY);


        // ==========================================
        // RÉINITIALISER LE FORMULAIRE
        // ==========================================

        form.reset();

        editingCreatureId = null;

        // Garder recherche, filtre et tri
        await rechargerGrille();

        // Restaurer le titre
        const formTitle = form.querySelector("h2");

        if (formTitle) {
            formTitle.textContent = "Ajouter une créature";
        }

        // Restaurer le texte du bouton
        button.textContent = "Ajouter";


        // Réinitialiser les bordures
        [
            nameInput,
            typeInput,
            statInputs[0],
            statInputs[1],
            statInputs[2]
        ].forEach(field => {
            field.style.border = "";
        });


        // Effacer les messages d'erreur
        errorMessage.forEach(message => {
            message.textContent = "";
        });

    } catch (error) {

        console.error("Erreur :", error);

        showMessage(
            editingCreatureId !== null
                ? "Erreur : impossible de modifier la créature."
                : "Erreur : impossible d'ajouter la créature."
        );

    } finally {

        hideLoading();

        button.disabled = false;
    }
});


// =====================================================
// RESTAURER ET VALIDATION AU DEMARRAGE
// =====================================================

validateForm();

// Supprimer un Pokémon de l'équipe
team.addEventListener("click", function (e) {
    const button = e.target.closest(".btn-delete");

    if (!button) return;

    const article = button.closest("article");

    if (!article) return;

    supprimerEquipe(article.dataset.id);

    updateTeamButtons();
});