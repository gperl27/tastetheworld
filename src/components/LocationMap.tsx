import * as React from "react";
import {useContext, useState} from "react";
import {LocationContext, LocationCtx} from "../context/LocationContext";

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
            const results = await locationService.getRestaurantsByLocation<PlaceResult>(genre, coords);

            console.log(results, 'results')

            setPlaces(results)
        }
    }

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
                            <div key={place.id} className={'columns is-mobile'}>
                                <div key={place.id} className={'column is-half is-offset-one-quarter'}>
                                    <div className={'card'}>
                                        {/*{place.name}*/}
                                        {/*<div className="card-image">*/}
                                            {/*<figure className="image is-4by3">*/}
                                                {/*<img src="https://bulma.io/images/placeholders/1280x960.png"*/}
                                                     {/*alt="Placeholder image"/>*/}
                                            {/*</figure>*/}
                                        {/*</div>*/}
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

                                            <div className="content">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                Phasellus nec iaculis mauris. <a>@bulmaio</a>.
                                                <a href="#">#css</a> <a href="#">#responsive</a>
                                                <br/>
                                                <time dateTime="2016-1-1">11:09 PM - 1 Jan 2016</time>
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