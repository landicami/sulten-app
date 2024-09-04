import { APIProvider, AdvancedMarker, InfoWindow, Map } from "@vis.gl/react-google-maps";
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
import Image from "react-bootstrap/Image";
import insta from "../assets/images/insta.svg";
import facebook from "../assets/images/facebook.svg";
import link from "../assets/images/link.svg";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
			setSearchParams({ city: newcity });
			setCity(newcity);
		} else {
			toast.error("No postal town found in the response.");
		}
	};

	const handleReset = () => {
		if (userLocation) {
			getPostalTown(`${userLocation.lat},${userLocation.lng}`);
		}
		setSearchParams({ city: "Malmö" });
		setCity("Malmö");
	};

	useEffect(() => {
		if (city) {
			query.changeCity(city);
		}
	}, [city, query]);

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

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
				<h1 className="text-center">SULTEN!</h1>
				<OffCanvasList restaurants={query.data} />
				<SearchMapForm onCitySearch={onCitySearch} onReset={handleReset} />
				<div className="map">
					<Map
						defaultZoom={15}
						defaultCenter={mapCenterAfterSearch ?? userLocation ?? { lat: 55.6071256, lng: 13.0212773 }}
						center={shouldCenterMap ? mapCenterAfterSearch : undefined}
						onCameraChanged={() => {
							setShouldCenterMap(false);
						}}
						mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
					>
						{query.data &&
							query.data.map((restaurant, index) => {
								return (
									<AdvancedMarker
										key={`${restaurant._id}-${index}`}
										clickable={true}
										onClick={() => handleClickOpenInfo(restaurant)}
										position={restaurant.location}
									>
										<div className="pointer-on-map">🍔</div>
									</AdvancedMarker>
								);
							})}

						<AdvancedMarker title="Your position" key={"userPos"} position={userLocation}>
							<div className="pointer-on-map">👇</div>
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
										{infoRestaurant.description && (
											<Card.Text>{infoRestaurant.description}</Card.Text>
										)}
										<Card.Text>
											<strong>Category:</strong> {infoRestaurant.category}
										</Card.Text>
										<Card.Text>
											<strong>Offer:</strong> {infoRestaurant.offer}
										</Card.Text>
										{infoRestaurant.phone && (
											<Card.Text>
												<strong>Phone:</strong> {infoRestaurant.phone}
											</Card.Text>
										)}
										<div className="icon-wrapper mb-3">
											{infoRestaurant.website && (
												<Card.Text>
													<a
														href={infoRestaurant.website}
														target="_blank"
														rel="noopener noreferrer"
													>
														<Image className="icon" src={link} alt="Website icon" />
													</a>
												</Card.Text>
											)}
											{infoRestaurant.facebook && (
												<Card.Text className="icon-wrapper">
													<a
														href={infoRestaurant.facebook}
														target="_blank"
														rel="noopener noreferrer"
													>
														<Image className="icon" src={facebook} alt="Facebook icon" />
													</a>
												</Card.Text>
											)}
											{infoRestaurant.instagram && (
												<Card.Text className="icon-wrapper">
													<a
														href={infoRestaurant.instagram}
														target="_blank"
														rel="noopener noreferrer"
													>
														<Image className="icon" src={insta} alt="Instagram icon" />
													</a>
												</Card.Text>
											)}
										</div>
										<div>
											{infoRestaurant.photoUrls.length > 1 && (
												<>
													<Row className="row">
														{infoRestaurant.photoUrls.slice(1).map((photo, index) => (
															<Col xs={8} md={6} lg={4} key={`${photo}-${index}`}>
																<Card.Img
																	alt="Resturant photos"
																	className="other-photos mb-3"
																	src={photo}
																/>
															</Col>
														))}
													</Row>
												</>
											)}
										</div>
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
