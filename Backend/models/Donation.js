const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    donorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    ngoId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    beneficiaryId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Beneficiary' 
    },
    items: [{
        category: { 
            type: String, 
            enum: ['clothing', 'household', 'books', 'electronics', 'furniture', 'other'],
            default: 'other' 
        },
        type: { 
            type: String, 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true, 
            default: 1,
            min: 1
        },
        description: { 
            type: String, 
            default: '' 
        },
        condition: { 
            type: String, 
            enum: ['new', 'good', 'fair', 'poor'],
            default: 'good' 
        },
    }],
    collectionAddress: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        pincode: { type: String, default: '' },
    },
    scheduledDate: { 
        type: Date, 
        default: Date.now 
    },
    scheduledTime: { 
        type: String, 
        default: '12:00' 
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'collected', 'distributed', 'cancelled'],
        default: 'pending',
    },
    specialInstructions: { 
        type: String, 
        default: '' 
    },
    donorMessage: { 
        type: String, 
        default: '' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    completedAt: { 
        type: Date 
    }
});

module.exports = mongoose.model('Donation', DonationSchema);