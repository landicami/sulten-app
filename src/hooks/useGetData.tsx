import { useState } from "react";
import { GoogleMapsAPIResponse } from "../types/Locations.types";
import { getGeocoding, getReverseGeocoding } from "../service/GoogleMaps_API";

type useGetDataType = "address" | "latlng";

const useGetData = () => {
	const [data, setData] = useState<GoogleMapsAPIResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const getLocationData = async (queryType: useGetDataType, query: string) => {
		setData(null);
		setError(null);
		setIsError(false);
		setIsLoading(true);

		if (queryType === "address") {
			try {
				const res = await getGeocoding(query);
				setData(res);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An unknown error occurred");
			}
		}

		if (queryType === "latlng") {
			try {
				const res = await getReverseGeocoding(query);
				setData(res);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An unknown error occurred");
			}
		}

		setIsLoading(false);
	};

	return {
		data,
		error,
		isError,
		isLoading,
		getLocationData,
	};
};

export default useGetData;
