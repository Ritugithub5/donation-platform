const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// ============ MongoDB Connection ============
mongoose.connect('mongodb://localhost:27017/donation_platform')
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Error:', err));

// ============ USER MODEL ============
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['donor', 'ngo', 'admin'], default: 'donor' },
    isVerified: { type: Boolean, default: false },
    organizationName: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

// ============ BENEFICIARY MODEL ============
const BeneficiarySchema = new mongoose.Schema({
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    need: { type: String, default: '' },
    familyMembers: { type: Number, default: 1 },
    income: { type: String, default: '' },
    status: { 
        type: String, 
        enum: ['active', 'inactive', 'completed'], 
        default: 'active' 
    },
    notes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const Beneficiary = mongoose.model('Beneficiary', BeneficiarySchema);

// ============ DONATION MODEL ============
const DonationSchema = new mongoose.Schema({
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    beneficiaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary' },
    items: [{
        category: { type: String, default: 'other' },
        type: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        description: { type: String, default: '' },
        condition: { type: String, default: 'good' }
    }],
    collectionAddress: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        pincode: { type: String, default: '' }
    },
    scheduledDate: { type: Date, default: Date.now },
    scheduledTime: { type: String, default: '12:00' },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'collected', 'distributed', 'cancelled'],
        default: 'pending'
    },
    specialInstructions: { type: String, default: '' },
    donorMessage: { type: String, default: '' },
    isRecurring: { type: Boolean, default: false },
    recurringFrequency: { type: String, default: '' },
    recurringEndDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
});
const Donation = mongoose.model('Donation', DonationSchema);

// ============ CATEGORY MODEL ============
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    icon: { type: String, default: '📦' },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});
const Category = mongoose.model('Category', CategorySchema);

// ============ CONTACT MODEL ============
const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
    createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', ContactSchema);

// ============ CONTACT INFO MODEL ============
const ContactInfoSchema = new mongoose.Schema({
    email: { type: String, default: 'info@donatenow.com' },
    phone: { type: String, default: '+91 98765 43210' },
    address: { type: String, default: 'Mumbai, India' },
    updatedAt: { type: Date, default: Date.now }
});
const ContactInfo = mongoose.model('ContactInfo', ContactInfoSchema);

// ============ EMPLOYEE ENGAGEMENT MODEL ============
const EmployeeEngagementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, default: '' },
    collaboration: { type: String, default: '' },
    requirement: { type: String, default: '' },
    status: { type: String, enum: ['new', 'contacted', 'replied'], default: 'new' },
    createdAt: { type: Date, default: Date.now }
});
const EmployeeEngagement = mongoose.model('EmployeeEngagement', EmployeeEngagementSchema);

// ============ RATING MODEL ============
const RatingSchema = new mongoose.Schema({
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});
const Rating = mongoose.model('Rating', RatingSchema);

// ============ TEST ROUTE ============
app.get('/api/test', (req, res) => {
    res.json({ message: '✅ Backend is working!', timestamp: new Date().toISOString() });
});

// ============ REGISTER ============
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, phone, role, organizationName } = req.body;
        
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
                message: 'User already exists' 
            });
        }
        
        user = new User({
            email: email.toLowerCase(),
            password: password,
            name: name,
            phone: phone || '',
            role: role || 'donor',
            isVerified: role === 'ngo' ? false : true,
            organizationName: role === 'ngo' ? organizationName || name : ''
        });
        
        await user.save();
        
        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            token: user.email,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                isVerified: user.isVerified,
                organizationName: user.organizationName,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration' 
        });
    }
});

