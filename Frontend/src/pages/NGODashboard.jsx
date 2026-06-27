import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const NGODashboard = () => {
    const [pendingDonations, setPendingDonations] = useState([]);
    const [acceptedDonations, setAcceptedDonations] = useState([]);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingBeneficiary, setEditingBeneficiary] = useState(null);
    const [beneficiaryData, setBeneficiaryData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        need: '',
        familyMembers: 1,
        income: '',
        notes: ''
    });
    const [activeTab, setActiveTab] = useState('pending');

    // ============ SEARCH & FILTER STATE ============
    const [searchTerm, setSearchTerm] = useState('');
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

    // ============ ANALYTICS STATE ============
    const [analyticsData, setAnalyticsData] = useState({
        totalDonations: 0,
        totalBeneficiaries: 0,
        completionRate: 0,
        monthlyTrends: [],
        topDonors: []
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isNGO = user.role === 'ngo';

    useEffect(() => {
        if (isNGO) {
            fetchAllData();
            calculateAnalytics();
        } else {
            setLoading(false);
            toast.warning('Please login as NGO');
        }
    }, []);

    // ✅ Extract cities from donations
    useEffect(() => {
        const allDonations = [...pendingDonations, ...acceptedDonations];
        const cityList = allDonations
            .map(d => d.collectionAddress?.city)
            .filter(c => c && c.length > 0);
        setCities([...new Set(cityList)]);
    }, [pendingDonations, acceptedDonations]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            
            // Get pending donations
            const pendingRes = await api.get('/donations/pending');
            setPendingDonations(pendingRes.data.donations || []);
            
            // Get all donations (for accepted)
            const allRes = await api.get('/donations');
            const allDonations = allRes.data.donations || [];
            setAcceptedDonations(allDonations.filter(d => d.status !== 'pending'));
            
            // Get beneficiaries
            const benRes = await api.get('/beneficiaries');
            setBeneficiaries(benRes.data.beneficiaries || []);
            
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    // ============ ANALYTICS CALCULATION ============
    const calculateAnalytics = () => {
        const allDonations = [...pendingDonations, ...acceptedDonations];
        const total = allDonations.length;
        const completed = allDonations.filter(d => d.status === 'distributed').length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Monthly trends
        const monthlyData = {};
        allDonations.forEach(d => {
            const month = new Date(d.createdAt).getMonth();
            monthlyData[month] = (monthlyData[month] || 0) + 1;
        });

        const monthlyTrends = Object.entries(monthlyData).map(([month, count]) => ({
            month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(month)],
            count
        }));

        // Top donors
        const donorCounts = {};
        allDonations.forEach(d => {
            const name = d.donorId?.name || 'Unknown';
            donorCounts[name] = (donorCounts[name] || 0) + 1;
        });

        const topDonors = Object.entries(donorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        setAnalyticsData({
            totalDonations: total,
            totalBeneficiaries: beneficiaries.length,
            completionRate,
            monthlyTrends,
            topDonors
        });
    };

    // ============ FILTER DONATIONS ============
    const getFilteredDonations = (donations) => {
        let filtered = [...donations];

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(d =>
                d.items?.some(i => i.type.toLowerCase().includes(term)) ||
                d.donorId?.name?.toLowerCase().includes(term) ||
                d.donorId?.email?.toLowerCase().includes(term)
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

        return filtered;
    };

    const resetFilters = () => {
        setSearchTerm('');
        setFilterStatus('all');
        setFilterCity('all');
        setFilterDateFrom('');
        setFilterDateTo('');
    };

    // ============ BENEFICIARY CRUD ============
    const handleAddBeneficiary = async () => {
        if (!beneficiaryData.name || !beneficiaryData.email) {
            toast.warning('Name and email are required');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/beneficiaries', beneficiaryData, {
                headers: { 'x-auth-token': token }
            });
            if (response.data.success) {
                toast.success('Beneficiary added successfully!');
                setShowAddModal(false);
                setBeneficiaryData({ 
                    name: '', 
                    email: '', 
                    phone: '', 
                    address: '', 
                    need: '',
                    familyMembers: 1,
                    income: '',
                    notes: ''
                });
                fetchAllData();
                calculateAnalytics();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add beneficiary');
        }
    };

    const handleEditBeneficiary = (beneficiary) => {
        setEditingBeneficiary(beneficiary);
        setBeneficiaryData({
            name: beneficiary.name,
            email: beneficiary.email,
            phone: beneficiary.phone || '',
            address: beneficiary.address || '',
            need: beneficiary.need || '',
            familyMembers: beneficiary.familyMembers || 1,
            income: beneficiary.income || '',
            notes: beneficiary.notes || ''
        });
        setShowEditModal(true);
    };

    const handleUpdateBeneficiary = async () => {
        if (!beneficiaryData.name || !beneficiaryData.email) {
            toast.warning('Name and email are required');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await api.put(`/beneficiaries/${editingBeneficiary._id}`, beneficiaryData, {
                headers: { 'x-auth-token': token }
            });
            if (response.data.success) {
                toast.success('Beneficiary updated successfully!');
                setShowEditModal(false);
                setEditingBeneficiary(null);
                setBeneficiaryData({ 
                    name: '', 
                    email: '', 
                    phone: '', 
                    address: '', 
                    need: '',
                    familyMembers: 1,
                    income: '',
                    notes: ''
                });
                fetchAllData();
                calculateAnalytics();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update beneficiary');
        }
    };

    const deleteBeneficiary = async (id) => {
        if (window.confirm('Are you sure you want to delete this beneficiary?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await api.delete(`/beneficiaries/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                if (response.data.success) {
                    toast.success('Beneficiary deleted successfully!');
                    fetchAllData();
                    calculateAnalytics();
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete beneficiary');
            }
        }
    };

    // ============ DONATION ACTIONS ============
    const handleAcceptDonation = async (id) => {
        try {
            await api.put(`/donations/${id}/accept`);
            toast.success('Donation accepted!');
            fetchAllData();
            calculateAnalytics();
        } catch (error) {
            toast.error('Failed to accept donation');
        }
    };

    const handleCollectDonation = async (id) => {
        try {
            await api.put(`/donations/${id}/collect`);
            toast.success('Donation collected!');
            fetchAllData();
            calculateAnalytics();
        } catch (error) {
            toast.error('Failed to collect donation');
        }
    };

    const handleDistributeDonation = async (id) => {
        try {
            await api.put(`/donations/${id}/distribute`);
            toast.success('Donation distributed!');
            fetchAllData();
            calculateAnalytics();
        } catch (error) {
            toast.error('Failed to distribute donation');
        }
    };

    // ============ EXPORT DATA ============
    const exportData = (format, type) => {
        try {
            let data = [];
            let headers = [];
            let filename = '';

            if (type === 'donations') {
                data = [...pendingDonations, ...acceptedDonations];
                headers = ['ID', 'Donor', 'Items', 'Status', 'City', 'Date'];
                filename = 'donations';
            } else if (type === 'beneficiaries') {
                data = beneficiaries;
                headers = ['Name', 'Email', 'Phone', 'Address', 'Need', 'Family Members'];
                filename = 'beneficiaries';
            } else {
                toast.warning('Please select data to export');
                return;
            }

            if (data.length === 0) {
                toast.warning('No data to export');
                return;
            }

            if (format === 'csv') {
                let csv = headers.join(',') + '\n';
                data.forEach(item => {
                    if (type === 'donations') {
                        csv += `${item._id?.slice(-6)},${item.donorId?.name || 'Unknown'},${item.items?.length || 0},${item.status},${item.collectionAddress?.city || 'N/A'},${new Date(item.createdAt).toLocaleDateString()}\n`;
                    } else if (type === 'beneficiaries') {
                        csv += `${item.name},${item.email},${item.phone || 'N/A'},${item.address || 'N/A'},${item.need || 'N/A'},${item.familyMembers || 1}\n`;
                    }
                });
                
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success(`Exported ${data.length} records as CSV`);
            }
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export data');
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            accepted: 'bg-blue-100 text-blue-800',
            collected: 'bg-purple-100 text-purple-800',
            distributed: 'bg-green-100 text-green-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!isNGO) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                <div className="bg-white rounded-xl shadow-md p-8">
                    <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
                    <p className="text-gray-600">Please login as an NGO</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">NGO Dashboard</h1>
                <p className="text-gray-600">Welcome, {user.organizationName || user.name}!</p>
                <div className="flex flex-wrap gap-4 mt-2">
                    {user.isVerified && (
                        <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">✅ Verified</span>
                    )}
                    <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                        📦 {acceptedDonations.length} Active
                    </span>
                    <button 
                        className="text-purple-600 bg-purple-50 px-3 py-1 rounded-full text-sm hover:bg-purple-100"
                        onClick={() => setShowAddModal(true)}
                    >
                        ➕ Add Beneficiary
                    </button>
                </div>
            </div>

            {/* ============ SEARCH & FILTERS ============ */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="🔍 Search by item, donor..."
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
                </div>

                {showFilters && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
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
                    className={`py-2 px-4 font-medium ${activeTab === 'pending' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending ({pendingDonations.length})
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'accepted' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('accepted')}
                >
                    Active ({acceptedDonations.length})
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'beneficiaries' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('beneficiaries')}
                >
                    👥 Beneficiaries ({beneficiaries.length})
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'analytics' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('analytics')}
                >
                    📊 Analytics
                </button>
            </div>

            {/* Pending Donations */}
            {activeTab === 'pending' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Pending Donations</h2>
                        <button
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                            onClick={() => exportData('csv', 'donations')}
                        >
                            📥 Export CSV
                        </button>
                    </div>
                    {getFilteredDonations(pendingDonations).length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            {searchTerm || filterStatus !== 'all' || filterCity !== 'all' || filterDateFrom || filterDateTo
                                ? 'No donations match your filters'
                                : 'No pending donations'}
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {getFilteredDonations(pendingDonations).map((d) => (
                                <div key={d._id} className="border rounded-lg p-4 hover:shadow-md transition">
                                    <p className="font-bold">{d.donorId?.name || 'Unknown'}</p>
                                    <p className="text-sm text-gray-600">
                                        {d.items?.map(i => `${i.quantity}x ${i.type}`).join(', ')}
                                    </p>
                                    {d.collectionAddress?.city && (
                                        <p className="text-sm text-gray-400">📍 {d.collectionAddress.city}</p>
                                    )}
                                    <button 
                                        className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                                        onClick={() => handleAcceptDonation(d._id)}
                                    >
                                        Accept
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Active Donations */}
            {activeTab === 'accepted' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Active Donations</h2>
                        <button
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                            onClick={() => exportData('csv', 'donations')}
                        >
                            📥 Export CSV
                        </button>
                    </div>
                    {getFilteredDonations(acceptedDonations).length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            {searchTerm || filterStatus !== 'all' || filterCity !== 'all' || filterDateFrom || filterDateTo
                                ? 'No donations match your filters'
                                : 'No active donations'}
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {getFilteredDonations(acceptedDonations).map((d) => (
                                <div key={d._id} className="border rounded-lg p-4">
                                    <div className="flex justify-between">
                                        <p className="font-bold">{d.donorId?.name || 'Unknown'}</p>
                                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(d.status)}`}>
                                            {d.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {d.items?.map(i => `${i.quantity}x ${i.type}`).join(', ')}
                                    </p>
                                    {d.collectionAddress?.city && (
                                        <p className="text-sm text-gray-400">📍 {d.collectionAddress.city}</p>
                                    )}
                                    <div className="mt-2 flex gap-2 flex-wrap">
                                        {d.status === 'accepted' && (
                                            <button
                                                className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                                                onClick={() => handleCollectDonation(d._id)}
                                            >
                                                📦 Collect
                                            </button>
                                        )}
                                        {d.status === 'collected' && (
                                            <button
                                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                                onClick={() => handleDistributeDonation(d._id)}
                                            >
                                                🎯 Distribute
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Beneficiaries */}
            {activeTab === 'beneficiaries' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">👥 Beneficiaries</h2>
                        <div className="flex gap-2">
                            <button 
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                                onClick={() => setShowAddModal(true)}
                            >
                                ➕ Add Beneficiary
                            </button>
                            <button
                                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                                onClick={() => exportData('csv', 'beneficiaries')}
                            >
                                📥 Export CSV
                            </button>
                        </div>
                    </div>
                    
                    {beneficiaries.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No beneficiaries added yet</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {beneficiaries.map((b) => (
                                <div key={b._id} className="border rounded-lg p-4 hover:shadow-md transition relative">
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 text-xs bg-blue-50 px-2 py-1 rounded"
                                            onClick={() => handleEditBeneficiary(b)}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700 text-xs bg-red-50 px-2 py-1 rounded"
                                            onClick={() => deleteBeneficiary(b._id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                    <h3 className="font-bold text-lg">{b.name}</h3>
                                    <p className="text-sm text-gray-600">📧 {b.email}</p>
                                    {b.phone && <p className="text-sm text-gray-600">📱 {b.phone}</p>}
                                    {b.address && <p className="text-sm text-gray-600">📍 {b.address}</p>}
                                    {b.need && <p className="text-sm text-gray-600">💡 Need: {b.need}</p>}
                                    {b.familyMembers > 1 && (
                                        <p className="text-sm text-gray-600">👨‍👩‍👧‍👦 Family: {b.familyMembers} members</p>
                                    )}
                                    {b.income && <p className="text-sm text-gray-600">💰 Income: {b.income}</p>}
                                    {b.notes && <p className="text-sm text-gray-600">📝 {b.notes}</p>}
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
                </div>
            )}

            {/* Analytics */}
            {activeTab === 'analytics' && (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-md p-6 text-center">
                            <h4 className="text-sm text-gray-500">Total Donations</h4>
                            <p className="text-3xl font-bold text-gray-800">{analyticsData.totalDonations}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 text-center">
                            <h4 className="text-sm text-gray-500">Beneficiaries</h4>
                            <p className="text-3xl font-bold text-gray-800">{analyticsData.totalBeneficiaries}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 text-center">
                            <h4 className="text-sm text-gray-500">Completion Rate</h4>
                            <p className="text-3xl font-bold text-green-600">{analyticsData.completionRate}%</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 text-center">
                            <h4 className="text-sm text-gray-500">Active Donations</h4>
                            <p className="text-3xl font-bold text-blue-600">{acceptedDonations.length}</p>
                        </div>
                    </div>

                    {/* Monthly Trends */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold mb-4">📈 Monthly Donation Trends</h3>
                        <div className="grid grid-cols-6 gap-2">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
                                const data = analyticsData.monthlyTrends.find(t => t.month === month);
                                const count = data?.count || 0;
                                const maxCount = Math.max(1, ...analyticsData.monthlyTrends.map(t => t.count));
                                const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                                return (
                                    <div key={month} className="text-center">
                                        <div className="flex justify-center items-end h-20">
                                            <div 
                                                className="w-8 bg-purple-500 rounded-t transition-all duration-500 hover:bg-purple-600"
                                                style={{ height: `${Math.max(5, height)}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1">{month}</span>
                                        <span className="block text-xs font-bold">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Top Donors */}
                    {analyticsData.topDonors.length > 0 && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-bold mb-4">🏆 Top Donors</h3>
                            <div className="space-y-2">
                                {analyticsData.topDonors.map((donor, index) => (
                                    <div key={donor.name} className="flex items-center gap-3">
                                        <span className="w-8 text-center font-bold text-gray-400">#{index + 1}</span>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm">
                                                <span>{donor.name}</span>
                                                <span>{donor.count} donations</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-purple-500 h-2 rounded-full"
                                                    style={{ width: `${(donor.count / Math.max(1, analyticsData.topDonors[0].count)) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Add Beneficiary Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Add Beneficiary</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                                onClick={() => setShowAddModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name *"
                                className="w-full border rounded-lg px-4 py-2"
                                value={beneficiaryData.name}
                                onChange={(e) => setBeneficiaryData({...beneficiaryData, name: e.target.value})}
                            />
                            <input
                                type="email"
                                placeholder="Email *"
                                className="w-full border rounded-lg px-4 py-2"
                                value={beneficiaryData.email}
                                onChange={(e) => setBeneficiaryData({...beneficiaryData, email: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Phone"
                                className="w-full border rounded-lg px-4 py-2"
                                value={beneficiaryData.phone}
                                onChange={(e) => setBeneficiaryData({...beneficiaryData, phone: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                className="w-full border rounded-lg px-4 py-2"
                                value={beneficiaryData.address}
                                onChange={(e) => setBeneficiaryData({...beneficiaryData, address: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Need"
                                className="w-full border rounded-lg px-4 py-2"
                                value={beneficiaryData.need}
                                onChange={(e) => setBeneficiaryData({...beneficiaryData, need: e.target.value})}
                            />
                            <input
                                type="number"
                                placeholder="Family Members"
                                className="w-full border rounded-lg px-4 py-2"
                                value={beneficiaryData.familyMembers}
                                onChange={(e) => setBeneficiaryData({...beneficiaryData, familyMembers: parseInt(e.target.value) || 1})}
                                min="1"
                            />
                            <input
                                type="text"
                                placeholder="Income"
                                className="w-full border rounded-lg px-4 py-2"
                                value={beneficiaryData.income}
                                onChange={(e) => setBeneficiaryData({...beneficiaryData, income: e.target.value})}
                            />
                            <textarea
                                placeholder="Notes"
                                className="w-full border rounded-lg px-4 py-2 h-20"
                                value={beneficiaryData.notes}
                                onChange={(e) => setBeneficiaryData({...beneficiaryData, notes: e.target.value})}
                            />
                            <div className="flex gap-3">
                                <button 
                                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                                    onClick={handleAddBeneficiary}
                                >
                                    Add
                                </button>
                                <button 
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Beneficiary Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Edit Beneficiary</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                                onClick={() => setShowEditModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name *"
                                className="w-full border rounded-lg px-4 py-2"
                                value={beneficiaryData.name}
                                onChange={(e) => setBeneficiaryData({...beneficiaryData, name: e.target.value})}
                            />
                            <input
                                type="email"
                                placeholder="Email *"
                                className="w-full border rounded-lg px-4 py-2"
                                value={beneficiaryData.email}
                                onChange={(e) => setBeneficiaryData({...beneficiaryData, email: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Phone"
                                className="w-full border rounded-lg px-4 py-2"
                                value={beneficiaryData.phone}
                                onChange={(e) => setBeneficiaryData({...beneficiaryData, phone: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                className="w-full border rounded-lg px-4 py-2"
                                value={beneficiaryData.address}
                                onChange={(e) => setBeneficiaryData({...beneficiaryData, address: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Need"
                                className="w-full border rounded-lg px-4 py-2"
                                value={beneficiaryData.need}
                                onChange={(e) => setBeneficiaryData({...beneficiaryData, need: e.target.value})}
                            />
                            <input
                                type="number"
                                placeholder="Family Members"
                                className="w-full border rounded-lg px-4 py-2"
                                value={beneficiaryData.familyMembers}
                                onChange={(e) => setBeneficiaryData({...beneficiaryData, familyMembers: parseInt(e.target.value) || 1})}
                                min="1"
                            />
                            <input
                                type="text"
                                placeholder="Income"
                                className="w-full border rounded-lg px-4 py-2"
                                value={beneficiaryData.income}
                                onChange={(e) => setBeneficiaryData({...beneficiaryData, income: e.target.value})}
                            />
                            <textarea
                                placeholder="Notes"
                                className="w-full border rounded-lg px-4 py-2 h-20"
                                value={beneficiaryData.notes}
                                onChange={(e) => setBeneficiaryData({...beneficiaryData, notes: e.target.value})}
                            />
                            <div className="flex gap-3">
                                <button 
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={handleUpdateBeneficiary}
                                >
                                    Update
                                </button>
                                <button 
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                                    onClick={() => setShowEditModal(false)}
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

export default NGODashboard;