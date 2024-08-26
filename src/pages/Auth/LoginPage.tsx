import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { SubmitHandler, useForm } from "react-hook-form";
import { FirebaseError } from "firebase/app";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoginCredentials } from "../../types/Admin.types";

const LoginPage = () => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { handleSubmit, register, formState: { errors } } = useForm<LoginCredentials>();
    const { login } = useAuth();
    const navigate = useNavigate();

    const onLogin: SubmitHandler<LoginCredentials> = async (data) => {
        setIsLoggingIn(true);

        try {
            await login(data.email, data.password);

            toast.success("Logged in successfully!");
            navigate("/");

        } catch (err) {
            if (err instanceof FirebaseError) {
                toast.error(err.message);
            } else if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("An error occurred while logging in!");
            }
        }

        setIsLoggingIn(false);
    }

    return (
        <Container className="py-3 cemter-y" fluid>
            <Row>
                <Col md={{ span: 8, offset: 4 }}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title className="mb-4">Login</Card.Title>

                            <Form onSubmit={handleSubmit(onLogin)}>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        {...register("email", {
                                            required: "Email is requried to login!"
                                        })}
                                    />
                                    {errors.email && <Form.Text className="text-danger">{errors.email.message || "Invalid email"}</Form.Text>}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        autoComplete="new-password"
                                        {...register("password", {
                                            required: "Password is requried to login!"
                                        })}
                                    />
                                    {errors.password && <Form.Text className="text-danger">{errors.password.message || "Invalid password"}</Form.Text>}
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={isLoggingIn}
                                > {isLoggingIn
                                    ? "Logging in..."
                                    : "Login"
                                    }
                                </Button>
                            </Form>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default LoginPage;