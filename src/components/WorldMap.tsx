import * as React from "react"
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
    Markers,
    Marker, MarkerType,
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
import SVG from 'react-inlinesvg';
import {ReactComponent as Stamp} from '../assets/images/stamp2.svg'
import {Post} from "./Post";

console.log(Stamp, 'stamp')

const wrapperStyles = {
    width: "100%",
    margin: "0 auto",
    position: 'relative',
};

type Coordinates = [number, number];

const MAP_WIDTH = 850;
const MAP_HEIGHT = 400;
const markers = [
    {markerOffset: -25, name: "Buenos Aires", coordinates: [-58.3816, -34.6037]},
    {markerOffset: -25, name: "La Paz", coordinates: [-68.1193, -16.4897]},
    {markerOffset: 35, name: "Brasilia", coordinates: [-47.8825, -15.7942]},
    {markerOffset: 35, name: "Santiago", coordinates: [-70.6693, -33.4489]},
    {markerOffset: 35, name: "Bogota", coordinates: [-74.0721, 4.7110]},
    {markerOffset: 35, name: "Quito", coordinates: [-78.4678, -0.1807]},
    {markerOffset: -25, name: "Georgetown", coordinates: [-58.1551, 6.8013]},
    {markerOffset: -25, name: "Asuncion", coordinates: [-57.5759, -25.2637]},
    {markerOffset: 35, name: "Paramaribo", coordinates: [-55.2038, 5.8520]},
    {markerOffset: 35, name: "Montevideo", coordinates: [-56.1645, -34.9011]},
    {markerOffset: -25, name: "Caracas", coordinates: [-66.9036, 10.4806]},
]

export function WorldMap() {
    const locationContext: LocationCtx = useContext(LocationContext);
    const [center, setCenter] = React.useState<Coordinates>([0, 20]);
    const [zoom, setZoom] = React.useState(1);
    const [selectedCountry, setSelectedCountry] = React.useState<Geography | undefined>(undefined)
    const [isAddingPin, setIsAddingPin] = React.useState(false);
    const [isCreatingPost, setIsCreatingPost] = React.useState(false);
    const [markers, setMarkers] = React.useState<MarkerType[]>([]);
    const mapRef = React.useRef(null);

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

    // @ts-ignore
    async function handleCountryClick(geography: Geography & { properties: ExtendedGeographyProperties }, proj, evt) {
        if (isAddingPin || isCreatingPost) {
            const gp = geoPath().projection(proj)
            const dim = evt.target.getBoundingClientRect()
            const cx = evt.clientX - dim.left
            const cy = evt.clientY - dim.top
            // @ts-ignore
            const [orgX, orgY] = gp.bounds(geography)[0]

            // @ts-ignore
            const box = mapRef!.current!.getBoundingClientRect()
            const scale = box.width / MAP_WIDTH

            // @ts-ignore
            const c = proj.invert([orgX + cx / scale, orgY + cy / scale]);

            console.log(c, 'asdf')
            setMarkers([
                { coordinates: c}
            ])
            return;
        }

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

    const getCurrentPosition = (e: React.MouseEvent) => {
        if (selectedCountry && mapRef && mapRef.current) {
            // const projection = geoTimes()
            //     .translate([MAP_WIDTH/2, MAP_HEIGHT/2])
            //     .scale(125)
            // // @ts-ignore
            // const box = mapRef!.current!.getBoundingClientRect()
            //
            // const resizeFactorX = 1 / MAP_WIDTH * box.width
            // const resizeFactorY = 1 / MAP_HEIGHT * box.height
            //
            // const originalCenter = [MAP_WIDTH / 2, MAP_HEIGHT / 2]
            // const prevCenter = projection(center)
            //
            // const offsetX = prevCenter[0] - originalCenter[0]
            // const offsetY = prevCenter[1] - originalCenter[1]
            //
            // const {top, left} = box
            // const clientX = (e.clientX - left) / resizeFactorX
            // const clientY = (e.clientY - top) / resizeFactorY
            //
            // const x = clientX + offsetX
            // const y = clientY + offsetY
            //
            // const c = projection.invert([x, y])
            // setMarkers([
            //     { coordinates: c}
            // ])
            // console.log(c, 'wtf')
            // @ts-ignore
            // const gp = geoPath().projection(projection)
            // // @ts-ignore
            // const dim = mapRef!.current!.getBoundingClientRect()
            // const cx = e.clientX - dim.left
            // const cy = e.clientY - dim.top
            // const [orgX, orgY] = gp.bounds(selectedCountry)[0]
            // // @ts-ignore
            // const c = projection.invert([orgX + cx, orgY + cy])
            // console.log(c, 'yo')
        }
    }

    return (
        // @ts-ignore
        <div onClick={getCurrentPosition} style={wrapperStyles} className={isAddingPin ? "cursor-pic" : ''}
             ref={mapRef}>
            <div
                style={{
                    position: 'absolute',
                    top: MAP_HEIGHT / 4,
                    right: MAP_WIDTH / 4,
                }}
            >
                <button
                    className={'button'}
                    onClick={() => {
                        setIsAddingPin(true)
                        setIsCreatingPost(true)
                    }}>
                    Add Pin
                </button>
                <button
                    className={'button'}
                    onClick={handleReset}>
                    {"Reset"}
                </button>
            </div>
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
            {
                isCreatingPost &&
                <div>
                    <Card>
                        <Post/>
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
                                    onClick={(geo, e) => handleCountryClick(geo, projection, e)}
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
                            <Markers>
                                {markers.map((marker, i) => (
                                    <Marker
                                        key={i}
                                        marker={{coordinates: marker.coordinates} as MarkerType}
                                        style={{
                                            default: {fill: "#FF5722"},
                                            hover: {fill: "#FFFFFF"},
                                            pressed: {fill: "#FF5722"},
                                        }}
                                        onClick={() => console.log('hello world')}
                                    >
                                        <rect height="10" width='10' stroke="white" fill="white"
                                        />
                                        <Stamp fill='blue' height={10} width={10}/>
                                    </Marker>
                                ))}
                            </Markers>
                        </ZoomableGroup>
                    </ComposableMap>
                )}
            </Motion>
            <ReactTooltip/>
        </div>
    )
}

