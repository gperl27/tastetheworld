import * as React from "react";
import {useContext, useState} from "react";
import {LocationContext, LocationCtx} from "../context/LocationContext";
import * as QueryString from "qs";
import qs from "qs";

type PlaceResult = google.maps.places.PlaceResult;

enum FoodGenre {
    American = 'american',
    Asian = 'asian',
    Mexican = 'mexican'
}

export default function LocationMap() {
    const [places, setPlaces] = useState<PlaceResult[]>([]);
    const {location, locationService}: LocationCtx = useContext(LocationContext);

    const handleGenreClick = (genre: string) => async (e: React.MouseEvent) => {
        if (location) {
            const coords = new google.maps.LatLng(
                location.latitude,
                location.longitude
            );

            // use overloads to do zipcode instead of coords
            const results = await locationService.getRestaurantsByLocation(genre, coords);

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

    return (
        <>
            <>
                {Object.keys(FoodGenre).map(genre => {
                    return (
                        <div onClick={handleGenreClick(genre)} key={genre}>{genre}</div>
                    )
                })}
            </>
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
                                                        <img src="https://bulma.io/images/placeholders/96x96.png"
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
        </>
    )
}