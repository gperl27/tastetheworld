import React, {Component} from 'react';
import 'bulma/css/bulma.css'
import './App.css';
import {LocationProvider} from "./context/LocationContext";
import {LocationSearch} from "./components/LocationSearch";
import LocationMap from "./components/LocationMap";
import {WorldMap} from "./components/WorldMap";

class App extends Component {
    render() {
        return (
            <LocationProvider>
                <section className="hero is-primary">
                    <div className="hero-body">
                        <div className="container">
                            <h1 className="title">
                                Taste the World
                            </h1>
                            <h2 className="subtitle">
                                One Bite at a Time
                            </h2>
                        </div>
                    </div>
                </section>
                <WorldMap/>
            </LocationProvider>
        );
    }
}

export default App;
