import {
	APIProvider,
	AdvancedMarker,
	InfoWindow,
	Map,
	MapCameraChangedEvent,
	Pin,
	/* useMap, */
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { PlaceAutocompleteClassic } from "../components/PlaceAutocomplete";
import MapHandler from "../components/MapHandler";
import useAdminRestaurants from "../hooks/useAdminRestaurants";
import { LatLng } from "../types/Locations.types";
import { Restaurant } from "../types/Restaurant.types";
import Button from "react-bootstrap/Button";
import MapNavigation from "../components/MapNavigation";
import { toast } from "react-toastify";

export const MapPage = () => {
	const [openInfo, setOpenInfo] = useState(false);
	const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
	const [openInfoLocation, setOpenInfoLocation] = useState<null | LatLng>(null);
	const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
	const [infoRestaurant, setInfoRestaurant] = useState<null | Restaurant>(null);
	const [navigationDestination, setNavigationDestination] = useState<LatLng | undefined>(undefined);

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

	const handleNavigate = () => {
		if (infoRestaurant && userLocation) {
			return infoRestaurant.location;
		}
	};

	useEffect(() => {
		if (navigator.geolocation) {
			const watchId = navigator.geolocation.watchPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					setUserLocation({ lat: latitude, lng: longitude });
				},
				(error) => {
					toast.error(error.message);
				}
			);

			return () => {
				setUserLocation(null);
				navigator.geolocation.clearWatch(watchId);
			};
		} else {
			toast.error("Your browser does not support us getting your location.");
		}
	}, []);

	return (
		<APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY} onLoad={() => console.log("Maps API has loaded.")}>
			<h1>Our map</h1>
			<PlaceAutocompleteClassic onPlaceSelect={setSelectedPlace} />

			<div style={{ height: "100vh", width: "100%" }}>
				<Map
					defaultZoom={15}
					defaultCenter={userLocation ?? { lat: 0, lng: 0 }}
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
									<Button
										variant="primary"
										onClick={() => {
											const destination = handleNavigate();
											setNavigationDestination(destination);
										}}
										disabled={!userLocation}
									>
										Navigate to eat here!
									</Button>
								</Card.Footer>
							</Card>
						</InfoWindow>
					)}
				</Map>

				{userLocation && navigationDestination && (
					<MapNavigation userLocation={userLocation} destination={navigationDestination} />
				)}
				<MapHandler place={selectedPlace} />
			</div>
		</APIProvider>
	);
};

export default MapPage;
