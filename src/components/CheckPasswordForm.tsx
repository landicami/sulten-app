import { Alert } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { SubmitHandler, useForm } from "react-hook-form";

const passwordForSignup = import.meta.env.VITE_PASSWORD_FOR_SIGNUP;

interface CheckPasswordFormProps {
	onCorrectPassword: () => void;
	onIncorrectPassword: () => void;
}

type FormDataPassword = { password: string | undefined };

const CheckPasswordForm: React.FC<CheckPasswordFormProps> = ({ onCorrectPassword, onIncorrectPassword }) => {
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<FormDataPassword>();

	const handlePasswordSubmit: SubmitHandler<FormDataPassword> = async (data) => {
		if (data.password === passwordForSignup) {
			onCorrectPassword();
		} else {
			onIncorrectPassword();
		}
	};

	if (!passwordForSignup) {
		return (
			<Alert variant="danger">
				<h1>Admin Password not set</h1>
				<p>There is currently no admin password wich means no new admins can sign up</p>
				<p>Please contact the administration</p>
			</Alert>
		);
	}

	return (
		<>
			<Form onSubmit={handleSubmit(handlePasswordSubmit)} className="mb-3">
				<Form.Group controlId="password" className="mb-3">
					<Form.Label>Admin Password</Form.Label>
					<Form.Control
						type="password"
						{...register("password", {
							required: "You need to enter the Admin Password!",
						})}
					/>
					{errors.password && <p className="invalid">{errors.password.message || "WRONG!"}</p>}
				</Form.Group>

				<div className="d-grid gap-2 col-6 mx-auto">
					<Button type="submit" variant="success">
						Submit
					</Button>
				</div>
			</Form>
		</>
	);
};

export default CheckPasswordForm;
