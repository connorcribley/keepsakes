import type { FeatureCollection, Point } from "geojson";

const citiesGeoJSON: FeatureCollection<Point> = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: { name: 'New York' },
            geometry: {
                type: 'Point',
                coordinates: [-74.006, 40.7128],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'Los Angeles' },
            geometry: {
                type: 'Point',
                coordinates: [-118.2437, 34.0522],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'Miami' },
            geometry: {
                type: 'Point',
                coordinates: [-80.1918, 25.7617],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'Houston' },
            geometry: {
                type: 'Point',
                coordinates: [-95.3698, 29.7604],
            },
        },
        {
            type: 'Feature',
            properties: { name: 'Chicago' },
            geometry: {
                type: 'Point',
                coordinates: [-87.6298, 41.8781],
            },
        },
    ],
};

export default citiesGeoJSON;