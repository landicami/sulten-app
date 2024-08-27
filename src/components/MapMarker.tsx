import React, { useState } from 'react';
import {
    AdvancedMarker,
    InfoWindow,
    useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';
import Button from 'react-bootstrap/Button';

interface MarkerWithInfowindowProps {
    place: google.maps.places.PlaceResult | null;
}

const MarkerWithInfowindow: React.FC<MarkerWithInfowindowProps> = ({ place }) => {
    const [infowindowOpen, setInfowindowOpen] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [markerRef, marker] = useAdvancedMarkerRef();

    return (
        <>
            <AdvancedMarker
                ref={markerRef}
                onClick={() => setInfowindowOpen(true)}
                position={place?.geometry?.location}
                title={place?.name}
            />
            {infowindowOpen && (
                <InfoWindow
                    anchor={marker}
                    maxWidth={isExpanded ? 400 : 200}
                    onCloseClick={() => setInfowindowOpen(false)}>
                    <div>
                        <h4>{place?.name ?? ""}</h4>
                        <p>{place?.formatted_address ?? ""}</p>
                        <Button
                            variant="primary"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >Läs mer</Button>
                    </div>
                </InfoWindow>
            )}
        </>
    );
};

export default MarkerWithInfowindow;