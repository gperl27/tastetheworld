import * as React from "react";
import {useContext, useState} from "react";
import {LocationContext, LocationCtx} from "../context/LocationContext";
import { Location } from "../lib/location/location";

export function LocationSearch() {
    const locationContext: LocationCtx = useContext(LocationContext);
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = React.useState<Location[]>([]);

    const onChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);

        if (value.length === 0) {
            setSuggestions([]);
            return;
        }

        setSuggestions(await locationContext.getSuggestions(value));
    };

    // const renderLocation = () => {
    //     if (locationContext.location) {
    //         if (typeof locationContext.location === 'string') {
    //             return locationContext.location;
    //         }
    //
    //         return `Lat: ${locationContext.location.latitude} - Lon: ${locationContext.location.longitude}`
    //     }
    //
    // }

    // {suggestions.map(suggestion => {
    //     return <div className={'list-item'}
    //                 onClick={async () => await locationContext.updateLocation(suggestion.place_id)}
    //                 key={suggestion.place_id}>{suggestion.description}</div>
    // })}
    function renderResults() {
        return suggestions.map(suggestion => {
            return <div className={'list-item'} key={suggestion.id}>{suggestion.address}</div>
        })
    }

    return (
        <>
            <div>location search</div>
            <input value={input} onChange={onChangeInput}/>
            {suggestions.length > 0 &&
            <div className={'list is-hoverable'}>
                {renderResults()}
            </div>
            }
        </>
    )
}