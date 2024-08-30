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
import useAdminRestaurants from "../hooks/useAdminRestaurants";
import { LatLng } from "../types/Locations.types";
import { Restaurant } from "../types/Restaurant.types";
import Button from "react-bootstrap/Button";

export const MapPage = () => {
	const [openInfo, setOpenInfo] = useState(false);
	const [openInfoLocation, setOpenInfoLocation] = useState<null | LatLng>(null);
	const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
	const [infoRestaurant, setInfoRestaurant] = useState<null | Restaurant>(null);
	/* const point = {
		key: "theRocks",
		location: { lat: 55.60587, lng: 13.00073 },
	}; */

	const { data: restaurants } = useAdminRestaurants();

	const handleClickOpenInfo = (inofObject: Restaurant) => {
		setOpenInfo(true);
		setOpenInfoLocation(inofObject.location);
		setInfoRestaurant(inofObject);
	};

	const handleClickCloseInfo = () => {
		setOpenInfo(false);
		setOpenInfoLocation(null);
		setInfoRestaurant(null);
	};

	console.log("Open info: ", openInfo);
	console.log("Open info location: ", openInfoLocation);

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
					{restaurants &&
						restaurants.map((restaurant) => {
							return (
								<AdvancedMarker
									key={restaurant._id}
									clickable={true}
									onClick={() => handleClickOpenInfo(restaurant)}
									position={restaurant.location}
								>
									<Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
								</AdvancedMarker>
							);
						})}

					{openInfo && infoRestaurant && (
						<InfoWindow position={openInfoLocation} onCloseClick={handleClickCloseInfo}>
							<Card key={infoRestaurant._id}>
								{infoRestaurant.photoUrls.length === 0 ? (
									<Card.Img variant="top" src="https://placehold.co/600x400?text=No+Image+Yet+:(" />
								) : (
									<Card.Img variant="top" src={infoRestaurant.photoUrls[0]} />
								)}
								<Card.Body>
									<Card.Title>{infoRestaurant.name}</Card.Title>
									<Card.Text>{infoRestaurant.description}</Card.Text>
									<Card.Text>{infoRestaurant.category}</Card.Text>
									<Card.Text>{infoRestaurant.offer}</Card.Text>
								</Card.Body>
								<Card.Footer>
									{infoRestaurant.website ? (
										<Button>
											<a href={infoRestaurant.website}></a>Besök hemsidan
										</Button>
									) : (
										<p>Det finns ingen hemsida</p>
									)}
								</Card.Footer>
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
