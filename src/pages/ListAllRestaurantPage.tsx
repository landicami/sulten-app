import useAdminRestaurants from "../hooks/useAdminRestaurants";
import { ColumnDef } from "@tanstack/react-table";
import { Restaurant } from "../types/Restaurant.types";
import Container from "react-bootstrap/Container";
import TanstackTable from "../components/table/TanstackTable";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import SearchMapForm from "../components/SearchMapForm";
import { useSearchParams } from "react-router-dom";
import { getGeocoding } from "../service/GoogleMaps_API";
import { toast } from "react-toastify";
import useGetRestaurantsByCity from "../hooks/useGetCityResturants";

const ListAllRestaurantsPage = () => {
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	const [searchParams, setSearchParams] = useSearchParams();
	const [city, setCity] = useState<string | null>(null);
	const cityParamSearch = searchParams.get("city") || "";
	const { data: adminRestaurants, loading: adminLoading } = useAdminRestaurants();

	const query = useGetRestaurantsByCity();

	const updateMedia = () => {
		setIsMobile(window.innerWidth < 768);
	};

	const onCitySearch = (city: string) => {
		setSearchParams({ city: city });
	};

	const searchCityWithApi = async (city: string) => {
		try {
			const cityFromApi = await getGeocoding(city);

			if (cityFromApi.status === "OK" && cityFromApi.results) {
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

	const handleReset = () => {
		setCity(null);
		setSearchParams({});
		query.changeCity(null);
	};

	useEffect(() => {
		window.addEventListener("resize", updateMedia);
		return () => window.removeEventListener("resize", updateMedia);
	}, []);

	useEffect(() => {
		if (city) {
			query.changeCity(city);
		} else {
			query.changeCity(null);
		}
	}, [city]);

	useEffect(() => {
		if (cityParamSearch) {
			searchCityWithApi(cityParamSearch);
		}
	}, [cityParamSearch, searchParams]);

	const columnDefs: ColumnDef<Restaurant>[] = [
		{
			accessorKey: "name",
			header: "Name",
		},
		{
			accessorKey: "address",
			header: "Address",
		},
		{
			accessorKey: "city",
			header: "City",
		},
		{
			accessorKey: "description",
			header: "Description",
		},
		{
			accessorKey: "category",
			header: "Category",
		},
		{
			accessorKey: "offer",
			header: "Offer",
		},
		{
			accessorKey: "phone",
			header: "Phone",
		},
		{
			accessorKey: "email",
			header: "Email",
		},
		{
			accessorKey: "website",
			header: "Website",
		},
		{
			accessorKey: "facebook",
			header: "Facebook",
		},
		{
			accessorKey: "instagram",
			header: "Instagram",
		},
	];

	return (
		<Container fluid>
			<h2 className="mb-4">List of all restaurants 🥙</h2>
			<div className="mb-3 d-flex justify-content-between">
				<SearchMapForm onCitySearch={onCitySearch} onReset={handleReset} />
			</div>

			{adminLoading || (query.isLoading && <p>Loading...</p>)}

			{!city &&
				adminRestaurants &&
				adminRestaurants.length > 0 &&
				(isMobile ? (
					<Row>
						{adminRestaurants.map((restaurant) => (
							<Col xs={12} key={restaurant._id} className="mb-3">
								<div className="p-3 border border-secondary rounded">
									<h3 className="h5">{restaurant.name}</h3>
									<p>
										<strong>Address:</strong> {restaurant.address}
									</p>
									<p>
										<strong>City:</strong> {restaurant.city}
									</p>
									{restaurant.description && (
										<p>
											<strong>Description:</strong> {restaurant.description}
										</p>
									)}
									<p>
										<strong>Category:</strong> {restaurant.category}
									</p>
									<p>
										<strong>Offer:</strong> {restaurant.offer}
									</p>
									{restaurant.phone && (
										<p>
											<strong>Phone:</strong> {restaurant.phone}
										</p>
									)}
									{restaurant.email && (
										<p>
											<strong>Email:</strong> {restaurant.email}
										</p>
									)}
									{restaurant.website && (
										<p>
											<strong>Website:</strong>
											<a href={restaurant.website} target="_blank">
												{restaurant.website}
											</a>
										</p>
									)}
									{restaurant.facebook && (
										<p>
											<strong>Facebook:</strong>
											<a href={restaurant.facebook} target="_blank">
												{restaurant.facebook}
											</a>
										</p>
									)}
									{restaurant.instagram && (
										<p>
											<strong>Instagram:</strong>
											<a href={restaurant.instagram} target="_blank">
												{restaurant.instagram}
											</a>
										</p>
									)}
								</div>
							</Col>
						))}
					</Row>
				) : (
					<TanstackTable columns={columnDefs} data={adminRestaurants} />
				))}
			{city &&
				query.data &&
				query.data.length > 0 &&
				(isMobile ? (
					<Row>
						{query.data.map((restaurant) => (
							<Col xs={12} key={restaurant._id} className="mb-3">
								<div className="p-3 border border-secondary rounded">
									<h3 className="h5">{restaurant.name}</h3>
									<p>
										<strong>Address:</strong> {restaurant.address}
									</p>
									<p>
										<strong>City:</strong> {restaurant.city}
									</p>
									{restaurant.description && (
										<p>
											<strong>Description:</strong> {restaurant.description}
										</p>
									)}
									<p>
										<strong>Category:</strong> {restaurant.category}
									</p>
									<p>
										<strong>Offer:</strong> {restaurant.offer}
									</p>
									{restaurant.phone && (
										<p>
											<strong>Phone:</strong> {restaurant.phone}
										</p>
									)}
									{restaurant.email && (
										<p>
											<strong>Email:</strong> {restaurant.email}
										</p>
									)}
									{restaurant.website && (
										<p>
											<strong>Website:</strong>
											<a href={restaurant.website} target="_blank">
												{restaurant.website}
											</a>
										</p>
									)}
									{restaurant.facebook && (
										<p>
											<strong>Facebook:</strong>
											<a href={restaurant.facebook} target="_blank">
												{restaurant.facebook}
											</a>
										</p>
									)}
									{restaurant.instagram && (
										<p>
											<strong>Instagram:</strong>
											<a href={restaurant.instagram} target="_blank">
												{restaurant.instagram}
											</a>
										</p>
									)}
								</div>
							</Col>
						))}
					</Row>
				) : (
					<TanstackTable columns={columnDefs} data={query.data} />
				))}
			{!adminRestaurants || (adminRestaurants.length == 0 && <p>No restaurants here...</p>)}
			{!query.data || (query.data.length == 0 && <p>No restaurants in the city you searched for...</p>)}
		</Container>
	);
};

export default ListAllRestaurantsPage;
