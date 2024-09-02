import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const SearchMapForm = () => {
	const [citySearch, setCitySearch] = useState("");
	const handleCitySearch = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Searched for", citySearch);
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
							<Button type="submit" className="btn btn-sm">
								Search
							</Button>
						</InputGroup>
					</Form>
				</Col>
			</Row>
		</>
	);
};

export default SearchMapForm;
