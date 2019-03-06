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
import {Card} from "./Card";
import ReactTooltip from 'react-tooltip'
import {LocationSearch} from "./LocationSearch";
import {SearchResults} from "./SearchResults";

const wrapperStyles = {
    width: "100%",
    margin: "0 auto",
    position: 'relative',
};

type Coordinates = [number, number];

const MAP_WIDTH = 850;
const MAP_HEIGHT = 400;

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
            .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2])
            .scale(160)
    }

    interface ExtendedGeographyProperties {
        genreKey: string;
    }

    async function handleCountryClick(geography: Geography & { properties: ExtendedGeographyProperties }) {
        setSelectedCountry(geography);

        const path = geoPath().projection(projection());
        // @ts-ignore
        const centroid = projection().invert(path.centroid(geography));

        setCenter(centroid);
        setZoom(2);
    }


    const onClickEat = async () => {
        if (locationContext.userLocation) {
            // @ts-ignore
            const genre = foodGenres[selectedCountry.properties.genre];
            await locationContext.getLocations(locationContext.userLocation.id, genre);
        } else {
            alert('please find your location!')
        }
    };

    return (
        // @ts-ignore
        <div style={wrapperStyles}>
            <button
                className={'button'}
                style={{
                    position: 'absolute',
                    top: MAP_HEIGHT / 4,
                    right: MAP_WIDTH / 4,
                }}
                onClick={handleReset}>
                {"Reset"}
            </button>
            {selectedCountry &&
            <div
                style={{
                    position: 'absolute',
                    left: MAP_WIDTH / 4,
                    top: MAP_HEIGHT / 4,
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}>
                <Card
                    closable={true}
                    onClose={handleReset}
                >
                    <FoodGenreDetail genre={foodGenres.asian} handleClickEat={onClickEat}/>
                </Card>
                <Card
                    closable={true}
                    onClose={handleReset}
                >
                    <LocationSearch/>
                    <SearchResults/>
                </Card>
            </div>
            }
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
                        projectionConfig={{scale: 125}}
                        width={MAP_WIDTH}
                        height={MAP_HEIGHT}
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
                                                data-tip={geography.properties.NAME}
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
            <ReactTooltip/>
        </div>
    )
}

