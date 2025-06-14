"use client"

import { useEffect, useRef } from "react";
import getAddressFromCoordinates from "@/utils/getAddressFromCoordinates";
import mapboxgl from "mapbox-gl";
import citiesGeoJSON from "../../../testdata/cities";
import ReactDOMServer from "react-dom/server";
import MapListing from "./MapListing";
import LocationPopup from "./LocationPopup";
import axios from "axios";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

import type { Session } from "next-auth"; // Add this import if using next-auth

interface Props {
    session: Session | null;
}

const Map = ({ session }: Props) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const locationMarkerRef = useRef<mapboxgl.Marker | null>(null)
    const locationPopupRef = useRef<mapboxgl.Popup | null>(null);

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

            const popupNode = document.createElement("div");
            popupNode.className = "bg-zinc-900 text-white rounded-lg p-4 shadow-xl max-w-xs";
            popupNode.innerHTML = ReactDOMServer.renderToString(<MapListing />);

            if (coordinates) {
                new mapboxgl.Popup({
                    closeOnClick: true,
                    offset: 15,
                    anchor: 'bottom',
                    closeButton: false
                })
                    .setLngLat(coordinates)
                    .setDOMContent(popupNode)
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

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                const { latitude, longitude } = coords;

                map.setCenter([longitude, latitude]);
                map.setZoom(13);

                if (locationMarkerRef.current) {
                    locationMarkerRef.current.setLngLat([longitude, latitude]);
                } else {
                    const marker = new mapboxgl.Marker({ color: "blue" })
                        .setLngLat([longitude, latitude])
                        .addTo(map)

                    locationMarkerRef.current = marker;

                    marker.getElement().style.cursor = "pointer";

                    marker.getElement().addEventListener("click", async () => {
                        const address = await getAddressFromCoordinates(latitude, longitude);

                        if (locationPopupRef.current) locationPopupRef.current.remove();

                        const popupNode = document.createElement("div");
                        popupNode.className = "bg-zinc-900 text-white rounded-lg p-4 shadow-xl max-w-xs";
                        popupNode.innerHTML = ReactDOMServer.renderToString(<LocationPopup address={address} />);

                        locationPopupRef.current = new mapboxgl.Popup({ offset: 25 })
                            .setLngLat([longitude, latitude])
                            .setDOMContent(popupNode)
                            .addTo(map);
                    })
                }

                if (session?.user?.email) {
                    await axios.post("/api/userlocation", {
                        lat: latitude,
                        lng: longitude
                    });
                }
            },
            (error) => {
                console.warn("Could not get user location", error)
            },
            { enableHighAccuracy: true }
        )

        return () => {
            map.remove();
            mapRef.current = null;
        }

    }, [mapContainerRef, session])


    return (
        <div
            ref={mapContainerRef}
            className="w-full h-full"
        ></div>
    )
};

export default Map
