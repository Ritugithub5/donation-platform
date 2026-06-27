import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSpinner, FaBox, FaUser, FaMapMarkerAlt, FaCalendarAlt, FaHeart } from 'react-icons/fa';
import api, { publicApi } from '../services/api';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState(null);

    useEffect(() => {
        fetchCategoryItems();
    }, [categoryName]);

    const fetchCategoryItems = async () => {
        try {
            setLoading(true);
            
            // ✅ Fetch ALL donations
            const response = await publicApi.get('/donations');
            console.log('📦 All donations:', response.data);
            
            let allDonations = [];
            if (response.data && response.data.donations) {
                allDonations = response.data.donations;
            } else if (Array.isArray(response.data)) {
                allDonations = response.data;
            } else if (response.data && response.data.success && response.data.donations) {
                allDonations = response.data.donations;
            } else {
                allDonations = [];
            }
            
            // ✅ Filter by category
            const filteredItems = allDonations.filter(donation => {
                if (!donation.items || donation.items.length === 0) return false;
                return donation.items.some(item => 
                    item.category?.toLowerCase() === categoryName?.toLowerCase()
                );
            });
            
            console.log(`✅ Found ${filteredItems.length} items in category: ${categoryName}`);
            setItems(filteredItems);
            
            // ✅ Get category info
            try {
                const catResponse = await publicApi.get('/categories');
                let categories = [];
                if (catResponse.data && catResponse.data.categories) {
                    categories = catResponse.data.categories;
                } else if (Array.isArray(catResponse.data)) {
                    categories = catResponse.data;
                }
                
                const foundCategory = categories.find(
                    c => c.name?.toLowerCase() === categoryName?.toLowerCase()
                );
                setCategory(foundCategory);
            } catch (err) {
                console.log('Category info not found');
            }
            
        } catch (error) {
            console.error('Error fetching category items:', error);
            toast.error('Failed to load category items');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            accepted: 'bg-blue-100 text-blue-800',
            collected: 'bg-purple-100 text-purple-800',
            distributed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: '⏳',
            accepted: '✅',
            collected: '📦',
            distributed: '🎯',
            cancelled: '❌',
        };
        return icons[status] || '📋';
    };

    const getEmojiForCategory = (categoryName) => {
        const emojis = {
            'clothing': '👕',
            'household': '🏠',
            'books': '📚',
            'electronics': '💻',
            'furniture': '🪑',
            'other': '📦',
            'food': '🍲',
            'medicine': '💊',
            'toys': '🧸',
            'shoes': '👟',
            'bags': '🎒',
            'stationery': '✏️',
        };
        return emojis[categoryName?.toLowerCase()] || '📦';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="text-5xl text-purple-600 animate-spin mx-auto" />
                    <p className="text-gray-500 mt-4">Loading category...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Back Button */}
            <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors"
            >
                <FaArrowLeft /> Back to Home
            </Link>

            {/* Category Header */}
            <div className="flex items-center gap-4 mb-8">
                <span className="text-6xl">{category?.icon || getEmojiForCategory(categoryName)}</span>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 capitalize">
                        {category?.name || categoryName} 
                    </h1>
                    <p className="text-gray-500">
                        {items.length} donation(s) available
                    </p>
                    {category?.description && (
                        <p className="text-gray-400 text-sm mt-1">{category.description}</p>
                    )}
                </div>
            </div>

            {/* Items Grid with Full Details */}
            {items.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No donations available in this category yet.</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Be the first to donate in this category!
                    </p>
                    <Link 
                        to="/donor" 
                        className="inline-block mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                        Start Donating
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map((donation) => (
                        <div key={donation._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                            {/* Status Header */}
                            <div className="px-6 py-3 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-gray-100 flex justify-between items-center">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(donation.status)}`}>
                                    {getStatusIcon(donation.status)} {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                                </span>
                                <span className="text-sm text-gray-400">
                                    #{donation._id?.slice(-6)}
                                </span>
                            </div>

                            <div className="p-6">
                                {/* Items */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-500 mb-2">📦 Items Donated</h4>
                                    <div className="space-y-2">
                                        {donation.items?.map((item, idx) => (
                                            <div key={idx} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                                                <div>
                                                    <span className="font-medium">{item.quantity}x {item.type}</span>
                                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusBadge(item.category)}`}>
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500">Condition: {item.condition}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Donor Info */}
                                <div className="mb-3 border-t border-gray-100 pt-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <FaUser className="text-purple-500" />
                                        <span className="font-medium">Donor:</span>
                                        <span className="text-gray-600">{donation.donorId?.name || 'Unknown'}</span>
                                        <span className="text-gray-400 text-xs">({donation.donorId?.email || 'No email'})</span>
                                    </div>
                                </div>

                                {/* NGO Info */}
                                {donation.ngoId && (
                                    <div className="mb-3 flex items-center gap-2 text-sm">
                                        <FaHeart className="text-red-500" />
                                        <span className="font-medium">NGO:</span>
                                        <span className="text-gray-600">{donation.ngoId?.name || 'Not assigned'}</span>
                                    </div>
                                )}

                                {/* Address */}
                                {donation.collectionAddress && (
                                    <div className="mb-3 flex items-start gap-2 text-sm">
                                        <FaMapMarkerAlt className="text-purple-500 mt-0.5" />
                                        <div>
                                            <span className="font-medium">Address:</span>
                                            <span className="text-gray-600">
                                                {donation.collectionAddress?.street}, {donation.collectionAddress?.city}, {donation.collectionAddress?.state}
                                            </span>
                                            <span className="text-gray-400 text-xs block">
                                                Pincode: {donation.collectionAddress?.pincode}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Schedule */}
                                {donation.scheduledDate && (
                                    <div className="mb-3 flex items-center gap-2 text-sm">
                                        <FaCalendarAlt className="text-purple-500" />
                                        <span className="font-medium">Scheduled:</span>
                                        <span className="text-gray-600">
                                            {new Date(donation.scheduledDate).toLocaleDateString()} at {donation.scheduledTime || '12:00'}
                                        </span>
                                    </div>
                                )}

                                {/* Special Instructions */}
                                {donation.specialInstructions && (
                                    <div className="mb-3 text-sm bg-yellow-50 p-2 rounded-lg border border-yellow-100">
                                        <span className="font-medium">📝 Instructions:</span>
                                        <span className="text-gray-600 ml-1">{donation.specialInstructions}</span>
                                    </div>
                                )}

                                {/* Donor Message */}
                                {donation.donorMessage && (
                                    <div className="mb-3 text-sm bg-blue-50 p-2 rounded-lg border border-blue-100">
                                        <span className="font-medium">💬 Message:</span>
                                        <span className="text-gray-600 ml-1">"{donation.donorMessage}"</span>
                                    </div>
                                )}

                                {/* Dates */}
                                <div className="text-xs text-gray-400 border-t border-gray-100 pt-3 mt-2">
                                    Created: {new Date(donation.createdAt).toLocaleString()}
                                    {donation.completedAt && (
                                        <span className="ml-4">Completed: {new Date(donation.completedAt).toLocaleString()}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
