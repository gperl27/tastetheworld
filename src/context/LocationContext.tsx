import * as React from "react";
import {Location, LocationService, LocationStrategies} from "../lib/location/location";

const LatLng = google.maps.LatLng;

interface Props {
    children: React.ReactNode
}

export interface LocationCtx {
    locations: Location[];
    selectedLocation?: Location;
    userLocation?: Location;

    getLocations(id: string): void;

    getSuggestions(value: string): Promise<Location[]>;

    clearLocations(): void;
}

// @ts-ignore
export const LocationContext: LocationCtx & React.ContextType = React.createContext();

export function LocationProvider(props: Props) {
    const locationService = new LocationService().use(LocationStrategies.Google);
    const [locations, setLocations] = React.useState<Location[]>([]);
    const [userLocation, setUserLocation] = React.useState<Location | undefined>(undefined);
    const [selectedLocation, setSelectedLocation] = React.useState<Location | undefined>(undefined);

    async function getLocations(id: string) {
        const tmpLatLng = new LatLng(30, -80);
        const results = await locationService.getRestaurantsByLocation('mexican', tmpLatLng);
        setLocations(results);
    }

    function clearLocations() {
        setLocations([]);
    }


    async function getSuggestions(value: string): Promise<Location[]> {
        return locationService.getLocationSuggestions(value);
    }

    return (
        <LocationContext.Provider value={{
            locations,
            userLocation,
            selectedLocation,
            getLocations,
            clearLocations,
            getSuggestions
        }}>
            {props.children}
        </LocationContext.Provider>
    )
}
