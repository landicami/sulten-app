import { useState, useCallback, useEffect } from "react";
import { query, where, orderBy, getDocs } from "firebase/firestore";
import { restaurantCol } from "../service/firebase"; // Se till att importera din Firestore instans
import { Restaurant } from "../types/Restaurant.types";
import { FirebaseError } from "firebase/app";

const useGetRestaurantsByCity = (initialCity: string | null = null) => {
	const [data, setData] = useState<Restaurant[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [city, setCity] = useState<string | null>(initialCity);

	console.log("city from hook is: ", initialCity);

	const changeCity = (newCity: string) => {
		setCity(newCity);
	};

	const getRestaurants = useCallback(async (city: string) => {
		setData(null);
		setIsError(false);
		setIsLoading(true);

		try {
			const q = query(
				restaurantCol,
				where("approvedByAdmin", "==", true),
				where("city", "==", city),
				orderBy("name")
			);

			const querySnapshot = await getDocs(q);
			const restaurants = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setData(restaurants);
		} catch (err) {
			if (err instanceof FirebaseError) {
				setError(err.message);
			} else if (err instanceof Error) {
				setError(err.message);
				setIsError(true);
			}
		}

		setIsLoading(false);
	}, []);

	const execute = useCallback(() => {
		if (!city) {
			return;
		}

		getRestaurants(city);
	}, [getRestaurants, city]);

	useEffect(() => {
		execute();
	}, [execute]);

	return {
		changeCity,
		data,
		error,
		execute,
		isError,
		isLoading,
	};
};

export default useGetRestaurantsByCity;
