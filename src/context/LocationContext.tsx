import * as React from "react";
import {Location, LocationService, LocationStrategies, LocationSuggestion} from "../lib/location/location";
import {FoodGenre} from "../foodgenres";

interface Props {
    children: React.ReactNode
}

export interface LocationCtx {
    locations: Location[];
    selectedLocation?: Location;
    userLocation?: Location;

    getLocations(id: string, genre: FoodGenre): void;

    getSuggestions(value: string): Promise<LocationSuggestion[]>;

    clearLocations(): void;

    setUserLocation(location: LocationSuggestion): void;

    setSelectedLocation(location: Location): void;
}

// @ts-ignore
export const LocationContext: LocationCtx & React.ContextType = React.createContext();

export function LocationProvider(props: Props) {
    const locationService = new LocationService().use(LocationStrategies.Google);
    const [locations, setLocations] = React.useState<Location[]>([]);
    const [userLocation, setUserLocation] = React.useState<LocationSuggestion | undefined>(undefined);
    const [selectedLocation, setSelectedLocation] = React.useState<Location | undefined>(undefined);

    async function getLocations(id: string, genre: FoodGenre) {
        const results = await locationService.getRestaurantsByLocation(id, genre.key);
        setLocations(results);
    }

    function clearLocations() {
        setLocations([]);
    }


    async function getSuggestions(value: string): Promise<LocationSuggestion[]> {
        return locationService.getLocationSuggestions(value);
    }

    async function updateUserLocation(loc: LocationSuggestion) {
        const userLocation = await locationService.getLocationByPlaceId(loc.id);

        setUserLocation(userLocation);
    }

    function updateSelectedLocation(loc: Location) {
        setSelectedLocation(loc);
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
            setSelectedLocation: updateSelectedLocation,
        }}>
            {props.children}
        </LocationContext.Provider>
    )
}