// ============ LOGIN ============
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }
        
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials - User not found' 
            });
        }
        
        if (user.password !== password) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials - Wrong password' 
            });
        }
        
        res.json({
            success: true,
            message: 'Login successful!',
            token: user.email,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                isVerified: user.isVerified,
                organizationName: user.organizationName,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

// ============ GET CURRENT USER ============
app.get('/api/auth/me', async (req, res) => {
    try {
        const token = req.headers['x-auth-token'];
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }
        
        const user = await User.findOne({ email: token.toLowerCase() });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                isVerified: user.isVerified,
                organizationName: user.organizationName,
                phone: user.phone
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// ============ CREATE DEFAULT ADMIN ============
app.post('/api/setup-admin', async (req, res) => {
    try {
        let admin = await User.findOne({ role: 'admin' });
        if (admin) {
            return res.json({ 
                success: true, 
                message: 'Admin already exists', 
                admin: {
                    email: admin.email,
                    password: 'password123'
                }
            });
        }
        
        admin = new User({
            email: 'admin@test.com',
            password: 'password123',
            name: 'Admin User',
            role: 'admin',
            isVerified: true,
            phone: '1234567890'
        });
        await admin.save();
        
        res.json({ 
            success: true, 
            message: 'Admin created successfully!',
            admin: {
                email: 'admin@test.com',
                password: 'password123'
            }
        });
    } catch (error) {
        console.error('Setup admin error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create admin' 
        });
    }
});

// ============ VERIFY NGO ============
app.put('/api/verify-ngo/:email', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { email: req.params.email.toLowerCase(), role: 'ngo' },
            { isVerified: true },
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'NGO not found' 
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
            message: 'Server error' 
        });
    }
});

// ============ GET ALL NGOs ============
app.get('/api/ngos', async (req, res) => {
    try {
        const ngos = await User.find({ 
            role: 'ngo', 
            isVerified: true 
        }).select('-password');
        
        res.json({ 
            success: true, 
            count: ngos.length, 
            ngos: ngos 
        });
    } catch (error) {
        console.error('Get NGOs error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch NGOs' 
        });
    }
});

// ============ GET ALL DONORS ============
app.get('/api/donors', async (req, res) => {
    try {
        const donors = await User.find({ 
            role: 'donor' 
        }).select('-password');
        
        res.json({ 
            success: true, 
            count: donors.length, 
            donors: donors 
        });
    } catch (error) {
        console.error('Get donors error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch donors' 
        });
    }
});

// ============ RATING ROUTES ============

// SUBMIT RATING
app.post('/api/ratings', async (req, res) => {
    try {
        const { donationId, ngoId, rating, comment } = req.body;
        const token = req.headers['x-auth-token'];
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        
        const donor = await User.findOne({ email: token.toLowerCase() });
        if (!donor) {
            return res.status(404).json({ success: false, message: 'Donor not found' });
        }
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }
        
        // Check if already rated
        const existingRating = await Rating.findOne({ donationId, donorId: donor._id });
        if (existingRating) {
            return res.status(400).json({ success: false, message: 'You have already rated this donation' });
        }
        
        const newRating = new Rating({
            donorId: donor._id,
            ngoId,
            donationId,
            rating,
            comment: comment || ''
        });
        
        await newRating.save();
        
        // Update average rating for NGO
        const allRatings = await Rating.find({ ngoId });
        const avgRating = allRatings.length > 0 ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length : 0;
        await User.findByIdAndUpdate(ngoId, { rating: Math.round(avgRating * 10) / 10 });
        
        res.status(201).json({
            success: true,
            message: 'Rating submitted successfully',
            data: newRating
        });
    } catch (error) {
        console.error('Submit rating error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit rating' });
    }
});

// GET NGO RATINGS
app.get('/api/ratings/ngo/:ngoId', async (req, res) => {
    try {
        const ratings = await Rating.find({ ngoId: req.params.ngoId })
            .populate('donorId', 'name email')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: ratings.length,
            ratings
        });
    } catch (error) {
        console.error('Get ratings error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch ratings' });
    }
});

// ============ GET ALL RATINGS (Admin) ============
app.get('/api/admin/ratings', async (req, res) => {
    try {
        const ratings = await Rating.find()
            .populate('donorId', 'name email')
            .populate('ngoId', 'name email organizationName')
            .populate('donationId', 'status items')
            .sort({ createdAt: -1 });
        
        console.log(`✅ Found ${ratings.length} ratings in admin`);
        
        res.json({
            success: true,
            count: ratings.length,
            ratings: ratings
        });
    } catch (error) {
        console.error('Get admin ratings error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch ratings',
            ratings: []
        });
    }
});

