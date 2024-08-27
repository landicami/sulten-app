import { CollectionReference, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const useStreamDocument = <T>(colRef: CollectionReference<T>, documentId: string | undefined) => {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const docRef = doc(colRef, documentId);

		const unsubscribe = onSnapshot(docRef, (snapshot) => {
			if (!snapshot.exists()) {
				setData(null);
				setError(true);
				setLoading(false);
				return;
			}

			const data = {
				...snapshot.data(),
				_id: snapshot.id,
			};

			setData(data);
			setLoading(false);
		});

		return unsubscribe;

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [colRef]);

	return {
		data,
		error,
		loading,
	};
};

export default useStreamDocument;
