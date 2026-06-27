const mongoose = require('mongoose');

const BeneficiarySchema = new mongoose.Schema({
    ngoId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true,
        lowercase: true,
        trim: true
    },
    phone: { 
        type: String, 
        default: '' 
    },
    address: { 
        type: String, 
        default: '' 
    },
    need: { 
        type: String, 
        default: '' 
    },
    familyMembers: { 
        type: Number, 
        default: 1 
    },
    income: { 
        type: String, 
        default: '' 
    },
    status: { 
        type: String, 
        enum: ['active', 'inactive', 'completed'], 
        default: 'active' 
    },
    notes: { 
        type: String, 
        default: '' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Beneficiary', BeneficiarySchema);