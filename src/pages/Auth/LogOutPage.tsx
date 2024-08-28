import React, { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const LogOutPage = () => {
	const { logout } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const logOutAdmin = async () => {
			await logout();
			// navigate("/");
		};
		logOutAdmin();
	}, [logout, navigate]);
	return (
		<Container className="py-3 center-y">
			<Row className="justify-content-center">
				<Col lg={6} md={8} sm={12}>
					<Card className="mb-3">
						<Card.Body>
							<Card.Text>You are now logged out... </Card.Text>
							<a href="/login">Log in again here</a>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default LogOutPage;
