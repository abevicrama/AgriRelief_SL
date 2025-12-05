import React, { useEffect, useState } from 'react';
import { getReports, updateReportStatus } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function Dashboard() {
    const { currentUser } = useAuth(); // In a real app, check for admin role here
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const data = await getReports();
            setReports(data);
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id) => {
        try {
            await updateReportStatus(id, 'Verified', true);
            // Optimistic update
            setReports(reports.map(r => r.report_id === id ? { ...r, status: 'Verified', is_verified: true } : r));
        } catch (error) {
            console.error("Error verifying report:", error);
            alert("Failed to verify report.");
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-agri-green-600" /></div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <div className="text-sm text-gray-600">
                        Logged in as: {currentUser?.email}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Damage</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reports.map((report) => (
                                    <tr key={report.report_id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {report.created_at?.seconds ? new Date(report.created_at.seconds * 1000).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{report.farmer_name}</div>
                                            <div className="text-sm text-gray-500">{report.contact_number}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{report.district}</div>
                                            <div className="text-sm text-gray-500">{report.ds_division}</div>
                                            <div className="text-xs text-gray-400">{report.gn_division}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${report.damage_type === 'Landslide' ? 'bg-red-100 text-red-800' :
                                                    report.damage_type === 'Flood' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                {report.damage_type}
                                            </span>
                                            <div className="text-xs text-gray-500 mt-1">{report.cultivation_nature}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-sm ${report.urgent ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                                                {report.severity}
                                            </span>
                                            {report.urgent && <div className="text-xs text-red-500">URGENT</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${report.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {!report.is_verified && (
                                                <button
                                                    onClick={() => handleVerify(report.report_id)}
                                                    className="text-agri-green-600 hover:text-agri-green-900 flex items-center"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" /> Verify
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
