import { SubmitHandler, useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import { Restaurant } from "../types/Restaurant.types";

const AddRestaurantPage = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<Restaurant>();

	const onAddRestaurant: SubmitHandler<Restaurant> = async (data) => {
		console.log(data);
	};
	return (
		<Container className="p-3">
			<Row className="justify-content-center">
				<Col lg={6} md={8} sm={12}>
					<Card className="p-3">
						<Card.Title>Add information here</Card.Title>
						<Form onSubmit={handleSubmit(onAddRestaurant)}>
							<Form.Group className="mb-3">
								<Form.Label>Name</Form.Label>
								<Form.Control type="text" {...register("name", { required: true })} />
								{errors.name && <span className="form-required">This field is required</span>}
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Adress</Form.Label>

								<Form.Control type="adress" {...register("address", { required: true })} />
								{errors.address && <span className="form-required">This field is required</span>}
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>City</Form.Label>

								<Form.Control type="text" {...register("city", { required: true })} />
								{errors.city && <span className="form-required">This field is required</span>}
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Category</Form.Label>

								<Form.Select
									defaultValue=""
									aria-placeholder="Select.."
									{...register("category", { required: true })}
								>
									<option value="" disabled hidden>
										Select ...
									</option>
									<option value="Fastfood">Fastfood</option>
									<option value="Café">Café</option>
									<option value="Restaurant">Restaurant</option>
									<option value="Grill">Grill/Kiosko</option>
									<option value="Foodtruck">Foodtruck</option>
								</Form.Select>

								{errors.category && <span className="form-required">This field is required</span>}
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Offer</Form.Label>

								<Form.Check
									type="checkbox"
									value="lunch"
									label="Lunch"
									aria-label="offer"
									{...register("offer", { required: true })}
								/>
								<Form.Check
									type="checkbox"
									value="after-work"
									label="After Work"
									aria-label="Offer"
									{...register("offer", { required: true })}
								/>
								<Form.Check
									type="checkbox"
									value="middag/a-la-carte"
									label="Middag/A-la-carte"
									aria-label="Offer"
									{...register("offer", { required: true })}
								/>
								{errors.offer && <span className="form-required">Please choose an offer</span>}
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Description:</Form.Label>

								<Form.Control as="textarea" type="text" {...register("description")} />
							</Form.Group>

							<Button className="mt-2" type="submit">
								Add restaurant
							</Button>
						</Form>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default AddRestaurantPage;
