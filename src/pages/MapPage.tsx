import { APIProvider, AdvancedMarker, InfoWindow, Map, Pin } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { LatLng } from "../types/Locations.types";
import { Restaurant } from "../types/Restaurant.types";
import Button from "react-bootstrap/Button";
import MapNavigation from "../components/MapNavigation";
import { toast } from "react-toastify";
import SearchMapForm from "../components/SearchMapForm";
import { useSearchParams } from "react-router-dom";
import { getGeocoding } from "../service/GoogleMaps_API";
import { getReverseGeocoding } from "../service/GoogleMaps_API";
import OffCanvasList from "../components/OffCanvasList";
import useGetRestaurantsByCity from "../hooks/useGetCityResturants";

export const MapPage = () => {
	const [openInfo, setOpenInfo] = useState(false);
	const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
	const [openInfoLocation, setOpenInfoLocation] = useState<null | LatLng>(null);
	const [infoRestaurant, setInfoRestaurant] = useState<null | Restaurant>(null);
	const [navigationDestination, setNavigationDestination] = useState<LatLng | undefined>(undefined);
	const [city, setCity] = useState<string | null>(null);
	const [shouldCenterMap, setShouldCenterMap] = useState(false);
	const [mapCenterAfterSearch, setMapCenterAfterSearch] = useState<{ lat: number; lng: number } | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();

	const cityParamSearch = searchParams.get("city") || "";

	const query = useGetRestaurantsByCity();

	const handleClickOpenInfo = (infoObj: Restaurant) => {
		setOpenInfo(true);
		setOpenInfoLocation(infoObj.location);
		setInfoRestaurant(infoObj);
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

	const onCitySearch = (city: string) => {
		setSearchParams({ city: city });
	};

	const searchCityWithApi = async (city: string) => {
		try {
			const cityFromApi = await getGeocoding(city);

			if (cityFromApi.status === "OK" && cityFromApi.results) {
				setMapCenterAfterSearch({
					lat: cityFromApi.results[0].geometry.location.lat,
					lng: cityFromApi.results[0].geometry.location.lng,
				});

				setShouldCenterMap(true);
				const lastComma = cityFromApi.results[0].formatted_address.lastIndexOf(",");
				const result = cityFromApi.results[0].formatted_address.substring(0, lastComma).trim();

				setCity(result);
			} else {
				toast.error("Please try another city, could not find that one");
			}
		} catch (err) {
			if (err instanceof Error) console.error("Error fetching city data:", err.message);

			toast.error("An error occurred while searching for the city. Please try again.");
		}
	};

	const getPostalTown = async (latLng = "55.6071256,13.0212773") => {
		const resReverseGeoCoding = await getReverseGeocoding(latLng);
		const postalTown = resReverseGeoCoding.results[0].address_components.filter((component) => {
			return component.types.includes("postal_town");
		});

		if (postalTown.length > 0) {
			const newcity = postalTown[0].long_name;
			setCity(newcity);
		} else {
			toast.error("No postal town found in the response.");
		}
	};

	useEffect(() => {
		if (city) {
			query.changeCity(city);
		}
	}, [city]);

	useEffect(() => {
		if (cityParamSearch) {
			searchCityWithApi(cityParamSearch);
		}
	}, [cityParamSearch]);

	useEffect(() => {
		if (navigator.geolocation) {
			const watchId = navigator.geolocation.watchPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					setUserLocation({ lat: latitude, lng: longitude });
					getPostalTown(`${latitude},${longitude}`);
				},
				(error) => {
					toast.error(error.message);
					setUserLocation({ lat: 55.6071256, lng: 13.0212773 });
				}
			);

			return () => {
				setUserLocation(null);
				navigator.geolocation.clearWatch(watchId);
			};
		} else {
			toast.error("Your browser does not support us getting your location.");
			getPostalTown();
		}
	}, []);

	return (
		<>
			<OffCanvasList restaurants={query.data} />
			<APIProvider
				apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
			>
				<h1>Our map</h1>
				<SearchMapForm onCitySearch={onCitySearch} />
				<div style={{ height: "80vh", width: "80vw" }}>
					<Map
						defaultZoom={15}
						/* Spara till senare */
						defaultCenter={mapCenterAfterSearch ?? userLocation ?? { lat: 55.6071256, lng: 13.0212773 }}
						center={shouldCenterMap ? mapCenterAfterSearch : undefined}
						onCameraChanged={() => {
							setShouldCenterMap(false);
						}}
						mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
					>
						{query.data &&
							query.data.map((restaurant) => {
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

						<AdvancedMarker title="Your position" key={"userPos"} position={userLocation}>
							<div id="hand-pointer-on-map">👇</div>
						</AdvancedMarker>

						{openInfo && infoRestaurant && (
							<InfoWindow position={openInfoLocation} onCloseClick={handleClickCloseInfo}>
								<Card key={infoRestaurant._id} className="resturant-info-card">
									{infoRestaurant.photoUrls.length === 0 ? (
										<Card.Img
											variant="top"
											src="https://placehold.co/600x400?text=No+Image+Yet+:("
										/>
									) : (
										<Card.Img variant="top" src={infoRestaurant.photoUrls[0]} />
									)}
									<Card.Body>
										<Card.Title>{infoRestaurant.name}</Card.Title>
										<Card.Text>{infoRestaurant.description}</Card.Text>
										<Card.Text>
											<strong>Category:</strong> {infoRestaurant.category}
										</Card.Text>
										<Card.Text>
											<strong>Offer:</strong> {infoRestaurant.offer}
										</Card.Text>
									</Card.Body>
									<Card.Footer className="d-flex justify-content-center">
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

					{query.isError && <p>{query.error}</p>}
					{userLocation && navigationDestination && (
						<MapNavigation userLocation={userLocation} destination={navigationDestination} />
					)}
				</div>
			</APIProvider>
		</>
	);
};

export default MapPage;
