import { useState, useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import { getViewport } from "./utils/viewportUtils";
import { MapInterface, ViewportParams } from "./types";
import { highlightLayer } from './useCustomMesh.js'

const transitionDuration = 500;
const init_viewport = {
    latitude: 17.7853676657609,
    longitude: -64.74988233262428,
    zoom: 13,
    bearing: 0,
    pitch: 0
}

export function Map(): React.ReactElement {
    const mapContainer = useRef(null);
    const [map, setMap] = useState<MapInterface | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [viewport, setViewport] = useState(init_viewport);
    const [style, setStyle] = useState('https://api.maptiler.com/maps/satellite/style.json?key=MaFnSq3YV246XmAmaMFo');

    function flyToViewport(viewport: ViewportParams) {
        const center: [number, number] = [viewport.longitude, viewport.latitude]
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
        const _map: MapInterface = {
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
            map.map.addLayer(highlightLayer);
            setMapLoaded(true);
        });
        map.map.on("move", () => {
            setViewport(getViewport(map.map));
        });
    }, [map]); // eslint-disable-line react-hooks/exhaustive-deps

    return <div ref={mapContainer}
        className="map-container" />

} 