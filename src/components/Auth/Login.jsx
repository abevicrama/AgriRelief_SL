import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/'); // Redirect to home/dashboard
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-agri-green-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-agri-green-100">
                <h2 className="text-2xl font-bold text-center text-agri-green-900 mb-6">AgriRelief SL Login</h2>
                {error && <div className="bg-alert-red-500 text-white p-3 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-earth-brown-900 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-agri-green-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-earth-brown-900 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-agri-green-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-agri-green-500 text-white font-bold py-2 px-4 rounded hover:bg-agri-green-700 transition duration-300"
                    >
                        Log In
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-earth-brown-500">
                    Don't have an account? <Link to="/signup" className="text-agri-green-700 hover:underline">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}
