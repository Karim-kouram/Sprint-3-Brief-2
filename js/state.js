let initialcreatures = [];
let creatures = [];

export const getinitialCreatures = () => {
    return initialcreatures;
};

export const setinitialCreatures = (data) => {
    initialcreatures = data;
};

export const getCreatures = () => {
    return creatures;
};

export const setCreatures = (data) => {
    creatures = data;
};

export function addCreatures(newCreatures) {
    creatures = [...creatures, ...newCreatures];
}