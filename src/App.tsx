import React, {Component} from 'react';
import './App.css';
import {LocationService, LocationStrategies} from "./lib/location/location";
import {LocationProvider} from "./context/LocationContext";
import {LocationSearch} from "./components/LocationSearch";
import LocationMap from "./components/LocationMap";

// google maps typings are weird
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
    render() {
        return (
            <LocationProvider>
                <div className="App">
                    <LocationMap />
                    <LocationSearch/>
                </div>
            </LocationProvider>
        );
    }
}

export default App;
