import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReport, getUserProfile } from '../../services/db';
import { uploadImage } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Upload, Loader2 } from 'lucide-react';

const PROVINCES = ["North Central", "Central", "Eastern", "Northern", "Southern", "Western", "North Western", "Sabaragamuwa", "Uva"];

const DISTRICTS_BY_PROVINCE = {
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    "Central": ["Kandy", "Matale", "Nuwara Eliya"],
    "Eastern": ["Ampara", "Batticaloa", "Trincomalee"],
    "Northern": ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
    "Southern": ["Galle", "Hambantota", "Matara"],
    "Western": ["Colombo", "Gampaha", "Kalutara"],
    "North Western": ["Kurunegala", "Puttalam"],
    "Sabaragamuwa": ["Kegalle", "Ratnapura"],
    "Uva": ["Badulla", "Monaragala"]
};

const CULTIVATION_TYPES = ["Paddy", "Vegetable", "Tea", "Rubber", "Coconut", "Cinnamon", "Fruits"];
const DAMAGE_TYPES = ["Flood", "Landslide", "Drought", "Wild Elephant Attack", "Pest Attack"];
const SEVERITY_LEVELS = ["Total Destruction", "Partial", "Minor"];
const NEEDS_OPTIONS = ["Seeds", "Fertilizer", "Labor", "Technology", "Equipment", "Lab Test", "Heavy Machines", "Financial Aid"];
const LAND_UNITS = ["Acres", "Perches", "Hectares"];

