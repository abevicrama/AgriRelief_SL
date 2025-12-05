import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Contact() {
    const { t } = useLanguage();

    const staff = [
        {
            name: "Dr. W.A.R.T. Wickramaarachchi",
            title: "Director General of Agriculture",
            phone: "+94 812 386484",
            email: "dg@doa.gov.lk"
        },
        {
            name: "Dr. J.A. Sumith",
            title: "Additional Director General (Research)",
            phone: "+94 812 068183",
            email: "adg.res@doa.gov.lk"
        },
        {
            name: "Mrs. G.G.V. Shyamali",
            title: "Additional Director General (Development)",
            phone: "+94 812 068184",
            email: "adg.dev@doa.gov.lk"
        },
        {
            name: "Mr. D.M.P. Jayawardhana",
            title: "Additional Director General (Administration)",
            phone: "+94 812 388181",
            email: "adg.admin@doa.gov.lk"
        },
        {
            name: "Mrs. K.S.D. Dissanayake",
            title: "Chief Financial Officer",
            phone: "+94 812 387404",
            email: "-"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-agri-green-800 dark:text-agri-green-400 mb-8 text-center">{t('contactDept')}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Contact Info */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Department of Agriculture</h2>
                    <div className="space-y-4 text-gray-600 dark:text-gray-300">
                        <div className="flex items-start">
                            <MapPin className="w-5 h-5 mr-3 mt-1 text-agri-green-600" />
                            <p>P.O. Box 01, Peradeniya, Sri Lanka.</p>
                        </div>
                        <div className="flex items-center">
                            <Phone className="w-5 h-5 mr-3 text-agri-green-600" />
                            <p>+94 812 388331 / 32 / 34</p>
                        </div>
                        <div className="flex items-center">
                            <Mail className="w-5 h-5 mr-3 text-agri-green-600" />
                            <p>info@doa.gov.lk</p>
                        </div>
                    </div>
                </div>

                {/* Key Staff */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Officials</h2>
                    <div className="space-y-6">
                        {staff.map((person, index) => (
                            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                                <h3 className="font-medium text-gray-900 dark:text-white">{person.name}</h3>
                                <p className="text-sm text-agri-green-600 dark:text-agri-green-400 mb-1">{person.title}</p>
                                <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center"><Phone className="w-3 h-3 mr-1" /> {person.phone}</span>
                                    {person.email !== '-' && (
                                        <span className="flex items-center"><Mail className="w-3 h-3 mr-1" /> {person.email}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Data Source: <a href="https://doa.gov.lk/about-us-2020/" target="_blank" rel="noopener noreferrer" className="text-agri-green-600 hover:underline">Department of Agriculture Website</a></p>
            </div>
        </div>
    );
}
