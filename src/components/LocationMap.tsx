import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {LocationContext, LocationCtx} from "../context/LocationContext";
import {FoodGenre, foodGenres} from "../foodgenres";

import {SearchResults} from "./SearchResults";

export default function LocationMap() {
    const locationContext: LocationCtx = useContext(LocationContext);
    const [chosenGenre, setChosenGenre] = useState<FoodGenre | null>(null);
    const [randomGenre, setRandomGenre] = useState<FoodGenre | null>(null);

    const handleGenreClick = (genre: FoodGenre) => () => {
        setChosenGenre(genre);
    };

    const getLocations = async () => {
        if (locationContext.userLocation && chosenGenre) {
            await locationContext.getLocations(locationContext.userLocation.id, chosenGenre);
        }
    };

    const renderGenres = () => {
        return Object.keys(foodGenres).map((genre) => {
            return <div className={'button'} onClick={handleGenreClick(foodGenres[genre])} key={genre}>{genre}</div>
        });
    }

    const chooseRandomGenre = () => {
        const tempFoodGenres = {...foodGenres};

        if (chosenGenre) {
            delete tempFoodGenres[chosenGenre.key]
        }

        const keys = Object.keys(tempFoodGenres);
        const randomKey = Math.floor(keys.length * Math.random());

        setRandomGenre(foodGenres[keys[randomKey]])
    };

    useEffect(() => {
        if (randomGenre) {
            setChosenGenre(randomGenre)
        }

    }, [randomGenre]);

    const renderRandomGenreButton = () => {
        return <div className={'button'} onClick={chooseRandomGenre}>Choose For Me</div>
    };

    return (
        <>
            <div>
                {renderGenres()}
                {renderRandomGenreButton()}
            </div>
            <div className={'columns'}>
                {chosenGenre &&
                <div className={'column'}>
                    <div className={'card'}>
                        <div>{chosenGenre.name}</div>
                        <div>{chosenGenre.description}</div>
                        <div>Spicy: {chosenGenre.spiceLevel}</div>
                        <div>{chosenGenre.popularDishes.map(dish => <div key={dish}>{dish}</div>)}</div>
                        <button className={'button'} onClick={getLocations}>Let's Eat!</button>
                    </div>
                </div>
                }
                <SearchResults/>
            </div>
        </>
    )
}