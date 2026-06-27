import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    FaArrowLeft, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, 
    FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowRight 
} from 'react-icons/fa';
import api from '../services/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        
        try {
            // ✅ Send to backend - this will be stored in database
            const response = await api.post('/contact', formData);
            console.log('✅ Form submitted:', response.data);
            
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setSubmitted(true);
            
            // ✅ Update footer contact info by making a PUT request to update contact info
            try {
                await api.put('/api/contact-info', {
                    email: formData.email,
                    phone: formData.phone || '+91 98765 43210',
                    address: formData.location || 'Mumbai, India'
                });
                console.log('✅ Contact info updated in database');
            } catch (updateError) {
                console.log('Could not update contact info:', updateError);
            }
            
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                location: '',
                subject: '',
                message: '',
            });
            
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            console.error('❌ Error:', error);
            toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ============ HERO SECTION ============ */}
            <section className="relative py-20 bg-gradient-to-r from-purple-300 via-purple-600 to-purple-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition mb-6 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <FaArrowLeft /> Back to Home
                    </Link>
                    <div className="max-w-3xl">
                        <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
                            📬 Get In Touch
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{fontFamily: 'emoji'}}>
                            We'd Love to Hear{' '}
                            <span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent font-bold">
                                From You
                            </span>
                        </h1>
                        <p className="text-xl text-purple-100 max-w-2xl">
                            Have questions, feedback, or collaboration ideas? Reach out to us anytime.
                        </p>
                    </div>
                </div>
            </section>

            {/* ============ CONTACT INFO + FORM ============ */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Contact Info Cards */}
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                <FaPhone className="text-green-600" />
                            </div>
                            <h3 className="font-bold text-gray-800 mb-2">Phone</h3>
                            <p className="text-gray-500">+91 98765 43210</p>
                            <p className="text-gray-500 text-sm">Mon-Fri, 9 AM - 6 PM</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                <FaEnvelope className="text-blue-600" />
                            </div>
                            <h3 className="font-bold text-gray-800 mb-2">Email</h3>
                            <p className="text-gray-500">info@donatenow.com</p>
                            <p className="text-gray-500 text-sm">support@donatenow.com</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                <FaMapMarkerAlt className="text-purple-600" />
                            </div>
                            <h3 className="font-bold text-gray-800 mb-2">Address</h3>
                            <p className="text-gray-500">123 Giving Lane,</p>
                            <p className="text-gray-500">Mumbai, India 400001</p>
                        </div>
                    </div>

                    {/* Form + Sidebar */}
                    <div className="grid md:grid-cols-5 gap-8">
                        {/* Form */}
                        <div className="md:col-span-3 bg-white p-8 rounded-2xl shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{fontFamily: 'emoji'}}>
                                Send Us a Message
                            </h2>
                            <p className="text-gray-500 mb-6">We'll get back to you within 24 hours</p>

                            {submitted && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4">
                                    ✅ Thank you! Your message has been sent successfully.
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            placeholder="Enter your location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Subject *</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        placeholder="How can we help?"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                        required
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Message *</label>
                                    <textarea
                                        name="message"
                                        rows="5"
                                        placeholder="Tell us what's on your mind..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-6 w-full py-4 bg-gradient-to-r from-purple-300 to-purple-700 text-white font-bold rounded-xl hover:from-purple-700 hover:to-purple-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? 'Sending...' : 'Send Message'} <FaArrowRight />
                                </button>
                            </form>
                        </div>

                        {/* Info Sidebar */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-gradient-to-br from-purple-400 to-purple-700 rounded-2xl p-8 text-white">
                                <h3 className="text-2xl font-bold mb-4" style= {{fontFamily: 'emoji'}}>
                                    Why Contact Us?
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-yellow-300 text-xl">✓</span>
                                        <span>Questions about donating</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-yellow-300 text-xl">✓</span>
                                        <span>Partnership opportunities</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-yellow-300 text-xl">✓</span>
                                        <span>Feedback and suggestions</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-yellow-300 text-xl">✓</span>
                                        <span>Technical support</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-yellow-300 text-xl">✓</span>
                                        <span>Media inquiries</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-md">
                                <h4 className="font-bold text-gray-800 mb-3">Office Hours</h4>
                                <div className="flex items-start gap-3 text-gray-600">
                                    <FaClock className="text-purple-600 mt-1" />
                                    <div>
                                        <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                                        <p>Saturday: 10:00 AM - 2:00 PM</p>
                                        <p>Sunday: Closed</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-md">
                                <h4 className="font-bold text-gray-800 mb-3">Follow Us</h4>
                                <div className="flex gap-4 text-2xl">
                                    <a href="#" className="text-blue-600 hover:text-blue-800 transition"><FaFacebook /></a>
                                    <a href="#" className="text-cyan-500 hover:text-cyan-700 transition"><FaTwitter /></a>
                                    <a href="#" className="text-pink-600 hover:text-pink-800 transition"><FaInstagram /></a>
                                    <a href="#" className="text-blue-700 hover:text-blue-900 transition"><FaLinkedin /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;