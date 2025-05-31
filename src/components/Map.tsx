"use client"

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import citiesGeoJSON from "../../testdata/cities";
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const Map = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null)

    useEffect(() => {
        const container = mapContainerRef.current;
        if (!container || mapRef.current) return;

        // Initialize the map
        const map = new mapboxgl.Map({
            container: container,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-98.5795, 39.8283],
            zoom: 3,
        });

        mapRef.current = map;

        map.on('load', () => {
            map.addSource('cities', {
                type: 'geojson',
                data: citiesGeoJSON,
            })

            map.addLayer({
                id: 'city-points',
                type: 'circle',
                source: 'cities',
                paint: {
                    'circle-radius': 6,
                    'circle-color': '#ff6600',
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff',
                }
            });
        });


        map.on('click', 'city-points', (e) => {

            const feature = e.features && e.features[0] as mapboxgl.GeoJSONFeature;
            if (!feature || feature.geometry.type !== 'Point') return;

            const coordinates = (feature.geometry.coordinates as [number, number]);
            const name = feature.properties?.name;

            if (coordinates && name) {
                new mapboxgl.Popup({
                    closeOnClick: true,
                    offset: 15,
                    anchor: 'bottom',
                    closeButton: false
                })
                    .setLngLat(coordinates)
                    .setHTML(`<div class="px-2 py-1 bg-white text-black text-xs rounded shadow">${name}</div>`)
                    // .setHTML(`<h1>Hello World!</h1>`)
                    .addTo(map);
            }
        });

        map.on('mouseenter', 'city-points', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'city-points', () => {
            map.getCanvas().style.cursor = '';
        });

        return () => {
            map.remove();
            mapRef.current = null;
        }
    }, [mapContainerRef])


    return (
        <div
            ref={mapContainerRef}
            className="w-full h-full"
        ></div>
    )
};

export default Map
