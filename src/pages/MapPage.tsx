import {
	APIProvider,
	AdvancedMarker,
	InfoWindow,
	Map,
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
import SearchMapForm from "../components/SearchMapForm";
import { useSearchParams } from "react-router-dom";
import { getGeocoding } from "../service/GoogleMaps_API";
import { toast } from "react-toastify";
import { getReverseGeocoding } from "../service/GoogleMaps_API";
import useGetRestuarantByCity from "../hooks/useGetRestuarantByCity";

export const MapPage = () => {
	const [openInfo, setOpenInfo] = useState(false);
	const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
	const [openInfoLocation, setOpenInfoLocation] = useState<null | LatLng>(null);
	const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
	const [infoRestaurant, setInfoRestaurant] = useState<null | Restaurant>(null);
	const [city, setCity] = useState("Malmö");

	const { data: restaurants } = useAdminRestaurants();

	const [searchParams, setSearchParams] = useSearchParams();

	const cityParamSearch = searchParams.get("city") || "";

	const [mapCenterAfterSearch, setMapCenterAfterSearch] = useState<{ lat: number; lng: number } | null>(null);

	const { data } = useGetRestuarantByCity(city);

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

	const onCitySearch = (city: string) => {
		setSearchParams({ city: city });
	};

	const searchCityWithApi = async (city: string) => {
		try {
			const cityFromApi = await getGeocoding(city);
			console.log("City from api", cityFromApi);

			if (cityFromApi.status === "OK" && cityFromApi.results) {
				setMapCenterAfterSearch({
					lat: cityFromApi.results[0].geometry.location.lat,
					lng: cityFromApi.results[0].geometry.location.lng,
				});
				console.log("Searched for", cityFromApi.results[0].formatted_address);
			} else {
				toast.error("Please try another city, could not find that one");
			}
		} catch (err) {
			if (err instanceof Error) console.error("Error fetching city data:", err.message);

			toast.error("An error occurred while searching for the city. Please try again.");
		}
	};

	console.log(mapCenterAfterSearch);

	useEffect(() => {
		if (cityParamSearch) {
			searchCityWithApi(cityParamSearch);
		}
	}, [cityParamSearch]);

	const getPostalTown = async (latLng = "55.6071256,13.0212773") => {
		const resReverseGeoCoding = await getReverseGeocoding(latLng);
		const postalTown = resReverseGeoCoding.results[0].address_components.filter((component) => {
			return component.types.includes("postal_town");
		});

		if (postalTown.length > 0) {
			const newcity = postalTown[0].long_name;
			console.log(newcity);
			setCity(newcity);
		} else {
			console.error("No postal town found in the response.");
		}
	};

	console.log("🏙️ city: ", city);

	if (!data) {
		console.log(`🌮 restaurants in ${city}: is null ❌`);
	} else if (data.length <= 0) {
		console.log("Data is not null, but no city yet :) ", data);
	} else {
		console.log(`Length 🌮 restaurants in ${city}: is ${data.length} ✅`);
		console.log(`1st 🌮 restaurants in ${city}: is ${data[0].name} ✅`);
		console.log(`1st 🌮 restaurants in ${city}: is ${data[0]._id} ✅`);
		console.log(`1st 🌮 restaurants in ${city}: is ${data[0].address} ✅`);
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

	return (
		<APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY} onLoad={() => console.log("Maps API has loaded.")}>
			<h1>Our map</h1>
			{/* <PlaceAutocompleteClassic onPlaceSelect={setSelectedPlace} /> */}
			<SearchMapForm onCitySearch={onCitySearch} />
			<div style={{ height: "100vh", width: "50vw" }}>
				<Map
					defaultZoom={15}
					center={mapCenterAfterSearch || userLocation || { lat: 55.6071256, lng: 13.0212773 }}
					// defaultCenter={userLocation || { lat: 55.6071256, lng: 13.0212773 }} // Use user's location or default
					mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
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

				{/* <MapHandler place={selectedPlace} /> */}
			</div>
		</APIProvider>
	);
};

export default MapPage;
