import {Location, LocationProtocol, LocationSuggestion} from "./location";

type PlaceResult = google.maps.places.PlaceResult;
type AutocompletePrediction = google.maps.places.AutocompletePrediction;

export class GoogleLocationStrategy implements LocationProtocol {
    map: google.maps.Map;
    service: google.maps.places.PlacesService;
    autocompleteService: google.maps.places.AutocompleteService;

    private static transformPlaceResultToLocation(placeResult: PlaceResult): Location {
        return {
            id: placeResult.place_id,
            address: placeResult.vicinity,
            name: placeResult.name,
            latitude: placeResult.geometry.location.lat(),
            longitude: placeResult.geometry.location.lng(),
        };
    }

    private static transformPredictionToLocationSuggestion(prediction: AutocompletePrediction): LocationSuggestion {
        return {
            id: prediction.place_id,
            name: prediction.description,
        };
    }

    public async getLocationByPlaceId(id: string): Promise<Location | undefined> {
        const location = await this.getCoordinatesByPlaceId(id);

        if (location) {
            return GoogleLocationStrategy.transformPlaceResultToLocation(location);
        }

        return undefined;
    }

    public async getRestaurantsByLocation(id: string, genre: string): Promise<Location[]> {
        const location = await this.getCoordinatesByPlaceId(id);

        if (!location) {
            return [];
        }

        const latLng = new google.maps.LatLng(location.geometry.location.lat(), location.geometry.location.lng());

        const request = {
            location: latLng,
            radius: 2000,
            keyword: genre,
            type: 'restaurant'
        };

        return new Promise((resolve, reject) => {
            return this.service.nearbySearch(request, (results, status: google.maps.places.PlacesServiceStatus) => {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    const transformedLocations = results.map(GoogleLocationStrategy.transformPlaceResultToLocation);

                    return resolve(transformedLocations);
                }

                return resolve([])
            });
        })
    }


    public getLocationSuggestions(input: string): Promise<LocationSuggestion[]> {
        return new Promise((resolve, reject) => {
            return this.autocompleteService.getPlacePredictions({input}, (results, status: google.maps.places.PlacesServiceStatus) => {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    const transformedLocations = results.map(GoogleLocationStrategy.transformPredictionToLocationSuggestion);

                    return resolve(transformedLocations);
                }

                return resolve([])
            });
        })
    }

    private getCoordinatesByPlaceId(placeId: string): Promise<PlaceResult | null> {
        const request = {
            placeId,
            fields: ['id', 'place_id', 'geometry', 'vicinity', 'name']
        };

        return new Promise((resolve, reject) => {
            return this.service.getDetails(request, (result, status: google.maps.places.PlacesServiceStatus) => {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    return resolve(result)
                }

                return resolve(null)
            });
        })
    }

    constructor() {
        this.map = new google.maps.Map(document.createElement('div'), {});
        this.service = new google.maps.places.PlacesService(this.map);
        this.autocompleteService = new google.maps.places.AutocompleteService();
    }
}