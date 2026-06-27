const express = require('express');
const router = express.Router();
const Beneficiary = require('../models/Beneficiary');
const User = require('../models/User');
const { auth, isNGO } = require('../middleware/auth');

// Get all beneficiaries for NGO
router.get('/', auth, isNGO, async (req, res) => {
    try {
        const beneficiaries = await Beneficiary.find({ ngoId: req.user._id })
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: beneficiaries.length,
            beneficiaries: beneficiaries
        });
    } catch (error) {
        console.error('Get beneficiaries error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch beneficiaries' 
        });
    }
});

// Add beneficiary
router.post('/', auth, isNGO, async (req, res) => {
    try {
        const { name, email, phone, address, need, familyMembers, income, notes } = req.body;

        if (!name || !email) {
            return res.status(400).json({ 
                success: false,
                message: 'Name and email are required' 
            });
        }

        // Check for duplicate email
        const existingBeneficiary = await Beneficiary.findOne({ 
            email: email.toLowerCase(),
            ngoId: req.user._id 
        });
        if (existingBeneficiary) {
            return res.status(400).json({ 
                success: false,
                message: 'Beneficiary with this email already exists' 
            });
        }

        const beneficiary = new Beneficiary({
            ngoId: req.user._id,
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone || '',
            address: address || '',
            need: need || '',
            familyMembers: familyMembers || 1,
            income: income || '',
            notes: notes || '',
        });

        await beneficiary.save();

        res.status(201).json({
            success: true,
            message: 'Beneficiary added successfully',
            beneficiary: beneficiary
        });
    } catch (error) {
        console.error('Add beneficiary error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to add beneficiary',
            error: error.message 
        });
    }
});

// Update beneficiary
router.put('/:id', auth, isNGO, async (req, res) => {
    try {
        const { name, email, phone, address, need, familyMembers, income, notes } = req.body;
        
        const beneficiary = await Beneficiary.findOne({ 
            _id: req.params.id, 
            ngoId: req.user._id 
        });
        if (!beneficiary) {
            return res.status(404).json({ 
                success: false,
                message: 'Beneficiary not found' 
            });
        }

        beneficiary.name = name || beneficiary.name;
        beneficiary.email = email || beneficiary.email;
        beneficiary.phone = phone || beneficiary.phone;
        beneficiary.address = address || beneficiary.address;
        beneficiary.need = need || beneficiary.need;
        beneficiary.familyMembers = familyMembers || beneficiary.familyMembers;
        beneficiary.income = income || beneficiary.income;
        beneficiary.notes = notes || beneficiary.notes;
        beneficiary.updatedAt = Date.now();

        await beneficiary.save();

        res.json({
            success: true,
            message: 'Beneficiary updated successfully',
            beneficiary: beneficiary
        });
    } catch (error) {
        console.error('Update beneficiary error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to update beneficiary' 
        });
    }
});

// Delete beneficiary
router.delete('/:id', auth, isNGO, async (req, res) => {
    try {
        const beneficiary = await Beneficiary.findOneAndDelete({ 
            _id: req.params.id, 
            ngoId: req.user._id 
        });
        if (!beneficiary) {
            return res.status(404).json({ 
                success: false,
                message: 'Beneficiary not found' 
            });
        }

        res.json({
            success: true,
            message: 'Beneficiary deleted successfully'
        });
    } catch (error) {
        console.error('Delete beneficiary error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to delete beneficiary' 
        });
    }
});

module.exports = router;