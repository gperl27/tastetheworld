import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {LocationContext, LocationCtx} from "../context/LocationContext";
import qs from "qs";
import {FoodGenre, foodGenres} from "../foodgenres";

type PlaceResult = google.maps.places.PlaceResult;

export default function LocationMap() {
    const [places, setPlaces] = useState<PlaceResult[]>([]);
    const {location, locationService}: LocationCtx = useContext(LocationContext);
    const [chosenGenre, setChosenGenre] = useState<FoodGenre | null>(null)
    const [randomGenre, setRandomGenre] = useState<FoodGenre | null>(null);


    const handleGenreClick = (genre: FoodGenre) => async (e: React.MouseEvent) => {
        console.log(genre, 'gerne')
        setChosenGenre(genre);

        if (location) {
            const coords = new google.maps.LatLng(
                location.latitude,
                location.longitude
            );

            // use overloads to do zipcode instead of coords
            const results = await locationService.getRestaurantsByLocation(genre.name, coords);

            console.log(results, 'results')

            setPlaces(results)
        }
    }

    const createDirectionUrl = (place: PlaceResult): string => {
        const params = {
            destination: `${place.name} ${place.vicinity}`,
            origin: location ? `${location.latitude},${location.longitude}` : undefined
        };


        return `https://www.google.com/maps/dir/?api=1&${qs.stringify(params)}`;
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
    }

    useEffect(() => {
       setChosenGenre(randomGenre)

    }, [randomGenre])

    const renderRandomGenreButton = () => {
        return <div className={'button'} onClick={chooseRandomGenre}>Choose For Me</div>
    }

    // todo
    // quickfind incase users dont want to see food detail div
    return (
        <>
            <div className="buttons">
                {renderGenres()}
                {renderRandomGenreButton()}
            </div>
            <div className={'columns'}>
                {chosenGenre &&
                <div className={'column'}>
                    <div>{chosenGenre.name}</div>
                    <div>{chosenGenre.description}</div>
                    <div>Spicy: {chosenGenre.spiceLevel}</div>
                    <div>{chosenGenre.popularDishes.map(dish => <div key={dish}>{dish}</div>)}</div>
                </div>
                }
                <div className={'column'}>
                    <h3>found places:</h3>
                    <>
                        {
                            places.map((place: PlaceResult) => {
                                return (
                                    <div key={place.id} className={'columns is-mobile'}
                                         onClick={() => window.open(createDirectionUrl(place))}
                                    >
                                        <div key={place.id} className={'column is-half is-offset-one-quarter'}>
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
                                                            <p className="title is-4">{place.name}</p>
                                                            <p className="subtitle is-6">{place.vicinity}</p>
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