// ============ DELETE RATING (Admin) ============
app.delete('/api/admin/ratings/:id', async (req, res) => {
    try {
        const rating = await Rating.findByIdAndDelete(req.params.id);
        if (!rating) {
            return res.status(404).json({ 
                success: false, 
                message: 'Rating not found' 
            });
        }
        
        // Update NGO average rating
        const allRatings = await Rating.find({ ngoId: rating.ngoId });
        if (allRatings.length > 0) {
            const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
            await User.findByIdAndUpdate(rating.ngoId, { rating: Math.round(avgRating * 10) / 10 });
        } else {
            await User.findByIdAndUpdate(rating.ngoId, { rating: 0 });
        }
        
        res.json({
            success: true,
            message: 'Rating deleted successfully'
        });
    } catch (error) {
        console.error('Delete rating error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete rating' 
        });
    }
});

// ============ TEST RATINGS ENDPOINT ============
app.get('/api/test-ratings', async (req, res) => {
    try {
        const ratings = await Rating.find()
            .populate('donorId', 'name email')
            .populate('ngoId', 'name email organizationName')
            .populate('donationId', 'status');
        
        console.log(`🧪 Test ratings: Found ${ratings.length} ratings`);
        
        res.json({
            success: true,
            count: ratings.length,
            ratings: ratings
        });
    } catch (error) {
        console.error('Test ratings error:', error);
        res.json({ 
            success: false, 
            error: error.message,
            ratings: []
        });
    }
});

// ============ CATEGORY ROUTES ============

// GET ALL CATEGORIES
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .sort({ displayOrder: 1, name: 1 });
        
        res.json({ 
            success: true, 
            count: categories.length, 
            categories: categories 
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch categories' 
        });
    }
});

// ADD CATEGORY (Admin only)
app.post('/api/categories', async (req, res) => {
    try {
        const { name, icon, description, isActive } = req.body;
        const token = req.headers['x-auth-token'];
        
        const admin = await User.findOne({ email: token.toLowerCase(), role: 'admin' });
        if (!admin) {
            return res.status(403).json({ 
                success: false, 
                message: 'Admin access required' 
            });
        }
        
        if (!name || !name.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Category name is required' 
            });
        }
        
        const existingCategory = await Category.findOne({ 
            name: name.toLowerCase() 
        });
        if (existingCategory) {
            return res.status(400).json({ 
                success: false, 
                message: 'Category already exists' 
            });
        }
        
        const category = new Category({
            name: name.trim(),
            icon: icon || '📦',
            description: description || '',
            isActive: isActive !== undefined ? isActive : true,
            displayOrder: 0
        });
        
        await category.save();
        
        res.status(201).json({
            success: true,
            message: 'Category added successfully',
            category: category
        });
    } catch (error) {
        console.error('Add category error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to add category' 
        });
    }
});

// UPDATE CATEGORY (Admin only)
app.put('/api/categories/:id', async (req, res) => {
    try {
        const { name, icon, description, isActive, displayOrder } = req.body;
        const token = req.headers['x-auth-token'];
        
        const admin = await User.findOne({ email: token.toLowerCase(), role: 'admin' });
        if (!admin) {
            return res.status(403).json({ 
                success: false, 
                message: 'Admin access required' 
            });
        }
        
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ 
                success: false, 
                message: 'Category not found' 
            });
        }
        
        if (name) category.name = name.trim();
        if (icon) category.icon = icon;
        if (description !== undefined) category.description = description;
        if (isActive !== undefined) category.isActive = isActive;
        if (displayOrder !== undefined) category.displayOrder = displayOrder;
        
        await category.save();
        
        res.json({
            success: true,
            message: 'Category updated successfully',
            category: category
        });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update category' 
        });
    }
});

// DELETE CATEGORY (Admin only)
app.delete('/api/categories/:id', async (req, res) => {
    try {
        const token = req.headers['x-auth-token'];
        
        const admin = await User.findOne({ email: token.toLowerCase(), role: 'admin' });
        if (!admin) {
            return res.status(403).json({ 
                success: false, 
                message: 'Admin access required' 
            });
        }
        
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ 
                success: false, 
                message: 'Category not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete category' 
        });
    }
});

// ============ CONTACT INFO ROUTES ============

