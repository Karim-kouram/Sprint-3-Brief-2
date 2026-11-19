
// -------------------------------------------------------------
// 1. afficherPokemon
// Supprimez les cartes écrites à la main dans index.html et
// construisez la grille à partir du tableau `creatures`.
// -------------------------------------------------------------



export function afficherPokemon(Tableau) {
    let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
    const section = document.getElementById("grid");
    section.innerHTML = "";

    Tableau.forEach((pokemon) => {
        const article = document.createElement("article");

        article.dataset.id = pokemon.id;
        article.className = "card h-[300px] flex flex-col gap-3 rounded-card bg-white p-3 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg";

        const typeColors = {
            feu: "bg-red-500 text-white",
            eau: "bg-blue-500 text-white",
            plante: "bg-green-500 text-white",
            électrique: "bg-yellow-400 text-black",
            glace: "bg-cyan-300 text-black",
            ténèbres: "bg-gray-800 text-white",
            poison: "bg-purple-500 text-white",
            vol: "bg-sky-300 text-black",
            insecte: "bg-lime-500 text-black",
            normal: "bg-stone-400 text-black",
            combat: "bg-orange-600 text-white",
            psy: "bg-pink-500 text-white",
            sol: "bg-amber-600 text-white",
            roche: "bg-yellow-700 text-white",
            spectre: "bg-violet-800 text-white",
            dragon: "bg-indigo-600 text-white",
            acier: "bg-slate-400 text-black",
            fée: "bg-pink-300 text-black"
        };

        const typeColor = typeColors[pokemon.type] || "bg-gray-200 text-black";


        article.innerHTML = `
    <div class="relative flex h-36 items-center justify-center rounded-xl bg-brand-light">
            <img src="${pokemon.image}" alt="logo" class="h-[150px] w-[150px] text-muted">
            <span class="absolute left-3 top-2 font-mono text-sm text-muted">${pokemon.numero}</span>
          </div>
          <div class="flex items-center justify-between gap-2">
            <h3 class="font-display text-xl font-semibold">${pokemon.name}</h3>
            <span class="rounded-full px-3 py-1 text-sm font-bold ${typeColor}">${pokemon.type}</span>
          </div>
          <p class="relative text-sm text-muted">${pokemon.level} · Total 309 <span class="absolute right-3 btn-favorite">
            <i class="fa-${favoris.includes(pokemon.id) ? 'solid' : 'regular'} fa-heart"></i></span>
          </p>
            <button type="button" class="btn-add-team btn-outline hover:bg-yellow-400 hover:text-black hover:border-red-600  hover:shadow-lg transition-all duration-300">
                Ajouter à l'équipe
            </button>`;

        section.append(article);

    })

    const creature_count = document.querySelectorAll('article').length;
    document.getElementById("creature-count").textContent = creature_count;

}




// -------------------------------------------------------------
// 2. DÉTAIL
// Un clic sur une carte ouvre le panneau de détail :
// image, description, et statistiques affichées en barres.
// -------------------------------------------------------------



export function afficherDetail(pokemon) {
    const Section = document.getElementById("detail");
    const typeColors = {
        feu: "bg-red-500 text-white",
        eau: "bg-blue-500 text-white",
        plante: "bg-green-500 text-white",
        électrique: "bg-yellow-400 text-black",
        glace: "bg-cyan-300 text-black",
        ténèbres: "bg-gray-800 text-white",
        poison: "bg-purple-500 text-white",
        vol: "bg-sky-300 text-black",
        insecte: "bg-lime-500 text-black",
        normal: "bg-stone-400 text-black",
        combat: "bg-orange-600 text-white",
        psy: "bg-pink-500 text-white",
        sol: "bg-amber-600 text-white",
        roche: "bg-yellow-700 text-white",
        spectre: "bg-violet-800 text-white",
        dragon: "bg-indigo-600 text-white",
        acier: "bg-slate-400 text-black",
        fée: "bg-pink-300 text-black"
    };

    const typeColor = typeColors[pokemon.type] || "bg-gray-200 text-black";

    Section.innerHTML = `
    <article data-id="${pokemon.id}" class="card"> 
        <div class="flex items-center justify-between">
            <span class="font-mono text-sm text-muted">${pokemon.id} · Détail</span>
            <button type="button" aria-label="Fermer le détail"
                class="Annule btn-outline w-11 px-0">✕</button>
        </div>

        <div class="flex h-[155px] items-center justify-center rounded-2xl bg-brand-light">
            <img src="${pokemon.image}" alt="${pokemon.name}"
                class="h-[170px] w-[170px] object-contain">
        </div>

        <div class="flex items-center justify-between">
            <h2 class="font-display text-3xl font-extrabold">${pokemon.name}</h2>
            <span class="rounded-full px-3 py-1 text-sm font-bold ${typeColor}">${pokemon.type}</span>
        </div>

        <p class="text-gray-700">${pokemon.description}.</p>

        <div class="flex flex-col gap-2 text-sm">
            <div class="grid grid-cols-[80px_1fr_40px] items-center gap-2">
                <span class="font-bold">PV</span>
                <span class="h-3 rounded-full bg-ground">
                    <span class="block h-3 rounded-full ${typeColor}"
                        style="width:${pokemon.stats.hp}%;"></span>
                </span>
                <span class="text-right font-mono">${pokemon.stats.hp}</span>
            </div>

            <div class="grid grid-cols-[80px_1fr_40px] items-center gap-2">
                <span class="font-bold">Attaque</span>
                <span class="h-3 rounded-full bg-ground">
                    <span class="block h-3 rounded-full ${typeColor}"
                        style="width:${pokemon.stats.attack}%;"></span>
                </span>
                <span class="text-right font-mono">${pokemon.stats.attack}</span>
            </div>

            <div class="grid grid-cols-[80px_1fr_40px] items-center gap-2">
                <span class="font-bold">Défense</span>
                <span class="h-3 rounded-full bg-ground">
                    <span class="block h-3 rounded-full ${typeColor}"
                        style="width:${pokemon.stats.defence}%;"></span>
                </span>
                <span class="text-right font-mono">${pokemon.stats.defence}</span>
            </div>
        </div>
        <div class="flex items-center justify-center">
        <button type="button" class="btn-add-team ${typeColor} px-6 py-3 rounded-xl mt-4">Ajouter à l'équipe</button>
        </div>
    </article>`;
}

