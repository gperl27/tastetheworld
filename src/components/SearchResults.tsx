import * as React from 'react';
import {LocationContext, LocationCtx} from "../context/LocationContext";
import {Location} from "../lib/location/location";

export function SearchResults() {
    const locationContext: LocationCtx = React.useContext(LocationContext);

    const createDirectionUrl = (place: Location): string => {
        return locationContext.createLocationUrl(place);
    };

    const handleDirectionClick = (place: Location) => {
        if (locationContext.userLocation) {
            window.open(createDirectionUrl(place));
            return;
        }

        return undefined;
    };

    return (
        <div className={'column'}>
            <h3>found places:</h3>
            <>
                {
                    locationContext.locations.map((location) => {
                        return (
                            <div key={location.id} className={'columns is-mobile'}>
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
                                                    <button
                                                        onClick={() => handleDirectionClick(location)}
                                                        className={'button'}
                                                    >
                                                        Directions
                                                    </button>
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
    )
}