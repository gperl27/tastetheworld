import {GoogleLocationStrategy} from "./googleStrategy";

export enum LocationStrategies {
    Google
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

type PlaceResult = google.maps.places.PlaceResult;
export interface LocationConfig {
    getRestaurantsByLocation(genre: string, location: google.maps.LatLng): PlaceResult[] | Promise<PlaceResult[]>;
    getAutocompleteSuggestions<T>(input: string): T[] | Promise<T[]>;
}
