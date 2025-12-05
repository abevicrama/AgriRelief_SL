import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import DamageReportForm from './components/Forms/DamageReportForm';
import AidMap from './components/Map/AidMap';
import Dashboard from './components/Admin/Dashboard';
import DatabaseSeeder from './DatabaseSeeder';
import Navbar from './components/Layout/Navbar';
import MyReports from './components/User/MyReports';
import Contact from './components/Pages/Contact';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" />; // Redirect unauthorized users to home
    }

    return (
        <>
            <Navbar />
            <div className="pt-4">
                {children}
            </div>
        </>
    );
};

// Placeholder Home Component
const Home = () => {
    const { currentUser, userRole } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
                <h1 className="text-3xl font-bold text-agri-green-700 mb-4">Welcome to AgriRelief SL</h1>
                <p className="mb-4">Logged in as: <span className="font-semibold">{currentUser?.email}</span></p>
                <p className="mb-4">Role: <span className="font-semibold capitalize">{userRole}</span></p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {userRole === 'farmer' && (
                        <div className="bg-green-50 p-6 rounded border border-green-200">
                            <h2 className="text-xl font-bold text-green-800 mb-2">Report Damage</h2>
                            <p className="text-gray-600 mb-4">Submit a new damage report for your farmland.</p>
                            <Link to="/report" className="inline-block bg-agri-green-500 text-white px-4 py-2 rounded hover:bg-agri-green-600">
                                Start Report
                            </Link>
                        </div>
                    )}

                    <div className="bg-blue-50 p-6 rounded border border-blue-200">
                        <h2 className="text-xl font-bold text-blue-800 mb-2">Public Aid Map</h2>
                        <p className="text-gray-600 mb-4">View active damage reports and offer assistance.</p>
                        <Link to="/map" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            View Map
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                        path="/report"
                        element={
                            <ProtectedRoute requiredRole="farmer">
                                <DamageReportForm />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-reports"
                        element={
                            <ProtectedRoute requiredRole="farmer">
                                <MyReports />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/map"
                        element={
                            <ProtectedRoute>
                                <AidMap />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requiredRole="official">
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/contact"
                        element={
                            <ProtectedRoute>
                                <Contact />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/seed" element={<DatabaseSeeder />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
