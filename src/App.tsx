import React, {Component} from 'react';
import './App.css';
import {LocationService, LocationStrategies} from "./lib/Location/location";

type PlaceResult = google.maps.places.PlaceResult;

enum FoodGenre {
    American = 'american',
    Asian = 'asian',
    Mexican = 'mexican'
}

interface Props {

}

interface State {
    places: PlaceResult[];
}

class App extends Component<Props, State> {
    locationService = new LocationService().use(LocationStrategies.Google);

    public state = {
        // put all this in a GoogleMapsContext
        places: [],
    };

    private handleGenreClick = (value: string) => async (e: React.MouseEvent) => {
        const results = await this.locationService.getRestaurantsByLocation<PlaceResult>(value);

        this.setState({places: results})
    };

    render() {
        return (
            <div className="App">
                <ul>
                    {Object.keys(FoodGenre).map(genre => <li onClick={this.handleGenreClick(genre)}
                                                             key={genre}>{genre}</li>)}
                </ul>
                <h3>found places:</h3>
                <ul>
                    {
                        this.state.places.map((place: google.maps.places.PlaceResult) => {
                            return <li key={place.id}>
                                {place.name}
                            </li>
                        })
                    }
                </ul>
            </div>
        );
    }
}

export default App;
