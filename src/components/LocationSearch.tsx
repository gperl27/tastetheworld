import * as React from "react";
import {useContext, useState} from "react";
import {LocationContext, LocationCtx} from "../context/LocationContext";
import {Location} from "../lib/location/location";
import Autocomplete from "react-autocomplete";

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

    const onSelect = (value: string, item: Location) => {
        setInput(value);
        locationContext.setUserLocation(item);
    }

    return (
        <>
            <div>Location Search</div>
            <Autocomplete
                renderInput={props => <input className={'input'} {...props} />}
                getItemValue={(item: Location) => item.address}
                items={suggestions}
                renderItem={(item: Location, isHighlighted) => {
                    const style = isHighlighted ? {
                        color: 'black',
                        cursor: 'pointer',
                    } : {};

                    return (
                        <div key={item.id} className={`list-item`} style={style}>
                            {item.address}
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