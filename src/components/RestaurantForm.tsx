import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import { AddRestaurantForm, Restaurant } from "../types/Restaurant.types";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface RestaurantFormProps {
	initialValues?: Restaurant;
	onSave: (data: AddRestaurantForm) => Promise<void>;
}

const RestaurantForm: React.FC<RestaurantFormProps> = ({ initialValues, onSave }) => {
	const { currentAdmin } = useAuth();
	const [isAdding, setIsAdding] = useState(false);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isSubmitSuccessful },
	} = useForm<AddRestaurantForm>({
		defaultValues: {
			...initialValues,
		},
	});

	const onAddRestaurant: SubmitHandler<AddRestaurantForm> = (data) => {
		try {
			setIsAdding(true);
			onSave(data);
			navigate(-1);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Error adding restaurant");
			}
		} finally {
			setIsAdding(false);
		}
	};

	useEffect(() => {
		reset(initialValues);
	}, [initialValues, isSubmitSuccessful, reset]);

	return (
		<Container className="p-3">
			<Row className="justify-content-center">
				<Col lg={6} md={8} sm={12}>
					<Card className="p-3">
						<Card.Title>Add information here about the restaurant</Card.Title>
						<Card.Text>Options with * is required</Card.Text>
						<Form onSubmit={handleSubmit(onAddRestaurant)}>
							<Form.Group className="mb-3">
								<Form.Label>Name*</Form.Label>
								<Form.Control
									aria-label="Add the name of the restaurant"
									type="text"
									{...register("name", {
										required: true,
										minLength: 1,
									})}
								/>
								{errors.name && (
									<span className="form-required">This field requires at least 1 char</span>
								)}
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Adress*</Form.Label>

								<Form.Control
									aria-label="Add the adress of the restaurant"
									type="text"
									{...register("address", { required: true })}
								/>
								{errors.address && <span className="form-required">This field is required</span>}
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>City*</Form.Label>

								<Form.Control
									aria-label="Add the city of the restaurant"
									type="text"
									{...register("city", { required: true })}
								/>
								{errors.city && <span className="form-required">This field is required</span>}
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Description</Form.Label>

								<Form.Control
									aria-label="Add the description of the restaurant"
									as="textarea"
									type="text"
									{...register("description")}
								/>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Category*</Form.Label>

								<Form.Select
									aria-label="Add the category of the restaurant"
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
								<Form.Label>Offer*</Form.Label>

								<Form.Check
									type="checkbox"
									value="lunch"
									label="Lunch"
									aria-label="Pick lunch as an offer"
									{...register("offer", { required: true })}
								/>
								<Form.Check
									type="checkbox"
									value="after-work"
									label="After Work"
									aria-label="Pick after-work as an offer"
									{...register("offer", { required: true })}
								/>
								<Form.Check
									type="checkbox"
									value="dinner/a-la-carte"
									label="Dinner/Á-la-carte"
									aria-label="Pick dinner as an offer"
									{...register("offer", { required: true })}
								/>
								{errors.offer && <span className="form-required">Please choose an offer</span>}
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Upload photos</Form.Label>

								<Form.Control
									aria-label="Add photos of the restaurant"
									type="file"
									{...register("photoFiles")}
									accept=".jpeg, .jpg, .png, .gif"
									multiple
								/>
							</Form.Group>
							<p>Photos added on this restaurant:</p>

							{initialValues?.photoUrls.map((photo) => (
								<Image src={photo} alt="Thumbnail" fluid className="img-thumbnail mb-3 me-2" />
							))}

							<Form.Group className="mb-3">
								<Form.Label>Email</Form.Label>

								<Form.Control
									aria-label="Add the email of the restaurant"
									type="email"
									{...register("email")}
								/>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Phone</Form.Label>

								<Form.Control
									aria-label="Add the phonenumber of the restaurant"
									type="tel"
									{...register("phone", {
										pattern: {
											value: /^\+?[0-9]{8,}$/,
											message: "You need to add at least 8 numbers",
										},
									})}
								/>
								{errors.phone && <span className="form-required">{errors.phone.message}</span>}
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Website</Form.Label>

								<Form.Control
									aria-label="Add the website of the restaurant"
									type="url"
									{...register("website")}
								/>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Facebook</Form.Label>

								<Form.Control
									aria-label="Add the facebook of the restaurant"
									type="url"
									{...register("facebook")}
								/>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Instagram</Form.Label>

								<Form.Control
									aria-label="Add the Instagram of the restaurant"
									type="url"
									{...register("instagram")}
								/>
							</Form.Group>

							<Button disabled={isAdding} className="mb-5" type="submit">
								{isAdding ? "Submitting restaurant..." : "Submit restaurant"}
							</Button>

							{currentAdmin && (
								<Form.Group className="mb-3">
									<Form.Check
										type="checkbox"
										label="Approved by admin"
										aria-label="Choose this if admin approves"
										{...register("approvedByAdmin")}
										onChange={(e) => setValue("approvedByAdmin", e.target.checked)}
									/>
								</Form.Group>
							)}
						</Form>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default RestaurantForm;
