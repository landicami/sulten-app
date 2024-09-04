import { useState } from "react";
import Card from "react-bootstrap/Card";
import Hamburger from "../assets/images/hamburger.png";
import insta from "../assets/images/insta.svg";
import facebook from "../assets/images/facebook.svg";
import link from "../assets/images/link.svg";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Restaurant } from "../types/Restaurant.types";
import { Image } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

interface OffCanvasListProps {
	restaurants: Restaurant[] | null;
}
const OffCanvasList: React.FC<OffCanvasListProps> = ({ restaurants }) => {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<>
			<div className="hamburger-button">
				<Image
					src={Hamburger}
					title="Show list of restaurants"
					role="button"
					onClick={handleShow}
					style={{ height: "2rem" }}
				/>
			</div>

			<Offcanvas show={show} onHide={handleClose}>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>🥘 Restauranger i din närhet 🥘</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					{restaurants &&
						restaurants.map((restaurant) => (
							<Card key={restaurant._id} className="mb-3 card-canva">
								{restaurant.photoUrls.length === 0 ? (
									<Card.Img
										variant="top"
										src="https://placehold.co/600x400?text=No+Image+Yet+:("
									/>
								) : (
									<Card.Img variant="top" src={restaurant.photoUrls[0]} />
								)}
								<Card.Body>
									<Card.Title>{restaurant.name}</Card.Title>
									{restaurant.description && (
										<Card.Text>{restaurant.description}</Card.Text>
									)}
									<Card.Text>
										<strong>Category:</strong> {restaurant.category}
									</Card.Text>
									<Card.Text>
										<strong>Offer:</strong> {restaurant.offer}
									</Card.Text>
									{restaurant.phone && (
										<Card.Text>
											<strong>Phone:</strong> {restaurant.phone}
										</Card.Text>
									)}
									<div className="icon-wrapper mb-3">
										{restaurant.website && (
											<Card.Text>
												<a
													href={restaurant.website}
													target="_blank"
													rel="noopener noreferrer"
												>
													<Image className="icon" src={link} alt="Website icon" />
												</a>
											</Card.Text>
										)}
										{restaurant.facebook && (
											<Card.Text className="icon-wrapper">
												<a
													href={restaurant.facebook}
													target="_blank"
													rel="noopener noreferrer"
												>
													<Image className="icon" src={facebook} alt="Facebook icon" />
												</a>
											</Card.Text>
										)}
										{restaurant.instagram && (
											<Card.Text className="icon-wrapper">
												<a
													href={restaurant.instagram}
													target="_blank"
													rel="noopener noreferrer"
												>
													<Image className="icon" src={insta} alt="Instagram icon" />
												</a>
											</Card.Text>
										)}
									</div>
									<div>
										{restaurant.photoUrls.length > 1 && (
											<>
												<Row className="row">
													{restaurant.photoUrls.slice(1).map((photo, index) => (
														<Col xs={8} md={6} lg={4} key={`${photo}-${index}`}>
															<Card.Img
																alt="Resturant photos"
																className="other-photos mb-3"
																src={photo}
															/>
														</Col>
													))}
												</Row>
											</>
										)}
									</div>
								</Card.Body>
							</Card>
						))}
				</Offcanvas.Body>
			</Offcanvas>
		</>
	);
};

export default OffCanvasList;
