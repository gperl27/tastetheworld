import {LocationConfig} from "./location";

export class GoogleLocationStrategy implements LocationConfig {
    map: google.maps.Map;
    service: google.maps.places.PlacesService;
    location: google.maps.LatLng;

    public getRestaurantsByLocation<PlaceResult>(genre: string): Promise<PlaceResult[]> {
        const request = {
            location: this.location,
            radius: 500,
            query: genre,
            type: 'restaurant'
        };


        return new Promise((resolve, reject) => {
            // @ts-ignore
            return this.service.textSearch(request, (results: PlaceResult[], status: google.maps.places.PlacesServiceStatus) => {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    return resolve(results)
                }

                return resolve([])
            });
        })
    }

    constructor() {
        this.location = new google.maps.LatLng(-33.8665433, 151.1956316);

        this.map = new google.maps.Map(document.createElement('div'), {
            center: this.location,
            zoom: 15
        });

        this.service = new google.maps.places.PlacesService(this.map);
    }
}