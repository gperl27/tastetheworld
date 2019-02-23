import * as React from "react";
import {useContext, useState} from "react";
import {LocationContext, LocationCtx} from "../context/LocationContext";
import {LocationSuggestion} from "../lib/location/location";
import Autocomplete from "react-autocomplete";

export function LocationSearch() {
    const locationContext: LocationCtx = useContext(LocationContext);
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = React.useState<LocationSuggestion[]>([]);

    const onChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);

        if (value.length === 0) {
            setSuggestions([]);
            return;
        }

        setSuggestions(await locationContext.getSuggestions(value));
    };

    const onSelect = (value: string, item: LocationSuggestion) => {
        setInput(value);
        locationContext.setUserLocation(item);
    };

    return (
        <>
            <div>Location Search</div>
            <Autocomplete
                renderInput={props => <input className={'input'} {...props} />}
                getItemValue={(item: LocationSuggestion) => item.name}
                items={suggestions}
                renderItem={(item: LocationSuggestion, isHighlighted) => {
                    const style = isHighlighted ? {
                        color: 'black',
                        cursor: 'pointer',
                    } : {};

                    return (
                        <div key={item.id} className={`list-item`} style={style}>
                            {item.name}
                        </div>
                    )
                }}
                value={input}
                onChange={onChangeInput}
                onSelect={onSelect}
            />
        </>
    )
}