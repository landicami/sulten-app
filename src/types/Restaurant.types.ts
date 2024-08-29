import { LongLat } from "./Locations.types";

export interface Restaurant {
	_id: string;
	approvedByAdmin: boolean;
	name: string;
	address: string;
	city: string;
	description: string | null;
	category: string;
	offer: string[];
	email: string | null;
	phone: number | null;
	website: string | null;
	facebook: string | null;
	instagram: string | null;
	photoUrls: string[]; // seperat typ för att lagra url
	longLat: LongLat;
}

export interface AddRestaurantForm {
	_id: string;
	approvedByAdmin: boolean;
	name: string;
	address: string;
	city: string;
	description: string | null;
	category: string;
	offer: string[];
	email: string | null;
	phone: number | null;
	website: string | null;
	facebook: string | null;
	instagram: string | null;
	photoFiles: FileList;
	longLat: LongLat;
}

export type NewRestaurant = Omit<Restaurant, "_id">;
