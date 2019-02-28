enum Genre {
    American = 'american',
    Mexican = 'mexican',
    Asian = 'asian',
}

export interface FoodGenre {
    key: Genre;
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
        key: Genre.American,
        name: 'American',
        description: 'America stuff here',
        popularDishes: ['Hamburger', 'Pizza'],
        spiceLevel: 2
    },
    mexican: {
        key: Genre.Mexican,
        name: 'Mexican',
        description: 'Mexican stuff here',
        popularDishes: ['Tacos', 'Burritos'],
        spiceLevel: 3
    },
    asian: {
        key: Genre.Asian,
        name: 'Asian',
        description: `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Cras fermentum odio eu feugiat. Lectus magna fringilla urna porttitor rhoncus. Et magnis dis parturient montes nascetur.
        `,
        popularDishes: ['Teriyaki Chicken', 'Sushi'],
        spiceLevel: 5
    }
};