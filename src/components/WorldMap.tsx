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
import {FoodGenre, foodGenres} from "../foodgenres";
import {geoPath} from "d3-geo"
import {geoTimes} from "d3-geo-projection";
import {FoodGenreDetail} from "./FoodGenreDetail";

const wrapperStyles = {
    width: "100%",
    maxWidth: 980,
    margin: "0 auto",
    position: 'relative',
};

type Coordinates = [number, number];

export function WorldMap() {
    const locationContext: LocationCtx = useContext(LocationContext);
    const [center, setCenter] = React.useState<Coordinates>([0, 20]);
    const [zoom, setZoom] = React.useState(1);
    const [selectedCountry, setSelectedCountry] = React.useState<Geography | undefined>(undefined)

    function handleZoomIn() {
        setZoom(zoom * 2);
    }

    function handleZoomOut() {
        setZoom(zoom / 2)
    }

    function handleReset() {
        setCenter([0, 20]);
        setZoom(1);
        setSelectedCountry(undefined);
    }

    function projection() {
        return geoTimes()
            .translate([980 / 2, 550 / 2])
            .scale(160)
    }

    async function handleCountryClick(geography: Geography) {
        // const genre = foodGenres[geography.properties.genreKey];

        setSelectedCountry(geography);


        const path = geoPath().projection(projection());
        // @ts-ignore
        const centroid = projection().invert(path.centroid(geography))

        setCenter(centroid);
        setZoom(2)

        // if (genre) {
        //     await getLocations(genre);
        // }
    }


    const getLocations = async (genre: FoodGenre) => {
        if (locationContext.userLocation) {
            await locationContext.getLocations(locationContext.userLocation.id, genre);
        }
    };

    return (
        // @ts-ignore
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
            {selectedCountry && <div
                style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    backgroundColor: 'white',
                    border: '1px solid black',
                }}>
                <FoodGenreDetail genre={foodGenres.asian} handleClickEat={() => console.log('eat me')}/>
            </div>}
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
                                    geographies.map((geography, i) => {
                                        return (
                                            <Geography
                                                key={i}
                                                cacheId={`geography-${i}`}
                                                geography={geography}
                                                projection={projection}
                                                // @ts-ignore
                                                onClick={handleCountryClick}
                                                style={{
                                                    default: {
                                                        // @ts-ignore
                                                        fill: `${selectedCountry && selectedCountry.properties.ISO_A3 === geography.properties.ISO_A3 ? '#FF5722' : '#ECEFF1'}`,
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
                                        )
                                    })}
                            </Geographies>
                        </ZoomableGroup>
                    </ComposableMap>
                )}
            </Motion>
        </div>
    )
}

