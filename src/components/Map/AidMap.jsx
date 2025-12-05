import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getReports } from '../../services/db';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Phone, MapPin, Filter, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix for default Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom colored icons
const createCustomIcon = (color) => {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
};

const redIcon = createCustomIcon('red');
const blueIcon = createCustomIcon('blue');
const greenIcon = createCustomIcon('green');

const NEEDS_OPTIONS = ["Seeds", "Fertilizer", "Labor", "Technology", "Equipment", "Lab Test", "Heavy Machines", "Financial Aid"];

export default function AidMap() {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNeed, setSelectedNeed] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await getReports();
                setReports(data);
                setFilteredReports(data);
            } catch (error) {
                console.error("Error fetching reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    useEffect(() => {
        if (selectedNeed === 'All') {
            setFilteredReports(reports);
        } else {
            setFilteredReports(reports.filter(report => report.needs_list && report.needs_list.includes(selectedNeed)));
        }
    }, [selectedNeed, reports]);

    const getMarkerIcon = (damageType) => {
        switch (damageType) {
            case 'Landslide': return redIcon;
            case 'Flood': return blueIcon;
            default: return greenIcon;
        }
    };

    return (
        <div className="flex h-screen flex-col md:flex-row">
            {/* Sidebar / Filter Panel */}
            <div className={`bg-white w-full md:w-80 shadow-lg z-10 flex flex-col ${showFilters ? 'block' : 'hidden md:flex'}`}>
                <div className="p-4 bg-agri-green-600 text-white flex justify-between items-center">
                    <div className="flex items-center">
                        <Link to="/" className="mr-2 hover:bg-agri-green-700 p-1 rounded">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h2 className="text-xl font-bold">Public Aid Map</h2>
                    </div>
                    <button onClick={() => setShowFilters(false)} className="md:hidden">Close</button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-2">Filter by Needs</h3>
                        <select
                            className="w-full p-2 border rounded"
                            value={selectedNeed}
                            onChange={(e) => setSelectedNeed(e.target.value)}
                        >
                            <option value="All">All Needs</option>
                            {NEEDS_OPTIONS.map(need => (
                                <option key={need} value={need}>{need}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-700">Legend</h3>
                        <div className="flex items-center space-x-2">
                            <span className="w-3 h-3 rounded-full bg-red-600"></span>
                            <span>Landslide (Urgent)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                            <span>Flood</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-3 h-3 rounded-full bg-green-600"></span>
                            <span>General / Other</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="text-sm text-gray-500">
                            Showing {filteredReports.length} active reports.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button
                className="md:hidden absolute top-4 right-4 z-[1000] bg-white p-2 rounded shadow"
                onClick={() => setShowFilters(!showFilters)}
            >
                <Filter className="h-6 w-6 text-agri-green-600" />
            </button>

            {/* Map Container */}
            <div className="flex-1 relative z-0">
                {loading ? (
                    <div className="flex items-center justify-center h-full bg-gray-100">Loading Map...</div>
                ) : (
                    <MapContainer
                        center={[7.8731, 80.7718]} // Center of Sri Lanka
                        zoom={8}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {filteredReports.map(report => (
                            report.coordinates && (
                                <Marker
                                    key={report.report_id}
                                    position={[report.coordinates.lat, report.coordinates.lng]}
                                    icon={getMarkerIcon(report.damage_type)}
                                >
                                    <Popup>
                                        <div className="p-2 min-w-[200px]">
                                            <h3 className="font-bold text-lg mb-1">{report.damage_type}</h3>
                                            <p className="text-sm text-gray-600 mb-1">{report.district} - {report.ds_division}</p>
                                            <p className="text-xs text-gray-500 mb-2">{report.gn_division}</p>

                                            <div className="mb-2">
                                                <span className="font-semibold text-xs uppercase text-gray-500">Cultivation:</span>
                                                <p className="text-sm">{report.cultivation_nature} ({report.land_size} {report.land_unit || 'Acres'})</p>
                                            </div>

                                            <div className="mb-3">
                                                <span className="font-semibold text-xs uppercase text-gray-500">Needs:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {report.needs_list && report.needs_list.map(need => (
                                                        <span key={need} className="text-xs bg-gray-100 px-2 py-1 rounded border">
                                                            {need}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {report.images && report.images.length > 0 && (
                                                <div className="mb-3">
                                                    <img src={report.images[0]} alt="Damage" className="w-full h-32 object-cover rounded" />
                                                </div>
                                            )}

                                            <button
                                                className="w-full bg-agri-green-600 text-white py-1 px-3 rounded text-sm flex items-center justify-center hover:bg-agri-green-700"
                                                onClick={() => alert(`Contact Farmer: ${report.contact_number}`)}
                                            >
                                                <Phone className="h-3 w-3 mr-1" /> Contact Farmer
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        ))}
                    </MapContainer>
                )}
            </div>
        </div>
    );
}