// GET CONTACT INFO
app.get('/api/contact-info', async (req, res) => {
    try {
        let contactInfo = await ContactInfo.findOne();
        
        if (!contactInfo) {
            contactInfo = new ContactInfo({
                email: 'info@donatenow.com',
                phone: '+91 98765 43210',
                address: 'Mumbai, India'
            });
            await contactInfo.save();
            console.log('✅ Default contact info created');
        }
        
        res.json({
            success: true,
            data: contactInfo
        });
    } catch (error) {
        console.error('Get contact info error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch contact info' 
        });
    }
});

// UPDATE CONTACT INFO
app.put('/api/contact-info', async (req, res) => {
    try {
        const { email, phone, address } = req.body;
        
        let contactInfo = await ContactInfo.findOne();
        
        if (!contactInfo) {
            contactInfo = new ContactInfo({
                email: email || 'info@donatenow.com',
                phone: phone || '+91 98765 43210',
                address: address || 'Mumbai, India'
            });
        } else {
            if (email) contactInfo.email = email;
            if (phone) contactInfo.phone = phone;
            if (address) contactInfo.address = address;
        }
        
        contactInfo.updatedAt = Date.now();
        await contactInfo.save();
        
        console.log('✅ Contact info updated:', contactInfo);
        
        res.json({
            success: true,
            message: 'Contact info updated successfully',
            data: contactInfo
        });
    } catch (error) {
        console.error('Update contact info error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update contact info' 
        });
    }
});

// ============ CONTACT FORM SUBMISSION ============
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, location, subject, message } = req.body;
        
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, email, subject, and message are required' 
            });
        }
        
        const contact = new Contact({
            name,
            email,
            phone: phone || '',
            location: location || '',
            subject,
            message,
            status: 'new'
        });
        
        await contact.save();
        console.log('✅ Contact form submitted:', contact);
        
        // Also update ContactInfo
        try {
            let contactInfo = await ContactInfo.findOne();
            if (!contactInfo) {
                contactInfo = new ContactInfo({
                    email: email || 'info@donatenow.com',
                    phone: phone || '+91 98765 43210',
                    address: location || 'Mumbai, India'
                });
            } else {
                if (email) contactInfo.email = email;
                if (phone) contactInfo.phone = phone;
                if (location) contactInfo.address = location;
            }
            
            contactInfo.updatedAt = Date.now();
            await contactInfo.save();
            console.log('✅ ContactInfo updated from form submission');
        } catch (infoError) {
            console.log('Could not update contact info:', infoError);
        }
        
        res.status(201).json({
            success: true,
            message: 'Message sent successfully!',
            data: contact
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send message' 
        });
    }
});

// GET ALL CONTACTS (Admin)
app.get('/api/admin/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({ 
            success: true, 
            count: contacts.length, 
            contacts: contacts 
        });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch contacts' 
        });
    }
});

// ============ EMPLOYEE ENGAGEMENT ROUTES ============

// SUBMIT EMPLOYEE ENGAGEMENT FORM
app.post('/api/employee-engagement', async (req, res) => {
    try {
        const { name, email, phone, company, collaboration, requirement } = req.body;
        
        if (!name || !email || !phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, email, and phone are required' 
            });
        }
        
        const engagement = new EmployeeEngagement({
            name,
            email,
            phone,
            company: company || '',
            collaboration: collaboration || '',
            requirement: requirement || '',
            status: 'new'
        });
        
        await engagement.save();
        console.log('✅ Employee engagement form submitted:', engagement);
        
        res.status(201).json({
            success: true,
            message: 'Form submitted successfully!',
            data: engagement
        });
    } catch (error) {
        console.error('Employee engagement error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit form' 
        });
    }
});

// GET ALL EMPLOYEE ENGAGEMENTS (Admin)
app.get('/api/admin/employee-engagements', async (req, res) => {
    try {
        const engagements = await EmployeeEngagement.find().sort({ createdAt: -1 });
        res.json({ 
            success: true, 
            count: engagements.length, 
            engagements: engagements 
        });
    } catch (error) {
        console.error('Get engagements error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch engagements' 
        });
    }
});

// UPDATE EMPLOYEE ENGAGEMENT STATUS (Admin)
app.put('/api/admin/employee-engagements/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const engagement = await EmployeeEngagement.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!engagement) {
            return res.status(404).json({ 
                success: false, 
                message: 'Engagement not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Engagement updated successfully',
            data: engagement
        });
    } catch (error) {
        console.error('Update engagement error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update engagement' 
        });
    }
});

// DELETE EMPLOYEE ENGAGEMENT (Admin)
app.delete('/api/admin/employee-engagements/:id', async (req, res) => {
    try {
        const engagement = await EmployeeEngagement.findByIdAndDelete(req.params.id);
        if (!engagement) {
            return res.status(404).json({ 
                success: false, 
                message: 'Engagement not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Engagement deleted successfully'
        });
    } catch (error) {
        console.error('Delete engagement error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete engagement' 
        });
    }
});

// ============ BENEFICIARY ROUTES ============

// GET BENEFICIARIES
app.get('/api/beneficiaries', async (req, res) => {
    try {
        const token = req.headers['x-auth-token'];
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }
        
        const ngo = await User.findOne({ 
            email: token.toLowerCase(), 
            role: 'ngo' 
        });
        
        if (!ngo) {
            return res.status(404).json({ 
                success: false, 
                message: 'NGO not found' 
            });
        }
        
        const beneficiaries = await Beneficiary.find({ ngoId: ngo._id })
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

// ADD BENEFICIARY
app.post('/api/beneficiaries', async (req, res) => {
    try {
        const { name, email, phone, address, need, familyMembers, income, notes } = req.body;
        const token = req.headers['x-auth-token'];
        
        if (!name || !email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name and email are required' 
            });
        }
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }
        
        const ngo = await User.findOne({ 
            email: token.toLowerCase(), 
            role: 'ngo' 
        });
        
        if (!ngo) {
            return res.status(404).json({ 
                success: false, 
                message: 'NGO not found. Please register as NGO first.' 
            });
        }
        
        const existing = await Beneficiary.findOne({ 
            email: email.toLowerCase(), 
            ngoId: ngo._id 
        });
        if (existing) {
            return res.status(400).json({ 
                success: false, 
                message: 'Beneficiary already exists' 
            });
        }
        
        const beneficiary = new Beneficiary({
            ngoId: ngo._id,
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone || '',
            address: address || '',
            need: need || '',
            familyMembers: familyMembers || 1,
            income: income || '',
            notes: notes || ''
        });
        
        await beneficiary.save();
        
        res.status(201).json({
            success: true,
            message: 'Beneficiary added successfully!',
            beneficiary: beneficiary
        });
    } catch (error) {
        console.error('Add beneficiary error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to add beneficiary' 
        });
    }
});

