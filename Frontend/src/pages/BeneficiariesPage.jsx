import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const BeneficiariesPage = () => {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingBeneficiary, setEditingBeneficiary] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        need: '',
        familyMembers: 1,
        income: '',
        notes: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isNGO = user.role === 'ngo';

    useEffect(() => {
        if (isNGO) {
            fetchBeneficiaries();
        } else {
            setLoading(false);
            toast.warning('Please login as an NGO');
        }
    }, []);

    const fetchBeneficiaries = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            // ✅ Send token in headers
            const response = await api.get('/beneficiaries', {
                headers: { 
                    'x-auth-token': token || user.email 
                }
            });
            
            console.log('Beneficiaries Response:', response.data);
            
            if (response.data && response.data.beneficiaries) {
                setBeneficiaries(response.data.beneficiaries);
            } else if (Array.isArray(response.data)) {
                setBeneficiaries(response.data);
            } else {
                setBeneficiaries([]);
            }
        } catch (error) {
            console.error('Error fetching beneficiaries:', error);
            if (error.response?.status === 404) {
                toast.error('NGO not found. Please login again.');
            } else {
                toast.error('Failed to fetch beneficiaries');
            }
            setBeneficiaries([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBeneficiary = async () => {
        if (!formData.name || !formData.name.trim()) {
            toast.warning('Name is required');
            return;
        }
        if (!formData.email || !formData.email.trim()) {
            toast.warning('Email is required');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.warning('Please enter a valid email address');
            return;
        }

        try {
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone || '',
                address: formData.address || '',
                need: formData.need || '',
                familyMembers: formData.familyMembers || 1,
                income: formData.income || '',
                notes: formData.notes || ''
            };

            const token = localStorage.getItem('token');
            
            // ✅ Send token in headers
            const response = await api.post('/beneficiaries', payload, {
                headers: { 
                    'x-auth-token': token || user.email 
                }
            });

            if (response.data && response.data.success) {
                toast.success('Beneficiary added successfully!');
                setShowAddModal(false);
                resetForm();
                fetchBeneficiaries();
            } else {
                toast.error(response.data?.message || 'Failed to add beneficiary');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response?.status === 404) {
                toast.error('NGO not found. Please login again.');
            } else {
                toast.error(error.response?.data?.message || 'Failed to add beneficiary');
            }
        }
    };

    const handleEditBeneficiary = (beneficiary) => {
        setEditingBeneficiary(beneficiary);
        setFormData({
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
        if (!formData.name || !formData.name.trim()) {
            toast.warning('Name is required');
            return;
        }
        if (!formData.email || !formData.email.trim()) {
            toast.warning('Email is required');
            return;
        }

        try {
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone || '',
                address: formData.address || '',
                need: formData.need || '',
                familyMembers: formData.familyMembers || 1,
                income: formData.income || '',
                notes: formData.notes || ''
            };

            const token = localStorage.getItem('token');
            
            // ✅ Send token in headers
            const response = await api.put(`/beneficiaries/${editingBeneficiary._id}`, payload, {
                headers: { 
                    'x-auth-token': token || user.email 
                }
            });

            if (response.data && response.data.success) {
                toast.success('Beneficiary updated successfully!');
                setShowEditModal(false);
                resetForm();
                fetchBeneficiaries();
            } else {
                toast.error(response.data?.message || 'Failed to update beneficiary');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update beneficiary');
        }
    };

    const deleteBeneficiary = async (id) => {
        if (window.confirm('Are you sure you want to delete this beneficiary?')) {
            try {
                const token = localStorage.getItem('token');
                
                // ✅ Send token in headers
                const response = await api.delete(`/beneficiaries/${id}`, {
                    headers: { 
                        'x-auth-token': token || user.email 
                    }
                });

                if (response.data && response.data.success) {
                    toast.success('Beneficiary deleted successfully');
                    fetchBeneficiaries();
                } else {
                    toast.error(response.data?.message || 'Failed to delete beneficiary');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to delete beneficiary');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            need: '',
            familyMembers: 1,
            income: '',
            notes: ''
        });
        setEditingBeneficiary(null);
    };

    // Filter beneficiaries
    const filteredBeneficiaries = beneficiaries.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             b.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (!isNGO) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
                    <p className="text-gray-600">This page is only for NGOs.</p>
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

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">👥 Beneficiaries</h1>
                    <p className="text-gray-600">Manage all your beneficiaries</p>
                </div>
                <button
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                    onClick={() => setShowAddModal(true)}
                >
                    ➕ Add Beneficiary
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h3 className="text-gray-500 font-medium">Total</h3>
                    <p className="text-3xl font-bold text-gray-800">{beneficiaries.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h3 className="text-gray-500 font-medium">Active</h3>
                    <p className="text-3xl font-bold text-green-600">
                        {beneficiaries.filter(b => b.status === 'active').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h3 className="text-gray-500 font-medium">Completed</h3>
                    <p className="text-3xl font-bold text-blue-600">
                        {beneficiaries.filter(b => b.status === 'completed').length}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full border rounded-lg px-4 py-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="border rounded-lg px-4 py-2"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                        onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Beneficiaries List */}
            <div className="bg-white rounded-xl shadow-md p-6">
                {filteredBeneficiaries.length === 0 ? (
                    <p className="text-center py-8 text-gray-400">No beneficiaries found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredBeneficiaries.map((b) => (
                            <div key={b._id} className="border rounded-lg p-4 hover:shadow-md transition relative">
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        className="text-blue-500 hover:text-blue-700 text-sm bg-blue-50 px-2 py-1 rounded"
                                        onClick={() => handleEditBeneficiary(b)}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700 text-sm bg-red-50 px-2 py-1 rounded"
                                        onClick={() => deleteBeneficiary(b._id)}
                                    >
                                        🗑️ Delete
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

            {/* Add Beneficiary Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">👤 Add Beneficiary</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                                onClick={() => { setShowAddModal(false); resetForm(); }}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Name *</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-4 py-2"
                                    placeholder="Beneficiary name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Email *</label>
                                <input
                                    type="email"
                                    className="w-full border rounded-lg px-4 py-2"
                                    placeholder="beneficiary@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Phone</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-4 py-2"
                                    placeholder="Phone number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Address</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-4 py-2"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Need</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-4 py-2"
                                    placeholder="What they need"
                                    value={formData.need}
                                    onChange={(e) => setFormData({ ...formData, need: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Family Members</label>
                                <input
                                    type="number"
                                    className="w-full border rounded-lg px-4 py-2"
                                    placeholder="Number of family members"
                                    value={formData.familyMembers}
                                    onChange={(e) => setFormData({ ...formData, familyMembers: parseInt(e.target.value) || 1 })}
                                    min="1"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                                    onClick={handleAddBeneficiary}
                                >
                                    ➕ Add Beneficiary
                                </button>
                                <button
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                    onClick={() => { setShowAddModal(false); resetForm(); }}
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
                            <h2 className="text-2xl font-bold">✏️ Edit Beneficiary</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                                onClick={() => { setShowEditModal(false); resetForm(); }}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Name *</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-4 py-2"
                                    placeholder="Beneficiary name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Email *</label>
                                <input
                                    type="email"
                                    className="w-full border rounded-lg px-4 py-2"
                                    placeholder="beneficiary@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Phone</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-4 py-2"
                                    placeholder="Phone number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Address</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-4 py-2"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Need</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-4 py-2"
                                    placeholder="What they need"
                                    value={formData.need}
                                    onChange={(e) => setFormData({ ...formData, need: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Family Members</label>
                                <input
                                    type="number"
                                    className="w-full border rounded-lg px-4 py-2"
                                    placeholder="Number of family members"
                                    value={formData.familyMembers}
                                    onChange={(e) => setFormData({ ...formData, familyMembers: parseInt(e.target.value) || 1 })}
                                    min="1"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                    onClick={handleUpdateBeneficiary}
                                >
                                    💾 Update
                                </button>
                                <button
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                    onClick={() => { setShowEditModal(false); resetForm(); }}
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

export default BeneficiariesPage;