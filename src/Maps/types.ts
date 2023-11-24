
export interface ViewportParams {
    longitude: number;
    latitude: number;
    zoom: number;
    bearing: number;
    pitch: number;
}


export interface MapInterface {
    map: maplibregl.Map,
    helpers: {
        flyToViewport: Function
    }
}