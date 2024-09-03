import { useCallback, useEffect, useState } from "react";
import useGetRestuarantByCity from "./useGetRestuarantByCity";
import { Restaurant } from "../types/Restaurant.types";

const useRestaurantsInCity = () => {
	const [city, setCity] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);
	const { data } = useGetRestuarantByCity(city);

	const changeCity = useCallback((newCity: string) => {
		setCity(newCity);
	}, []);

	useEffect(() => {
		setIsLoading(true);
		setRestaurants(null);

		if (restaurants !== data) {
			setRestaurants(data);
		}

		setIsLoading(false);
	}, [city]);

	return {
		changeCity,
		isLoading,
		restaurants,
		city,
	};
};

export default useRestaurantsInCity;
