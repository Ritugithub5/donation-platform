const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Donation = require('../models/Donation');
const Beneficiary = require('../models/Beneficiary');
const { auth, isAdmin } = require('../middleware/auth');

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({
            success: true,
            count: users.length,
            users: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch users' 
        });
    }
});

// Get all donations
router.get('/donations', auth, isAdmin, async (req, res) => {
    try {
        const donations = await Donation.find()
            .sort({ createdAt: -1 })
            .populate('donorId', 'name email')
            .populate('ngoId', 'name email organizationName')
            .populate('beneficiaryId', 'name email');
        
        res.json({
            success: true,
            count: donations.length,
            donations: donations
        });
    } catch (error) {
        console.error('Get admin donations error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch donations' 
        });
    }
});

// Get stats
router.get('/stats', auth, isAdmin, async (req, res) => {
    try {
        const totalDonors = await User.countDocuments({ role: 'donor' });
        const totalNGOs = await User.countDocuments({ role: 'ngo' });
        const totalDonations = await Donation.countDocuments();
        const pendingDonations = await Donation.countDocuments({ status: 'pending' });
        const completedDonations = await Donation.countDocuments({ status: 'distributed' });
        const totalBeneficiaries = await Beneficiary.countDocuments();
        
        res.json({
            success: true,
            stats: {
                totalDonors,
                totalNGOs,
                totalDonations,
                pendingDonations,
                completedDonations,
                totalBeneficiaries
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch stats' 
        });
    }
});

// Verify NGO
router.put('/verify-ngo/:userId', auth, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId, 
            { isVerified: true }, 
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'NGO verified successfully',
            user: user
        });
    } catch (error) {
        console.error('Verify NGO error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to verify NGO' 
        });
    }
});

// Delete user
router.delete('/user/:userId', auth, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to delete user' 
        });
    }
});

// Delete donation
router.delete('/donation/:donationId', auth, isAdmin, async (req, res) => {
    try {
        const donation = await Donation.findByIdAndDelete(req.params.donationId);
        if (!donation) {
            return res.status(404).json({ 
                success: false,
                message: 'Donation not found' 
            });
        }
        res.json({
            success: true,
            message: 'Donation deleted successfully'
        });
    } catch (error) {
        console.error('Delete donation error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to delete donation' 
        });
    }
});

module.exports = router;