import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaShieldAlt, FaLock, FaUserSecret, FaCookie, FaFileContract, FaGavel } from 'react-icons/fa';

const PrivacyTerms = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* ============ HERO SECTION ============ */}
            <section className="relative py-20 bg-gradient-to-r from-amber-300 via-amber-500 to-orange-700 text-white overflow-hidden">
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
                            🔒 Privacy & Terms
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: 'emoji' }}>
                            Privacy Policy &{' '}
                            <span className="bg-gradient-to-r from-yellow-200 via-amber-300 to-amber-400 bg-clip-text text-transparent ">
                                Terms of Service
                            </span>
                        </h1>
                        <p className="text-xl text-blue-100 max-w-2xl">
                            Your privacy matters to us. Learn how we protect your data and what you agree to when using our platform.
                        </p>
                    </div>
                </div>
            </section>

            {/* ============ PRIVACY POLICY ============ */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <FaLock className="text-green-600" /> Information We Collect
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                We collect information you provide directly, including your name, email address, phone number, 
                                and donation details. We also collect information about your usage of our platform to improve 
                                your experience.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <FaUserSecret className="text-blue-600" /> How We Use Your Information
                            </h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                <li>To connect you with verified NGOs and beneficiaries</li>
                                <li>To process and track your donations</li>
                                <li>To send you updates about your donation status</li>
                                <li>To improve our platform and services</li>
                                <li>To comply with legal obligations</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <FaCookie className="text-yellow-600" /> Cookies and Tracking
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                We use cookies to enhance your experience, analyze site traffic, and personalize content. 
                                You can control cookie preferences in your browser settings.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <FaShieldAlt className="text-purple-600" /> Data Security
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                We implement robust security measures to protect your data, including encryption, secure servers, 
                                and regular security audits. Your information is stored securely and accessed only by authorized personnel.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Your Rights</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                <li>Access your personal data</li>
                                <li>Request correction of inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Opt-out of marketing communications</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ TERMS OF SERVICE ============ */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center gap-3 mb-6">
                        <FaFileContract className="text-4xl text-purple-600" />
                        <h2 className="text-3xl font-bold text-gray-800" style={{fontFamily: 'emoji'}}>Terms of Service</h2>
                    </div>
                    <p className="text-gray-500 text-sm mb-8">Last updated: June 2024</p>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <FaGavel className="text-red-600" /> Acceptance of Terms
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                By using our platform, you agree to these terms and conditions. If you do not agree, please 
                                do not use our services.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">User Responsibilities</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                <li>Provide accurate and truthful information</li>
                                <li>Ensure donated items are in usable condition</li>
                                <li>Respect the privacy and rights of other users</li>
                                <li>Comply with all applicable laws and regulations</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Donation Guidelines</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                <li>Items must be clean and in reusable condition</li>
                                <li>No hazardous or illegal items</li>
                                <li>Donations are final and cannot be returned</li>
                                <li>We reserve the right to refuse any donation</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Limitation of Liability</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our platform acts as an intermediary between donors and NGOs. We are not responsible for 
                                the quality or condition of donated items, nor for the actions of third-party NGOs.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Termination</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We reserve the right to terminate accounts that violate these terms or engage in fraudulent 
                                activities. Users may also delete their accounts at any time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyTerms;