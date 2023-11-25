import { useState, useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import { getViewport } from "./utils/viewportUtils";
// import { MapInterface, ViewportParams } from "./types";
// import { highlightLayer } from './useCustomMesh.js'

const transitionDuration = 500;

const init_viewport = {
    center: [-64.74988233262428, 17.7853676657609],
    zoom: 13,
    bearing: 0,
    pitch: 0
}

// const init_viewport = {
//     latitude: 0,
//     longitude: 0,
//     zoom: 0,
//     bearing: 0,
//     pitch: 0
// }

const coords = [
    [-64.73374196267778, 17.77621879686222],
    [-64.74840398683924, 17.77621879686222],
    [-64.74840398683924, 17.783984953353503],
    [-64.73374196267778, 17.783984953353503]
]

export function Map(canvasRef) {
    const mapContainer = useRef(null);
    const [map, setMap] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [viewport, setViewport] = useState(init_viewport);
    const [style, setStyle] = useState('https://api.maptiler.com/maps/satellite/style.json?key=MaFnSq3YV246XmAmaMFo');

    function flyToViewport(viewport) {
        const center = [viewport.longitude, viewport.latitude]
        const viewport_formatted = {
            center: center,
            zoom: viewport.zoom,
            bearing: viewport.bearing,
            pitch: viewport.pitch,
            transitionDuration: transitionDuration,
        };
        map?.map.flyTo(viewport_formatted);
    }

    useEffect(() => {
        if (map) return; // initialize map only once
        if (!mapContainer.current) return
        const _map = {
            map: new maplibregl.Map({
                container: mapContainer.current,
                style: style,
                boxZoom: false,
                antialias: true,
                maxPitch: 85,
                ...init_viewport
            }),
            helpers: {
                flyToViewport: flyToViewport
            }
        }
        setMap(
            _map
        );
    }, []);

    useEffect(() => {
        if (!map) return;
        if (mapLoaded) return;
        map.map.on("load", () => {
            map.map.getCanvas().style.cursor = "pointer";
            map.map.setRenderWorldCopies(true);
            map.map.on("move", () => {
                setViewport(getViewport(map.map));
            });

            setMapLoaded(true);
            map.map.addSource('canvas-source', {
                type: 'canvas',
                canvas: 'flowmap',
                coordinates: coords,
                // Set to true if the canvas source is animated. If the canvas is static, animate should be set to false to improve performance.
                animate: true
            });

            map.map.addLayer({
                id: 'canvas-layer',
                type: 'raster',
                source: 'canvas-source'
            });
        });
        map.map.on("move", () => {
            setViewport(getViewport(map.map));
        });
        console.log(map.map)
    }, [map]); // eslint-disable-line react-hooks/exhaustive-deps

    return <div
        ref={mapContainer}
        className="map-container"
    />

} 