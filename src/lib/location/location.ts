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

export interface LocationConfig {
    getRestaurantsByLocation<T>(genre: string, location: google.maps.LatLng): T[] | Promise<T[]>;
}
