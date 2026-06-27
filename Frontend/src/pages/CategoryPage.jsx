import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSpinner, FaBox } from 'react-icons/fa';
import api, { publicApi } from '../services/api'; // ✅ Import both

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
            
            // ✅ Fetch ALL donations from public API
            const response = await publicApi.get('/donations');
            console.log('📦 All donations response:', response.data);
            
            // Handle different response formats
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
            
            console.log('📦 All donations:', allDonations);
            console.log('🔍 Looking for category:', categoryName);
            
            // ✅ Filter donations by category (case-insensitive)
            const filteredItems = allDonations.filter(donation => {
                if (!donation.items || donation.items.length === 0) return false;
                return donation.items.some(item => 
                    item.category?.toLowerCase() === categoryName?.toLowerCase()
                );
            });
            
            console.log(`✅ Found ${filteredItems.length} items in category: ${categoryName}`);
            setItems(filteredItems);
            
            // ✅ Fetch category info
            try {
                const catResponse = await publicApi.get('/categories');
                console.log('📋 Categories response:', catResponse.data);
                
                let categories = [];
                if (catResponse.data && catResponse.data.categories) {
                    categories = catResponse.data.categories;
                } else if (Array.isArray(catResponse.data)) {
                    categories = catResponse.data;
                } else {
                    categories = [];
                }
                
                const foundCategory = categories.find(
                    c => c.name?.toLowerCase() === categoryName?.toLowerCase()
                );
                setCategory(foundCategory);
                console.log('✅ Found category:', foundCategory);
                
            } catch (err) {
                console.log('Category info not found:', err);
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

            {/* Items Grid */}
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
                    <br />
                    <Link to="/" className="text-purple-600 hover:underline mt-3 inline-block">
                        Browse other categories
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((donation) => (
                        <div key={donation._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                            <div className="flex justify-between items-start">
                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(donation.status)}`}>
                                    {donation.status}
                                </span>
                                <span className="text-sm text-gray-400">
                                    {new Date(donation.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <div className="mt-4">
                                <h3 className="font-bold text-gray-800">
                                    {donation.items?.map(i => `${i.quantity}x ${i.type}`).join(', ')}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {donation.items?.length} item(s)
                                </p>
                                {donation.items?.[0]?.category && (
                                    <span className="inline-block mt-2 px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-full">
                                        {getEmojiForCategory(donation.items[0].category)} {donation.items[0].category}
                                    </span>
                                )}
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">Donor</p>
                                    <p className="font-medium text-gray-700">{donation.donorId?.name || 'Unknown'}</p>
                                </div>
                                <Link
                                    to={`/donation/${donation._id}`}
                                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                                >
                                    View Details →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryPage;