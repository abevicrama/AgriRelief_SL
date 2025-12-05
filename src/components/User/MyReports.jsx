import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getReportsByFarmerId, deleteReport } from '../../services/db';
import { Trash2, Edit, AlertTriangle, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function MyReports() {
    const { currentUser } = useAuth();
    const { t } = useLanguage();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            if (currentUser) {
                try {
                    const data = await getReportsByFarmerId(currentUser.uid);
                    setReports(data);
                } catch (error) {
                    console.error("Error fetching my reports:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchReports();
    }, [currentUser]);

    const handleDelete = async (reportId) => {
        if (window.confirm("Are you sure you want to delete this report?")) {
            try {
                await deleteReport(reportId);
                setReports(reports.filter(r => r.report_id !== reportId));
            } catch (error) {
                alert("Failed to delete report.");
            }
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-agri-green-600" /></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('myReports')}</h1>

            {reports.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500 dark:text-gray-400">You haven't submitted any reports yet.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {reports.map((report) => (
                            <li key={report.report_id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <p className="text-sm font-medium text-agri-green-600 truncate">
                                                {report.damage_type}
                                            </p>
                                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.status === 'Verified' ? 'bg-green-100 text-green-800' :
                                                    report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {report.status}
                                            </span>
                                        </div>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {report.district}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                {report.cultivation_nature} - {report.land_size} {report.land_unit || 'Acres'}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                                            <p>
                                                Submitted on {report.created_at?.toDate().toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-3">
                                        {report.status === 'Pending' && (
                                            <button
                                                onClick={() => handleDelete(report.report_id)}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
