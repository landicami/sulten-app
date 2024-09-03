import { useRef, useState } from "react";
import Container from "react-bootstrap/Container"
import useAuth from "../../hooks/useAuth";
import { SubmitHandler, useForm } from "react-hook-form";
import { UpdateAdminFormData } from "../../types/Admin.types";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../service/firebase";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const UpdateProfilePage = () => {
    const [submitting, setSubmitting] = useState(false);
    const {
        currentAdmin,
        updateInfo,
        setName,
        setEmail,
        setPassword,
        setPhoto,
        userEmail,
        userName,
        userPhoto,
    } = useAuth();
    const { handleSubmit, register, watch, formState: { errors } } = useForm<UpdateAdminFormData>({
        defaultValues: {
            email: userEmail ?? "",
            name: userName ?? "",
        }
    });

    const passRef = useRef("");
    passRef.current = watch("password");

    const onEditAdmin: SubmitHandler<UpdateAdminFormData> = async (data) => {

        try {
            setSubmitting(true);
            console.log(currentAdmin);

            if (data.photoFiles.length) {
                const photo = data.photoFiles[0];
                const fileRef = ref(storage, `admins/${currentAdmin?.uid}/${photo.name}`);

                try {
                    const uploadPhoto = await uploadBytes(fileRef, photo);
                    const photoUrl = await getDownloadURL(uploadPhoto.ref);
                    await setPhoto(photoUrl);

                } catch (err) {
                    if (err instanceof Error) {
                        toast.error(err.message);
                    } else {
                        toast.error("Error uploading photo to admin!");
                    }
                }
            }

            if (data.email !== userEmail) {
                await setEmail(data.email);
            }

            if (data.name !== userName) {
                await setName(data.name);
            }

            if (data.password) {
                await setPassword(data.password);
            }

            updateInfo();
            toast.success("Admin updated successfully");
            //maybe navigate

        } catch (error) {
            if (error instanceof FirebaseError) {
                toast.error(error.message);
            }
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Error updating admin");
            }

        }

        setSubmitting(false);
    }

    return (
        <Container>
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <Card className="mb-2">
                        <Card.Body>
                            <Card.Title className="mb-2">Edit Profile</Card.Title>

                            <div>
                                <div className="d-flex justify-content-center mb-2">
                                    <Image
                                        src={userPhoto || "https://placehold.co/600x400?text=No+Image+Yet+:("}
                                        fluid
                                        roundedCircle
                                        className="img-square w-75"
                                    />
                                </div>
                            </div>

                            <Form onSubmit={handleSubmit(onEditAdmin)} className="mb-3">
                                <Form.Group controlId="name" className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        placeholder="Admin Adminsson"
                                        type="text"
                                        {...register("name", {
                                            minLength: {
                                                value: 2,
                                                message: "Your name must be at least 2 characters long",
                                            }
                                        })}
                                    />
                                    {errors.name && <p>{errors.name.message || "Invalid value"}</p>}
                                </Form.Group>

                                <Form.Group controlId="photoFiles" className="mb-3">
                                    <Form.Label>Photo</Form.Label>
                                    <Form.Control
                                        accept="image/gif,image/jpeg,image/png,image/webp"
                                        type="file"
                                        {...register("photoFiles")}
                                    />
                                    {errors.photoFiles && <p>{errors.photoFiles.message || "Invalid value"}</p>}
                                </Form.Group>

                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        placeholder="admin.adminsson@hottestmejl.se"
                                        type="email"
                                        {...register("email", {
                                            required: "You must specify an email",
                                        })}
                                    />
                                    {errors.email && <p>{errors.email.message || "Invalid value"}</p>}
                                </Form.Group>

                                <Form.Group controlId="password" className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        autoComplete="new-password"
                                        {...register("password", {
                                            minLength: {
                                                message: "Enter at least 6 characters",
                                                value: 6,
                                            }
                                        })}
                                    />
                                    {errors.password && <p>{errors.password.message || "Invalid value"}</p>}
                                    <Form.Text>Min 6 characters</Form.Text>
                                </Form.Group>

                                <Form.Group controlId="confirmPassword" className="mb-3">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        autoComplete="off"
                                        {...register("confirmPassword", {
                                            minLength: {
                                                message: "Enter at least 6 characters",
                                                value: 6,
                                            },
                                            validate: (value) => {
                                                return !passRef.current || value === passRef.current || "Passwords do not match";
                                            }
                                        })}
                                    />
                                    {errors.confirmPassword && <p>{errors.confirmPassword.message || "Invalid value"}</p>}
                                </Form.Group>

                                <Button
                                    disabled={submitting}
                                    type="submit"
                                    variant="primary"
                                >
                                    {submitting
                                        ? "Editing your info..."
                                        : "Submit"}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container >
    )
}

export default UpdateProfilePage;