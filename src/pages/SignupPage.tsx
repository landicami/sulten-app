import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardBody, CardText, Col, Container, Row } from "react-bootstrap";
import CheckPasswordForm from "../components/CheckPasswordForm";
import { toast } from "react-toastify";
import SignupForm from "../components/SignupForm";
import { SubmitHandler } from "react-hook-form";
import { SignupInfo } from "../types/Admin.types";
import { FirebaseError } from "firebase/app";

const SignupPage = () => {
	const [okForSignup, setOkForSignup] = useState(false);
	const { signup } = useAuth();
	const navigate = useNavigate();

	const handleSignup: SubmitHandler<SignupInfo> = async (data) => {
		try {
			await signup(data.email, data.password);
			toast.success("Account created! 🥳");
			navigate("/admin-restaurants");
		} catch (err) {
			if (err instanceof FirebaseError) {
				toast.error(err.message);
			} else if (err instanceof Error) {
				toast.error(err.message);
			} else {
				toast.error("Something went wrong. Have you tried turning it off and on again?");
			}
		}
	};

	return (
		<Container className="py-3">
			<Row>
				<Col md={{ span: 6, offset: 3 }}>
					<Card className="mb-5">
						<CardBody>
							<Card.Title className="mb-3">Sign Up</Card.Title>

							{okForSignup ? (
								<SignupForm onSignup={handleSignup} />
							) : (
								<CheckPasswordForm
									onCorrectPassword={() => setOkForSignup(true)}
									onIncorrectPassword={() => toast.warning("🛑 Wrong password! 🛑")}
								/>
							)}
						</CardBody>
					</Card>

					<Card>
						<CardBody>
							<CardText className="text-center">
								Do you already have an account? ➡️{" "}
								<Link to="/login" className="stretched-link">
									Log In
								</Link>
							</CardText>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default SignupPage;
