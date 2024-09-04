import React, { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignupInfo } from "../types/Admin.types";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import CardText from "react-bootstrap/CardText";
import Button from "react-bootstrap/Button";
import { PulseLoader } from "react-spinners";
import { Link } from "react-router-dom";

interface SignupFormProps {
	onSignup: SubmitHandler<SignupInfo>;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup }) => {
	const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
	const {
		handleSubmit,
		register,
		watch,
		formState: { errors },
	} = useForm<SignupInfo>();

	const passwordRef = useRef("");
	passwordRef.current = watch("password");

	const onSubmitSignup: SubmitHandler<SignupInfo> = async (data) => {
		setIsCreatingAdmin(true);
		await onSignup(data);
		setIsCreatingAdmin(false);
	};

	if (isCreatingAdmin) {
		return (
			<Card>
				<CardText>
					<p>Creating admin</p>
					<PulseLoader color="#FBBC04" />
				</CardText>
			</Card>
		);
	}

	return (
		<>
			<Form onSubmit={handleSubmit(onSubmitSignup)}>
				<Form.Group controlId="email" className="mb-5">
					<Form.Label>EMAIL</Form.Label>
					<Form.Control
						placeholder="krögarn@köket.nu"
						type="email"
						{...register("email", {
							required: "📧 You need to enter an email 📧",
						})}
					/>
					{errors.email && <p className="text-danger">{errors.email.message || "Not an email"}</p>}
				</Form.Group>

				<hr />

				<Form.Group controlId="password" className="mb-5">
					<Form.Label>PASSWORD</Form.Label>
					<Form.Control
						type="password"
						{...register("password", {
							required: "Password is required",
							minLength: {
								message: "Password needs to be atleast 6 characters",
								value: 6,
							},
						})}
					/>
					{errors.password && (
						<p className="text-danger">{errors.password.message || "Not a valid password"}</p>
					)}
					<Form.Text>Password needs to be atleast 6 characters</Form.Text>
				</Form.Group>

				<hr />

				<Form.Group controlId="confirmPassword" className="mb-5">
					<Form.Label>CONFIRM PASSWORD</Form.Label>
					<Form.Control
						type="password"
						{...register("confirmPassword", {
							required: "Confirm the password",
							minLength: {
								message: "Confirm the password",
								value: 6,
							},
							validate: (value) => {
								return value === passwordRef.current || "🛑 Password don't match! 🛑";
							},
						})}
					/>
					{errors.confirmPassword && (
						<p className="text-danger">{errors.confirmPassword.message || "Not a valid password"}</p>
					)}
				</Form.Group>

				<Button disabled={isCreatingAdmin} type="submit" variant="success">
					"Sign up"
				</Button>
			</Form>

			<Card className="text-center mb-3 mt-3">
				<CardText className="pb-3 pt-3">
					Forgot your password? Get a new here ➡️
					<Link to="/forgot-password" className="stretched-link">
						Forgot password
					</Link>
				</CardText>
			</Card>
		</>
	);
};

export default SignupForm;
