import React, { useState } from 'react';
import { db } from './services/firebase'; // Import the existing db instance
import { collection, addDoc, doc, setDoc, Timestamp } from 'firebase/firestore';

const DatabaseSeeder = () => {
    const [status, setStatus] = useState("Ready to build...");

    // 1. Builds the 'users' collection
    const seedUsers = async () => {
        setStatus("Creating Users...");
        try {
            // Create a "Farmer"
            await setDoc(doc(db, "users", "test-farmer-id-1"), {
                uid: "test-farmer-id-1",
                name: "Kamal Gunaratne",
                role: "farmer",
                nic: "198512345678",
                phone: "+94771234567",
                home_district: "Polonnaruwa",
                created_at: Timestamp.now()
            });

            // Create an "Official"
            await setDoc(doc(db, "users", "test-official-id-1"), {
                uid: "test-official-id-1",
                name: "Officer Perera",
                role: "official",
                division_assigned: "Medirigiriya",
                email: "officer@agri.gov.lk",
                created_at: Timestamp.now()
            });
            setStatus("Success: 'users' collection created with 2 test users.");
        } catch (error) {
            console.error(error);
            setStatus("Error creating users: " + error.message);
        }
    };

    // 2. Builds the 'damage_reports' collection (The Core Data)
    const seedReports = async () => {
        setStatus("Creating Damage Reports...");
        try {
            const reportData = {
                farmer_id: "test-farmer-id-1",
                farmer_name: "Kamal Gunaratne",
                contact_number: "+94771234567",

                // Location Data (Flat Structure)
                province: "North Central",
                district: "Polonnaruwa",
                ds_division: "Medirigiriya",
                gn_division: "Track 7",
                coordinates: { lat: 8.15, lng: 80.95 },

                // Damage Details (Flat Structure)
                damage_type: "Flood",
                cultivation_nature: "Paddy",
                land_size_acres: 2.5,
                severity: "Total Destruction",

                // Needs (Flat Structure)
                urgent: true,
                needs_list: ["Seeds", "Fertilizer", "Machine Harvest"],

                status: "Pending",
                is_verified: false,
                images: [],
                created_at: Timestamp.now()
            };

            await addDoc(collection(db, "damage_reports"), reportData);

            setStatus("Success: 'damage_reports' collection created with 1 sample report.");
        } catch (error) {
            console.error(error);
            setStatus("Error creating report: " + error.message);
        }
    };

    // 3. Builds the 'department_contacts' collection
    const seedContacts = async () => {
        setStatus("Creating Department Contacts...");
        try {
            await setDoc(doc(db, "department_contacts", "polonnaruwa_medirigiriya"), {
                division_id: "polonnaruwa_medirigiriya",
                division_name: "Medirigiriya",
                district: "Polonnaruwa",
                office_address: "No 5, Agri Road, Medirigiriya",
                contact_officer: "Mr. K. Bandara",
                phone_hotline: "027-2244555",
                email: "info_medirigiriya@agri.gov.lk"
            });
            setStatus("Success: 'department_contacts' created.");
        } catch (error) {
            setStatus("Error: " + error.message);
        }
    };

    return (
        <div className="p-6 bg-gray-100 border border-gray-300 rounded-lg my-8 font-sans max-w-2xl mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4 text-gray-800">🛠️ Database Builder Tool</h2>
            <p className="mb-4 text-sm text-gray-600">
                Click these buttons to initialize your Firestore database structure.
            </p>

            <div className="flex flex-col gap-3">
                <button
                    onClick={seedUsers}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    1. Build "Users" Collection
                </button>

                <button
                    onClick={seedContacts}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                    2. Build "Department Contacts" Collection
                </button>

                <button
                    onClick={seedReports}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                    3. Create Sample "Damage Report"
                </button>
            </div>

            <div className="mt-4 p-3 bg-white border border-gray-200 rounded text-sm font-mono text-gray-800 shadow-sm">
                <span className="font-bold text-gray-500">Status:</span> {status}
            </div>
        </div>
    );
};

export default DatabaseSeeder;