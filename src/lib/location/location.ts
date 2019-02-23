import {GoogleLocationStrategy} from "./googleStrategy";

export enum LocationStrategies {
    Google
}

export interface Location {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
}

export interface LocationSuggestion {
   id: string;
   name: string;
}

export interface LocationProtocol {
    getRestaurantsByLocation(id: string, genre: string): Location[] | Promise<Location[]>;

    getLocationSuggestions(input: string): LocationSuggestion[] | Promise<LocationSuggestion[]>;

    getLocationByPlaceId(id: string): Promise<Location | undefined>;

    createDirectionUrl(place: Location, origin: Location): string;
}

interface LocationDelegate {
    use(strategy: LocationStrategies): GoogleLocationStrategy
}

export class LocationService implements LocationDelegate {
    public use(strategy: LocationStrategies) {
        switch (strategy) {
            case LocationStrategies.Google: {
                return new GoogleLocationStrategy();
            }
        }
    }
}

