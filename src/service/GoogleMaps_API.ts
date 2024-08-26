import axios from "axios";
import { GoogleMapsAPIResponse } from "../types/Locations.types";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const instance = axios.create({
	baseURL: "https://maps.googleapis.com/maps/api/geocode/json",
	headers: {
		"Content-Type": "application/json",
	},
});

/**
 * GET
 * Geocoding
 * @param API_KEY
 * @param adress
 */
export const getGeocoding = async (address: string) => {
	const res = await instance.get<GoogleMapsAPIResponse>("", {
		params: {
			address,
			key: API_KEY,
		},
	});
	return res.data;
};

/**
 * GET
 * Reverse Geocoding
 * @param API_KEY
 * @param latlng
 */
export const getReverseGeocoding = async (latlng: string) => {
	const res = await instance.get<GoogleMapsAPIResponse>("", {
		params: {
			latlng,
			key: API_KEY,
		},
	});
	return res.data;
};
