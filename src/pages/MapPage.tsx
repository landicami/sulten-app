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
import { getReverseGeocoding } from "../service/GoogleMaps_API";
import useRestaurantsInCity from "../hooks/useRestaurantsInCity";

export const MapPage = () => {
	const [openInfo, setOpenInfo] = useState(false);
	const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
	const [openInfoLocation, setOpenInfoLocation] = useState<null | LatLng>(null);
	const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
	const [infoRestaurant, setInfoRestaurant] = useState<null | Restaurant>(null);

	const { data: restaurants } = useAdminRestaurants();

	const { changeCity, restaurants: restaurantsInCity, city } = useRestaurantsInCity();

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

	const getPostalTown = async (latLng = "55.6071256,13.0212773") => {
		const resReverseGeoCoding = await getReverseGeocoding(latLng);
		const postalTown = resReverseGeoCoding.results[0].address_components.filter((component) => {
			return component.types.includes("postal_town");
		});

		if (postalTown.length > 0) {
			const newcity = postalTown[0].long_name;
			changeCity(newcity);
		} else {
			console.error("No postal town found in the response.");
		}
	};

	console.log("🏙️ city: ", city);

	if (!restaurantsInCity) {
		console.log(`🌮 restaurants in ${city}: is null ❌`);
	} else if (restaurantsInCity.length <= 0) {
		console.log(`🌮 restaurants in ${city}: is 0 ✅`);
	} else {
		console.log(`1st 🌮 restaurants in ${city}: is ${restaurantsInCity[0].name} ✅`);
	}

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					setUserLocation({ lat: latitude, lng: longitude });
					getPostalTown(`${latitude},${longitude}`);
				},
				(error) => {
					console.error("Error obtaining geolocation: ", error);
				}
			);
		} else {
			console.error("Geolocation is not supported by this browser.");
			getPostalTown();
		}
	}, []);

	useEffect(() => {}, [city]);

	return (
		<APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY} onLoad={() => console.log("Maps API has loaded.")}>
			<h1>Our map</h1>
			<PlaceAutocompleteClassic onPlaceSelect={setSelectedPlace} />

			<div style={{ height: "100vh", width: "50vw" }}>
				<Map
					defaultZoom={15}
					defaultCenter={userLocation || { lat: 55.6071256, lng: 13.0212773 }} // Use user's location or default
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
			</div>
		</APIProvider>
	);
};

export default MapPage;
