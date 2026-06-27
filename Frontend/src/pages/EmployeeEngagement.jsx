import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import heroImage from '../img/don5.png';
import don2Image from '../img/don2.png';
import don6Image from '../img/don6.png';
import don4Image from '../img/don4.png';
import { 
    FaArrowLeft, 
    FaGift, 
    FaBox, 
    FaLaptop, 
    FaTruck, 
    FaChartLine, 
    FaUsers, 
    FaLeaf, 
    FaHeart,
    FaCheckCircle,
    FaArrowRight,
    FaPhone,
    FaEnvelope,
    FaUser,
    FaBuilding,
    FaGlobe,
    FaTree,
    FaRecycle,
    FaHandshake,
    FaAward
} from 'react-icons/fa';
import api from '../services/api';

const EmployeeEngagement = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        collaboration: '',
        requirement: '',
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ✅ Updated handleSubmit to save to database
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate
        if (!formData.name || !formData.email || !formData.phone) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        
        try {
            const response = await api.post('/employee-engagement', formData);
            console.log('✅ Employee engagement form submitted:', response.data);
            
            toast.success('Form submitted successfully! We will get back to you soon.');
            setSubmitted(true);
            
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                collaboration: '',
                requirement: '',
            });
            
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            console.error('❌ Error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Scroll to contact section
    const scrollToContact = () => {
        const contactSection = document.getElementById('contact-section');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ============ HERO SECTION ============ */}
            <section 
                className="relative py-20 md:py-28 text-white overflow-hidden"
                style={{
                    backgroundImage: `url(${heroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/85 via-green-800/70 to-green-700/50"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition mb-6 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <FaArrowLeft /> Back to Home
                    </Link>

                    <div className="max-w-3xl">
                        <span className="inline-block px-4 py-1.5 bg-green-500/30 backdrop-blur-sm rounded-full text-sm font-semibold mb-4 border border-green-400/30">
                            👥 Employee Engagement
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight" style= {{fontFamily: 'emoji'}}>
                            Empower Your{' '}
                            <span className="bg-gradient-to-r from-green-500 to-green-800 bg-clip-text text-transparent">
                                Employees
                            </span>
                        </h1>
                        <p className="text-xl text-gray-200 max-w-2xl leading-relaxed">
                            Create meaningful impact through employee engagement initiatives. 
                            Give your team the gift of giving back.
                        </p>
                    </div>
                </div>
            </section>

            {/* ============ WHAT WE DO FOR YOU - SIDE BY SIDE ============ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full mb-4">
                            🎯 Our Services
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800" style= {{fontFamily: 'emoji'}}>
                            What We Do <span className="text-green-600">For You</span>
                        </h2>
                    </div>

                    {/* Card 1 - Donation Pickup for Employees (Image Left) */}
                    <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 mb-12 border border-gray-100">
                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Image - Left */}
                            <div className="h-64 md:h-auto overflow-hidden">
                                <img 
                                    src={don6Image} 
                                    alt="Donation Pickup for Employees"
                                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                />
                            </div>
                            {/* Content - Right */}
                            <div className="p-8 md:p-10 flex flex-col justify-center">
                                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                                    <FaTruck className="text-green-800" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3" style= {{fontFamily: 'emoji'}}>
                                    Donation Pickup for Employees
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Give your employees the <span className="font-semibold text-green-600">"gift of giving back"</span> 
                                    with donation pickup from their homes.
                                </p>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Sign up for our engagement initiative <span className="font-semibold">"Go Circular 100"</span> 
                                    and avail sponsored donation pickup services. This is a perfect initiative for 
                                    environmentalists to engage remote employees in a fun and create a tangible 
                                    social and environmental impact.
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-green-600 text-sm">
                                    <FaCheckCircle /> Perfect for remote teams
                                </div>
                                
                                {/* HOVER EFFECT BUTTON */}
                                <div className="relative mt-6 w-fit">
                                    <button 
                                        onClick={scrollToContact}
                                        onMouseEnter={() => setHoveredButton('donation-pickup')}
                                        onMouseLeave={() => setHoveredButton(null)}
                                        className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition flex items-center gap-2"
                                    >
                                        Reach Out to Us <FaArrowRight className="text-sm" />
                                    </button>
                                    {hoveredButton === 'donation-pickup' && (
                                        <div className="absolute left-0 top-full mt-2 px-4 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
                                            💬 Let's talk about Donation pickup for employees
                                            <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-800 rotate-45"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 - Donate Surplus Stock (Image Right) */}
                    <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Content - Left */}
                            <div className="p-8 md:p-10 flex flex-col justify-center order-2 md:order-1">
                                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                                    <FaBox className="text-green-800" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3" style= {{fontFamily: 'emoji'}}>
                                    Donate Surplus Stock
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Have dead stock or <span className="font-semibold text-green-600">unused surplus inventory</span> 
                                    lying in your warehouse or store for a long time?
                                </p>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Join our <span className="font-semibold">"360 Sharing"</span> initiative to keep your 
                                    excess products away from landfills. Donate items like clothes, shoes, toys, 
                                    accessories, non-expired sanitary products that are unsold but in perfectly 
                                    reusable condition.
                                </p>
                                <p className="text-gray-500 text-sm leading-relaxed mt-2">
                                    Perfect for e-commerce platforms, sellers, retailers, consumer brands, 
                                    distributors, wholesalers, and dealers looking to create impact while 
                                    meeting business objectives.
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-green-600 text-sm">
                                    <FaCheckCircle /> Reduce waste, create impact
                                </div>
                                
                                {/* HOVER EFFECT BUTTON */}
                                <div className="relative mt-6 w-fit">
                                    <button 
                                        onClick={scrollToContact}
                                        onMouseEnter={() => setHoveredButton('surplus-stock')}
                                        onMouseLeave={() => setHoveredButton(null)}
                                        className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition flex items-center gap-2"
                                    >
                                        Reach Out to Us <FaArrowRight className="text-sm" />
                                    </button>
                                    {hoveredButton === 'surplus-stock' && (
                                        <div className="absolute left-0 top-full mt-2 px-4 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
                                            💬 Let's talk about Donate Surplus Stock
                                            <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-800 rotate-45"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Image - Right */}
                            <div className="h-64 md:h-auto overflow-hidden order-1 md:order-2">
                                <img 
                                    src={don2Image} 
                                    alt="Donate Surplus Stock"
                                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ WHAT MAKES US EFFECTIVE ============ */}
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
                            <h2 className="text-4xl md:text-5xl font-bold text-white" style= {{fontFamily: 'emoji'}}>
                                What Makes Us <span className="bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent">
                                    Effective
                                </span>

                            </h2>
                            <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-4">
                                Discover how we create lasting impact through innovative solutions
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="parallax-card">
                                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl mb-4 backdrop-blur-sm">
                                    <FaLaptop className="text-blue-300" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2" style= {{fontFamily: 'emoji'}}>
                                    Tech-driven Process
                                </h4>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Customized tech solutions as per your focus areas - Net zero goals, 
                                    SDGs, social impact etc. to meet your yearly objectives and provide flexibility.
                                </p>
                            </div>

                            <div className="parallax-card">
                                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl mb-4 backdrop-blur-sm">
                                    <FaGlobe className="text-blue-300" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2" style= {{fontFamily: 'emoji'}}>
                                    Super Convenient
                                </h4>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Your employees can easily take part in the campaigns even when they are working 
                                    remotely as our donation pickup services are available across 2000+ cities in India.
                                </p>
                            </div>

                            <div className="parallax-card">
                                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl mb-4 backdrop-blur-sm">
                                    <FaUsers className="text-blue-300" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2" style= {{fontFamily: 'emoji'}}>
                                    High Engagement
                                </h4>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    With the end to end support in promotions and marketing, exclusive webinars, 
                                    and gamified integrations and rewards, you would be able to provide a unique 
                                    and fun experience for your employees.
                                </p>
                            </div>

                            <div className="parallax-card">
                                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl mb-4 backdrop-blur-sm">
                                    <FaChartLine className="text-blue-300" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2" style= {{fontFamily: 'emoji'}}>
                                    Measurable Impact
                                </h4>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Get regular impact reports and insights to understand the social 
                                    and environmental impact made by your employees.
                                </p>
                            </div>
                        </div>

                        {/* Impact In Numbers */}
                        <div className="mt-20 pt-10 border-t border-white/10">
                            <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-12" style= {{fontFamily: 'emoji'}}>
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

            {/* ============ CONTACT FORM SECTION - DYNAMIC ============ */}
            <section id="contact-section" className="py-20 bg-white scroll-mt-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Left - Form */}
                        <div>
                            <div className="mb-8">
                                <span className="inline-block px-4 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full mb-4">
                                    📝 Get In Touch
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-800" style= {{fontFamily: 'emoji'}}>
                                    Let's <span className="text-green-600">Talk!</span>
                                </h2>
                                <p className="text-gray-500 mt-2">
                                    Fill up the form, and we'll get in touch with you.
                                </p>
                                {submitted && (
                                    <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                                        ✅ Form submitted successfully! We'll get back to you soon.
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Work Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="example@domain.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Phone <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="+91 xxxxx xxxxx"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        name="company"
                                        placeholder="Your company name"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Choose Collaboration Option
                                    </label>
                                    <select
                                        name="collaboration"
                                        value={formData.collaboration}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="donation-pickup">Donation Pickup for Employees</option>
                                        <option value="surplus-stock">Donate Surplus Stock</option>
                                        <option value="employee-engagement">Employee Engagement Programs</option>
                                        <option value="custom">Custom Initiative</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Your Requirement
                                    </label>
                                    <textarea
                                        name="requirement"
                                        placeholder="Tell us what you are looking for..."
                                        value={formData.requirement}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Submitting...' : 'SUBMIT'} <FaArrowRight />
                                </button>
                            </form>
                        </div>

                        {/* Right - Info */}
                        <div className="hidden md:flex flex-col justify-center">
                            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-8 text-white">
                                <div className="text-6xl mb-6">🤝</div>
                                <h3 className="text-2xl font-bold mb-4" style= {{fontFamily: 'emoji'}}>Why Partner With Us?</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <FaCheckCircle className="text-green-300 mt-1 flex-shrink-0" />
                                        <span>2000+ cities coverage across India</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <FaCheckCircle className="text-green-300 mt-1 flex-shrink-0" />
                                        <span>Verified NGOs and transparent reporting</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <FaCheckCircle className="text-green-300 mt-1 flex-shrink-0" />
                                        <span>Customized engagement programs</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <FaCheckCircle className="text-green-300 mt-1 flex-shrink-0" />
                                        <span>Measurable social and environmental impact</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <FaCheckCircle className="text-green-300 mt-1 flex-shrink-0" />
                                        <span>Gamified rewards and recognition</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ CTA - MINIMAL ============ */}
            <section className="py-12 bg-gradient-to-r from-orange-300 to-green-400"> 
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-gray-800 mb-3" style={{fontFamily: 'emoji'}}>
                        Ready to{' '}
                        <span className="bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent"> {/* 🔵 Blue to Cyan */}
                            Make a Difference
                        </span>
                        ?
                    </h2>
                    <p className="text-gray-600 mb-5" style={{fontFamily: 'emoji'}}>
                        Join <span className="font-semibold text-emerald-600">thousands</span> of donors & NGOs {/* 🔵 Blue */}
                    </p>
                    <Link 
                        to="/register" 
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-xl transition shadow-lg" 
                    >
                        🎯 Start Donating <FaArrowRight />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default EmployeeEngagement;