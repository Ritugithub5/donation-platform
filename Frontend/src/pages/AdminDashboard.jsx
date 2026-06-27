import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [categories, setCategories] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [stats, setStats] = useState({
        totalDonors: 0,
        totalNGOs: 0,
        totalDonations: 0,
        pendingDonations: 0,
        completedDonations: 0,
        totalBeneficiaries: 0,
        totalRatings: 0,
        averageRating: 0
    });

    // ============ SEARCH & FILTER STATE ============
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRating, setFilterRating] = useState('all');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [filteredRatings, setFilteredRatings] = useState([]);

    // Category Modal
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryFormData, setCategoryFormData] = useState({
        name: '',
        icon: '📦',
        description: '',
        isActive: true
    });
    const [submitting, setSubmitting] = useState(false);

    // Complaint Modal
    const [showComplaintModal, setShowComplaintModal] = useState(false);
    const [complaintTitle, setComplaintTitle] = useState('');
    const [complaintDescription, setComplaintDescription] = useState('');
    const [editingComplaint, setEditingComplaint] = useState(null);
    const [complaintSubmitting, setComplaintSubmitting] = useState(false);

    // Export Modal
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFormat, setExportFormat] = useState('csv');
    const [exporting, setExporting] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    useEffect(() => {
        if (isAdmin) {
            fetchAllData();
        } else {
            setLoading(false);
            toast.warning('Please login as Admin');
        }
    }, []);

    // Apply filters whenever data or filter changes
    useEffect(() => {
        applyFilters();
    }, [users, donations, ratings, searchTerm, filterRole, filterStatus, filterRating, filterDateFrom, filterDateTo]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            
            // Fetch users
            const usersRes = await api.get('/admin/users');
            if (usersRes.data && usersRes.data.users) {
                setUsers(usersRes.data.users);
                setFilteredUsers(usersRes.data.users);
            }

            // Fetch donations
            const donationsRes = await api.get('/admin/donations');
            if (donationsRes.data && donationsRes.data.donations) {
                setDonations(donationsRes.data.donations);
                setFilteredDonations(donationsRes.data.donations);
            }

            // Fetch complaints
            const complaintsRes = await api.get('/admin/complaints');
            if (complaintsRes.data && complaintsRes.data.complaints) {
                setComplaints(complaintsRes.data.complaints);
            }

            // Fetch stats
            const statsRes = await api.get('/admin/stats');
            if (statsRes.data && statsRes.data.stats) {
                setStats(statsRes.data.stats);
            }

            // Fetch categories
            const categoriesRes = await api.get('/categories');
            if (categoriesRes.data && categoriesRes.data.categories) {
                setCategories(categoriesRes.data.categories);
            } else if (Array.isArray(categoriesRes.data)) {
                setCategories(categoriesRes.data);
            } else {
                setCategories([]);
            }

            // ✅ Fetch ratings
            const ratingsRes = await api.get('/admin/ratings');
            if (ratingsRes.data && ratingsRes.data.ratings) {
                setRatings(ratingsRes.data.ratings);
                setFilteredRatings(ratingsRes.data.ratings);
            } else if (Array.isArray(ratingsRes.data)) {
                setRatings(ratingsRes.data);
                setFilteredRatings(ratingsRes.data);
            } else {
                setRatings([]);
                setFilteredRatings([]);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Apply search and filters
    const applyFilters = () => {
        // Filter Users
        let filteredU = [...users];
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filteredU = filteredU.filter(u =>
                u.name.toLowerCase().includes(term) ||
                u.email.toLowerCase().includes(term)
            );
        }
        if (filterRole !== 'all') {
            filteredU = filteredU.filter(u => u.role === filterRole);
        }
        setFilteredUsers(filteredU);

        // Filter Donations
        let filteredD = [...donations];
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filteredD = filteredD.filter(d =>
                d.donorId?.name?.toLowerCase().includes(term) ||
                d.items?.some(i => i.type.toLowerCase().includes(term))
            );
        }
        if (filterStatus !== 'all') {
            filteredD = filteredD.filter(d => d.status === filterStatus);
        }
        if (filterDateFrom) {
            filteredD = filteredD.filter(d => new Date(d.createdAt) >= new Date(filterDateFrom));
        }
        if (filterDateTo) {
            filteredD = filteredD.filter(d => new Date(d.createdAt) <= new Date(filterDateTo));
        }
        setFilteredDonations(filteredD);

        // ✅ Filter Ratings
        let filteredR = [...ratings];
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filteredR = filteredR.filter(r =>
                r.donorId?.name?.toLowerCase().includes(term) ||
                r.ngoId?.name?.toLowerCase().includes(term) ||
                r.comment?.toLowerCase().includes(term)
            );
        }
        if (filterRating !== 'all') {
            const numRating = parseInt(filterRating);
            filteredR = filteredR.filter(r => r.rating === numRating);
        }
        if (filterDateFrom) {
            filteredR = filteredR.filter(r => new Date(r.createdAt) >= new Date(filterDateFrom));
        }
        if (filterDateTo) {
            filteredR = filteredR.filter(r => new Date(r.createdAt) <= new Date(filterDateTo));
        }
        setFilteredRatings(filteredR);
    };

    // ✅ Reset filters
    const resetFilters = () => {
        setSearchTerm('');
        setFilterRole('all');
        setFilterStatus('all');
        setFilterRating('all');
        setFilterDateFrom('');
        setFilterDateTo('');
        setFilteredUsers(users);
        setFilteredDonations(donations);
        setFilteredRatings(ratings);
    };

    // ============ EXPORT DATA ============
    const handleExport = async () => {
        setExporting(true);
        try {
            let data = [];
            let headers = [];
            let filename = '';

            if (activeTab === 'users') {
                data = filteredUsers;
                headers = ['Name', 'Email', 'Role', 'Phone', 'Verified', 'Joined'];
                filename = 'users';
            } else if (activeTab === 'donations') {
                data = filteredDonations;
                headers = ['ID', 'Donor', 'Items', 'Category', 'Status', 'Date'];
                filename = 'donations';
            } else if (activeTab === 'categories') {
                data = categories;
                headers = ['Name', 'Icon', 'Description', 'Status', 'Items'];
                filename = 'categories';
            } else if (activeTab === 'ratings') {
                data = filteredRatings;
                headers = ['Donor', 'NGO', 'Rating', 'Comment', 'Date'];
                filename = 'ratings';
            } else {
                toast.warning('Please select a tab to export');
                setExporting(false);
                return;
            }

            if (data.length === 0) {
                toast.warning('No data to export');
                setExporting(false);
                return;
            }

            if (exportFormat === 'csv') {
                let csv = headers.join(',') + '\n';
                data.forEach(item => {
                    if (activeTab === 'users') {
                        csv += `${item.name},${item.email},${item.role},${item.phone || 'N/A'},${item.isVerified ? 'Yes' : 'No'},${new Date(item.createdAt).toLocaleDateString()}\n`;
                    } else if (activeTab === 'donations') {
                        csv += `${item._id?.slice(-6)},${item.donorId?.name || 'Unknown'},${item.items?.length || 0},${item.items?.[0]?.category || 'N/A'},${item.status},${new Date(item.createdAt).toLocaleDateString()}\n`;
                    } else if (activeTab === 'categories') {
                        const count = donations.filter(d => d.items?.some(i => i.category === item.name.toLowerCase())).length;
                        csv += `${item.name},${item.icon || '📦'},${item.description || ''},${item.isActive ? 'Active' : 'Inactive'},${count}\n`;
                    } else if (activeTab === 'ratings') {
                        csv += `${item.donorId?.name || 'Unknown'},${item.ngoId?.name || 'Unknown'},${item.rating},${item.comment || 'N/A'},${new Date(item.createdAt).toLocaleDateString()}\n`;
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
                
            } else if (exportFormat === 'json') {
                const json = JSON.stringify(data, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success(`Exported ${data.length} records as JSON`);
            }
            
            setShowExportModal(false);
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export data');
        } finally {
            setExporting(false);
        }
    };

    // ============ CATEGORY MANAGEMENT ============
    const handleAddCategory = () => {
        setEditingCategory(null);
        setCategoryFormData({
            name: '',
            icon: '📦',
            description: '',
            isActive: true
        });
        setShowCategoryModal(true);
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setCategoryFormData({
            name: category.name,
            icon: category.icon || '📦',
            description: category.description || '',
            isActive: category.isActive !== undefined ? category.isActive : true
        });
        setShowCategoryModal(true);
    };

    const handleSubmitCategory = async () => {
        if (!categoryFormData.name.trim()) {
            toast.warning('Category name is required');
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                name: categoryFormData.name.trim(),
                icon: categoryFormData.icon || '📦',
                description: categoryFormData.description || '',
                isActive: categoryFormData.isActive
            };

            if (editingCategory) {
                await api.put(`/categories/${editingCategory._id}`, payload, {
                    headers: { 'x-auth-token': token }
                });
                toast.success('Category updated successfully!');
            } else {
                await api.post('/categories', payload, {
                    headers: { 'x-auth-token': token }
                });
                toast.success('Category added successfully!');
            }
            setShowCategoryModal(false);
            fetchAllData();
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error(error.response?.data?.message || 'Failed to save category');
        } finally {
            setSubmitting(false);
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/categories/${id}`, {
                headers: { 'x-auth-token': token }
            });
            toast.success('Category deleted successfully');
            fetchAllData();
        } catch (error) {
            console.error('Delete category error:', error);
            toast.error('Failed to delete category');
        }
    };

    // ============ USER MANAGEMENT ============
    const deleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await api.delete(`/admin/user/${userId}`, {
                headers: { 'x-auth-token': token }
            });
            
            if (response.data && response.data.success) {
                toast.success('User deleted successfully!');
                setUsers(prev => prev.filter(u => u._id !== userId));
                fetchAllData();
            } else {
                toast.error(response.data?.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Delete user error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const verifyNGO = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.put(`/admin/verify-ngo/${userId}`, {}, {
                headers: { 'x-auth-token': token }
            });
            
            if (response.data && response.data.success) {
                toast.success('NGO verified successfully!');
                fetchAllData();
            } else {
                toast.error(response.data?.message || 'Failed to verify NGO');
            }
        } catch (error) {
            console.error('Verify NGO error:', error);
            toast.error('Failed to verify NGO');
        }
    };

    // ============ COMPLAINT MANAGEMENT ============
    const handleAddComplaint = () => {
        setEditingComplaint(null);
        setComplaintTitle('');
        setComplaintDescription('');
        setShowComplaintModal(true);
    };

    const handleEditComplaint = (complaint) => {
        setEditingComplaint(complaint);
        setComplaintTitle(complaint.title);
        setComplaintDescription(complaint.description);
        setShowComplaintModal(true);
    };

    const handleSubmitComplaint = async () => {
        if (!complaintTitle.trim() || !complaintDescription.trim()) {
            toast.warning('Please fill in all fields');
            return;
        }

        setComplaintSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            
            if (editingComplaint) {
                await api.put(`/admin/complaints/${editingComplaint._id}`, {
                    title: complaintTitle,
                    description: complaintDescription
                }, {
                    headers: { 'x-auth-token': token }
                });
                toast.success('Complaint updated!');
            } else {
                await api.post('/admin/complaints', {
                    title: complaintTitle,
                    description: complaintDescription
                }, {
                    headers: { 'x-auth-token': token }
                });
                toast.success('Complaint added!');
            }
            setShowComplaintModal(false);
            fetchAllData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save complaint');
        } finally {
            setComplaintSubmitting(false);
        }
    };

    const resolveComplaint = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await api.put(`/admin/complaints/${id}/resolve`, {}, {
                headers: { 'x-auth-token': token }
            });
            toast.success('Complaint resolved!');
            fetchAllData();
        } catch (error) {
            toast.error('Failed to resolve complaint');
        }
    };

    const deleteComplaint = async (id) => {
        if (window.confirm('Delete this complaint?')) {
            try {
                const token = localStorage.getItem('token');
                await api.delete(`/admin/complaints/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                toast.success('Complaint deleted');
                fetchAllData();
            } catch (error) {
                toast.error('Failed to delete complaint');
            }
        }
    };

    // ============ DONATION MANAGEMENT ============
    const deleteDonation = async (donationId) => {
        if (!window.confirm('Delete this donation?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await api.delete(`/admin/donation/${donationId}`, {
                headers: { 'x-auth-token': token }
            });
            
            if (response.data && response.data.success) {
                toast.success('Donation deleted successfully');
                fetchAllData();
            } else {
                toast.error(response.data?.message || 'Failed to delete donation');
            }
        } catch (error) {
            console.error('Delete donation error:', error);
            toast.error('Failed to delete donation');
        }
    };

    // ============ RATING MANAGEMENT ============
    const deleteRating = async (ratingId) => {
        if (!window.confirm('Delete this rating?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await api.delete(`/admin/ratings/${ratingId}`, {
                headers: { 'x-auth-token': token }
            });
            
            if (response.data && response.data.success) {
                toast.success('Rating deleted successfully');
                fetchAllData();
            } else {
                toast.error(response.data?.message || 'Failed to delete rating');
            }
        } catch (error) {
            console.error('Delete rating error:', error);
            toast.error('Failed to delete rating');
        }
    };

    // ============ HELPERS ============
    const getStatusBadge = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            accepted: 'bg-blue-100 text-blue-800',
            collected: 'bg-purple-100 text-purple-800',
            distributed: 'bg-green-100 text-green-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getCategoryStats = () => {
        const categoryStats = {};
        categories.forEach(cat => {
            const count = donations.filter(d => 
                d.items?.some(item => item.category === cat.name.toLowerCase())
            ).length;
            categoryStats[cat.name] = count;
        });
        return categoryStats;
    };

    const getItemsByCategory = (categoryName) => {
        const items = [];
        donations.forEach(d => {
            if (d.items) {
                d.items.forEach(item => {
                    if (item.category === categoryName.toLowerCase()) {
                        items.push({
                            ...item,
                            donationId: d._id,
                            donorName: d.donorId?.name || 'Unknown',
                            status: d.status
                        });
                    }
                });
            }
        });
        return items;
    };

    // ✅ Render stars for rating display
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

    if (!isAdmin && !loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
                    <p className="text-gray-600">This page is only for Admins.</p>
                </div>
            </div>
        );
    }

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

    const categoryStats = getCategoryStats();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome, {user.name}!</p>
                </div>
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                    onClick={() => setShowExportModal(true)}
                >
                    📊 Export Data
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h3 className="text-gray-500 font-medium">Total Users</h3>
                    <p className="text-3xl font-bold text-gray-800">{users.length}</p>
                    <p className="text-sm text-gray-500">{users.filter(u => u.role === 'donor').length} Donors, {users.filter(u => u.role === 'ngo').length} NGOs</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h3 className="text-gray-500 font-medium">Donations</h3>
                    <p className="text-3xl font-bold text-gray-800">{donations.length}</p>
                    <p className="text-sm text-gray-500">{donations.filter(d => d.status === 'pending').length} Pending</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h3 className="text-gray-500 font-medium">Beneficiaries</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalBeneficiaries}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h3 className="text-gray-500 font-medium">Completed</h3>
                    <p className="text-3xl font-bold text-green-600">{donations.filter(d => d.status === 'distributed').length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h3 className="text-gray-500 font-medium">⭐ Ratings</h3>
                    <p className="text-3xl font-bold text-yellow-500">{ratings.length}</p>
                    <p className="text-sm text-gray-500">Avg: {ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1) : 'N/A'}</p>
                </div>
            </div>


            {/* Tabs - Add Ratings tab */}
            <div className="flex gap-4 mb-6 border-b flex-wrap">
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'users' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('users')}
                >
                    👥 Users ({filteredUsers.length})
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'donations' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('donations')}
                >
                    📦 Donations ({filteredDonations.length})
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'categories' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('categories')}
                >
                    🏷️ Categories ({categories.length})
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'complaints' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('complaints')}
                >
                    ⚠️ Complaints ({complaints.length})
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'ratings' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('ratings')}
                >
                    ⭐ Ratings ({filteredRatings.length})
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'analytics' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('analytics')}
                >
                    📊 Analytics
                </button>
            </div>

            {/* ============ SEARCH & FILTERS ============ */}
            {(activeTab === 'users' || activeTab === 'donations' || activeTab === 'ratings') && (
                <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <input
                                type="text"
                                placeholder="🔍 Search by name, email, item..."
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
                            {activeTab === 'users' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select
                                        className="w-full border rounded-lg px-3 py-2"
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="donor">Donor</option>
                                        <option value="ngo">NGO</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            )}
                            {activeTab === 'donations' && (
                                <>
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
                                </>
                            )}
                            {activeTab === 'ratings' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                        <select
                                            className="w-full border rounded-lg px-3 py-2"
                                            value={filterRating}
                                            onChange={(e) => setFilterRating(e.target.value)}
                                        >
                                            <option value="all">All Ratings</option>
                                            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                                            <option value="4">⭐⭐⭐⭐ (4)</option>
                                            <option value="3">⭐⭐⭐ (3)</option>
                                            <option value="2">⭐⭐ (2)</option>
                                            <option value="1">⭐ (1)</option>
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
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ============ RATINGS TAB ============ */}
            {activeTab === 'ratings' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">
                        ⭐ Donor Ratings & Reviews
                        {filteredRatings.length !== ratings.length && (
                            <span className="text-sm text-gray-500 ml-2">
                                (Showing {filteredRatings.length} of {ratings.length})
                            </span>
                        )}
                    </h2>
                    
                    {ratings.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">⭐</div>
                            <p className="text-gray-500 text-lg">No ratings yet</p>
                            <p className="text-gray-400 text-sm">Ratings will appear here once donors start rating NGOs</p>
                        </div>
                    ) : (
                        <>
                            {/* Rating Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-yellow-50 rounded-lg p-4 text-center border border-yellow-200">
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {(ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)}
                                    </p>
                                    <p className="text-sm text-gray-600">Average Rating</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                                    <p className="text-2xl font-bold text-green-600">{ratings.filter(r => r.rating >= 4).length}</p>
                                    <p className="text-sm text-gray-600">Positive (4-5 ⭐)</p>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                                    <p className="text-2xl font-bold text-blue-600">{ratings.filter(r => r.rating === 3).length}</p>
                                    <p className="text-sm text-gray-600">Neutral (3 ⭐)</p>
                                </div>
                                <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
                                    <p className="text-2xl font-bold text-red-600">{ratings.filter(r => r.rating <= 2).length}</p>
                                    <p className="text-sm text-gray-600">Negative (1-2 ⭐)</p>
                                </div>
                            </div>

                            {/* Ratings List */}
                            {filteredRatings.length === 0 ? (
                                <p className="text-center py-4 text-gray-400">No ratings match your filters</p>
                            ) : (
                                <div className="space-y-4">
                                    {filteredRatings.map((rating) => (
                                        <div key={rating._id} className="border rounded-lg p-4 hover:shadow-md transition">
                                            <div className="flex justify-between items-start flex-wrap gap-4">
                                                <div>
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <h3 className="font-bold">
                                                            {rating.donorId?.name || 'Unknown Donor'}
                                                        </h3>
                                                        <span className="text-sm text-gray-400">→</span>
                                                        <span className="font-medium text-purple-600">
                                                            {rating.ngoId?.name || 'Unknown NGO'}
                                                        </span>
                                                        <div className="flex items-center gap-1">
                                                            {renderStars(rating.rating)}
                                                            <span className="text-sm text-gray-500 ml-1">({rating.rating})</span>
                                                        </div>
                                                    </div>
                                                    {rating.comment && (
                                                        <p className="text-gray-600 mt-2 italic">"{rating.comment}"</p>
                                                    )}
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(rating.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                <button 
                                                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition" 
                                                    onClick={() => deleteRating(rating._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* ============ USERS TAB ============ */}
            {activeTab === 'users' && (
                // ... (existing users tab code)
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">
                        All Users
                        {filteredUsers.length !== users.length && (
                            <span className="text-sm text-gray-500 ml-2">
                                (Showing {filteredUsers.length} of {users.length})
                            </span>
                        )}
                    </h2>
                    {filteredUsers.length === 0 ? (
                        <p className="text-center py-8 text-gray-400">No users found</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Name</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Email</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Role</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id} className="border-t hover:bg-gray-50">
                                            <td className="py-3 px-4">{user.name}</td>
                                            <td className="py-3 px-4">{user.email}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                                    user.role === 'ngo' ? 'bg-blue-100 text-blue-800' : 
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {user.isVerified ? '✅ Verified' : '⏳ Pending'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-2 flex-wrap">
                                                    {user.role === 'ngo' && !user.isVerified && (
                                                        <button 
                                                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition" 
                                                            onClick={() => verifyNGO(user._id)}
                                                        >
                                                            Verify
                                                        </button>
                                                    )}
                                                    {user.role !== 'admin' && (
                                                        <button 
                                                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition" 
                                                            onClick={() => deleteUser(user._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ============ DONATIONS TAB ============ */}
            {activeTab === 'donations' && (
                // ... (existing donations tab code)
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">
                        All Donations
                        {filteredDonations.length !== donations.length && (
                            <span className="text-sm text-gray-500 ml-2">
                                (Showing {filteredDonations.length} of {donations.length})
                            </span>
                        )}
                    </h2>
                    {filteredDonations.length === 0 ? (
                        <p className="text-center py-8 text-gray-400">No donations found</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">ID</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Donor</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Items</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Category</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDonations.map((donation) => (
                                        <tr key={donation._id} className="border-t hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm">#{donation._id?.slice(-6)}</td>
                                            <td className="py-3 px-4">{donation.donorId?.name || 'Unknown'}</td>
                                            <td className="py-3 px-4">{donation.items?.length || 0} items</td>
                                            <td className="py-3 px-4">
                                                {donation.items?.map((item, idx) => (
                                                    <span key={idx} className="inline-block px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs mr-1 mb-1">
                                                        {item.category || 'other'}
                                                    </span>
                                                ))}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(donation.status)}`}>
                                                    {donation.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <button 
                                                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition" 
                                                    onClick={() => deleteDonation(donation._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ============ CATEGORIES TAB ============ */}
            {activeTab === 'categories' && (
                // ... (existing categories tab code)
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">🏷️ Categories</h2>
                        <button 
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                            onClick={handleAddCategory}
                        >
                            ➕ Add Category
                        </button>
                    </div>

                    {categories.length === 0 ? (
                        <p className="text-center py-8 text-gray-400">No categories found</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((cat) => {
                                const itemCount = categoryStats[cat.name] || 0;
                                const items = getItemsByCategory(cat.name);
                                
                                return (
                                    <div key={cat._id} className="border rounded-lg p-4 hover:shadow-md transition">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl">{cat.icon || '📦'}</span>
                                                <div>
                                                    <h3 className="font-bold text-lg">{cat.name}</h3>
                                                    <p className="text-sm text-gray-500">{itemCount} items donated</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 text-sm"
                                                    onClick={() => handleEditCategory(cat)}
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                    onClick={() => deleteCategory(cat._id)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {cat.description && (
                                            <p className="text-sm text-gray-600 mt-2">{cat.description}</p>
                                        )}
                                        
                                        <div className="mt-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                cat.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {cat.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        {items.length > 0 && (
                                            <div className="mt-3 pt-3 border-t">
                                                <p className="text-xs font-semibold text-gray-500 mb-2">Recent Items:</p>
                                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                                    {items.slice(0, 5).map((item, idx) => (
                                                        <div key={idx} className="flex justify-between text-xs">
                                                            <span className="text-gray-600">{item.quantity}x {item.type}</span>
                                                            <span className={`px-1 py-0.5 rounded ${getStatusBadge(item.status)}`}>
                                                                {item.status}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {items.length > 5 && (
                                                        <p className="text-xs text-gray-400">+{items.length - 5} more</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ============ COMPLAINTS TAB ============ */}
            {activeTab === 'complaints' && (
                // ... (existing complaints tab code)
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">⚠️ Complaints</h2>
                        <button 
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition" 
                            onClick={handleAddComplaint}
                        >
                            ➕ Add Complaint
                        </button>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        {complaints.length === 0 ? (
                            <p className="text-center py-8 text-gray-400">No complaints</p>
                        ) : (
                            <div className="space-y-4">
                                {complaints.map((c) => (
                                    <div key={c._id} className="border rounded-lg p-4 flex justify-between items-start flex-wrap gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold">{c.title}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${c.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                    {c.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mt-1">{c.description}</p>
                                            <p className="text-gray-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600" onClick={() => handleEditComplaint(c)}>Edit</button>
                                            {c.status === 'open' && <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700" onClick={() => resolveComplaint(c._id)}>Resolve</button>}
                                            <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600" onClick={() => deleteComplaint(c._id)}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ============ ANALYTICS TAB ============ */}
            {activeTab === 'analytics' && (
                // ... (existing analytics tab code)
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h4 className="text-sm text-gray-500">Total Donations</h4>
                            <p className="text-3xl font-bold text-gray-800">{donations.length}</p>
                            <span className={`text-sm ${donations.length > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                                📈 {donations.length > 0 ? '+12%' : 'No data yet'}
                            </span>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h4 className="text-sm text-gray-500">Active NGOs</h4>
                            <p className="text-3xl font-bold text-gray-800">{users.filter(u => u.role === 'ngo').length}</p>
                            <span className="text-sm text-green-500">✅ Verified: {users.filter(u => u.role === 'ngo' && u.isVerified).length}</span>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h4 className="text-sm text-gray-500">Total Donors</h4>
                            <p className="text-3xl font-bold text-gray-800">{users.filter(u => u.role === 'donor').length}</p>
                            <span className="text-sm text-blue-500">👤 Active donors</span>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h4 className="text-sm text-gray-500">Completion Rate</h4>
                            <p className="text-3xl font-bold text-gray-800">
                                {donations.length > 0 ? Math.round((donations.filter(d => d.status === 'distributed').length / donations.length) * 100) : 0}%
                            </p>
                            <span className="text-sm text-green-500">✅ Distributed successfully</span>
                        </div>
                    </div>

                    {/* Donation Status Chart */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold mb-4">📊 Donation Status Distribution</h3>
                        <div className="space-y-3">
                            {['pending', 'accepted', 'collected', 'distributed'].map(status => {
                                const count = donations.filter(d => d.status === status).length;
                                const percentage = donations.length > 0 ? Math.round((count / donations.length) * 100) : 0;
                                const colors = {
                                    pending: 'bg-yellow-400',
                                    accepted: 'bg-blue-400',
                                    collected: 'bg-purple-400',
                                    distributed: 'bg-green-400'
                                };
                                return (
                                    <div key={status}>
                                        <div className="flex justify-between text-sm">
                                            <span className="capitalize">{status}</span>
                                            <span>{count} ({percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div 
                                                className={`${colors[status]} h-3 rounded-full transition-all duration-500`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Monthly Trends */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold mb-4">📈 Monthly Donation Trends</h3>
                        <div className="grid grid-cols-6 gap-2">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
                                const count = donations.filter(d => new Date(d.createdAt).getMonth() === index).length;
                                const monthCounts = {};
                                donations.forEach(d => {
                                    const m = new Date(d.createdAt).getMonth();
                                    monthCounts[m] = (monthCounts[m] || 0) + 1;
                                });
                                const maxCount = Math.max(1, ...Object.values(monthCounts));
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

                    {/* Top NGOs */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold mb-4">🏆 Top NGOs by Donations</h3>
                        {donations.length === 0 ? (
                            <p className="text-gray-400">No data yet</p>
                        ) : (
                            <div className="space-y-2">
                                {Object.entries(
                                    donations.reduce((acc, d) => {
                                        if (d.ngoId?.name) {
                                            acc[d.ngoId.name] = (acc[d.ngoId.name] || 0) + 1;
                                        }
                                        return acc;
                                    }, {})
                                )
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 5)
                                .map(([name, count], index) => (
                                    <div key={name} className="flex items-center gap-3">
                                        <span className="w-8 text-center font-bold text-gray-400">#{index + 1}</span>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm">
                                                <span>{name}</span>
                                                <span>{count} donations</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-purple-500 h-2 rounded-full"
                                                    style={{ width: `${(count / Math.max(1, donations.length)) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {showCategoryModal && (
                // ... (existing category modal code)
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">
                                {editingCategory ? '✏️ Edit Category' : '➕ Add Category'}
                            </h2>
                            <button
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                                onClick={() => setShowCategoryModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Category Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Clothing, Electronics"
                                    className="w-full border rounded-lg px-4 py-2"
                                    value={categoryFormData.name}
                                    onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Icon (Emoji)</label>
                                <input
                                    type="text"
                                    placeholder="e.g., 👕 📚 💻"
                                    className="w-full border rounded-lg px-4 py-2"
                                    value={categoryFormData.icon}
                                    onChange={(e) => setCategoryFormData({...categoryFormData, icon: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    placeholder="Brief description of this category"
                                    className="w-full border rounded-lg px-4 py-2 h-20"
                                    value={categoryFormData.description}
                                    onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    className="w-full border rounded-lg px-4 py-2"
                                    value={categoryFormData.isActive}
                                    onChange={(e) => setCategoryFormData({...categoryFormData, isActive: e.target.value === 'true'})}
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                                    onClick={handleSubmitCategory}
                                    disabled={submitting}
                                >
                                    {submitting ? '⏳ Saving...' : editingCategory ? '💾 Update' : '➕ Add'}
                                </button>
                                <button
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                    onClick={() => setShowCategoryModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Complaint Modal */}
            {showComplaintModal && (
                // ... (existing complaint modal code)
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">{editingComplaint ? '✏️ Edit' : '➕ Add'} Complaint</h2>
                            <button className="text-gray-500 hover:text-gray-700 text-2xl" onClick={() => setShowComplaintModal(false)}>✕</button>
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-2">Title *</label>
                            <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="Issue title" value={complaintTitle} onChange={(e) => setComplaintTitle(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-2">Description *</label>
                            <textarea className="w-full border rounded-lg px-4 py-2 h-32" placeholder="Describe the issue..." value={complaintDescription} onChange={(e) => setComplaintDescription(e.target.value)} />
                        </div>
                        <div className="flex gap-3">
                            <button className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition" onClick={handleSubmitComplaint} disabled={complaintSubmitting}>
                                {complaintSubmitting ? '⏳ Saving...' : editingComplaint ? '💾 Update' : '➕ Add'}
                            </button>
                            <button className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition" onClick={() => setShowComplaintModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Modal */}
            {showExportModal && (
                // ... (existing export modal code)
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">📊 Export Data</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                                onClick={() => setShowExportModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-2">Export Format</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    className={`px-4 py-2 rounded-lg border transition ${
                                        exportFormat === 'csv' 
                                            ? 'bg-purple-600 text-white border-purple-600' 
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setExportFormat('csv')}
                                >
                                    📄 CSV
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-lg border transition ${
                                        exportFormat === 'json' 
                                            ? 'bg-purple-600 text-white border-purple-600' 
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setExportFormat('json')}
                                >
                                    📋 JSON
                                </button>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <p className="text-sm text-gray-600">
                                📋 Exporting <span className="font-medium">
                                    {activeTab === 'users' ? filteredUsers.length : 
                                     activeTab === 'donations' ? filteredDonations.length : 
                                     activeTab === 'ratings' ? filteredRatings.length :
                                     categories.length}
                                </span> records as {exportFormat.toUpperCase()}
                            </p>
                        </div>
                        <button
                            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                            onClick={handleExport}
                            disabled={exporting}
                        >
                            {exporting ? '⏳ Exporting...' : '📥 Download'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;