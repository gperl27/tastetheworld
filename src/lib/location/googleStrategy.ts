type PlaceResult = google.maps.places.PlaceResult;
type AutocompletePrediction = google.maps.places.AutocompletePrediction;

abstract class GoogleLocationProtocol {
    abstract getRestaurantsByLocation(genre: string, location: google.maps.LatLng): PlaceResult[] | Promise<PlaceResult[]>;
    abstract getAutocompleteSuggestions(input: string): AutocompletePrediction[] | Promise<AutocompletePrediction[]>;
}

export class GoogleLocationStrategy extends GoogleLocationProtocol {
    map: google.maps.Map;
    service: google.maps.places.PlacesService;
    autocompleteService: google.maps.places.AutocompleteService;


    public async getRestaurantsByLocation(genre: string, location: google.maps.LatLng | string): Promise<PlaceResult[]> {
        let loc;

       if (typeof location === 'string') {
          const place = await this.getCoordinatesByPlaceId(location);
          if (!place) {
             return [];
          }

          loc = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng())
       } else {
           loc = location;
       }

        const request = {
            location: loc,
            radius: 500,
            keyword: genre,
            type: 'restaurant'
        };

        return new Promise((resolve, reject) => {
            return this.service.nearbySearch(request, (results, status: google.maps.places.PlacesServiceStatus) => {
                console.log(results, 'results?')
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    return resolve(results)
                }

                return resolve([])
            });
        })
    }


    public getAutocompleteSuggestions(input: string): Promise<AutocompletePrediction[]> {
        return new Promise((resolve, reject) => {
            return this.autocompleteService.getPlacePredictions({input}, (results, status: google.maps.places.PlacesServiceStatus) => {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    return resolve(results)
                }

                return resolve([])
            });
        })
    }

    private getCoordinatesByPlaceId(placeId: string): Promise<PlaceResult | null> {
        const request = {
            placeId,
            fields: ['geometry']
        };

        return new Promise((resolve, reject) => {

            return this.service.getDetails(request, (results, status: google.maps.places.PlacesServiceStatus) => {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    return resolve(results)
                }

                return resolve(null)
            });
        })
    }

    constructor() {
        super();

        this.map = new google.maps.Map(document.createElement('div'), {});
        this.service = new google.maps.places.PlacesService(this.map);
        this.autocompleteService = new google.maps.places.AutocompleteService();
    }
}