import * as React from "react";
import {ContextType} from "react";
import {LocationService, LocationStrategies} from "../lib/location/location";
import {GoogleLocationStrategy} from "../lib/location/googleStrategy";


interface Props {

}

interface State {
    location?: Coordinates
}

export interface LocationCtx {
    location?: Coordinates;
    locationService: GoogleLocationStrategy;

    changeLocation(): void;
}

// @ts-ignore
export const LocationContext: LocationCtx & ContextType = React.createContext();

export class LocationProvider extends React.Component<Props, State> {
    locationService = new LocationService().use(LocationStrategies.Google);

    public state = {
        location: undefined
    };

    componentDidMount(): void {
        if ("geolocation" in navigator) {
            /* geolocation is available */
            console.log('we have geo')
        } else {
            /* geolocation IS NOT available */
            console.log('no geo')
        }
    }

    changeLocation = () => {
        navigator.geolocation.getCurrentPosition( (position: Position) => {
            this.setState({location: position.coords })
        }, () => {}, { enableHighAccuracy: true });
    }

    render() {
        return (
            <LocationContext.Provider value={{
                location: this.state.location,
                changeLocation: this.changeLocation,
                locationService: this.locationService
            }}>
                {this.props.children}
            </LocationContext.Provider>
        )
    }
}