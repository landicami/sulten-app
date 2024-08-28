import React, { useRef, useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

interface PlaceAutocompleteClassicProps {
	onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export const PlaceAutocompleteClassic: React.FC<PlaceAutocompleteClassicProps> = ({ onPlaceSelect }) => {
	const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const places = useMapsLibrary("places");

	useEffect(() => {
		if (!places || !inputRef.current) return;

		const options = {
			fields: ["geometry", "name", "formatted_address"],
		};

		setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
	}, [places]);

	useEffect(() => {
		if (!placeAutocomplete) return;

		placeAutocomplete.addListener("place_changed", () => {
			onPlaceSelect(placeAutocomplete.getPlace());
		});
	}, [onPlaceSelect, placeAutocomplete]);

	return (
		<div className="autocomplete-container">
			<InputGroup>
				<Form.Control type="text" ref={inputRef} />
			</InputGroup>
		</div>
	);
};
