import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const BrandPartnerships = () => {
    return (
        <section 
            id="brand-partnerships"
            className="py-20 bg-gradient-to-b from-gray-50 to-white scroll-mt-20"
        >
            <div className="max-w-7xl mx-auto px-4">
                {/* ============ HEADER ============ */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full mb-4">
                        🤝 Collaborate With Us
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                        Brand <span className="text-green-600">Collaborations</span>
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-4">
                        Let's work together to create a sustainable future and make a lasting impact
                    </p>
                </div>

                {/* ============ HERO CARD ============ */}
                <div className="bg-gradient-to-r from-green-500 to-green-950 rounded-3xl overflow-hidden shadow-2xl mb-16">
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col lg:flex-row items-center gap-8">
                            {/* Left Content */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-3xl">🎯</span>
                                    <span className="text-white/80 text-sm font-medium">Featured Initiative</span>
                                    <span className="px-2 py-0.5 bg-yellow-400/30 text-yellow-200 text-xs rounded-full border border-yellow-400/30">
                                        New
                                    </span>
                                </div>
                                
                                <h3 className="text-2xl md:text-4xl font-bold text-white mb-3">
                                    Donate. Reuse. <span className="text-yellow-300">Impact.</span>
                                </h3>
                                
                                <p className="text-green-100 text-base md:text-lg mb-6 max-w-lg">
                                    Your unused items can change someone's life. 
                                    Schedule a free doorstep pickup today and make a difference.
                                </p>
                                
                                <div className="flex flex-wrap gap-3">
                                    <a 
                                        href="/brand-partnerships"
                                        className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition border border-white/30"
                                    >
                                        Learn More →
                                    </a>
                                </div>
                            </div>

                            {/* Right Icons */}
                            <div className="flex gap-4">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center border border-white/10 hover:bg-white/20 transition">
                                    <div className="text-2xl font-bold text-yellow-300">♻️</div>
                                    <div className="text-xs text-white/80 mt-1">Eco-Friendly</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center border border-white/10 hover:bg-white/20 transition">
                                    <div className="text-2xl font-bold text-yellow-300">🤝</div>
                                    <div className="text-xs text-white/80 mt-1">Trusted NGOs</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center border border-white/10 hover:bg-white/20 transition">
                                    <div className="text-2xl font-bold text-yellow-300">📦</div>
                                    <div className="text-xs text-white/80 mt-1">Free Pickup</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandPartnerships;