import {LocationProtocol, Location, LatLng} from "./location";

type PlaceResult = google.maps.places.PlaceResult;
type AutocompletePrediction = google.maps.places.AutocompletePrediction;

export class GoogleLocationStrategy implements LocationProtocol {
    map: google.maps.Map;
    service: google.maps.places.PlacesService;
    autocompleteService: google.maps.places.AutocompleteService;

    private static transformPlaceResultToLocation(placeResult: PlaceResult): Location {
        return {id: placeResult.id, address: placeResult.vicinity};
    }

    private static transformAutoCompletePredictionToLocation(prediction: AutocompletePrediction): Location {
        return {id: prediction.place_id, address: prediction.description};
    }

    public async getRestaurantsByLocation(genre: string, location: google.maps.LatLng): Promise<Location[]> {
        // let loc;
        //
        // if (typeof location === 'string') {
        //     const place = await this.getCoordinatesByPlaceId(location);
        //     if (!place) {
        //         return [];
        //     }
        //
        //     loc = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng())
        // } else {
        //     loc = location;
        // }

        const request = {
            // location: loc,
            location,
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


    public getLocationSuggestions(input: string): Promise<Location[]> {
        return new Promise((resolve, reject) => {
            return this.autocompleteService.getPlacePredictions({input}, (results, status: google.maps.places.PlacesServiceStatus) => {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    const transformedLocations = results.map(GoogleLocationStrategy.transformAutoCompletePredictionToLocation);

                    return resolve(transformedLocations);
                }

                return resolve([])
            });
        })
    }

    // public getCoordinatesByPlaceId(placeId: string): Promise<PlaceResult | null> {
    //     const request = {
    //         placeId,
    //         fields: ['geometry']
    //     };
    //
    //     return new Promise((resolve, reject) => {
    //         return this.service.getDetails(request, (result, status: google.maps.places.PlacesServiceStatus) => {
    //             if (status == google.maps.places.PlacesServiceStatus.OK) {
    //                 return resolve(result)
    //             }
    //
    //             return resolve(null)
    //         });
    //     })
    // }

    constructor() {
        this.map = new google.maps.Map(document.createElement('div'), {});
        this.service = new google.maps.places.PlacesService(this.map);
        this.autocompleteService = new google.maps.places.AutocompleteService();
    }
}