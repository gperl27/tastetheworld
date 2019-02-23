import * as React from "react";
import {Location, LocationService, LocationStrategies} from "../lib/location/location";
import {FoodGenre} from "../foodgenres";

const LatLng = google.maps.LatLng;

interface Props {
    children: React.ReactNode
}

export interface LocationCtx {
    locations: Location[];
    selectedLocation?: Location;
    userLocation?: Location;

    getLocations(id: string, genre: FoodGenre): void;

    getSuggestions(value: string): Promise<Location[]>;

    clearLocations(): void;

    setUserLocation(location: Location): void;
}

// @ts-ignore
export const LocationContext: LocationCtx & React.ContextType = React.createContext();

export function LocationProvider(props: Props) {
    const locationService = new LocationService().use(LocationStrategies.Google);
    const [locations, setLocations] = React.useState<Location[]>([]);
    const [userLocation, setUserLocation] = React.useState<Location | undefined>(undefined);
    const [selectedLocation, setSelectedLocation] = React.useState<Location | undefined>(undefined);

    async function getLocations(id: string, genre: FoodGenre) {
        const results = await locationService.getRestaurantsByLocation(id, genre.key);
        setLocations(results);
    }

    function clearLocations() {
        setLocations([]);
    }


    async function getSuggestions(value: string): Promise<Location[]> {
        return locationService.getLocationSuggestions(value);
    }

    function updateUserLocation(loc: Location) {
        setUserLocation(loc);
    }

    return (
        <LocationContext.Provider value={{
            locations,
            userLocation,
            selectedLocation,
            getLocations,
            clearLocations,
            getSuggestions,
            setUserLocation: updateUserLocation,
        }}>
            {props.children}
        </LocationContext.Provider>
    )
}
