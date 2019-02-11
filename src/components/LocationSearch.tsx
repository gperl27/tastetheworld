import * as React from "react";
import {useContext} from "react";
import {LocationContext, LocationCtx} from "../context/LocationContext";

export function LocationSearch() {
    const locationContext: LocationCtx = useContext(LocationContext)

    return (
        <>
            <div>location search</div>
            <h3>
            {
                locationContext.location &&
                    `Lat: ${locationContext.location.latitude} - Lon: ${locationContext.location.longitude}`
            }
            </h3>
            <button onClick={locationContext.changeLocation}>click me</button>
        </>
    )
}