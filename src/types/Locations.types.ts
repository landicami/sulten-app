export interface LongLat {
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
					northeast: LongLat;
					southwest: LongLat;
				};
				location: LongLat;
				location_type: string;
				viewport: {
					northeast: LongLat;
					southwest: LongLat;
				};
			};
			place_id: string;
			types: string[];
		}
	];
	status: string;
}
