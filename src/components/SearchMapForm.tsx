import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
// import { useSearchParams } from "react-router-dom";

interface SearchMapFormProps {
	onCitySearch: (city: string) => void;
	onReset: () => void;
	list: boolean;
}

const SearchMapForm: React.FC<SearchMapFormProps> = ({ onCitySearch, list, onReset }) => {
	const [citySearch, setCitySearch] = useState("");

	const handleCitySearch = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Searched for", citySearch);
		onCitySearch(citySearch);
		setCitySearch("");
	};
	return (
		<>
			<Row>
				<Col lg={6} md={8} sm={12}>
					<Form className="mb-2" onSubmit={handleCitySearch}>
						<InputGroup>
							<Form.Control
								id="citySearch"
								placeholder="Search for a city"
								aria-label="Search for city to find restaurants"
								type="text"
								value={citySearch}
								onChange={(e) => setCitySearch(e.target.value)}
							/>
							<Button type="submit" className="btn btn-sm" onClick={handleCitySearch}>
								Search
							</Button>
							{list && (
								<Button type="submit" variant="success" className="btn btn-sm" onClick={onReset}>
									Reset
								</Button>
							)}
						</InputGroup>
					</Form>
				</Col>
			</Row>
		</>
	);
};

export default SearchMapForm;
