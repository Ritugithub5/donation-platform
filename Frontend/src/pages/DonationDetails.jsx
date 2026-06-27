import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const DonorDashboard = () => {
    const [donations, setDonations] = useState([]);
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedNGO, setSelectedNGO] = useState('');
    const [formData, setFormData] = useState({
        items: [{ category: 'clothing', type: '', quantity: 1, description: '', condition: 'good' }],
        collectionAddress: { street: '', city: '', state: '', pincode: '' },
        scheduledDate: '',
        scheduledTime: '',
        specialInstructions: '',
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchDonations();
        fetchNGOs();
    }, []);

    // ✅ Fetch Donations
    const fetchDonations = async () => {
        try {
            setLoading(true);
            const response = await api.get('/donations/my-donations');
            setDonations(response.data);
            console.log('📦 Donations loaded:', response.data);
        } catch (error) {
            console.error('Error fetching donations:', error);
            toast.error('Failed to fetch donations');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch NGOs
    const fetchNGOs = async () => {
        try {
            let response;
            try {
                response = await api.get('/ngos');
            } catch (err) {
                console.log('Trying alternative NGO endpoint...');
                response = await api.get('/donations/ngos');
            }
            setNgos(response.data);
            console.log('✅ NGOs loaded:', response.data);
        } catch (error) {
            console.error('Failed to fetch NGOs:', error);
            toast.error('Failed to load NGOs list');
        }
    };

    // ✅ Create Donation
    const handleCreateDonation = async (e) => {
        e.preventDefault();
        
        if (!selectedNGO) {
            toast.warning('Please select an NGO');
            return;
        }
        
        try {
            const donationData = {
                ...formData,
                ngoId: selectedNGO
            };
            
            const response = await api.post('/donations', donationData);
            console.log('✅ Donation created:', response.data);
            
            toast.success('Donation created successfully!');
            setShowForm(false);
            fetchDonations();
            
            // Reset form
            setFormData({
                items: [{ category: 'clothing', type: '', quantity: 1, description: '', condition: 'good' }],
                collectionAddress: { street: '', city: '', state: '', pincode: '' },
                scheduledDate: '',
                scheduledTime: '',
                specialInstructions: '',
            });
            setSelectedNGO('');
        } catch (error) {
            console.error('Create donation error:', error);
            toast.error(error.response?.data?.message || 'Failed to create donation');
        }
    };

    // ✅ Cancel Donation
    const handleCancelDonation = async (donationId) => {
        if (window.confirm('Are you sure you want to cancel this donation?')) {
            try {
                await api.put(`/donations/${donationId}/status`, { status: 'cancelled' });
                toast.success('Donation cancelled successfully');
                fetchDonations();
            } catch (error) {
                console.error('Cancel error:', error);
                toast.error('Failed to cancel donation');
            }
        }
    };

    // ✅ View Details
    const handleViewDetails = (donation) => {
        setSelectedDonation(donation);
        setShowDetailsModal(true);
    };

    // ✅ Add Item
    const addItem = () => {
        setFormData({
            ...formData,
            items: [
                ...formData.items,
                { category: 'clothing', type: '', quantity: 1, description: '', condition: 'good' }
            ]
        });
    };

    // ✅ Remove Item
    const removeItem = (index) => {
        if (formData.items.length > 1) {
            const newItems = formData.items.filter((_, i) => i !== index);
            setFormData({ ...formData, items: newItems });
        } else {
            toast.warning('You need at least one item');
        }
    };

    // ✅ Handle Item Change
    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };

    // ✅ Handle Address Change
    const handleAddressChange = (field, value) => {
        setFormData({
            ...formData,
            collectionAddress: {
                ...formData.collectionAddress,
                [field]: value
            }
        });
    };

    // ✅ Handle Pincode Change (Only Numbers)
    const handlePincodeChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^[0-9]+$/.test(value)) {
            handleAddressChange('pincode', value);
        }
    };

    // ✅ Get Status Badge
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

    // ✅ Get Category Badge
    const getCategoryBadge = (category) => {
        const colors = {
            clothing: 'bg-blue-100 text-blue-800',
            household: 'bg-green-100 text-green-800',
            books: 'bg-yellow-100 text-yellow-800',
            electronics: 'bg-purple-100 text-purple-800',
            furniture: 'bg-orange-100 text-orange-800',
            other: 'bg-gray-100 text-gray-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Dashboard Header */}
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Donor Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user.name || 'Donor'}!</p>
                </div>
                <button 
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? '✕ Cancel' : '➕ New Donation'}
                </button>
            </div>

            {/* Donation Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Donation</h2>
                    <form onSubmit={handleCreateDonation}>
                        {/* Select NGO */}
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-2">
                                Select NGO / Beneficiary *
                            </label>
                            <select
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                value={selectedNGO}
                                onChange={(e) => setSelectedNGO(e.target.value)}
                                required
                            >
                                <option value="">-- Select an NGO --</option>
                                {ngos.map((ngo) => (
                                    <option key={ngo._id} value={ngo._id}>
                                        {ngo.name} {ngo.isVerified ? '✅' : '⏳'}
                                    </option>
                                ))}
                            </select>
                            {ngos.length === 0 && (
                                <p className="text-sm text-yellow-600 mt-1">No NGOs available. Please contact support.</p>
                            )}
                        </div>

                        {/* Items Section */}
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-2">Items to Donate *</label>
                            {formData.items.map((item, index) => (
                                <div key={index} className="border rounded-lg p-4 mb-3 bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                        <select
                                            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
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
                                        
                                        <input
                                            type="text"
                                            placeholder="Item type (e.g., T-shirt)"
                                            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                                            value={item.type}
                                            onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                                            required
                                        />
                                        
                                        <input
                                            type="number"
                                            placeholder="Quantity"
                                            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                            min="1"
                                            required
                                        />
                                        
                                        <select
                                            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                                            value={item.condition}
                                            onChange={(e) => handleItemChange(index, 'condition', e.target.value)}
                                        >
                                            <option value="new">🆕 New</option>
                                            <option value="good">👍 Good</option>
                                            <option value="fair">👌 Fair</option>
                                            <option value="poor">👎 Poor</option>
                                        </select>
                                    </div>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            placeholder="Description (optional)"
                                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                        />
                                    </div>
                                    {formData.items.length > 1 && (
                                        <button
                                            type="button"
                                            className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                            onClick={() => removeItem(index)}
                                        >
                                            ❌ Remove Item
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                className="text-green-600 hover:text-green-700 text-sm font-medium"
                                onClick={addItem}
                            >
                                ➕ Add Another Item
                            </button>
                        </div>

                        {/* Collection Address */}
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-2">📍 Collection Address *</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Street"
                                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                                    value={formData.collectionAddress.street}
                                    onChange={(e) => handleAddressChange('street', e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="City"
                                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                                    value={formData.collectionAddress.city}
                                    onChange={(e) => handleAddressChange('city', e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="State"
                                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                                    value={formData.collectionAddress.state}
                                    onChange={(e) => handleAddressChange('state', e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Pincode"
                                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                                    value={formData.collectionAddress.pincode}
                                    onChange={handlePincodeChange}
                                    maxLength="6"
                                    pattern="[0-9]*"
                                    title="Please enter only numbers (max 6 digits)"
                                    required
                                />
                            </div>
                        </div>

                        {/* Schedule Pickup */}
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-2">🕐 Schedule Doorstep Collection *</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                    type="date"
                                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                                    value={formData.scheduledDate}
                                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                <input
                                    type="time"
                                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                                    value={formData.scheduledTime}
                                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Special Instructions */}
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-2">📝 Special Instructions (Optional)</label>
                            <textarea
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                                rows="3"
                                placeholder="Any special instructions for collection..."
                                value={formData.specialInstructions}
                                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button 
                                type="submit" 
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex-1"
                            >
                                🚀 Submit Donation
                            </button>
                            <button
                                type="button"
                                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Donation History */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Your Donation History</h2>
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading donations...</p>
                    </div>
                ) : donations.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No donations yet</p>
                        <p className="text-gray-400">Start by creating your first donation!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Items</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600">NGO</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.map((donation) => (
                                    <tr key={donation._id} className="border-b hover:bg-gray-50 transition">
                                        <td className="py-3 px-4">
                                            <div className="flex flex-wrap gap-1 mb-1">
                                                {donation.items?.slice(0, 3).map((item, idx) => (
                                                    <span key={idx} className={`px-2 py-0.5 rounded-full text-xs ${getCategoryBadge(item.category)}`}>
                                                        {item.category}
                                                    </span>
                                                ))}
                                                {donation.items?.length > 3 && (
                                                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                                                        +{donation.items.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {donation.items?.length || 0} item(s)
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            {donation.ngoId?.name || 'Not assigned'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(donation.status)}`}>
                                                {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            {new Date(donation.createdAt).toLocaleDateString()}
                                            <div className="text-xs text-gray-400">
                                                {new Date(donation.createdAt).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2 flex-wrap">
                                                <button 
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    onClick={() => handleViewDetails(donation)}
                                                >
                                                    View
                                                </button>
                                                {donation.status === 'pending' && (
                                                    <button 
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                        onClick={() => handleCancelDonation(donation._id)}
                                                    >
                                                        Cancel
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

            {/* Details Modal */}
            {showDetailsModal && selectedDonation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Donation Details</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                                onClick={() => setShowDetailsModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="font-medium text-gray-600">Status</p>
                                <span className={`px-3 py-1 rounded-full inline-block text-sm mt-1 ${getStatusBadge(selectedDonation.status)}`}>
                                    {selectedDonation.status.charAt(0).toUpperCase() + selectedDonation.status.slice(1)}
                                </span>
                            </div>

                            <div>
                                <p className="font-medium text-gray-600">Items Donated</p>
                                <div className="space-y-2 mt-1">
                                    {selectedDonation.items?.map((item, idx) => (
                                        <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold">{item.quantity}x {item.type}</p>
                                                    <p className="text-sm text-gray-500">Category: {item.category}</p>
                                                    <p className="text-sm text-gray-500">Condition: {item.condition}</p>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryBadge(item.category)}`}>
                                                    {item.category}
                                                </span>
                                            </div>
                                            {item.description && (
                                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedDonation.ngoId && (
                                <div>
                                    <p className="font-medium text-gray-600">NGO Partner</p>
                                    <p className="text-gray-800">{selectedDonation.ngoId.name}</p>
                                </div>
                            )}

                            {selectedDonation.collectionAddress && (
                                <div>
                                    <p className="font-medium text-gray-600">Collection Address</p>
                                    <p className="text-gray-800">{selectedDonation.collectionAddress.street}</p>
                                    <p className="text-gray-600">
                                        {selectedDonation.collectionAddress.city}, {selectedDonation.collectionAddress.state}
                                    </p>
                                    <p className="text-gray-500 text-sm">Pincode: {selectedDonation.collectionAddress.pincode}</p>
                                </div>
                            )}

                            {selectedDonation.scheduledDate && (
                                <div>
                                    <p className="font-medium text-gray-600">Schedule</p>
                                    <p className="text-gray-800">
                                        {new Date(selectedDonation.scheduledDate).toLocaleDateString()}
                                        {selectedDonation.scheduledTime && ` at ${selectedDonation.scheduledTime}`}
                                    </p>
                                </div>
                            )}

                            {selectedDonation.specialInstructions && (
                                <div>
                                    <p className="font-medium text-gray-600">Special Instructions</p>
                                    <p className="text-gray-700 bg-gray-50 p-2 rounded-lg">{selectedDonation.specialInstructions}</p>
                                </div>
                            )}

                            <div className="border-t pt-3 text-sm text-gray-400">
                                <p>Created: {new Date(selectedDonation.createdAt).toLocaleString()}</p>
                                {selectedDonation.completedAt && (
                                    <p>Completed: {new Date(selectedDonation.completedAt).toLocaleString()}</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex gap-3">
                            {selectedDonation.status === 'pending' && (
                                <button
                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        handleCancelDonation(selectedDonation._id);
                                    }}
                                >
                                    Cancel Donation
                                </button>
                            )}
                            <button
                                className={`${selectedDonation.status === 'pending' ? 'flex-1' : 'w-full'} bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition`}
                                onClick={() => setShowDetailsModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonorDashboard;