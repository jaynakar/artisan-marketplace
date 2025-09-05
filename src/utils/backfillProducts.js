import { auth, db } from '../firebase';
import { collection, getDocs, updateDoc } from 'firebase/firestore';

export async function backfillProductsForCurrentStore() {
	const user = auth.currentUser;
	if (!user) throw new Error('Not signed in');
	const storeId = user.uid;

	const productsCol = collection(db, 'stores', storeId, 'products');
	const snap = await getDocs(productsCol);

	const updates = snap.docs.map(async (d) => {
		const data = d.data();
		const update = {};
		if (!data.storeId) update.storeId = storeId;
		if (!data.ownerId) update.ownerId = storeId;
		if (!data.role) update.role = 'seller';
		if (Object.keys(update).length > 0) {
			await updateDoc(d.ref, update);
		}
	});

	await Promise.all(updates);
}
