import * as React from "react";
import {Location, LocationService, LocationStrategies, LocationSuggestion} from "../lib/location/location";
import {FoodGenre} from "../foodgenres";
import qs from "qs";

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
    
    createLocationUrl(location: Location): string;
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
    
    function createLocationUrl(location: Location) {
        if (userLocation) {
            return locationService.createDirectionUrl(location, userLocation);
        }

        return '';
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
            createLocationUrl
        }}>
            {props.children}
        </LocationContext.Provider>
    )
}
