import * as React from "react"
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
    Markers,
    Marker,
} from "react-simple-maps"
import {Motion, spring} from "react-motion"
import MAP from '../assets/maps/world-110m.json';
import {LocationContext, LocationCtx} from "../context/LocationContext";
import {useContext} from "react";
import {useState} from "react";
import {FoodGenre, foodGenres} from "../foodgenres";

const wrapperStyles = {
    width: "100%",
    maxWidth: 980,
    margin: "0 auto",
}

type Coordinates = [number, number];
type City = { name: string, coordinates: Coordinates }

const cities: City[] = [
    {name: "Zurich", coordinates: [8.5417, 47.3769]},
    {name: "Singapore", coordinates: [103.8198, 1.3521]},
    {name: "San Francisco", coordinates: [-122.4194, 37.7749]},
    {name: "Sydney", coordinates: [151.2093, -33.8688]},
    {name: "Lagos", coordinates: [3.3792, 6.5244]},
    {name: "Buenos Aires", coordinates: [-58.3816, -34.6037]},
    {name: "Shanghai", coordinates: [121.4737, 31.2304]},
];

export function WorldMap() {
    const locationContext: LocationCtx = useContext(LocationContext);
    const [center, setCenter] = React.useState<Coordinates>([0, 20])
    const [zoom, setZoom] = React.useState(1);

    console.log(locationContext, 'ctx')

    function handleZoomIn() {
        setZoom(zoom * 2);
    }

    function handleZoomOut() {
        setZoom(zoom / 2)
    }

    function handleReset() {
        setCenter([0, 20]);
        setZoom(1);
    }

    async function handleCountryClick(geography: { properties: { genreKey: string; }; }) {
        const genre = foodGenres[geography.properties.genreKey];

        if (genre) {
            await getLocations(genre);
        }
    }


    const getLocations = async (genre: FoodGenre) => {
        if (locationContext.userLocation) {
            await locationContext.getLocations(locationContext.userLocation.id, genre);
        }
    };

    return (
        <div style={wrapperStyles}>
            <button onClick={handleZoomIn}>
                {"Zoom in"}
            </button>
            <button onClick={handleZoomOut}>
                {"Zoom out"}
            </button>
            <button onClick={handleReset}>
                {"Reset"}
            </button>
            <Motion
                defaultStyle={{
                    zoom: 1,
                    x: 0,
                    y: 20,
                }}
                style={{
                    zoom: spring(zoom, {stiffness: 210, damping: 20}),
                    x: spring(center[0], {stiffness: 210, damping: 20}),
                    y: spring(center[1], {stiffness: 210, damping: 20}),
                }}
            >
                {({zoom, x, y}) => (
                    <ComposableMap
                        projectionConfig={{scale: 205}}
                        width={980}
                        height={551}
                        style={{
                            width: "100%",
                            height: "auto",
                        }}
                    >
                        <ZoomableGroup center={[x, y]} zoom={zoom}>
                            <Geographies geography={MAP} disableOptimization>
                                {(geographies, projection) =>
                                    // @ts-ignore
                                    geographies.map((geography, i) => geography.id !== "010" && (
                                        <Geography
                                            key={i}
                                            cacheId={`geography-${i}`}
                                            geography={geography}
                                            projection={projection}
                                            // @ts-ignore
                                            onClick={handleCountryClick}
                                            style={{
                                                default: {
                                                    fill: "#ECEFF1",
                                                    stroke: "#607D8B",
                                                    strokeWidth: 0.75,
                                                    outline: "none",
                                                },
                                                hover: {
                                                    fill: "#CFD8DC",
                                                    stroke: "#607D8B",
                                                    strokeWidth: 0.75,
                                                    outline: "none",
                                                },
                                                pressed: {
                                                    fill: "#FF5722",
                                                    stroke: "#607D8B",
                                                    strokeWidth: 0.75,
                                                    outline: "none",
                                                },
                                            }}
                                        />
                                    ))}
                            </Geographies>
                        </ZoomableGroup>
                    </ComposableMap>
                )}
            </Motion>
        </div>
    )
}