export default function DamageReportForm() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [availableDistricts, setAvailableDistricts] = useState([]);

    const [formData, setFormData] = useState({
        contact_number: '',
        province: '',
        district: '',
        ds_division: '',
        gn_division: '',
        cultivation_nature: '',
        damage_type: '',
        land_size: '',
        land_unit: 'Acres',
        severity: '',
        needs_list: [],
        urgent: false,
        coordinates: null, // { lat, lng }
        images: [] // Array of File objects
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (currentUser) {
                const profile = await getUserProfile(currentUser.uid);
                if (profile) {
                    setUserProfile(profile);
                    setFormData(prev => ({
                        ...prev,
                        contact_number: profile.phone || '',
                        // Pre-fill location if available, but let user change it
                    }));
                }
            }
        };
        fetchProfile();
    }, [currentUser]);

    // Update available districts when province changes
    useEffect(() => {
        if (formData.province) {
            setAvailableDistricts(DISTRICTS_BY_PROVINCE[formData.province] || []);
            // Reset district if it doesn't belong to the new province
            if (formData.district && !DISTRICTS_BY_PROVINCE[formData.province]?.includes(formData.district)) {
                setFormData(prev => ({ ...prev, district: '' }));
            }
        } else {
            setAvailableDistricts([]);
        }
    }, [formData.province]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCheckboxChange = (need) => {
        setFormData(prev => {
            const newNeeds = prev.needs_list.includes(need)
                ? prev.needs_list.filter(n => n !== need)
                : [...prev.needs_list, need];
            return { ...prev, needs_list: newNeeds };
        });
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...Array.from(e.target.files)]
            }));
        }
    };

    const getLocation = () => {
        setLocationLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        coordinates: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    }));
                    setLocationLoading(false);
                },
                (error) => {
                    console.error("Error getting location: ", error);
                    alert("Unable to retrieve your location.");
                    setLocationLoading(false);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            setLocationLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Upload Images
            const imageUrls = await Promise.all(
                formData.images.map(file => uploadImage(file, `damage_reports/${currentUser.uid}/${Date.now()}_${file.name}`))
            );

            // 2. Create Report Data
            const reportData = {
                farmer_id: currentUser.uid,
                farmer_name: userProfile?.name || 'Unknown Farmer',
                contact_number: formData.contact_number,
                province: formData.province,
                district: formData.district,
                ds_division: formData.ds_division,
                gn_division: formData.gn_division,
                cultivation_nature: formData.cultivation_nature,
                damage_type: formData.damage_type,
                land_size: Number(formData.land_size),
                land_unit: formData.land_unit,
                severity: formData.severity,
                needs_list: formData.needs_list,
                urgent: formData.urgent,
                coordinates: formData.coordinates, // { lat, lng }
                images: imageUrls
            };

            // 3. Save to Firestore
            await createReport(reportData);

            alert("Report submitted successfully!");
            navigate('/');
        } catch (error) {
            console.error("Error submitting report: ", error);
            alert("Failed to submit report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-agri-green-600 py-4 px-6">
                    <h2 className="text-2xl font-bold text-white">Damage Report Form</h2>
                    <p className="text-agri-green-100 text-sm">Report your farmland damage to request assistance.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Location Details */}
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Location Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Province</label>
                                <select name="province" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-green-500 focus:ring-agri-green-500 sm:text-sm p-2 border" onChange={handleInputChange} value={formData.province}>
                                    <option value="">Select Province</option>
                                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">District</label>
                                <select
                                    name="district"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-green-500 focus:ring-agri-green-500 sm:text-sm p-2 border"
                                    onChange={handleInputChange}
                                    value={formData.district}
                                    disabled={!formData.province}
                                >
                                    <option value="">Select District</option>
                                    {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">DS Division</label>
                                <input type="text" name="ds_division" required placeholder="e.g. Medirigiriya" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-green-500 focus:ring-agri-green-500 sm:text-sm p-2 border" onChange={handleInputChange} value={formData.ds_division} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">GN Division</label>
                                <input type="text" name="gn_division" required placeholder="e.g. Track 7" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-green-500 focus:ring-agri-green-500 sm:text-sm p-2 border" onChange={handleInputChange} value={formData.gn_division} />
                            </div>
                        </div>

                        {/* GPS Location */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">GPS Location (Required for Map)</label>
                            <div className="flex items-center space-x-4">
                                <button
                                    type="button"
                                    onClick={getLocation}
                                    disabled={locationLoading}
                                    className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {locationLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
                                    Use My Location
                                </button>
                                {formData.coordinates && (
                                    <span className="text-sm text-green-600 font-medium">
                                        Captured: {formData.coordinates.lat.toFixed(4)}, {formData.coordinates.lng.toFixed(4)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Damage Details */}
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Damage Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nature of Cultivation</label>
                                <select name="cultivation_nature" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-green-500 focus:ring-agri-green-500 sm:text-sm p-2 border" onChange={handleInputChange} value={formData.cultivation_nature}>
                                    <option value="">Select Type</option>
                                    {CULTIVATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nature of Damage</label>
                                <select name="damage_type" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-green-500 focus:ring-agri-green-500 sm:text-sm p-2 border" onChange={handleInputChange} value={formData.damage_type}>
                                    <option value="">Select Damage</option>
                                    {DAMAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Land Size</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        name="land_size"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-green-500 focus:ring-agri-green-500 sm:text-sm p-2 border"
                                        onChange={handleInputChange}
                                        value={formData.land_size}
                                        placeholder="Size"
                                    />
                                    <select
                                        name="land_unit"
                                        className="mt-1 block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-agri-green-500 focus:ring-agri-green-500 sm:text-sm p-2 border"
                                        onChange={handleInputChange}
                                        value={formData.land_unit}
                                    >
                                        {LAND_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Severity</label>
                                <select name="severity" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-green-500 focus:ring-agri-green-500 sm:text-sm p-2 border" onChange={handleInputChange} value={formData.severity}>
                                    <option value="">Select Severity</option>
                                    {SEVERITY_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Needs */}
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Assistance Required</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Immediate Needs</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {NEEDS_OPTIONS.map(need => (
                                    <label key={need} className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-agri-green-600 shadow-sm focus:border-agri-green-300 focus:ring focus:ring-agri-green-200 focus:ring-opacity-50"
                                            checked={formData.needs_list.includes(need)}
                                            onChange={() => handleCheckboxChange(need)}
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{need}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="urgent"
                                name="urgent"
                                type="checkbox"
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                checked={formData.urgent}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="urgent" className="ml-2 block text-sm font-bold text-red-700">
                                Mark as Urgent (Critical Situation)
                            </label>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                        <input type="tel" name="contact_number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-green-500 focus:ring-agri-green-500 sm:text-sm p-2 border" onChange={handleInputChange} value={formData.contact_number} />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos (2-3)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-agri-green-500 transition-colors bg-white">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-agri-green-600 hover:text-agri-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-agri-green-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleImageChange} accept="image/*" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                        {formData.images.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                                {formData.images.length} file(s) selected
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-agri-green-600 hover:bg-agri-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-green-500 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Submit Report"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
