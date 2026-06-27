const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        default: '' 
    },
    role: { 
        type: String, 
        enum: ['donor', 'ngo', 'admin'], 
        default: 'donor' 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    // NGO specific fields
    organizationName: { type: String, default: '' },
    registrationNumber: { type: String, default: '' },
    address: { type: String, default: '' },
    website: { type: String, default: '' },
    description: { type: String, default: '' },
    // Donor specific fields
    donationHistory: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Donation' 
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('User', UserSchema);