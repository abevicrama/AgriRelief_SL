import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { createUserProfile } from '../../services/db';
import { useNavigate, Link } from 'react-router-dom';

const DISTRICTS = ["Polonnaruwa", "Anuradhapura", "Ampara", "Batticaloa", "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee", "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", "Monaragala", "Ratnapura", "Kegalle"];

export default function Signup() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'farmer',
        name: '',
        nic: '',
        phone: '',
        home_district: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // Create user profile in Firestore
            await createUserProfile(user.uid, {
                uid: user.uid,
                email: user.email,
                role: formData.role,
                name: formData.name,
                nic: formData.nic,
                phone: formData.phone,
                home_district: formData.home_district
            });

            navigate('/');
        } catch (err) {
            setError('Failed to create an account. ' + err.message);
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-agri-green-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md border border-agri-green-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-agri-green-900">
                        Join AgriRelief SL
                    </h2>
                </div>
                {error && <div className="bg-alert-red-500 text-white p-3 rounded text-sm">{error}</div>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                        <div className="flex space-x-4">
                            <label className={`flex-1 p-3 border rounded cursor-pointer text-center transition-colors ${formData.role === 'farmer' ? 'bg-agri-green-100 border-agri-green-500 text-agri-green-900' : 'border-gray-300 hover:bg-gray-50'}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="farmer"
                                    checked={formData.role === 'farmer'}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                Farmer
                            </label>
                            <label className={`flex-1 p-3 border rounded cursor-pointer text-center transition-colors ${formData.role === 'public' ? 'bg-blue-100 border-blue-500 text-blue-900' : 'border-gray-300 hover:bg-gray-50'}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="public"
                                    checked={formData.role === 'public'}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                Donor/Public
                            </label>
                        </div>
                    </div>

                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="name" className="sr-only">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-agri-green-500 focus:border-agri-green-500 focus:z-10 sm:text-sm"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="nic" className="sr-only">NIC Number</label>
                            <input
                                id="nic"
                                name="nic"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-agri-green-500 focus:border-agri-green-500 focus:z-10 sm:text-sm"
                                placeholder="NIC Number"
                                value={formData.nic}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phone" className="sr-only">Phone Number</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-agri-green-500 focus:border-agri-green-500 focus:z-10 sm:text-sm"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="home_district" className="sr-only">Home District</label>
                            <select
                                id="home_district"
                                name="home_district"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-agri-green-500 focus:border-agri-green-500 focus:z-10 sm:text-sm"
                                value={formData.home_district}
                                onChange={handleChange}
                            >
                                <option value="">Select Home District</option>
                                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-agri-green-500 focus:border-agri-green-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-agri-green-500 focus:border-agri-green-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-agri-green-600 hover:bg-agri-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-green-500"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <div className="text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="font-medium text-agri-green-600 hover:text-agri-green-500">Log in</Link>
                </div>
            </div>
        </div>
    );
}
