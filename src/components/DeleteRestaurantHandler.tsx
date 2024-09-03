import { Row } from "@tanstack/react-table";
import React, { useState } from "react";
import { Restaurant } from "../types/Restaurant.types";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../service/firebase";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface DeleteRestaurantHandlerProps {
	row: Row<Restaurant>;
}

const DeleteRestaurantHandler: React.FC<DeleteRestaurantHandlerProps> = ({ row }) => {
	const [showModal, setShowModal] = useState(false);

	const handleDelete = async () => {
		try {
			const id = row.original._id;
			const docRef = doc(db, "restaurants", id);
			await deleteDoc(docRef);
			toast.success("Item deleted successfully!");
		} catch (error) {
			if (error instanceof FirebaseError) toast.error("Error deleting document");
		}
		setShowModal(false);
	};

	return (
		<>
			<Button className="btn-sm btn btn-danger" onClick={() => setShowModal(true)}>
				Delete
			</Button>
			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Deletion</Modal.Title>
				</Modal.Header>
				<Modal.Body>Are you sure you want to delete this item?</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						Close
					</Button>
					<Button variant="primary" onClick={() => handleDelete()}>
						Delete
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default DeleteRestaurantHandler;
