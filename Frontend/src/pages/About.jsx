import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaChevronDown, FaChevronUp, FaHeart, FaUsers, FaGlobe, FaHandsHelping, FaLeaf, FaTruck, FaBox, FaStar } from 'react-icons/fa';
import aboutImage from '../img/don7.png';

const About = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            question: 'What is DonateNow?',
            answer: 'DonateNow is a donation and reuse platform that connects donors with verified NGOs and beneficiaries. We make it easy to donate unused clothes, household items, books, electronics, and furniture to those who need them most.'
        },
        {
            question: 'How does the donation process work?',
            answer: 'Simply register as a donor, list your items, select a verified NGO, schedule a doorstep pickup, and track your donation\'s journey until it reaches those in need. It\'s that simple!'
        },
        {
            question: 'Is the platform free for donors?',
            answer: 'Yes! 100% free for donors. We believe in making giving accessible to everyone. Our platform connects you with NGOs at no cost.'
        },
        {
            question: 'How do you verify NGOs?',
            answer: 'We have a strict verification process for NGOs. Each organization undergoes thorough background checks, documentation verification, and regular audits to ensure transparency and credibility.'
        },
        {
            question: 'What items can I donate?',
            answer: 'You can donate clothes, household items, books, electronics, furniture, and many other reusable items. All items should be in usable condition.'
        },
        {
            question: 'How can I track my donation?',
            answer: 'You can track your donation status in real-time through your donor dashboard. You\'ll see updates from "pending" to "accepted" to "collected" to "distributed".'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ============ HERO SECTION - CLEAN BACKGROUND ============ */}
            <section className="relative py-20 bg-white overflow-hidden border-b border-gray-100">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition mb-8 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full">
                        <FaArrowLeft /> Back to Home
                    </Link>

                    {/* Side by Side Grid */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left - Content */}
                        <div>
                            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-sm font-semibold rounded-full mb-4">
                                📖 About Us
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight" style={{fontFamily: 'emoji'}}>
                                Making a Difference,{' '}
                                <span className="bg-gradient-to-r from-blue-400 to-blue-700 text-transparent bg-clip-text">One Donation at a Time</span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mb-4">
                                We're on a mission to connect generosity with need, creating a sustainable future for all.
                            </p>
                            <p className="text-gray-500 text-base max-w-2xl leading-relaxed">
                                Our platform bridges the gap between those who want to give and those who need, 
                                making it simple, transparent, and impactful.
                            </p>
                            <div className="flex flex-wrap gap-4 mt-6">
                                <Link to="/register" className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-600 text-white font-bold rounded-full hover:bg-blue-700 transition shadow-lg hover:shadow-xl">
                                    Get Started
                                </Link>
                            </div>
                        </div>

                        {/* Right - Image */}
                        <div className="hidden md:block">
                            <div className="rounded-2xl overflow-hidden shadow-xl">
                                <img 
                                    src={aboutImage} 
                                    alt="About DonateNow"
                                    className="w-full h-auto object-cover hover:scale-105 transition duration-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ OUR MISSION ============ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full mb-4">
                            🎯 Our Mission
                        </span>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'emoji' }}>
                            Why We <span className="bg-gradient-to-r from-blue-400 to-blue-700 text-transparent bg-clip-text">Exist</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                                <FaHeart className="text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Connect Hearts</h3>
                            <p className="text-gray-500">We bridge the gap between those who want to give and those who need, creating meaningful connections.</p>
                        </div>
                        <div className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                                <FaLeaf className="text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Reduce Waste</h3>
                            <p className="text-gray-500">By reusing and recycling items, we help reduce landfill waste and promote environmental sustainability.</p>
                        </div>
                        <div className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition">
                            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                                <FaUsers className="text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Empower Communities</h3>
                            <p className="text-gray-500">We empower communities by providing access to essential items and creating opportunities for growth.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ FAQ SECTION ============ */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
                            ❓ FAQ
                        </span>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'emoji' }}>
                            Frequently Asked <span className="bg-gradient-to-r from-blue-400 to-blue-700 text-transparent bg-clip-text">Questions</span>
                        </h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                            Find answers to the most common questions about our platform
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <span className="font-semibold text-gray-800">{faq.question}</span>
                                    {openFaq === index ? (
                                        <FaChevronUp className="text-green-600" />
                                    ) : (
                                        <FaChevronDown className="text-gray-400" />
                                    )}
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                        <p className="text-gray-600">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ CTA ============ */}
            <section className="py-16 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-800 text-white">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
                    <p className="text-blue-100 mb-6">We're here to help. Reach out to us anytime.</p>
                    <Link to="/contact" className="inline-block px-8 py-3 bg-gradient-to-r from-blue-200 to-blue-400 text-white font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all">
                        Contact Us →
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default About;