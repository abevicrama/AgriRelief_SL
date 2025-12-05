import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    setDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    deleteDoc
} from 'firebase/firestore';

// Collection References
const REPORTS_COLLECTION = 'damage_reports';
const USERS_COLLECTION = 'users';
const CONTACTS_COLLECTION = 'department_contacts';

// --- Reports ---

export const createReport = async (reportData) => {
    try {
        const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
            ...reportData,
            created_at: serverTimestamp(),
            status: 'Pending',
            is_verified: false
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding report: ", error);
        throw error;
    }
};

export const getReports = async () => {
    try {
        const q = query(collection(db, REPORTS_COLLECTION), orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ report_id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting reports: ", error);
        throw error;
    }
};

export const getReportById = async (id) => {
    try {
        const docRef = doc(db, REPORTS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { report_id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting report: ", error);
        throw error;
    }
};

export const updateReportStatus = async (id, status, isVerified = false) => {
    try {
        const docRef = doc(db, REPORTS_COLLECTION, id);
        await updateDoc(docRef, {
            status: status,
            is_verified: isVerified
        });
    } catch (error) {
        console.error("Error updating report status: ", error);
        throw error;
    }
}


export const getReportsByFarmerId = async (farmerId) => {
    try {
        const q = query(collection(db, REPORTS_COLLECTION), where("farmer_id", "==", farmerId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ report_id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting farmer reports: ", error);
        throw error;
    }
};

export const deleteReport = async (reportId) => {
    try {
        await deleteDoc(doc(db, REPORTS_COLLECTION, reportId));
    } catch (error) {
        console.error("Error deleting report: ", error);
        throw error;
    }
};

// --- Users ---

export const createUserProfile = async (uid, userData) => {
    try {
        await setDoc(doc(db, USERS_COLLECTION, uid), userData);
    } catch (error) {
        console.error("Error creating user profile: ", error);
        throw error;
    }
};

export const getUserProfile = async (uid) => {
    try {
        const docRef = doc(db, USERS_COLLECTION, uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting user profile: ", error);
        throw error;
    }
};

// --- Department Contacts ---

export const getDepartmentContact = async (divisionId) => {
    try {
        const q = query(collection(db, CONTACTS_COLLECTION), where("division_id", "==", divisionId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data();
        }
        return null;
    } catch (error) {
        console.error("Error getting department contact: ", error);
        throw error;
    }
}