export function fermerDetail() {
    const Section = document.getElementById("detail");
    Section.innerHTML = `
        <div class="text-center">
            <p class="font-display text-xl font-extrabold">
                Aucun Pokémon sélectionné.
            </p>
        </div>
    `;

    document.querySelectorAll(".card.active").forEach(card => {
        card.classList.remove("active");
    });
}

// -------------------------------------------------------------
// 7. RÈGLES DE L'ÉQUIPE
// 6 créatures au maximum, pas de doublon, un message clair quand
// une action est refusée, et un compteur (x/6).
// -------------------------------------------------------------

export function AfficherEquipe(pokemon) {
    const section = document.getElementById("team");

    if (!section) return;

    const articles = section.querySelectorAll("article");;
    let dejaAjoute = false;
    articles.forEach((article) => {
        if (article.dataset.id === pokemon.id) {
            dejaAjoute = true;
        }
    })


    if (dejaAjoute) {
        alert("This Pokémon Already Exist in my Team .");
        return;
    }

    const article = document.createElement("article");

    article.className = "flex flex-col gap-3 rounded-card bg-white p-2 pb-4";
    article.dataset.id = pokemon.id;

    const typeColors = {
        feu: "bg-red-500 text-white",
        eau: "bg-blue-500 text-white",
        plante: "bg-green-500 text-white",
        électrique: "bg-yellow-400 text-black",
        glace: "bg-cyan-300 text-black",
        ténèbres: "bg-gray-800 text-white",
        poison: "bg-purple-500 text-white",
        vol: "bg-sky-300 text-black",
        insecte: "bg-lime-500 text-black",
        normal: "bg-stone-400 text-black",
        combat: "bg-orange-600 text-white",
        psy: "bg-pink-500 text-white",
        sol: "bg-amber-600 text-white",
        roche: "bg-yellow-700 text-white",
        spectre: "bg-violet-800 text-white",
        dragon: "bg-indigo-600 text-white",
        acier: "bg-slate-400 text-black",
        fée: "bg-pink-300 text-black"
    };

    const typeColor = typeColors[pokemon.type] || "bg-gray-200 text-black";

    article.innerHTML = `
        <div class="relative flex h-[100px] items-center justify-center rounded-xl bg-brand-light">
            <img src="${pokemon.image}" alt="logo" class="h-[90px] w-[90px] text-muted">
            <span class="absolute left-3 top-2 font-mono text-sm text-muted">${pokemon.id}</span>
            <span class="btn-delete absolute right-3 top-2 font-mono text-sm text-muted cursor-pointer">✕</span>
        </div>
        <div class="flex items-center justify-between gap-1">
            <h3 class="font-display text-base font-semibold">${pokemon.name}</h3>
            <span class="rounded-full px-3 py-1 text-sm font-bold ${typeColor}">${pokemon.type}</span>
        </div>`;

    section.append(article);

}

export function supprimerEquipe(id) {
    const section = document.getElementById("team");

    const article = section.querySelector(
        `article[data-id="${id}"]`
    );

    if (article) {
        article.remove();

    }
}


export function updateTeamButtons() {
    const team = document.getElementById("team");
    const count = team.querySelectorAll("article").length;
    const addButtons = document.querySelectorAll(".btn-add-team");

    addButtons.forEach(btn => {
        btn.disabled = count >= 6;
    });
}



export function showLoading() {
    const loader = document.getElementById("loader");
    const cardContainer = document.getElementById("grid");

    loader.classList.remove("hidden");
    loader.classList.add("flex");

    cardContainer.classList.remove("grid");
    cardContainer.classList.add("hidden");
};

export function hideLoading() {
    const loader = document.getElementById("loader");
    const cardContainer = document.getElementById("grid");

    loader.classList.remove("flex");
    loader.classList.add("hidden");

    cardContainer.classList.remove("hidden");
    cardContainer.classList.add("grid");
};

export function showMessage(text) {
    const message = document.getElementById("message");
    const cardContainer = document.getElementById("grid");

    message.textContent = text;
    message.classList.remove("hidden");

    cardContainer.innerHTML = "";
};

export function hideMessage() {
    const message = document.getElementById("message");

    message.textContent = "";
    message.classList.add("hidden");
};

// -------------------------------------------------------------
// BONUS : LocalStorage, Fetch API, tri, comparaison
// -------------------------------------------------------------


// export function updatePagination(currentPage) {
//     document.querySelectorAll(".page-btn").forEach(button => {
//         const page = Number(button.dataset.page);

//         button.className = `
//             page-btn rounded-lg px-5 py-3 font-semibold
//             transition duration-300
//             ${page === currentPage
//                 ? "bg-blue-600 text-white shadow-md"
//                 : "bg-gray-200 text-gray-700 hover:bg-blue-100"
//             }
//         `;
//     });
// }
