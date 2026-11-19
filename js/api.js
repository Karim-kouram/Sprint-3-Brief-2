const BASE_URL = "http://localhost:3000";

// =====================================================
// REQUEST GENERIQUE
// =====================================================

export async function request(method, route, body = null) {
    try {
        const response = await fetch(`${BASE_URL}${route}`, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            ...(body !== null && {
                body: JSON.stringify(body)
            })
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


// =====================================================
// GET TOUTES LES CREATURES
// =====================================================

export async function chargerPokemon() {
    return await request("GET", "/creatures");
}


// =====================================================
// FILTRER PAR TYPE
// =====================================================

export async function FiltrerPokemon(type) {
    const params = new URLSearchParams();

    if (type && type !== "Tous") {
        params.append("type", type);
    }

    return await request(
        "GET",
        `/creatures?${params.toString()}`
    );
}


// =====================================================
// RECHERCHE + FILTRE
// =====================================================

export async function getCreature(name, type) {
    const params = new URLSearchParams();

    // Recherche par nom
    if (name) {
        params.append("q", name);
    }

    // Filtre par type
    if (type && type !== "Tous") {
        params.append("type", type);
    }

    return await request(
        "GET",
        `/creatures?${params.toString()}`
    );
}


// =====================================================
// RECHERCHE + FILTRE + TRI
// =====================================================

export async function FiltrerApi(search, type, sort) {
    const params = new URLSearchParams();

    // Recherche
    if (search) {
        params.append("q", search);
    }

    // Filtre par type
    if (type && type !== "Tous") {
        params.append("type", type);
    }

    // Tri
    if (sort) {
        const [sortField, order] = sort.split("-");

        params.append("_sort", sortField);
        params.append("_order", order);
    }

    return await request(
        "GET",
        `/creatures?${params.toString()}`
    );
}

// =====================================================
// GET UNE CREATURE PAR ID
// =====================================================

export async function getCreatureById(id) {
    return await request(
        "GET",
        `/creatures/${encodeURIComponent(id)}`
    );
}


// =====================================================
// AJOUTER UNE CREATURE
// POST /creatures
// =====================================================

export async function ajouterCreature(data) {
    return await request(
        "POST",
        "/creatures",
        data
    );
}