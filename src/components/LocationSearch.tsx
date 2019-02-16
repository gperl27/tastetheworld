import * as React from "react";
import {useContext, useState} from "react";
import {LocationContext, LocationCtx} from "../context/LocationContext";

export function LocationSearch() {
    const locationContext: LocationCtx = useContext(LocationContext);
   const [input, setInput] = useState('');
   const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);

   const onChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
       const value = e.target.value;
       console.log(value, value.length)
      setInput(value);

          if(value.length === 0) {
              setSuggestions([])
              return;
          }

       // @ts-ignore
       const results: google.maps.places.AutocompletePrediction = await locationContext.locationService.getAutocompleteSuggestions(value);
       // @ts-ignore
       setSuggestions(results);
   };

    return (
        <>
            <div>location search</div>
            <input value={input} onChange={onChangeInput}/>
            <h3>
            {
                locationContext.location &&
                    `Lat: ${locationContext.location.latitude} - Lon: ${locationContext.location.longitude}`
            }
            </h3>
            {suggestions.length > 0 &&
           <div className={'list is-hoverable'}>
               {suggestions.map(suggestion => {
                   return <div className={'list-item'} onClick={async () => await locationContext.locationService.getRestaurantsByLocation('mexican', suggestion.place_id)} key={suggestion.place_id}>{suggestion.description}</div>
               })}
           </div>
            }
            <button onClick={locationContext.changeLocation}>click me</button>
        </>
    )
}