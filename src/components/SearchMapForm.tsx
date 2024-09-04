import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

interface SearchMapFormProps {
	onCitySearch: (city: string) => void;
	onReset: () => void;
}

const SearchMapForm: React.FC<SearchMapFormProps> = ({ onCitySearch, onReset }) => {
	const [citySearch, setCitySearch] = useState("");

	const handleCitySearch = (e: React.FormEvent) => {
		e.preventDefault();
		onCitySearch(citySearch);
		setCitySearch("");
	};
	return (
		<>
			<Col>
				<Form className="search-input mb-2" onSubmit={handleCitySearch}>
					<InputGroup>
						<Form.Control
							id="citySearch"
							placeholder="Search for a city"
							aria-label="Search for city to find restaurants"
							type="text"
							value={citySearch}
							onChange={(e) => setCitySearch(e.target.value)}
						/>
						<Button type="submit" onClick={handleCitySearch}>
							Search
						</Button>
						<Button variant="warning" onClick={onReset}>
							Reset
						</Button>
					</InputGroup>
				</Form>
			</Col>
		</>
	);
};

export default SearchMapForm;
