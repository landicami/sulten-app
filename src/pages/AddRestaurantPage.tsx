import { SubmitHandler, useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Restaurant } from "../types/Restaurant.types";

const AddRestaurantPage = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<Restaurant>();

	const onAddRestaurant: SubmitHandler<Restaurant> = async (data) => {
		console.log(data.address);
	};
	return (
		<Container className="p-3">
			<Row className="justify-content-center">
				<Col lg={6} md={8} sm={12}>
					<Card className="p-3">
						<Card.Title>Add your information here</Card.Title>
						<Form onSubmit={handleSubmit(onAddRestaurant)}>
							{/* register your input into the hook by invoking the "register" function */}
							<Form.Group className="mb-3">
								<Form.Label>Name on restaurant</Form.Label>
								<Form.Control type="text" {...register("name")} />
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Adress</Form.Label>

								<Form.Control type="adress" {...register("address", { required: true })} />
								{/* errors will return when field validation fails  */}
								{errors.address && <span>This field is required</span>}
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>City</Form.Label>

								<Form.Control type="text" {...register("city", { required: true })} />
								{/* errors will return when field validation fails  */}
								{errors.city && <span>This field is required</span>}
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