// UPDATE BENEFICIARY
app.put('/api/beneficiaries/:id', async (req, res) => {
    try {
        const { name, email, phone, address, need, familyMembers, income, notes } = req.body;
        const token = req.headers['x-auth-token'];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }
        
        const ngo = await User.findOne({ 
            email: token.toLowerCase(), 
            role: 'ngo' 
        });
        if (!ngo) {
            return res.status(404).json({ 
                success: false, 
                message: 'NGO not found' 
            });
        }
        
        const beneficiary = await Beneficiary.findOne({ 
            _id: req.params.id, 
            ngoId: ngo._id 
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

// DELETE BENEFICIARY
app.delete('/api/beneficiaries/:id', async (req, res) => {
    try {
        const token = req.headers['x-auth-token'];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }
        
        const ngo = await User.findOne({ 
            email: token.toLowerCase(), 
            role: 'ngo' 
        });
        if (!ngo) {
            return res.status(404).json({ 
                success: false, 
                message: 'NGO not found' 
            });
        }
        
        const beneficiary = await Beneficiary.findOneAndDelete({
            _id: req.params.id,
            ngoId: ngo._id
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

// ============ DONATION ROUTES ============

// CREATE DONATION
app.post('/api/donations', async (req, res) => {
    try {
        const { items, collectionAddress, scheduledDate, scheduledTime, specialInstructions, donorMessage, ngoId, isRecurring, recurringFrequency, recurringEndDate } = req.body;
        const token = req.headers['x-auth-token'];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }
        
        const donor = await User.findOne({ email: token.toLowerCase() });
        if (!donor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Donor not found' 
            });
        }
        
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
            donorId: donor._id,
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
            isRecurring: isRecurring || false,
            recurringFrequency: recurringFrequency || '',
            recurringEndDate: recurringEndDate ? new Date(recurringEndDate) : null
        });
        
        await donation.save();
        
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

// GET ALL DONATIONS
app.get('/api/donations', async (req, res) => {
    try {
        const donations = await Donation.find()
            .sort({ createdAt: -1 })
            .populate('donorId', 'name email')
            .populate('ngoId', 'name email')
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

// GET PENDING DONATIONS
app.get('/api/donations/pending', async (req, res) => {
    try {
        const donations = await Donation.find({ status: 'pending' })
            .sort({ createdAt: -1 })
            .populate('donorId', 'name email')
            .populate('ngoId', 'name email');
        
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

// GET MY DONATIONS (Donor)
app.get('/api/donations/my-donations', async (req, res) => {
    try {
        const token = req.headers['x-auth-token'];
        if (!token) {
            return res.json({ 
                success: true, 
                donations: [] 
            });
        }
        
        const donor = await User.findOne({ email: token.toLowerCase() });
        if (!donor) {
            return res.json({ 
                success: true, 
                donations: [] 
            });
        }
        
        const donations = await Donation.find({ donorId: donor._id })
            .sort({ createdAt: -1 })
            .populate('ngoId', 'name email')
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

// GET NGO DONATIONS
app.get('/api/donations/ngo-donations', async (req, res) => {
    try {
        const token = req.headers['x-auth-token'];
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }
        
        const ngo = await User.findOne({ 
            email: token.toLowerCase(), 
            role: 'ngo' 
        });
        if (!ngo) {
            return res.status(404).json({ 
                success: false, 
                message: 'NGO not found' 
            });
        }
        
        const donations = await Donation.find({ 
            $or: [
                { ngoId: ngo._id },
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

// ACCEPT DONATION
app.put('/api/donations/:id/accept', async (req, res) => {
    try {
        const token = req.headers['x-auth-token'];
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }
        
        const ngo = await User.findOne({ 
            email: token.toLowerCase(), 
            role: 'ngo' 
        });
        if (!ngo) {
            return res.status(404).json({ 
                success: false, 
                message: 'NGO not found' 
            });
        }
        
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
                message: 'Donation is not pending' 
            });
        }
        
        donation.ngoId = ngo._id;
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

// COLLECT DONATION
app.put('/api/donations/:id/collect', async (req, res) => {
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
                message: 'Cannot collect donation with status: ' + donation.status 
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

// DISTRIBUTE DONATION
app.put('/api/donations/:id/distribute', async (req, res) => {
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
                message: 'Cannot distribute donation with status: ' + donation.status 
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

// SCHEDULE DONATION
app.put('/api/donations/:id/schedule', async (req, res) => {
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

// ASSIGN BENEFICIARY TO DONATION
app.put('/api/donations/:id/assign', async (req, res) => {
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

// ============ ADMIN ROUTES ============

// GET ALL USERS (Admin)
app.get('/api/admin/users', async (req, res) => {
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

// GET ALL DONATIONS (Admin)
app.get('/api/admin/donations', async (req, res) => {
    try {
        const donations = await Donation.find()
            .sort({ createdAt: -1 })
            .populate('donorId', 'name email')
            .populate('ngoId', 'name email')
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

// GET STATS (Admin)
app.get('/api/admin/stats', async (req, res) => {
    try {
        const totalDonors = await User.countDocuments({ role: 'donor' });
        const totalNGOs = await User.countDocuments({ role: 'ngo' });
        const totalDonations = await Donation.countDocuments();
        const pendingDonations = await Donation.countDocuments({ status: 'pending' });
        const completedDonations = await Donation.countDocuments({ status: 'distributed' });
        const totalBeneficiaries = await Beneficiary.countDocuments();
        const totalRatings = await Rating.countDocuments();
        
        res.json({
            success: true,
            stats: {
                totalDonors,
                totalNGOs,
                totalDonations,
                pendingDonations,
                completedDonations,
                totalBeneficiaries,
                totalRatings
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

// VERIFY NGO (Admin)
app.put('/api/admin/verify-ngo/:userId', async (req, res) => {
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

// DELETE USER (Admin)
app.delete('/api/admin/user/:userId', async (req, res) => {
    try {
        const token = req.headers['x-auth-token'];
        
        console.log('🔑 Delete user - Token:', token);
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }
        
        let admin = await User.findOne({ 
            email: token.toLowerCase(), 
            role: 'admin' 
        });
        
        if (!admin) {
            admin = await User.findOne({ role: 'admin' });
        }
        
        if (!admin) {
            return res.status(403).json({ 
                success: false, 
                message: 'Admin access required' 
            });
        }
        
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        if (user.role === 'ngo') {
            await Beneficiary.deleteMany({ ngoId: user._id });
        }
        await Donation.deleteMany({ donorId: user._id });
        await Rating.deleteMany({ donorId: user._id });
        await Rating.deleteMany({ ngoId: user._id });
        
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

// DELETE DONATION (Admin)
app.delete('/api/admin/donation/:donationId', async (req, res) => {
    try {
        const donation = await Donation.findByIdAndDelete(req.params.donationId);
        if (!donation) {
            return res.status(404).json({ 
                success: false, 
                message: 'Donation not found' 
            });
        }
        
        await Rating.deleteMany({ donationId: req.params.donationId });
        
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

// ============ COMPLAINT ROUTES ============

// GET ALL COMPLAINTS (Admin)
app.get('/api/admin/complaints', async (req, res) => {
    try {
        const complaints = await Contact.find().sort({ createdAt: -1 });
        res.json({ 
            success: true, 
            count: complaints.length, 
            complaints: complaints 
        });
    } catch (error) {
        console.error('Get complaints error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch complaints' 
        });
    }
});

// ADD COMPLAINT
app.post('/api/admin/complaints', async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ 
                success: false, 
                message: 'Title and description are required' 
            });
        }
        
        const complaint = new Contact({
            name: 'Admin Complaint',
            email: 'admin@test.com',
            subject: title,
            message: description,
            status: 'new'
        });
        
        await complaint.save();
        
        res.status(201).json({
            success: true,
            message: 'Complaint added successfully',
            complaint: complaint
        });
    } catch (error) {
        console.error('Add complaint error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to add complaint' 
        });
    }
});

// RESOLVE COMPLAINT
app.put('/api/admin/complaints/:id/resolve', async (req, res) => {
    try {
        const complaint = await Contact.findByIdAndUpdate(
            req.params.id,
            { status: 'replied' },
            { new: true }
        );
        
        if (!complaint) {
            return res.status(404).json({ 
                success: false, 
                message: 'Complaint not found' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Complaint resolved', 
            complaint: complaint 
        });
    } catch (error) {
        console.error('Resolve complaint error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to resolve complaint' 
        });
    }
});

// DELETE COMPLAINT
app.delete('/api/admin/complaints/:id', async (req, res) => {
    try {
        const complaint = await Contact.findByIdAndDelete(req.params.id);
        if (!complaint) {
            return res.status(404).json({ 
                success: false, 
                message: 'Complaint not found' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Complaint deleted' 
        });
    } catch (error) {
        console.error('Delete complaint error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete complaint' 
        });
    }
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📍 Test: http://localhost:${PORT}/api/test`);
    console.log(`📍 Register: POST http://localhost:${PORT}/api/auth/register`);
    console.log(`📍 Login: POST http://localhost:${PORT}/api/auth/login`);
    console.log(`📍 Setup Admin: POST http://localhost:${PORT}/api/setup-admin`);
    console.log(`📍 Categories: GET http://localhost:${PORT}/api/categories`);
    console.log(`📍 Contact Info: GET http://localhost:${PORT}/api/contact-info`);
    console.log(`📍 Contact Info: PUT http://localhost:${PORT}/api/contact-info`);
    console.log(`📍 Contact Form: POST http://localhost:${PORT}/api/contact`);
    console.log(`📍 Employee Engagement: POST http://localhost:${PORT}/api/employee-engagement`);
    console.log(`📍 Employee Engagement (Admin): GET http://localhost:${PORT}/api/admin/employee-engagements`);
    console.log(`📍 Ratings: POST http://localhost:${PORT}/api/ratings`);
    console.log(`📍 Ratings (Admin): GET http://localhost:${PORT}/api/admin/ratings`);
    console.log(`📍 Test Ratings: GET http://localhost:${PORT}/api/test-ratings`);
});
