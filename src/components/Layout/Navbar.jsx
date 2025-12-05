import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Menu, X, LogOut, User, Map, FileText, Home, Phone, Sun, Moon, Globe } from 'lucide-react';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
    const { currentUser, userRole } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { language, switchLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: t('home'), path: '/', icon: <Home className="w-4 h-4 mr-2" /> },
        { name: t('reportDamage'), path: '/report', icon: <FileText className="w-4 h-4 mr-2" />, role: 'farmer' },
        { name: t('myReports'), path: '/my-reports', icon: <FileText className="w-4 h-4 mr-2" />, role: 'farmer' },
        { name: t('aidMap'), path: '/map', icon: <Map className="w-4 h-4 mr-2" /> },
        { name: t('contactDept'), path: '/contact', icon: <Phone className="w-4 h-4 mr-2" /> },
        { name: t('adminDashboard'), path: '/admin', icon: <User className="w-4 h-4 mr-2" />, role: 'official' },
    ];

    return (
        <nav className="bg-agri-green-700 dark:bg-gray-900 text-white shadow-lg transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 font-bold text-xl tracking-wider flex items-center">
                            <span className="text-white">AgriRelief</span>
                            <span className="text-agri-green-200 ml-1">SL</span>
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navLinks.map((link) => {
                                    if (link.role && link.role !== userRole) return null;
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.path)
                                                ? 'bg-agri-green-800 dark:bg-gray-700 text-white'
                                                : 'text-agri-green-100 hover:bg-agri-green-600 dark:hover:bg-gray-800 hover:text-white'
                                                }`}
                                        >
                                            {link.icon}
                                            {link.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Language Switcher */}
                        <div className="relative group">
                            <button className="p-1 rounded-full text-agri-green-100 hover:text-white focus:outline-none">
                                <Globe className="h-5 w-5" />
                            </button>
                            <div className="absolute right-0 pt-2 w-32 hidden group-hover:block z-50">
                                <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg py-1">
                                    <button onClick={() => switchLanguage('en')} className={`block w-full text-left px-4 py-2 text-sm ${language === 'en' ? 'font-bold text-agri-green-600' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>English</button>
                                    <button onClick={() => switchLanguage('si')} className={`block w-full text-left px-4 py-2 text-sm ${language === 'si' ? 'font-bold text-agri-green-600' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Sinhala</button>
                                    <button onClick={() => switchLanguage('ta')} className={`block w-full text-left px-4 py-2 text-sm ${language === 'ta' ? 'font-bold text-agri-green-600' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Tamil</button>
                                </div>
                            </div>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-1 rounded-full text-agri-green-100 hover:text-white focus:outline-none"
                            title="Toggle Theme"
                        >
                            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </button>

                        <div className="ml-4 flex items-center md:ml-6">
                            <span className="text-sm text-agri-green-100 mr-4">
                                {currentUser?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-agri-green-800 dark:bg-gray-700 p-1 rounded-full text-agri-green-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-agri-green-800 focus:ring-white"
                                title="Logout"
                            >
                                <LogOut className="h-6 w-6 p-1" />
                            </button>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-agri-green-800 dark:bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-agri-green-200 hover:text-white hover:bg-agri-green-600 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-agri-green-800 focus:ring-white"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-agri-green-700 dark:bg-gray-900">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => {
                            if (link.role && link.role !== userRole) return null;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)
                                        ? 'bg-agri-green-900 dark:bg-gray-800 text-white'
                                        : 'text-agri-green-100 hover:bg-agri-green-600 dark:hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    {link.icon}
                                    {link.name}
                                </Link>
                            );
                        })}

                        {/* Mobile Theme & Language */}
                        <div className="flex items-center justify-between px-3 py-2 text-agri-green-100">
                            <button onClick={toggleTheme} className="flex items-center">
                                {theme === 'light' ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                            </button>
                            <div className="flex space-x-2">
                                <button onClick={() => switchLanguage('en')} className={language === 'en' ? 'font-bold text-white' : ''}>EN</button>
                                <button onClick={() => switchLanguage('si')} className={language === 'si' ? 'font-bold text-white' : ''}>SI</button>
                                <button onClick={() => switchLanguage('ta')} className={language === 'ta' ? 'font-bold text-white' : ''}>TA</button>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                handleLogout();
                                setIsOpen(false);
                            }}
                            className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-red-200 hover:bg-red-700 hover:text-white"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            {t('logout')}
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
