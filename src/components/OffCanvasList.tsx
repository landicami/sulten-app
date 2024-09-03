import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import Offcanvas from "react-bootstrap/Offcanvas";
import { Restaurant } from "../types/Restaurant.types";
interface OffCanvasListProps {
	restaurants: Restaurant[] | null;
}
const OffCanvasList: React.FC<OffCanvasListProps> = ({ restaurants }) => {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<>
			<Button variant="primary" onClick={handleShow}>
				Show list of restaurants
			</Button>

			<Offcanvas show={show} onHide={handleClose}>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>🥘 Restauranger i din närhet 🥘</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					{restaurants &&
						restaurants.map((resturant) => (
							<Card className="mb-3" key={resturant._id}>
								<Card.Body>
									<Card.Title>{resturant.name}</Card.Title>
									<Card.Text>{resturant.description}</Card.Text>
									<Card.Text>{resturant.category}</Card.Text>
									<Card.Text>{resturant.offer}</Card.Text>
									<div className="d-flex">
										{resturant.photoUrls.map((photo) => (
											<div className="justify-content-center me-2">
												<Card.Img src={photo}></Card.Img>
											</div>
										))}
									</div>
								</Card.Body>
								<Card.Footer>
									{resturant.website ? (
										<Button>
											<a href={resturant.website}></a>Besök hemsidan
										</Button>
									) : (
										<p>Det finns ingen hemsida</p>
									)}
								</Card.Footer>
							</Card>
						))}
				</Offcanvas.Body>
			</Offcanvas>
		</>
	);
};

export default OffCanvasList;
