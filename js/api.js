// =============================================================
// data.js — les créatures de VOTRE univers
// =============================================================
// TODO : remplissez ce tableau avec au moins 12 créatures
// (Pokémon, Digimon ou Yu-Gi-Oh!), en respectant ce format :
//
// {
//   id: "#001",                                   // "#" suivi de 3 chiffres
//   name: "Exemple",                              // texte
//   type: "Feu",                                  // une valeur d'une liste fixe
//   level: "Base",                                // texte
//   stats: { hp: 45, attack: 49, defence: 49 },   // 3 nombres de 0 à 999
//   image: "https://example.com/001.png",         // lien https vers une image
//   description: "Une courte description."        // 10 à 200 caractères
// }
//
// Pensez à citer la source de vos images dans le README.


const BASE_URL = "http://localhost:3000";

export async function request(method, route, body = null) {
    try {
        const response = await fetch(`${BASE_URL}${route}`, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            ...(body && { body: JSON.stringify(body) })
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Erreur request :", error);
        throw error;
    }
}






export async function chargerPokemon(limit, page) {
    const loadButton = document.getElementById("loadButton");

    if (loadButton) loadButton.disabled = true;

    try {
        const data = await request(
            "GET",
            `/creatures?_page=${page}&_limit=${limit}`
        );

        return data;

    } catch (error) {
        console.log("Erreur lors du chargement :", error);
        return [];

    } finally {
        if (loadButton) loadButton.disabled = false;
    }
}




export async function FiltrerPokemon(type) {

    try {
        const data = await request(
            "GET",
            `/creatures?type=${type}`
        );

        return data;

    } catch (error) {
        console.log("Erreur lors du chargement :", error);
        return [];

    }
}




export async function getCreature(name) {
    try {
        const data = await request(
            "GET",
            `/creatures?q=${name}`
        );

        return data;

    } catch (error) {
        console.log("Erreur lors du chargement :", error);
        return [];

    }
}