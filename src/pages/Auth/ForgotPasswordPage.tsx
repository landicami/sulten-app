import { useState } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { ForgotPasswordInfo } from "../../types/Admin.types";
import useAuth from "../../hooks/useAuth";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import { Alert, Col, Row } from "react-bootstrap";

const ForgotPasswordPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resetPasswordSubmit, setResetPasswordSubmit] = useState(false);
    const { handleSubmit, register, formState: { errors } } = useForm<ForgotPasswordInfo>();
    const { resetPassword } = useAuth();

    const onResetPassword: SubmitHandler<ForgotPasswordInfo> = async (data) => {
        setIsSubmitting(true);

        try {
            await resetPassword(data.email);

            setResetPasswordSubmit(true);
        } catch (err) {
            if (err instanceof FirebaseError) {
                toast.error(err.message);
            } else if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("An error occurred. Please try again later.");
            }
        }

        setIsSubmitting(false);
    }

    return (
        <Container className="py-3" fluid>
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Reset Password</Card.Title>

                            {resetPasswordSubmit &&
                                <Alert variant="success">
                                    Check your email for a link to reset your password.
                                </Alert>
                            }

                            <Card.Text>
                                Write your email down below to get a link to reset your password.
                            </Card.Text>

                            <Form onSubmit={handleSubmit(onResetPassword)} className="mb-4">
                                <Form.Group
                                    controlId="email"
                                    className="mb-3"
                                >
                                    <Form.Label>Email plz</Form.Label>
                                    <Form.Control
                                        type="email"
                                        {...register("email", { required: "Email is required." })}
                                    />
                                    {errors.email && <p>{errors.email.message || "Try again"}</p>}
                                </Form.Group>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    variant="primary"
                                > {isSubmitting
                                    ? "Submitting..."
                                    : "Submit"
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

export default ForgotPasswordPage;