import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import React, { useEffect, useState } from "react";
import { LatLng } from "../types/Locations.types";
import { toast } from "react-toastify";
import Container from "react-bootstrap/Container";
import { CloseButton } from "react-bootstrap";

interface MapNavigationProps {
    userLocation: { lat: number; lng: number };
    destination: LatLng;
}

const MapNavigation: React.FC<MapNavigationProps> = ({ userLocation, destination }) => {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [navigationService, setNavigationService] = useState<google.maps.DirectionsService>();
    const [navigationRenderer, setNavigationRenderer] = useState<google.maps.DirectionsRenderer>();
    const [route, setRoute] = useState<google.maps.DirectionsRoute>();
    const [isOpen, setIsOpen] = useState(true);
    const leg = route?.legs[0];

    useEffect(() => {
        if (!routesLibrary || !map) return;
        setNavigationService(new routesLibrary.DirectionsService());
        setNavigationRenderer(new routesLibrary.DirectionsRenderer());
    }, [routesLibrary, map]);

    useEffect(() => {
        if (!navigationService || !navigationRenderer || !destination) return;
        setIsOpen(true);
        if (userLocation) {
            const location = { lat: userLocation.lat, lng: userLocation.lng };
            const dest = { lat: destination.lat, lng: destination.lng };

            navigationService
                .route({
                    origin: location,
                    destination: dest,
                    travelMode: google.maps.TravelMode.WALKING,
                    provideRouteAlternatives: false,
                })
                .then((res) => {
                    navigationRenderer.setDirections(res);
                    setRoute(res.routes[0]);
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    }, [navigationService, navigationRenderer, userLocation, destination]);

    useEffect(() => {
        if (!navigationRenderer) return;
        navigationRenderer.setMap(route ? map : null);
    }, [route, navigationRenderer]);

    if (!leg) {
        return null;
    }

    return (
        <>
            {isOpen && (
                <Container className="map-navigation d-flex justify-content-between">
                    <div>
                        <h2>{route.summary}</h2>
                        <p>
                            {leg.start_address.split(",")[0]} to {leg?.end_address.split(",")[0]}
                        </p>
                        <p>Distance: {leg.distance?.text}</p>
                        <p>Duration: {leg.duration?.text}</p>
                    </div>
                    <div>
                        <CloseButton onClick={() => setIsOpen(false)}></CloseButton>
                    </div>
                </Container>
            )}
        </>
    );
};

export default MapNavigation;
