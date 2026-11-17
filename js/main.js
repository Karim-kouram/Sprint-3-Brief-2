
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
    updatePagination

} from "./ui.js";

import { chargerPokemon, getCreature, FiltrerPokemon } from "./api.js";
import { setinitialCreatures, setCreatures, getinitialCreatures, getCreatures, addCreatures } from "./state.js";



async function main() {
    showLoading();
    try {
        //initialcreatures = await chargerPokemon(12, 1);
        //creatures = [...initialcreatures];
        setinitialCreatures(await chargerPokemon(12, 1));
        setCreatures(getinitialCreatures());

        // Récupérer la dernière recherche
        const lastSearch = localStorage.getItem("lastSearch") || "";

        const searchNom = document.getElementById("search");
        searchNom.value = lastSearch;

        // Rechercher si une ancienne recherche existe
        if (lastSearch) {
            setCreatures(await getCreature(lastSearch));
        }

        afficherPokemon(getCreatures());
        // État initial
        updateTeamButtons();

    } catch (error) {
        console.error("Erreur lors du chargement :", error);

        if (error instanceof TypeError) {
            showMessage("Network error! Please check your internet connection.");
        } else {
            showMessage("Something went wrong. Please try again.");
        }

    } finally {
        hideLoading();
    }
}

await main();



let initialcreatures = getinitialCreatures();
let creatures = getCreatures();



let currentPage = 1;
const limit = 12;

const pagination = document.getElementById("pagination");

pagination.addEventListener("click", async function (e) {

    const button = e.target.closest(".page-btn");

    if (!button) return;

    currentPage = Number(button.dataset.page);

    try {
        const newCreatures = await chargerPokemon(limit, currentPage);

        setCreatures(newCreatures);

        afficherPokemon(newCreatures);

        updateTeamButtons();

        updatePagination(currentPage);

    } catch (error) {
        console.error("Erreur :", error);
    }
});

// Page 1 au démarrage
updatePagination(currentPage);

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

// Événement sur les cards : anciennes et nouvelles
cardsSection.addEventListener("click", function (e) {
    const creatures = getCreatures();
    const card = e.target.closest(".card");

    const fa_heart = e.target.closest(".btn-favorite");

    if (!card || !cardsSection.contains(card)) return;

    const id = card.dataset.id;
    const pokemon = creatures.find(p => p.id === id);

    if (!pokemon) return;

    if (fa_heart) {
        if (favoris.includes(id)) {
            // Retirer des favoris
            favoris = favoris.filter(fav => fav !== id);
        } else {
            // Ajouter aux favoris
            favoris.push(id);
        }

        // Sauvegarder dans LocalStorage
        localStorage.setItem("favoris", JSON.stringify(favoris));

        // Actualiser l'affichage
        afficherPokemon(creatures);
        return;
    }

    if (e.target.closest(".btn-add-team")) {
        AfficherEquipe(pokemon);
        updateTeamButtons();
        return;
    };

    const isActive = card.classList.contains("active");

    document.querySelectorAll(".card.active").forEach(a => {
        a.classList.remove("active");
    });

    if (isActive) {
        fermerDetail();
    } else {
        card.classList.add("active");
        afficherDetail(pokemon);
    }
});


// Événement du bouton fermer
Section.addEventListener("click", function (e) {
    const creatures = getCreatures();
    if (e.target.closest(".Annule")) {
        fermerDetail();
        return;

    }

    const button = e.target.closest(".btn-add-team");

    if (!button) return;

    const article = e.target.closest(".card");

    if (!article || !Section.contains(article)) return;

    const id = article.dataset.id;
    const pokemon = creatures.find(p => p.id === id);

    if (!pokemon) return;

    const count = document.querySelectorAll("#team article").length;

    if (count >= 6) {
        button.disabled = true;
        return;
    }

    AfficherEquipe(pokemon);
    updateTeamButtons();



});

// -------------------------------------------------------------
// 3. RECHERCHE
// La liste se met à jour pendant la saisie d'un nom
// (sans tenir compte des majuscules).
// -------------------------------------------------------------

let searchNom = document.getElementById("search");
searchNom.addEventListener("input", async function () {
    localStorage.setItem("lastSearch", searchNom.value);
    console.log("Saved:", localStorage.getItem("lastSearch"));
    showLoading();
    hideMessage();
    try {

        if (!searchNom.value) {
            //setCreatures(initialcreatures);
            hideMessage();
            afficherPokemon(creatures);
            updateTeamButtons();
            return;
        }
        const newTableau = await getCreature(searchNom.value.trim());
        //setCreatures(newTableau);
        if (!newTableau) {
            showMessage(" Erreur 404 : Aucune créature trouvée pour .");
            return;
        }
        hideMessage();
        afficherPokemon(newTableau);
        updateTeamButtons();
    } catch (error) {
        console.error("Erreur lors du chargement :", error);

        if (error instanceof TypeError) {
            showMessage("Network error! Please check your internet connection.");
        } else {
            showMessage("Something went wrong. Please try again.");
        }

    } finally {
        hideLoading();
    }
})

// -------------------------------------------------------------
// 4. FILTRE
// Les boutons de type n'affichent que les créatures de ce type ;
// « Tous » réinitialise le filtre.
// La recherche et le filtre fonctionnent ENSEMBLE.
// -------------------------------------------------------------

let filterType = document.getElementById("filters");

filterType.querySelector(".chip").classList.add("Active");

