import {
	APIProvider,
	AdvancedMarker,
	InfoWindow,
	Map,
	MapCameraChangedEvent,
	Pin,
	/* useMap, */
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import Card from "react-bootstrap/Card";
import { PlaceAutocompleteClassic } from "../components/PlaceAutocomplete";
import MapHandler from "../components/MapHandler";
import MarkerWithInfowindow from "../components/MapMarker";

export const MapPage = () => {
	const [openInfo, setOpenInfo] = useState(false);
	const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
	const point = {
		key: "theRocks",
		location: { lat: 55.60587, lng: 13.00073 },
	};

	return (
		<APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY} onLoad={() => console.log("Maps API has loaded.")}>
			<h1>Our map</h1>
			<PlaceAutocompleteClassic onPlaceSelect={setSelectedPlace} />

			<div style={{ height: "100vh", width: "50vw" }}>
				<Map
					defaultZoom={13}
					defaultCenter={{ lat: 55.60587, lng: 13.00073 }} //ens geolocation
					mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
					onCameraChanged={(ev: MapCameraChangedEvent) =>
						console.log("camera changed:", ev.detail.center, "zoom:", ev.detail.zoom)
					}
				>
					<AdvancedMarker
						key={point.key}
						clickable={true}
						onClick={() => setOpenInfo(true)}
						position={point.location}
					>
						<Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
					</AdvancedMarker>

					{openInfo && (
						<InfoWindow
							position={{ lat: -33.860664, lng: 151.208138 }}
							onCloseClick={() => setOpenInfo(false)}
						>
							<Card>
								<Card.Title>Restaurang</Card.Title>
								<Card.Text>Här kommer information</Card.Text>
								<br />
								<br />
							</Card>
						</InfoWindow>
					)}
				</Map>

				<MapHandler place={selectedPlace} />
				<MarkerWithInfowindow place={selectedPlace} />
			</div>
		</APIProvider>
	);
};

export default MapPage;
