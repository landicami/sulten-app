export interface LatLng {
	lat: number;
	lng: number;
}

interface AddressComponents {
	long_name: string;
	short_name: string;
	types: string[];
}

export interface GoogleMapsAPIResponse {
	results: [
		{
			address_components: AddressComponents[];
			formatted_address: string;
			geometry: {
				bounds: {
					northeast: LatLng;
					southwest: LatLng;
				};
				location: LatLng;
				location_type: string;
				viewport: {
					northeast: LatLng;
					southwest: LatLng;
				};
			};
			place_id: string;
			types: string[];
		}
	];
	status: string;
}
