const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const User = require('../models/User');
const Beneficiary = require('../models/Beneficiary');
const { auth, isNGO } = require('../middleware/auth');

// Create donation
router.post('/', auth, async (req, res) => {
    try {
        const { items, collectionAddress, scheduledDate, scheduledTime, specialInstructions, donorMessage, ngoId } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'At least one item is required' 
            });
        }

        const validItems = items.map(item => ({
            type: item.type || 'Unnamed Item',
            quantity: parseInt(item.quantity) || 1,
            category: item.category || 'other',
            description: item.description || '',
            condition: item.condition || 'good'
        }));

        const donation = new Donation({
            donorId: req.user._id,
            ngoId: ngoId || null,
            items: validItems,
            collectionAddress: {
                street: collectionAddress?.street || '',
                city: collectionAddress?.city || '',
                state: collectionAddress?.state || '',
                pincode: collectionAddress?.pincode || ''
            },
            scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
            scheduledTime: scheduledTime || '12:00',
            status: 'pending',
            specialInstructions: specialInstructions || '',
            donorMessage: donorMessage || '',
        });

        await donation.save();

        await User.findByIdAndUpdate(req.user._id, {
            $push: { donationHistory: donation._id }
        });

        res.status(201).json({
            success: true,
            message: 'Donation created successfully!',
            donation: donation
        });
    } catch (error) {
        console.error('Create donation error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to create donation' 
        });
    }
});

// Get all donations
router.get('/', auth, async (req, res) => {
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
        console.error('Get donations error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch donations' 
        });
    }
});

// Get pending donations
router.get('/pending', auth, async (req, res) => {
    try {
        const donations = await Donation.find({ status: 'pending' })
            .sort({ createdAt: -1 })
            .populate('donorId', 'name email')
            .populate('ngoId', 'name email organizationName');
        
        res.json({
            success: true,
            count: donations.length,
            donations: donations
        });
    } catch (error) {
        console.error('Get pending donations error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch pending donations' 
        });
    }
});

// Get my donations (donor)
router.get('/my-donations', auth, async (req, res) => {
    try {
        const donations = await Donation.find({ donorId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('ngoId', 'name email organizationName')
            .populate('beneficiaryId', 'name email');
        
        res.json({
            success: true,
            count: donations.length,
            donations: donations
        });
    } catch (error) {
        console.error('Get my donations error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch donations' 
        });
    }
});

// Get NGO donations
router.get('/ngo-donations', auth, isNGO, async (req, res) => {
    try {
        const donations = await Donation.find({ 
            $or: [
                { ngoId: req.user._id },
                { status: 'pending' }
            ]
        })
            .sort({ createdAt: -1 })
            .populate('donorId', 'name email')
            .populate('beneficiaryId', 'name email');
        
        res.json({
            success: true,
            count: donations.length,
            donations: donations
        });
    } catch (error) {
        console.error('Get NGO donations error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch donations' 
        });
    }
});

// Accept donation (NGO)
router.put('/:id/accept', auth, isNGO, async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ 
                success: false,
                message: 'Donation not found' 
            });
        }

        if (donation.status !== 'pending') {
            return res.status(400).json({ 
                success: false,
                message: `Donation is already ${donation.status}` 
            });
        }

        donation.ngoId = req.user._id;
        donation.status = 'accepted';
        await donation.save();

        res.json({
            success: true,
            message: 'Donation accepted successfully',
            donation: donation
        });
    } catch (error) {
        console.error('Accept donation error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to accept donation' 
        });
    }
});

// Collect donation (NGO)
router.put('/:id/collect', auth, isNGO, async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ 
                success: false,
                message: 'Donation not found' 
            });
        }

        if (donation.status !== 'accepted') {
            return res.status(400).json({ 
                success: false,
                message: `Cannot collect donation with status: ${donation.status}` 
            });
        }

        donation.status = 'collected';
        await donation.save();

        res.json({
            success: true,
            message: 'Donation collected successfully',
            donation: donation
        });
    } catch (error) {
        console.error('Collect donation error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to collect donation' 
        });
    }
});

// Distribute donation (NGO)
router.put('/:id/distribute', auth, isNGO, async (req, res) => {
    try {
        const { beneficiaryId } = req.body;
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ 
                success: false,
                message: 'Donation not found' 
            });
        }

        if (donation.status !== 'collected') {
            return res.status(400).json({ 
                success: false,
                message: `Cannot distribute donation with status: ${donation.status}` 
            });
        }

        if (beneficiaryId) {
            const beneficiary = await Beneficiary.findById(beneficiaryId);
            if (!beneficiary) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Beneficiary not found' 
                });
            }
            donation.beneficiaryId = beneficiaryId;
        }

        donation.status = 'distributed';
        donation.completedAt = new Date();
        await donation.save();

        res.json({
            success: true,
            message: 'Donation distributed successfully',
            donation: donation
        });
    } catch (error) {
        console.error('Distribute donation error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to distribute donation' 
        });
    }
});

// Schedule donation collection
router.put('/:id/schedule', auth, isNGO, async (req, res) => {
    try {
        const { scheduledDate, scheduledTime } = req.body;
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ 
                success: false,
                message: 'Donation not found' 
            });
        }

        donation.scheduledDate = new Date(scheduledDate);
        donation.scheduledTime = scheduledTime;
        await donation.save();

        res.json({
            success: true,
            message: 'Collection scheduled successfully',
            donation: donation
        });
    } catch (error) {
        console.error('Schedule donation error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to schedule collection' 
        });
    }
});

// Update donation status (Admin)
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ 
                success: false,
                message: 'Donation not found' 
            });
        }

        donation.status = status;
        if (status === 'distributed' || status === 'cancelled') {
            donation.completedAt = new Date();
        }
        await donation.save();

        res.json({
            success: true,
            message: 'Status updated successfully',
            donation: donation
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to update status' 
        });
    }
});

// Assign beneficiary to donation
router.put('/:id/assign', auth, isNGO, async (req, res) => {
    try {
        const { beneficiaryId } = req.body;
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ 
                success: false,
                message: 'Donation not found' 
            });
        }

        const beneficiary = await Beneficiary.findById(beneficiaryId);
        if (!beneficiary) {
            return res.status(404).json({ 
                success: false,
                message: 'Beneficiary not found' 
            });
        }

        donation.beneficiaryId = beneficiaryId;
        await donation.save();

        res.json({
            success: true,
            message: 'Beneficiary assigned successfully',
            donation: donation
        });
    } catch (error) {
        console.error('Assign beneficiary error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to assign beneficiary' 
        });
    }
});

module.exports = router;