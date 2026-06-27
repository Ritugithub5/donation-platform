import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Home.css';
import heroImage from '../img/don3.png'; 
import BrandPartnerships from '../components/BrandPartnerships';
import don4Image from '../img/don4.png';

import { 
    FaBoxOpen, 
    FaTruck, 
    FaSeedling, 
    FaGift, 
    FaUsers, 
    FaBuilding, 
    FaHeart, 
    FaCheckCircle,
    FaArrowRight,
    FaTshirt,
    FaBook,
    FaLaptop,
    FaChair,
    FaHome,
    FaStar,
    FaUserCircle,
    FaSpinner,
    FaBox,
    FaGlobe,
    FaChartLine
} from 'react-icons/fa';
import { MdVerified, MdLocationOn, MdSchedule } from 'react-icons/md';
import api, { publicApi } from '../services/api'; // ✅ FIXED: Import publicApi

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const statsRef = useRef(null);

    // ✅ Fetch categories from backend
    useEffect(() => {
        fetchCategories();
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-stats');
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const fetchCategories = async () => {
        try {
            console.log('🔍 Fetching categories...');
            const response = await publicApi.get('/categories');
            console.log('✅ Categories fetched:', response.data);
            
            // Handle different response formats
            let categoriesData = [];
            if (response.data && response.data.categories) {
                categoriesData = response.data.categories;
            } else if (Array.isArray(response.data)) {
                categoriesData = response.data;
            } else {
                categoriesData = [];
            }
            
            setCategories(categoriesData);
        } catch (error) {
            console.error('❌ Failed to fetch categories:', error);
            // Fallback categories if API fails
            setCategories([
                { _id: '1', name: 'Clothing', icon: '👕', description: 'T-shirts, pants, dresses' },
                { _id: '2', name: 'Household', icon: '🏠', description: 'Kitchen items, decor' },
                { _id: '3', name: 'Books', icon: '📚', description: 'Books, magazines' },
                { _id: '4', name: 'Electronics', icon: '💻', description: 'Laptops, phones' },
                { _id: '5', name: 'Furniture', icon: '🪑', description: 'Chairs, tables, sofas' },
                { _id: '6', name: 'Other', icon: '📦', description: 'Miscellaneous items' },
            ]);
        } finally {
            setLoadingCategories(false);
        }
    };

    const getEmojiForCategory = (categoryName) => {
        const emojis = {
            'clothing': '👕',
            'household': '🏠',
            'books': '📚',
            'electronics': '💻',
            'furniture': '🪑',
            'other': '📦',
            'food': '🍲',
            'medicine': '💊',
            'toys': '🧸',
            'shoes': '👟',
            'bags': '🎒',
            'stationery': '✏️',
        };
        return emojis[categoryName?.toLowerCase()] || '📦';
    };

    return (
        <div className="min-h-screen">
            {/* ============ HERO SECTION ============ */}
            <section 
                className="hero-section"
                style={{
                    backgroundImage: `url(${heroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="hero-overlay"></div>
                
                <div className="hero-content relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20 animate-bounce">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        🎯 Making a Difference, One Donation at a Time
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight" style= {{fontFamily: 'emoji'}}>
                        Donation &{' '}
                        <span className="bg-gradient-to-r from-purple-800 to-red-700 bg-clip-text text-transparent">
                            Reuse
                        </span>{' '}
                        Platform
                    </h1>

                    <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 leading-relaxed" style= {{fontFamily: 'emoji'}}>
                        Connect donors with verified NGOs and make a difference in your community.
                        <br />
                        <span className="bg-gradient-to-r from-rose-800 to-blue-700 bg-clip-text text-transparent font-extrabold italic" style= {{fontFamily: 'emoji'}}>
                            Every item donated creates an impact.
                        </span>
                    </p>

                    <div className="hero-buttons">
                        <Link to="/register" className="btn-primary">🚀 Get Started</Link>
                        <Link to="/login" className="btn-secondary">👋 Sign In</Link>
                    </div>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                            <span className="text-green-400 text-xl">✓</span>
                            Verified NGOs
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-400 text-xl">✓</span>
                            100% Free for Donors
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-400 text-xl">✓</span>
                            Doorstep Collection
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-400 text-xl">✓</span>
                            Transparent Tracking
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                        <div className="w-1.5 h-3 bg-amber-400 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* ============ HOW IT WORKS ============ */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
                        Three simple steps to make a difference in your community
                    </p>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaBoxOpen className="text-5xl text-rose-800" />
                            </div>
                            <h3>Your Impact, Amplified</h3>
                            <p>Every item you donate reduces waste and creates opportunity. See your contribution in action.</p>
                            <span className="step-badge">
                                <FaGift className="inline-block mr-1" /> Step 1
                            </span>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaTruck className="text-5xl text-teal-600" />
                            </div>
                            <h3>Doorstep Collection Made Easy</h3>
                            <p>Pick your NGO, choose your time, and we'll handle the rest. Your giving journey starts with a single click.</p>
                            <span className="step-badge">
                                <MdSchedule className="inline-block mr-1" /> Step 2
                            </span>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaSeedling className="text-5xl text-purple-900" />
                            </div>
                            <h3>Spread Happiness</h3>
                            <p>Your unused items can become someone's treasure. Experience the joy of giving and the power of generosity.</p>
                            <span className="step-badge">
                                <FaHeart className="inline-block mr-1" /> Step 3
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ STATS SECTION ============ */}
            <section className="py-6 bg-white border-b border-gray-100">
                <div className="container">
                    <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="stat-item opacity-0 translate-y-10 transition-all duration-700">
                            <div className="text-4xl font-bold text-green-600">
                                <FaUsers className="inline-block text-3xl mr-2" />
                                500+
                            </div>
                            <div className="text-gray-500 mt-1">Donations Made</div>
                        </div>
                        <div className="stat-item opacity-0 translate-y-10 transition-all duration-700 delay-100">
                            <div className="text-4xl font-bold text-green-600">
                                <MdVerified className="inline-block text-3xl mr-2" />
                                100+
                            </div>
                            <div className="text-gray-500 mt-1">Verified NGOs</div>
                        </div>
                        <div className="stat-item opacity-0 translate-y-10 transition-all duration-700 delay-200">
                            <div className="text-4xl font-bold text-green-600">
                                <FaHeart className="inline-block text-3xl mr-2" />
                                1000+
                            </div>
                            <div className="text-gray-500 mt-1">Happy Donors</div>
                        </div>
                        <div className="stat-item opacity-0 translate-y-10 transition-all duration-700 delay-300">
                            <div className="text-4xl font-bold text-green-600">
                                <MdLocationOn className="inline-block text-3xl mr-2" />
                                50+
                            </div>
                            <div className="text-gray-500 mt-1">Cities Covered</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ CATEGORIES SECTION - CLICKABLE ============ */}
            <section className="py-6 bg-gray-50">
                <div className="container">
                    <h2 className="section-title">Donate Almost Anything</h2>
                    <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
                        We accept a wide variety of items for donation
                    </p>
                    
                    {loadingCategories ? (
                        <div className="text-center py-12">
                            <FaSpinner className="text-5xl text-green-600 animate-spin mx-auto" />
                            <p className="text-gray-500 mt-4">Loading categories...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {categories.map((category) => (
                                <Link
                                    key={category._id}
                                    to={`/category/${category.name.toLowerCase()}`}
                                    className="category-item group bg-white p-6 rounded-xl text-center transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg hover:bg-green-50 no-underline"
                                >
                                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300 text-gray-700 group-hover:text-green-600">
                                        {category.icon || getEmojiForCategory(category.name)}
                                    </div>
                                    <div className="font-medium text-gray-700 group-hover:text-green-600">
                                        {category.name}
                                    </div>
                                    {category.description && (
                                        <p className="text-xs text-gray-400 mt-1 hidden group-hover:block">
                                            {category.description}
                                        </p>
                                    )}
                                    <div className="mt-2 text-xs text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        View Donations →
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    
                    {!loadingCategories && categories.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No categories available. Please check back later.
                        </div>
                    )}
                </div>
            </section>

            {/* ============ TESTIMONIALS ============ */}
            <section className="py-20 bg-white">
                <div className="container">
                    <h2 className="section-title">What Our Community Says</h2>
                   
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center text-2xl text-white font-bold">
                                    <FaUserCircle className="text-3xl" />
                                </div>
                                <div className="ml-4">
                                    <div className="font-bold text-gray-800">Priya Sharma</div>
                                    <div className="text-sm text-gray-500">Donor</div>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                "I donated my unused clothes and they reached a family in need within 2 days. The tracking feature gave me complete peace of mind!"
                            </p>
                            <div className="mt-4 text-amber-400 text-lg">
                                {[...Array(5)].map((_, i) => <FaStar key={i} className="inline-block" />)}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-2xl text-white font-bold">
                                    <FaBuilding className="text-3xl" />
                                </div>
                                <div className="ml-4">
                                    <div className="font-bold text-gray-800">Helping Hands NGO</div>
                                    <div className="text-sm text-gray-500">NGO Partner</div>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                "We've received over 500 donations through this platform. It has transformed how we help our community."
                            </p>
                            <div className="mt-4 text-amber-400 text-lg">
                                {[...Array(5)].map((_, i) => <FaStar key={i} className="inline-block" />)}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center text-2xl text-white font-bold">
                                    <FaUserCircle className="text-3xl" />
                                </div>
                                <div className="ml-4">
                                    <div className="font-bold text-gray-800">Rahul Kumar</div>
                                    <div className="text-sm text-gray-500">Beneficiary</div>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                "My family received clothes and household items when we needed them the most. Thank you to everyone who donated!"
                            </p>
                            <div className="mt-4 text-amber-400 text-lg">
                                {[...Array(5)].map((_, i) => <FaStar key={i} className="inline-block" />)}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ WHAT MAKES US EFFECTIVE - PARALLAX SECTION ============ */}
            <section 
                className="parallax-section"
                style={{
                    backgroundImage: `url(${don4Image})`,
                }}
            >
                <div className="parallax-overlay">
                    <div className="max-w-7xl mx-auto px-4 w-full">
                        {/* Header */}
                        <div className="text-center mb-16">
                            <span className="inline-block px-4 py-1 bg-blue-500/30 backdrop-blur-sm text-blue-200 text-sm font-semibold rounded-full mb-4 border border-blue-400/30">
                                💡 Why Choose Us
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white">
                                What Makes Us <span className="text-blue-400">Effective</span>
                            </h2>
                            <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-4">
                                Discover how we create lasting impact through innovative solutions
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Feature 1 - Tech-driven */}
                            <div className="parallax-card">
                                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl mb-4 backdrop-blur-sm">
                                    <FaLaptop className="text-blue-300" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">Tech-driven Process</h4>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Customized tech solutions as per your focus areas - Net zero goals, 
                                    SDGs, social impact etc. to meet your yearly objectives and provide flexibility.
                                </p>
                            </div>

                            {/* Feature 2 - Super Convenient */}
                            <div className="parallax-card">
                                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl mb-4 backdrop-blur-sm">
                                    <FaGlobe className="text-blue-300" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">Super Convenient</h4>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Your employees can easily take part in the campaigns even when they are working 
                                    remotely as our donation pickup services are available across 2000+ cities in India.
                                </p>
                            </div>

                            {/* Feature 3 - High Engagement */}
                            <div className="parallax-card">
                                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl mb-4 backdrop-blur-sm">
                                    <FaUsers className="text-blue-300" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">High Engagement</h4>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    With the end to end support in promotions and marketing, exclusive webinars, 
                                    and gamified integrations and rewards, you would be able to provide a unique 
                                    and fun experience for your employees.
                                </p>
                            </div>

                            {/* Feature 4 - Measurable Impact */}
                            <div className="parallax-card">
                                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl mb-4 backdrop-blur-sm">
                                    <FaChartLine className="text-blue-300" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">Measurable Impact</h4>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Get regular impact reports and insights to understand the social 
                                    and environmental impact made by your employees.
                                </p>
                            </div>
                        </div>

                        {/* ============ IMPACT IN NUMBERS ============ */}
                        <div className="mt-20 pt-10 border-t border-white/10">
                            <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                                Our Impact <span className="text-blue-400">In Numbers</span>
                            </h3>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="text-center">
                                    <div className="stats-number text-blue-400">65%</div>
                                    <p className="text-gray-400 text-sm mt-2">Employee Participation Rate</p>
                                </div>
                                <div className="text-center">
                                    <div className="stats-number text-green-400">33M</div>
                                    <p className="text-gray-400 text-sm mt-2">Items Donated</p>
                                </div>
                                <div className="text-center">
                                    <div className="stats-number text-yellow-400">2.6M</div>
                                    <p className="text-gray-400 text-sm mt-2">Lives Impacted</p>
                                </div>
                                <div className="text-center">
                                    <div className="stats-number text-purple-400">30</div>
                                    <p className="text-gray-400 text-sm mt-2">Cities Covered</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ BRAND PARTNERSHIPS ============ */}
            <BrandPartnerships />

            {/* ============ CTA SECTION ============ */}
            <section className="cta-section">
                <div className="container">
                    <h2>Ready to Make a Difference?</h2>
                    <p>Join thousands of donors and NGOs making a positive impact every day</p>
                    <Link to="/register" className="btn-primary">
                        <FaGift className="inline-block mr-2" />
                        🎯 Start Donating Now
                        <FaArrowRight className="inline-block ml-2" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;