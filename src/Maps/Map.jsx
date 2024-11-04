import { useState, useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import { getViewport } from "./utils/viewportUtils";
import windData from '../data/zs/metadata_t0_zs.json';

// import { MapInterface, ViewportParams } from "./types";
// import { highlightLayer } from './useCustomMesh.js'

const transitionDuration = 500;

const init_viewport = {
    center: [-64.71713843185205, 17.755074238874826],
    zoom: 12.366225749316763, 
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

// Flip these around to play with orientation
const coords = [
    [windData.bounds.xmin, windData.bounds.ymax],
    [windData.bounds.xmax, windData.bounds.ymax],
    [windData.bounds.xmax, windData.bounds.ymin],
    [windData.bounds.xmin, windData.bounds.ymin],
]

console.log(coords)


const init_style = 'https://api.maptiler.com/maps/basic-v2-dark/style.json?key=MaFnSq3YV246XmAmaMFo'
// const init_style = 'https://api.maptiler.com/maps/backdrop/style.json?key=MaFnSq3YV246XmAmaMFo'

export function Map({ mesh }) {
    const mapContainer = useRef(null);
    const [map, setMap] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [viewport, setViewport] = useState(init_viewport);
    const [style, setStyle] = useState(init_style);

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

            // map.map.addLayer(mesh.get_layer())

            // map.map.addSource('canvas-mesh-source', {
            //     type: 'canvas',
            //     canvas: 'mesh-canvas',
            //     coordinates: coords,
            //     // Set to true if the canvas source is animated. If the canvas is static, animate should be set to false to improve performance.
            //     animate: true
            // });

            // map.map.addLayer({
            //     id: 'canvas-mesh-layer',
            //     type: 'raster',
            //     source: 'canvas-mesh-source'
            // });
            // map.map.on('moveend', () => setTimeout(() => {
            //     map.map.triggerRepaint()
            //     console.log('repaint')
            // }, 1000))

            console.log(map.map)
        });
        map.map.on("move", () => {
            setViewport(getViewport(map.map));
        });
        console.log(map.map)
    }, [map]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        console.log(viewport)
    }, [viewport])

    return <div
        ref={mapContainer}
        className="map-container"
    />

} 