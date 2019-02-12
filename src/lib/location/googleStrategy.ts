import {LocationConfig} from "./location";

export class GoogleLocationStrategy implements LocationConfig {
    map: google.maps.Map;
    service: google.maps.places.PlacesService;

    public getRestaurantsByLocation<PlaceResult>(genre: string, location: google.maps.LatLng): Promise<PlaceResult[]> {
        const request = {
            location,
            radius: 500,
            keyword: genre,
            type: ['restaurant']
        };


        return new Promise((resolve, reject) => {
            // @ts-ignore
            return this.service.nearbySearch(request, (results: PlaceResult[], status: google.maps.places.PlacesServiceStatus) => {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    return resolve(results)
                }

                return resolve([])
            });
        })
    }

    constructor() {
        this.map = new google.maps.Map(document.createElement('div'), {});

        this.service = new google.maps.places.PlacesService(this.map);
    }
}