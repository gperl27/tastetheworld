import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {LocationContext, LocationCtx} from "../context/LocationContext";
import {FoodGenre, foodGenres} from "../foodgenres";
import {Location} from "../lib/location/location";

import qs from "qs";

export default function LocationMap() {
    const locationContext: LocationCtx = useContext(LocationContext);
    const [chosenGenre, setChosenGenre] = useState<FoodGenre | null>(null);
    const [randomGenre, setRandomGenre] = useState<FoodGenre | null>(null);

    const handleGenreClick = (genre: FoodGenre) => async (e: React.MouseEvent) => {
        await chooseGenre(genre);
    };

    const chooseGenre = async (genre: FoodGenre) => {
        setChosenGenre(genre);

        if (locationContext.userLocation) {
            await locationContext.getLocations(locationContext.userLocation.id, genre);
        }
    };

    const handleDirectionClick = (place: Location) => {
        if (locationContext.userLocation) {
            window.open(createDirectionUrl(place));
            return;
        }

        return undefined;
    };

    const createDirectionUrl = (place: Location): string => {
        if (locationContext.userLocation) {
            const params = {
                destination: `${place.name} ${place.address}`,
                origin: `${locationContext.userLocation.latitude}, ${locationContext.userLocation.longitude}`
            };


            return `https://www.google.com/maps/dir/?api=1&${qs.stringify(params)}`;
        }

        return '';
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
            (async function () {
                await chooseGenre(randomGenre)
            }())
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
                    </div>
                </div>
                }
                <div className={'column'}>
                    <h3>found places:</h3>
                    <>
                        {
                            locationContext.locations.map((location) => {
                                return (
                                    <div key={location.id} className={'columns is-mobile'}
                                         onClick={() => handleDirectionClick(location)}
                                    >
                                        <div className={'column is-half is-offset-one-quarter'}>
                                            <div className={'card'}>
                                                <div className="card-content">
                                                    <div className="media">
                                                        <div className="media-left">
                                                            <figure className="image is-48x48">
                                                                <img
                                                                    src="https://bulma.io/images/placeholders/96x96.png"
                                                                    alt="Placeholder image"/>
                                                            </figure>
                                                        </div>
                                                        <div className="media-content">
                                                            <p className="title is-4">{location.name}</p>
                                                            <p className="subtitle is-6">{location.address}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </>
                </div>
            </div>
        </>
    )
}