const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, phone, role, organizationName, registrationNumber, address, website, description } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ 
                success: false,
                message: 'Email, password, and name are required' 
            });
        }

        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists with this email' 
            });
        }

        const userData = {
            email: email.toLowerCase(),
            password,
            name,
            phone: phone || '',
            role: role || 'donor',
            isVerified: role === 'ngo' ? false : true,
        };

        if (role === 'ngo') {
            userData.organizationName = organizationName || name;
            userData.registrationNumber = registrationNumber || '';
            userData.address = address || '';
            userData.website = website || '';
            userData.description = description || '';
        }

        user = new User(userData);
        await user.save();

        const userResponse = {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified,
            phone: user.phone,
            organizationName: user.organizationName,
            registrationNumber: user.registrationNumber,
            address: user.address,
            website: user.website,
            description: user.description,
        };

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            token: 'fake-token-' + Date.now(),
            user: userResponse
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during registration',
            error: error.message 
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email and password are required' 
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user || user.password !== password) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        const userResponse = {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified,
            phone: user.phone,
            organizationName: user.organizationName,
            registrationNumber: user.registrationNumber,
            address: user.address,
            website: user.website,
            description: user.description,
        };

        res.json({
            success: true,
            message: 'Login successful!',
            token: 'fake-token-' + Date.now(),
            user: userResponse
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during login' 
        });
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        const userResponse = {
            id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role,
            isVerified: req.user.isVerified,
            phone: req.user.phone,
            organizationName: req.user.organizationName,
            registrationNumber: req.user.registrationNumber,
            address: req.user.address,
            website: req.user.website,
            description: req.user.description,
        };

        res.json({
            success: true,
            user: userResponse
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
});

module.exports = router;