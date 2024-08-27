import { useMap } from '@vis.gl/react-google-maps';
import React, { useEffect } from 'react';

interface MapHandlerProps {
    place: google.maps.places.PlaceResult | null;
}

const MapHandler: React.FC<MapHandlerProps> = ({ place }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !place) return;

        if (place.geometry?.viewport) {
            map.fitBounds(place.geometry?.viewport);
        }
    }, [map, place]);

    return null;
};

export default React.memo(MapHandler);