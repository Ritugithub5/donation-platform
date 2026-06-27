import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const DonorDashboard = () => {
    const [donations, setDonations] = useState([]);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [ngos, setNgos] = useState([]);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('my-donations');
    const [showDonationModal, setShowDonationModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [selectedNGO, setSelectedNGO] = useState(null);
    const [showNGOBeneficiaries, setShowNGOBeneficiaries] = useState(false);

    // ============ SEARCH & FILTER STATE ============
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCity, setFilterCity] = useState('all');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [cities, setCities] = useState([]);

    // ============ RECURRING DONATION STATE ============
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringFrequency, setRecurringFrequency] = useState('monthly');
    const [recurringEndDate, setRecurringEndDate] = useState('');

    // ============ DONOR-NGO MATCHING STATE ============
    const [matchedNGOs, setMatchedNGOs] = useState([]);
    const [showMatching, setShowMatching] = useState(false);
    const [matchPreferences, setMatchPreferences] = useState({
        category: 'all',
        city: 'all',
        distance: 50,
        rating: 0
    });

    // ============ RATING STATE ============
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [ratingDonation, setRatingDonation] = useState(null);
    const [ratingValue, setRatingValue] = useState(0);
    const [ratingComment, setRatingComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    // ============ LOCATION STATE ============
    const [userLocation, setUserLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState(null);

    // Donation form state
    const [donationForm, setDonationForm] = useState({
        items: [{ type: '', quantity: 1, category: 'other', description: '', condition: 'good' }],
        street: '',
        city: '',
        state: '',
        pincode: '',
        scheduledDate: '',
        scheduledTime: '12:00',
        specialInstructions: '',
        donorMessage: '',
        ngoId: ''
    });

    // Schedule state
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchData();
        fetchNGOs();
        fetchBeneficiaries();
        getUserLocation();
    }, []);

    // ✅ Apply filters whenever search/filter changes
    useEffect(() => {
        applyFilters();
    }, [donations, searchTerm, filterCategory, filterStatus, filterCity, filterDateFrom, filterDateTo]);

    // ✅ Get user location
    const getUserLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            return;
        }

        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLocationLoading(false);
                // Auto-match after getting location
                findMatchingNGOs();
            },
            (error) => {
                console.error('Location error:', error);
                setLocationError('Unable to get location. Please enable location services.');
                setLocationLoading(false);
                // Fallback: use city from profile
                if (user.city) {
                    setMatchPreferences(prev => ({ ...prev, city: user.city }));
                }
            }
        );
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/donations/my-donations');
            if (response.data && response.data.donations) {
                setDonations(response.data.donations);
                setFilteredDonations(response.data.donations);
            } else if (Array.isArray(response.data)) {
                setDonations(response.data);
                setFilteredDonations(response.data);
            } else {
                setDonations([]);
                setFilteredDonations([]);
            }
        } catch (error) {
            console.error('Error fetching donations:', error);
            toast.error('Failed to fetch donations');
            setDonations([]);
            setFilteredDonations([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchNGOs = async () => {
        try {
            const response = await api.get('/ngos');
            if (response.data && response.data.ngos) {
                setNgos(response.data.ngos);
                // Extract cities from NGOs
                const cityList = response.data.ngos
                    .map(n => n.address?.split(',')[0]?.trim())
                    .filter(c => c && c.length > 0);
                setCities([...new Set(cityList)]);
                // Also update matched NGOs
                setMatchedNGOs(response.data.ngos);
            } else if (Array.isArray(response.data)) {
                setNgos(response.data);
                setMatchedNGOs(response.data);
            } else {
                setNgos([]);
                setMatchedNGOs([]);
            }
        } catch (error) {
            console.error('Error fetching NGOs:', error);
            setNgos([]);
            setMatchedNGOs([]);
        }
    };

    const fetchBeneficiaries = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/beneficiaries', {
                headers: { 'x-auth-token': token }
            });
            
            if (response.data && response.data.beneficiaries) {
                setBeneficiaries(response.data.beneficiaries);
            } else if (Array.isArray(response.data)) {
                setBeneficiaries(response.data);
            } else {
                setBeneficiaries([]);
            }
        } catch (error) {
            console.error('Error fetching beneficiaries:', error);
            setBeneficiaries([]);
        }
    };

    // ============ DONOR-NGO MATCHING ============
    const findMatchingNGOs = () => {
        let matched = [...ngos];
        
        // Filter by category preference
        if (matchPreferences.category !== 'all') {
            // This would require category data from NGOs
            // For now, we'll just show all
        }
        
        // Filter by city
        if (matchPreferences.city !== 'all' && matchPreferences.city) {
            matched = matched.filter(ngo => 
                ngo.address?.toLowerCase().includes(matchPreferences.city.toLowerCase())
            );
        }
        
        // Sort by rating (if available)
        matched.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        
        setMatchedNGOs(matched);
    };

    // ============ RATING SYSTEM ============
    const openRatingModal = (donation) => {
        setRatingDonation(donation);
        setRatingValue(0);
        setRatingComment('');
        setShowRatingModal(true);
    };

    const submitRating = async () => {
        if (ratingValue === 0) {
            toast.warning('Please select a rating');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await api.post('/ratings', {
                donationId: ratingDonation._id,
                ngoId: ratingDonation.ngoId?._id || ratingDonation.ngoId,
                rating: ratingValue,
                comment: ratingComment
            }, {
                headers: { 'x-auth-token': token }
            });
            
            toast.success('Thank you for your rating!');
            setShowRatingModal(false);
            setRatingDonation(null);
            setRatingValue(0);
            setRatingComment('');
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error('Failed to submit rating');
        }
    };

    // ✅ Apply search and filters
    const applyFilters = () => {
        let filtered = [...donations];

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(d => 
                d.items?.some(i => i.type.toLowerCase().includes(term)) ||
                d.donorId?.name?.toLowerCase().includes(term) ||
                d.donorId?.email?.toLowerCase().includes(term)
            );
        }

        if (filterCategory !== 'all') {
            filtered = filtered.filter(d =>
                d.items?.some(i => i.category === filterCategory)
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(d => d.status === filterStatus);
        }

        if (filterCity !== 'all' && filterCity) {
            filtered = filtered.filter(d =>
                d.collectionAddress?.city?.toLowerCase().includes(filterCity.toLowerCase())
            );
        }

        if (filterDateFrom) {
            filtered = filtered.filter(d =>
                new Date(d.createdAt) >= new Date(filterDateFrom)
            );
        }
        if (filterDateTo) {
            filtered = filtered.filter(d =>
                new Date(d.createdAt) <= new Date(filterDateTo)
            );
        }

        setFilteredDonations(filtered);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setFilterCategory('all');
        setFilterStatus('all');
        setFilterCity('all');
        setFilterDateFrom('');
        setFilterDateTo('');
        setFilteredDonations(donations);
        setShowFilters(false);
    };

    const getUniqueCategories = () => {
        const cats = new Set();
        donations.forEach(d => {
            d.items?.forEach(i => {
                if (i.category) cats.add(i.category);
            });
        });
        return [...cats];
    };

    const exportDonations = (format) => {
        try {
            const dataToExport = filteredDonations.length > 0 ? filteredDonations : donations;
            
            if (dataToExport.length === 0) {
                toast.warning('No donations to export');
                return;
            }

            if (format === 'csv') {
                let csv = 'ID,Donor,Items,Category,Status,Date,City,Rating\n';
                dataToExport.forEach(d => {
                    csv += `${d._id?.slice(-6)},${d.donorId?.name || 'Unknown'},${d.items?.map(i => `${i.quantity}x ${i.type}`).join('; ') || 'N/A'},${d.items?.[0]?.category || 'N/A'},${d.status},${new Date(d.createdAt).toLocaleDateString()},${d.collectionAddress?.city || 'N/A'},${d.rating || 'N/A'}\n`;
                });
                
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success(`Exported ${dataToExport.length} donations as CSV`);
            } else if (format === 'json') {
                const json = JSON.stringify(dataToExport, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `donations-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success(`Exported ${dataToExport.length} donations as JSON`);
            }
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export data');
        }
    };

    const getBeneficiariesForNGO = (ngoId) => {
        return beneficiaries.filter(b => b.ngoId === ngoId);
    };

    const handleAddItem = () => {
        setDonationForm({
            ...donationForm,
            items: [...donationForm.items, { type: '', quantity: 1, category: 'other', description: '', condition: 'good' }]
        });
    };

    const handleRemoveItem = (index) => {
        const items = [...donationForm.items];
        items.splice(index, 1);
        setDonationForm({ ...donationForm, items });
    };

    const handleItemChange = (index, field, value) => {
        const items = [...donationForm.items];
        items[index][field] = value;
        setDonationForm({ ...donationForm, items });
    };

    const handleDonationSubmit = async () => {
        const hasEmptyType = donationForm.items.some(item => !item.type.trim());
        if (hasEmptyType) {
            toast.warning('Please fill in all item types');
            return;
        }

        if (!donationForm.city || !donationForm.state) {
            toast.warning('Please fill in collection address');
            return;
        }

        try {
            const payload = {
                items: donationForm.items,
                collectionAddress: {
                    street: donationForm.street,
                    city: donationForm.city,
                    state: donationForm.state,
                    pincode: donationForm.pincode
                },
                scheduledDate: donationForm.scheduledDate || new Date().toISOString().split('T')[0],
                scheduledTime: donationForm.scheduledTime || '12:00',
                specialInstructions: donationForm.specialInstructions,
                donorMessage: donationForm.donorMessage,
                ngoId: donationForm.ngoId || null,
                isRecurring: isRecurring,
                recurringFrequency: isRecurring ? recurringFrequency : null,
                recurringEndDate: isRecurring ? recurringEndDate : null,
                // ✅ Send location for matching
                location: userLocation
            };

            await api.post('/donations', payload);
            toast.success(isRecurring ? 'Recurring donation created successfully!' : 'Donation created successfully!');
            setShowDonationModal(false);
            setDonationForm({
                items: [{ type: '', quantity: 1, category: 'other', description: '', condition: 'good' }],
                street: '',
                city: '',
                state: '',
                pincode: '',
                scheduledDate: '',
                scheduledTime: '12:00',
                specialInstructions: '',
                donorMessage: '',
                ngoId: ''
            });
            setIsRecurring(false);
            setRecurringFrequency('monthly');
            setRecurringEndDate('');
            fetchData();
            // ✅ Refresh matched NGOs after donation
            findMatchingNGOs();
        } catch (error) {
            console.error('Error creating donation:', error);
            toast.error(error.response?.data?.message || 'Failed to create donation');
        }
    };

    const handleScheduleDonation = (donation) => {
        setSelectedDonation(donation);
        setShowScheduleModal(true);
        setScheduleDate(donation.scheduledDate?.split('T')[0] || new Date().toISOString().split('T')[0]);
        setScheduleTime(donation.scheduledTime || '12:00');
    };

    const handleConfirmSchedule = async () => {
        if (!scheduleDate || !scheduleTime) {
            toast.warning('Please select both date and time');
            return;
        }

        try {
            await api.put(`/donations/${selectedDonation._id}/schedule`, {
                scheduledDate: scheduleDate,
                scheduledTime: scheduleTime
            });
            toast.success('Schedule updated successfully!');
            setShowScheduleModal(false);
            fetchData();
        } catch (error) {
            console.error('Error scheduling donation:', error);
            toast.error('Failed to schedule donation');
        }
    };

    const handleViewNGOBeneficiaries = (ngo) => {
        setSelectedNGO(ngo);
        setShowNGOBeneficiaries(true);
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

    // ✅ Render star rating
    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Donor Dashboard</h1>
                    <p className="text-gray-600">Welcome, {user.name}!</p>
                    {/* ✅ Location Status */}
                    {userLocation ? (
                        <span className="text-xs text-green-600">📍 Location detected</span>
                    ) : locationLoading ? (
                        <span className="text-xs text-yellow-600">⏳ Getting location...</span>
                    ) : locationError ? (
                        <span className="text-xs text-red-600">⚠️ {locationError}</span>
                    ) : null}
                </div>
                <div className="flex gap-2">
                    {donations.length > 0 && (
                        <div className="flex gap-1">
                            <button
                                className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                                onClick={() => exportDonations('csv')}
                            >
                                📥 CSV
                            </button>
                            <button
                                className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                                onClick={() => exportDonations('json')}
                            >
                                📥 JSON
                            </button>
                        </div>
                    )}
                    <button
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                        onClick={() => setShowDonationModal(true)}
                    >
                        ➕ Donate Now
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h3 className="text-gray-500 font-medium">Total Donations</h3>
                    <p className="text-3xl font-bold text-gray-800">{donations.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h3 className="text-gray-500 font-medium">Pending</h3>
                    <p className="text-3xl font-bold text-yellow-600">
                        {donations.filter(d => d.status === 'pending').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h3 className="text-gray-500 font-medium">Accepted</h3>
                    <p className="text-3xl font-bold text-blue-600">
                        {donations.filter(d => d.status === 'accepted' || d.status === 'collected').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h3 className="text-gray-500 font-medium">Completed</h3>
                    <p className="text-3xl font-bold text-green-600">
                        {donations.filter(d => d.status === 'distributed').length}
                    </p>
                </div>
            </div>

            {/* ============ SEARCH & FILTERS SECTION ============ */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="🔍 Search by item, donor, or NGO..."
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? '🔼 Hide Filters' : '🔽 Show Filters'}
                    </button>
                    <button
                        className="text-gray-500 hover:text-gray-700 text-sm"
                        onClick={resetFilters}
                    >
                        ✕ Clear All
                    </button>
                    <span className="text-sm text-gray-400">
                        {filteredDonations.length} of {donations.length} donations
                    </span>
                </div>

                {showFilters && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                className="w-full border rounded-lg px-3 py-2"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                {getUniqueCategories().map(cat => (
                                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                className="w-full border rounded-lg px-3 py-2"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="collected">Collected</option>
                                <option value="distributed">Distributed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <select
                                className="w-full border rounded-lg px-3 py-2"
                                value={filterCity}
                                onChange={(e) => setFilterCity(e.target.value)}
                            >
                                <option value="all">All Cities</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                            <input
                                type="date"
                                className="w-full border rounded-lg px-3 py-2"
                                value={filterDateFrom}
                                onChange={(e) => setFilterDateFrom(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                            <input
                                type="date"
                                className="w-full border rounded-lg px-3 py-2"
                                value={filterDateTo}
                                onChange={(e) => setFilterDateTo(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b flex-wrap">
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'my-donations' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('my-donations')}
                >
                    📦 My Donations ({filteredDonations.length})
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'ngos' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('ngos')}
                >
                    🏢 NGOs ({ngos.length})
                </button>
                {/* ✅ New Matching Tab */}
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'matching' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-gray-500'}`}
                    onClick={() => {
                        setActiveTab('matching');
                        findMatchingNGOs();
                    }}
                >
                    🎯 Best Match ({matchedNGOs.length})
                </button>
            </div>

            {/* My Donations */}
            {activeTab === 'my-donations' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">
                            My Donations
                            {filteredDonations.length !== donations.length && (
                                <span className="text-sm text-gray-500 ml-2">
                                    (Showing {filteredDonations.length} of {donations.length})
                                </span>
                            )}
                        </h2>
                        {filteredDonations.length > 0 && (
                            <span className="text-sm text-gray-400">
                                {filteredDonations.length} donation{filteredDonations.length > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                    {filteredDonations.length === 0 ? (
                        <p className="text-center py-8 text-gray-400">
                            {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' || filterCity !== 'all' || filterDateFrom || filterDateTo
                                ? 'No donations match your search criteria. Try adjusting your filters.'
                                : "You haven't made any donations yet. Click 'Donate Now' to get started!"}
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {filteredDonations.map((donation) => (
                                <div key={donation._id} className="border rounded-lg p-4 hover:shadow-md transition">
                                    <div className="flex justify-between items-start flex-wrap gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3 className="font-bold">Donation #{donation._id?.slice(-6)}</h3>
                                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(donation.status)}`}>
                                                    {donation.status}
                                                </span>
                                                {donation.collectionAddress?.city && (
                                                    <span className="text-sm text-gray-400">📍 {donation.collectionAddress.city}</span>
                                                )}
                                                {/* ✅ Show rating if completed */}
                                                {donation.status === 'distributed' && (
                                                    <button
                                                        className="text-sm text-yellow-500 hover:text-yellow-600"
                                                        onClick={() => openRatingModal(donation)}
                                                    >
                                                        {donation.rating ? (
                                                            renderStars(donation.rating)
                                                        ) : (
                                                            '⭐ Rate'
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-600 mt-2">
                                                <p><strong>Items:</strong> {donation.items?.map(i => `${i.quantity}x ${i.type}`).join(', ')}</p>
                                                <p><strong>Category:</strong> {donation.items?.[0]?.category || 'N/A'}</p>
                                                <p><strong>NGO:</strong> {donation.ngoId?.name || 'Not assigned yet'}</p>
                                                {donation.scheduledDate && (
                                                    <p><strong>📅 Scheduled:</strong> {new Date(donation.scheduledDate).toLocaleDateString()} at {donation.scheduledTime}</p>
                                                )}
                                                {donation.isRecurring && (
                                                    <p><strong>🔄 Recurring:</strong> {donation.recurringFrequency} until {new Date(donation.recurringEndDate).toLocaleDateString()}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {donation.status === 'pending' && (
                                                <button
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                                                    onClick={() => handleScheduleDonation(donation)}
                                                >
                                                    📅 Schedule
                                                </button>
                                            )}
                                            {donation.status === 'distributed' && !donation.rating && (
                                                <button
                                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition"
                                                    onClick={() => openRatingModal(donation)}
                                                >
                                                    ⭐ Rate
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* NGOs */}
            {activeTab === 'ngos' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Verified NGOs</h2>
                    {ngos.length === 0 ? (
                        <p className="text-center py-8 text-gray-400">No NGOs available.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ngos.map((ngo) => {
                                const ngoBeneficiaries = getBeneficiariesForNGO(ngo._id);
                                return (
                                    <div key={ngo._id} className="border rounded-lg p-4 hover:shadow-md transition">
                                        <h3 className="font-bold text-lg">{ngo.organizationName || ngo.name}</h3>
                                        <p className="text-sm text-gray-600">📧 {ngo.email}</p>
                                        {ngo.phone && <p className="text-sm text-gray-600">📱 {ngo.phone}</p>}
                                        {ngo.address && <p className="text-sm text-gray-600">📍 {ngo.address}</p>}
                                        {ngo.website && (
                                            <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:underline">
                                                🌐 {ngo.website}
                                            </a>
                                        )}
                                        {ngo.description && <p className="text-sm text-gray-600 mt-2">{ngo.description}</p>}
                                        
                                        {/* ✅ Show NGO Rating */}
                                        {ngo.rating && (
                                            <div className="mt-2 flex items-center gap-2">
                                                {renderStars(ngo.rating)}
                                                <span className="text-xs text-gray-500">({ngo.rating})</span>
                                            </div>
                                        )}
                                        
                                        <div className="mt-3 flex items-center gap-3 flex-wrap">
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                👥 {ngoBeneficiaries.length} Beneficiaries
                                            </span>
                                            <span className="inline-block text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">✅ Verified</span>
                                        </div>
                                        
                                        {ngoBeneficiaries.length > 0 && (
                                            <button
                                                className="mt-2 bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition"
                                                onClick={() => handleViewNGOBeneficiaries(ngo)}
                                            >
                                                👁️ View Beneficiaries
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ============ DONOR-NGO MATCHING TAB ============ */}
            {activeTab === 'matching' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">🎯 Best Match NGOs</h2>
                        <div className="flex gap-2 items-center">
                            <select
                                className="border rounded-lg px-3 py-1 text-sm"
                                value={matchPreferences.city}
                                onChange={(e) => {
                                    setMatchPreferences(prev => ({ ...prev, city: e.target.value }));
                                    findMatchingNGOs();
                                }}
                            >
                                <option value="all">All Cities</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                            <button
                                className="bg-purple-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-purple-700 transition"
                                onClick={() => {
                                    setMatchPreferences({
                                        category: 'all',
                                        city: 'all',
                                        distance: 50,
                                        rating: 0
                                    });
                                    findMatchingNGOs();
                                }}
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {userLocation && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-green-700">📍 Matching NGOs near your location</p>
                        </div>
                    )}

                    {matchedNGOs.length === 0 ? (
                        <p className="text-center py-8 text-gray-400">No matching NGOs found. Try adjusting your filters.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {matchedNGOs.map((ngo, index) => {
                                const ngoBeneficiaries = getBeneficiariesForNGO(ngo._id);
                                const matchScore = Math.floor(Math.random() * 40) + 60; // Simulated match score
                                
                                return (
                                    <div key={ngo._id} className="border rounded-lg p-4 hover:shadow-md transition relative">
                                        {index === 0 && (
                                            <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                                                🏆 Best Match
                                            </span>
                                        )}
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg">{ngo.organizationName || ngo.name}</h3>
                                            <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                                                {matchScore}% Match
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">📧 {ngo.email}</p>
                                        {ngo.phone && <p className="text-sm text-gray-600">📱 {ngo.phone}</p>}
                                        {ngo.address && <p className="text-sm text-gray-600">📍 {ngo.address}</p>}
                                        
                                        {/* ✅ Show NGO Rating */}
                                        {ngo.rating && (
                                            <div className="mt-2 flex items-center gap-2">
                                                {renderStars(ngo.rating)}
                                                <span className="text-xs text-gray-500">({ngo.rating})</span>
                                            </div>
                                        )}
                                        
                                        <div className="mt-3 flex items-center gap-3 flex-wrap">
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                👥 {ngoBeneficiaries.length} Beneficiaries
                                            </span>
                                            <span className="inline-block text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">✅ Verified</span>
                                        </div>
                                        
                                        <div className="mt-3 flex gap-2">
                                            <button
                                                className="bg-purple-600 text-white px-4 py-1 rounded text-sm hover:bg-purple-700 transition"
                                                onClick={() => {
                                                    setDonationForm(prev => ({ ...prev, ngoId: ngo._id }));
                                                    setActiveTab('my-donations');
                                                    setShowDonationModal(true);
                                                }}
                                            >
                                                🎁 Donate
                                            </button>
                                            {ngoBeneficiaries.length > 0 && (
                                                <button
                                                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                                                    onClick={() => handleViewNGOBeneficiaries(ngo)}
                                                >
                                                    👁️ View Beneficiaries
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* NGO Beneficiaries Modal */}
            {showNGOBeneficiaries && selectedNGO && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">
                                👥 Beneficiaries of {selectedNGO.organizationName || selectedNGO.name}
                            </h2>
                            <button
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                                onClick={() => setShowNGOBeneficiaries(false)}
                            >
                                ✕
                            </button>
                        </div>
                        
                        {getBeneficiariesForNGO(selectedNGO._id).length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No beneficiaries for this NGO</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {getBeneficiariesForNGO(selectedNGO._id).map((b) => (
                                    <div key={b._id} className="border rounded-lg p-4 hover:shadow-md transition">
                                        <h3 className="font-bold text-lg">{b.name}</h3>
                                        <p className="text-sm text-gray-600">📧 {b.email}</p>
                                        {b.phone && <p className="text-sm text-gray-600">📱 {b.phone}</p>}
                                        {b.address && <p className="text-sm text-gray-600">📍 {b.address}</p>}
                                        {b.need && <p className="text-sm text-gray-600">💡 Need: {b.need}</p>}
                                        {b.familyMembers > 1 && (
                                            <p className="text-sm text-gray-600">👨‍👩‍👧‍👦 Family: {b.familyMembers} members</p>
                                        )}
                                        <div className="mt-2">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                b.status === 'active' ? 'bg-green-100 text-green-800' :
                                                b.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {b.status || 'Active'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <div className="mt-4">
                            <button
                                className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                onClick={() => setShowNGOBeneficiaries(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============ RATING MODAL ============ */}
            {showRatingModal && ratingDonation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">⭐ Rate Your Donation</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                                onClick={() => {
                                    setShowRatingModal(false);
                                    setRatingDonation(null);
                                }}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <p className="text-gray-600 mb-4">
                            Rate your experience with <strong>{ratingDonation.ngoId?.name || 'NGO'}</strong>
                        </p>
                        
                        {/* Star Rating */}
                        <div className="flex justify-center gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className="text-4xl transition-transform hover:scale-110"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRatingValue(star)}
                                >
                                    <span className={(star <= (hoverRating || ratingValue)) ? 'text-yellow-400' : 'text-gray-300'}>
                                        ★
                                    </span>
                                </button>
                            ))}
                        </div>
                        
                        <div className="text-center text-sm text-gray-500 mb-4">
                            {ratingValue > 0 && (
                                <span>
                                    {ratingValue === 1 && '😞 Poor'}
                                    {ratingValue === 2 && '😕 Fair'}
                                    {ratingValue === 3 && '😊 Good'}
                                    {ratingValue === 4 && '😄 Very Good'}
                                    {ratingValue === 5 && '🌟 Excellent'}
                                </span>
                            )}
                        </div>
                        
                        <textarea
                            placeholder="Share your experience (optional)"
                            className="w-full border rounded-lg px-4 py-2 h-24 resize-none"
                            value={ratingComment}
                            onChange={(e) => setRatingComment(e.target.value)}
                        />
                        
                        <div className="flex gap-3 mt-4">
                            <button
                                className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                                onClick={submitRating}
                            >
                                Submit Rating
                            </button>
                            <button
                                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                onClick={() => {
                                    setShowRatingModal(false);
                                    setRatingDonation(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Donation Modal */}
            {showDonationModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">📦 Donate Now</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                                onClick={() => setShowDonationModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Items */}
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-2">Items to Donate *</label>
                            {donationForm.items.map((item, index) => (
                                <div key={index} className="border rounded-lg p-4 mb-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">Item {index + 1}</span>
                                        {donationForm.items.length > 1 && (
                                            <button
                                                className="text-red-500 hover:text-red-700 text-sm"
                                                onClick={() => handleRemoveItem(index)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Item type *"
                                            className="border rounded-lg px-3 py-2"
                                            value={item.type}
                                            onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Quantity"
                                            className="border rounded-lg px-3 py-2"
                                            value={item.quantity}
                                            min="1"
                                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                        />
                                        <select
                                            className="border rounded-lg px-3 py-2"
                                            value={item.category}
                                            onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                                        >
                                            <option value="clothing">👕 Clothing</option>
                                            <option value="household">🏠 Household</option>
                                            <option value="books">📚 Books</option>
                                            <option value="electronics">💻 Electronics</option>
                                            <option value="furniture">🪑 Furniture</option>
                                            <option value="other">📦 Other</option>
                                        </select>
                                        <select
                                            className="border rounded-lg px-3 py-2"
                                            value={item.condition}
                                            onChange={(e) => handleItemChange(index, 'condition', e.target.value)}
                                        >
                                            <option value="new">✨ New</option>
                                            <option value="good">👍 Good</option>
                                            <option value="fair">👌 Fair</option>
                                            <option value="poor">😕 Poor</option>
                                        </select>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Description (optional)"
                                        className="w-full border rounded-lg px-3 py-2 mt-2"
                                        value={item.description}
                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                    />
                                </div>
                            ))}
                            <button
                                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                onClick={handleAddItem}
                            >
                                ➕ Add Another Item
                            </button>
                        </div>

                        {/* Address */}
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-2">Collection Address *</label>
                            <input
                                type="text"
                                placeholder="Street"
                                className="w-full border rounded-lg px-3 py-2 mb-2"
                                value={donationForm.street}
                                onChange={(e) => setDonationForm({ ...donationForm, street: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="City *"
                                    className="border rounded-lg px-3 py-2"
                                    value={donationForm.city}
                                    onChange={(e) => setDonationForm({ ...donationForm, city: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="State *"
                                    className="border rounded-lg px-3 py-2"
                                    value={donationForm.state}
                                    onChange={(e) => setDonationForm({ ...donationForm, state: e.target.value })}
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Pincode"
                                className="w-full border rounded-lg px-3 py-2 mt-2"
                                value={donationForm.pincode}
                                onChange={(e) => setDonationForm({ ...donationForm, pincode: e.target.value })}
                            />
                        </div>

                        {/* Schedule */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={donationForm.scheduledDate}
                                    onChange={(e) => setDonationForm({ ...donationForm, scheduledDate: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Time</label>
                                <input
                                    type="time"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={donationForm.scheduledTime}
                                    onChange={(e) => setDonationForm({ ...donationForm, scheduledTime: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* NGO Selection */}
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-1">Select NGO (Optional)</label>
                            <select
                                className="w-full border rounded-lg px-3 py-2"
                                value={donationForm.ngoId}
                                onChange={(e) => setDonationForm({ ...donationForm, ngoId: e.target.value })}
                            >
                                <option value="">Any NGO</option>
                                {ngos.map((ngo) => (
                                    <option key={ngo._id} value={ngo._id}>
                                        {ngo.organizationName || ngo.name} ({getBeneficiariesForNGO(ngo._id).length} beneficiaries)
                                        {ngo.rating && ` ⭐${ngo.rating}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Recurring Donation */}
                        <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isRecurring}
                                    onChange={(e) => setIsRecurring(e.target.checked)}
                                    className="w-4 h-4 text-purple-600"
                                />
                                <span className="font-medium text-gray-700">🔄 Make this a recurring donation</span>
                            </label>

                            {isRecurring && (
                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <div>
                                        <label className="block font-medium text-gray-700 mb-1">Frequency</label>
                                        <select
                                            className="w-full border rounded-lg px-3 py-2"
                                            value={recurringFrequency}
                                            onChange={(e) => setRecurringFrequency(e.target.value)}
                                        >
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-medium text-gray-700 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            className="w-full border rounded-lg px-3 py-2"
                                            value={recurringEndDate}
                                            onChange={(e) => setRecurringEndDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Messages */}
                        <div className="mb-4">
                            <textarea
                                placeholder="Special Instructions (Optional)"
                                className="w-full border rounded-lg px-3 py-2 h-20"
                                value={donationForm.specialInstructions}
                                onChange={(e) => setDonationForm({ ...donationForm, specialInstructions: e.target.value })}
                            />
                            <textarea
                                placeholder="Message to NGO (Optional)"
                                className="w-full border rounded-lg px-3 py-2 h-20 mt-2"
                                value={donationForm.donorMessage}
                                onChange={(e) => setDonationForm({ ...donationForm, donorMessage: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                                onClick={handleDonationSubmit}
                            >
                                {isRecurring ? '🔄 Schedule Recurring Donation' : '🎁 Donate Now'}
                            </button>
                            <button
                                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                onClick={() => setShowDonationModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Schedule Modal */}
            {showScheduleModal && selectedDonation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold">📅 Schedule Pickup</h2>
                        <p className="text-gray-600 mb-4">Donation #{selectedDonation._id?.slice(-6)}</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Pickup Date *</label>
                                <input
                                    type="date"
                                    className="w-full border rounded-lg px-4 py-2"
                                    value={scheduleDate}
                                    onChange={(e) => setScheduleDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Pickup Time *</label>
                                <input
                                    type="time"
                                    className="w-full border rounded-lg px-4 py-2"
                                    value={scheduleTime}
                                    onChange={(e) => setScheduleTime(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                    onClick={handleConfirmSchedule}
                                >
                                    ✅ Confirm
                                </button>
                                <button
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                    onClick={() => setShowScheduleModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonorDashboard;