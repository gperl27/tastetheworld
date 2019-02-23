import {GoogleLocationStrategy} from "./googleStrategy";

export enum LocationStrategies {
    Google
}

export interface Location {
    id: string;
    address: string;
}

export type LatLng = google.maps.LatLng | Coordinates;

export interface LocationProtocol {
    getRestaurantsByLocation(id: string, genre: string): Location[] | Promise<Location[]>;

    getLocationSuggestions(input: string): Location[] | Promise<Location[]>;
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

