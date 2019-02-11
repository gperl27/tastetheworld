import * as React from "react";
import {useContext, useState} from "react";
import {LocationContext, LocationCtx} from "../context/LocationContext";
import {LocationService, LocationStrategies} from "../lib/location/location";

type PlaceResult = google.maps.places.PlaceResult;

enum FoodGenre {
    American = 'american',
    Asian = 'asian',
    Mexican = 'mexican'
}

export default function LocationMap() {
    const [places, setPlaces] = useState<PlaceResult[]>([]);
    const { location, locationService }: LocationCtx = useContext(LocationContext);

    const handleGenreClick = (genre: string) => async (e: React.MouseEvent) => {
        if (location) {
            const coords = new google.maps.LatLng(
                location.latitude,
                location.longitude
            );

            const results = await locationService.getRestaurantsByLocation<PlaceResult>(genre, coords);

            setPlaces(results)
        }
    }

    return (
        <>
            <ul>
                {Object.keys(FoodGenre).map(genre => <li onClick={handleGenreClick(genre)}
                                                         key={genre}>{genre}</li>)}
            </ul>
            <h3>found places:</h3>
            <ul>
                {
                    places.map((place: PlaceResult) => {
                        return <li key={place.id}>
                            {place.name}
                        </li>
                    })
                }
            </ul>
        </>
    )
}