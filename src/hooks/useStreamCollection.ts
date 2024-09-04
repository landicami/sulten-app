import { CollectionReference, QueryConstraint, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";

const useStreamCollection = <T>(collectionRef: CollectionReference<T>, ...qContraints: QueryConstraint[]) => {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<T[] | null>(null);

	useEffect(() => {
		const queryReference = query(collectionRef, ...qContraints);

		const unsubscribe = onSnapshot(queryReference, (snapshot) => {
			const data = snapshot.docs.map((document) => {
				return {
					...document.data(),
					_id: document.id,
				};
			});

			setData(data);
			setLoading(false);
		});

		return unsubscribe;

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [collectionRef]);

	return {
		data,
		loading,
	};
};

export default useStreamCollection;
