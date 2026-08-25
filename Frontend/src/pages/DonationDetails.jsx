import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSpinner, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaBox, FaHeart } from 'react-icons/fa';
import api from '../services/api';

const DonationDetails = () => {
    const { donationId } = useParams();
    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user?.role || '');
        fetchDonationDetails();
    }, [donationId]);

    const fetchDonationDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/donations/${donationId}`);
            setDonation(response.data);
            console.log('📦 Donation details:', response.data);
        } catch (error) {
            console.error('Error fetching donation:', error);
            toast.error('Failed to load donation details');
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="text-5xl text-green-600 animate-spin mx-auto" />
                    <p className="text-gray-500 mt-4">Loading donation details...</p>
                </div>
            </div>
        );
    }

    if (!donation) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Donation not found</h2>
                <Link to="/" className="text-green-600 hover:underline mt-4 inline-block">
                    Go back home
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
            >
                <FaArrowLeft /> Back to Home
            </Link>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-8 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold">Donation Details</h1>
                            <p className="text-green-100 text-sm mt-1">ID: #{donation._id?.slice(-8)}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(donation.status)}`}>
                            {getStatusIcon(donation.status)} {donation.status}
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <FaBox className="text-green-600" /> Items Donated
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {donation.items?.map((item, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-gray-800">{item.quantity}x {item.type}</p>
                                            <p className="text-sm text-gray-500">Category: {item.category}</p>
                                            <p className="text-sm text-gray-500">Condition: {item.condition}</p>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                            {item.quantity} items
                                        </span>
                                    </div>
                                    {item.description && (
                                        <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <FaUser className="text-green-600" /> Donor Information
                        </h2>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                            <p className="font-medium text-gray-800">{donation.donorId?.name || 'Unknown Donor'}</p>
                            <p className="text-sm text-gray-500">{donation.donorId?.email || 'No email provided'}</p>
                            {donation.donorId?.phone && (
                                <p className="text-sm text-gray-500">📞 {donation.donorId.phone}</p>
                            )}
                        </div>
                    </div>

                    {donation.ngoId && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <FaHeart className="text-green-600" /> NGO Partner
                            </h2>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                <p className="font-medium text-gray-800">{donation.ngoId?.name || 'Not assigned'}</p>
                                <p className="text-sm text-gray-500">{donation.ngoId?.email || ''}</p>
                                {donation.ngoId?.phone && (
                                    <p className="text-sm text-gray-500">📞 {donation.ngoId.phone}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {donation.collectionAddress && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-green-600" /> Collection Address
                            </h2>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                <p className="text-gray-800">{donation.collectionAddress?.street}</p>
                                <p className="text-gray-600">
                                    {donation.collectionAddress?.city}, {donation.collectionAddress?.state}
                                </p>
                                <p className="text-gray-500 text-sm">Pincode: {donation.collectionAddress?.pincode}</p>
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <FaCalendarAlt className="text-green-600" /> Schedule
                        </h2>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                            <p className="text-gray-800">
                                {donation.scheduledDate ? new Date(donation.scheduledDate).toLocaleDateString() : 'Not scheduled'}
                            </p>
                            <p className="text-gray-500 text-sm">Time: {donation.scheduledTime || 'Not specified'}</p>
                        </div>
                    </div>

                    {donation.specialInstructions && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">📝 Special Instructions</h2>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                <p className="text-gray-700">{donation.specialInstructions}</p>
                            </div>
                        </div>
                    )}

                    <div className="text-sm text-gray-400 border-t border-gray-100 pt-4">
                        Created: {new Date(donation.createdAt).toLocaleString()}
                        {donation.completedAt && (
                            <span className="ml-4">Completed: {new Date(donation.completedAt).toLocaleString()}</span>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex gap-3">
                    <Link
                        to="/"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DonationDetails;  