filterType.addEventListener("click",async function (e) {
    
    const button = e.target.closest(".chip");

    if (!button) return;

    filterType.querySelectorAll(".chip").forEach(a => {
        a.classList.remove("Active");
    });

    const type = button.textContent.trim();

    if (type === "favoris") {

        const pokemonFavoris = creatures.filter(pokemon =>
            favoris.includes(pokemon.id)
        );

        afficherPokemon(pokemonFavoris);
        updateTeamButtons();

        button.classList.add("Active");
        return;
    }

    if (type === "Tous") {

        afficherPokemon(creatures);
        updateTeamButtons();

        button.classList.add("Active");
        return;
    }

    const newTableau = await FiltrerPokemon(type);
    console.log(newTableau)
    afficherPokemon(newTableau);
    updateTeamButtons();

    button.classList.add("Active");

});

// -------------------------------------------------------------
// 5. CRÉER UNE CRÉATURE
// Validez chaque champ du formulaire avec une expression régulière
// (voir le tableau du brief). Affichez le message d'erreur sous le
// champ, et n'ajoutez jamais une créature invalide.
// -------------------------------------------------------------

const form = document.getElementById("creature-form");

// Expressions régulières
const regex_numero = /^#\d{3}$/;
const regex_nom = /^[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9 .'-]{1,29}$/;
const regex_statistique = /^\d{1,3}$/;
const regex_image = /^https:\/\/\S+\.(png|jpe?g|webp|gif)$/i;
const regex_description = /^[\s\S]{10,200}$/;

// Récupération des éléments
const id = document.querySelector('[name="id"]');
const name = document.querySelector('[name="name"]');
const type = document.querySelector('[name="type"]');
const level = document.querySelector('[name="level"]');
const stat = document.querySelectorAll('[name="stat"]');
const image = document.querySelector('[name="image"]');
const description = document.querySelector('[name="description"]');

const errorMessage = document.querySelectorAll(".error-message");

const button = document.querySelector('button[type="submit"]');
button.disabled = true;

form.addEventListener("input", function () {

    let notValide = false;

    // Validation du numéro
    if (!regex_numero.test(id.value)) {
        id.style.border = "2px solid red";
        errorMessage[0].textContent = "Numéro invalide (exemple : #001)";
        notValide = true;
    } else {
        id.style.border = "2px solid green";
        errorMessage[0].textContent = "";
    }
    // Validation du nom
    if (!regex_nom.test(name.value)) {
        name.style.border = "2px solid red";
        errorMessage[1].textContent = "nom invalide .";
        notValide = true;
    } else {
        name.style.border = "2px solid green";
        errorMessage[1].textContent = "";
    }
    // Validation du type
    if (type.value === "") {
        type.style.border = "2px solid red";
        errorMessage[2].textContent = "Veuillez sélectionner un type";
        notValide = true;
    } else {
        type.style.border = "2px solid green";
        errorMessage[2].textContent = "";
    }
    // Validation du level
    if (level.value === "") {
        level.style.border = "2px solid red";
        errorMessage[3].textContent = "Veuillez saisir un level";
        notValide = true;
    } else {
        level.style.border = "2px solid green";
        errorMessage[3].textContent = "";
    }
    // Validation du statistique
    if (!regex_statistique.test(stat[0].value)) {
        stat[0].style.border = "2px solid red";
        errorMessage[4].textContent = "statistique invalide (exemple : 0 à 999)";
        notValide = true;
    } else {
        stat[0].style.border = "2px solid green";
        errorMessage[4].textContent = "";
    }
    // Validation du statistique
    if (!regex_statistique.test(stat[1].value)) {
        stat[1].style.border = "2px solid red";
        errorMessage[5].textContent = "statistique invalide (exemple : 0 à 999)";
        notValide = true;
    } else {
        stat[1].style.border = "2px solid green";
        errorMessage[5].textContent = "";
    }
    // Validation du statistique
    if (!regex_statistique.test(stat[2].value)) {
        stat[2].style.border = "2px solid red";
        errorMessage[6].textContent = "statistique invalide (exemple : 0 à 999)";
        notValide = true;
    } else {
        stat[2].style.border = "2px solid green";
        errorMessage[6].textContent = "";
    }
    // Validation du limage
    if (!regex_image.test(image.value)) {
        image.style.border = "2px solid red";
        errorMessage[7].textContent = "limage invalide (ex: https://…/image.png)";
        notValide = true;
    } else {
        image.style.border = "2px solid green";
        errorMessage[7].textContent = "";
    }
    // Validation du description
    if (!regex_description.test(description.value)) {
        description.style.border = "2px solid red";
        errorMessage[8].textContent = "description invalide (exemple: 10 à 200 caractères)";
        notValide = true;
    } else {
        description.style.border = "2px solid green";
        errorMessage[8].textContent = "";
    }

    // Activation / désactivation du bouton
    button.disabled = notValide;
});

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const section = document.getElementById("grid");
    const articles = section.querySelectorAll(".card");

    if (!articles) return;

    let dejaAjoute = false;
    articles.forEach((article) => {
        if (article.dataset.id === id.value) {
            dejaAjoute = true;
        }
    })


    if (dejaAjoute) {
        alert("This Pokémon Already Exist in Page .")
        return;
    }
    creatures.push({
        id: id.value,
        name: name.value,
        type: type.value,
        level: level.value,
        stats: {
            hp: stat[0].value,
            attack: stat[1].value,
            defence: stat[2].value
        },
        image: image.value,
        description: description.value
    });

    afficherPokemon(creatures);

    form.reset();
    button.disabled = true;
});

// Supprimer un Pokémon de l'équipe
team.addEventListener("click", function (e) {
    const button = e.target.closest(".btn-delete");

    if (!button) return;

    const article = button.closest("article");

    if (!article) return;

    supprimerEquipe(article.dataset.id);

    updateTeamButtons();
});