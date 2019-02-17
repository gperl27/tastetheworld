export interface FoodGenre {
    key: string;
    name: string;
    description: string;
    popularDishes: string[];
    spiceLevel: number;
}

interface Genres {
    american: FoodGenre;
    mexican: FoodGenre;
    asian: FoodGenre;

    [key: string]: FoodGenre;
}

export const foodGenres: Genres = {
    american: {
        key: 'american',
        name: 'American',
        description: 'America stuff here',
        popularDishes: ['Hamburger', 'Pizza'],
        spiceLevel: 2
    },
    mexican: {
        key: 'mexican',
        name: 'Mexican',
        description: 'Mexican stuff here',
        popularDishes: ['Tacos', 'Burritos'],
        spiceLevel: 3
    },
    asian: {
        key: 'asian',
        name: 'Asian',
        description: 'Asian stuff here',
        popularDishes: ['Teriyaki Chicken', 'Sushi'],
        spiceLevel: 5
    }
};