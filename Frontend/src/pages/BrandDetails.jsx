import React from 'react';
import { Link } from 'react-router-dom';
import { 
    FaArrowLeft, FaLeaf, FaUsers, FaChartLine, FaHandshake, 
    FaArrowRight, FaCheckCircle, FaStar, FaGlobe, 
    FaRecycle, FaTree, FaAward 
} from 'react-icons/fa';
import heroImage from '../img/don8.png';

const BrandDetails = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* ============ HERO SECTION ============ */}
            <section 
                className="relative py-24 md:py-32 text-white overflow-hidden min-h-[500px] flex items-center"
                style={{
                    backgroundImage: `url(${heroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent"></div>
                
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition mb-8 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <FaArrowLeft /> Back to Home
                    </Link>

                    <div className="max-w-3xl">
                        <span className="inline-block px-4 py-1.5 bg-green-500/30 backdrop-blur-sm rounded-full text-sm font-semibold mb-4 border border-green-400/30">
                            🤝 Brand Partnerships
                        </span>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight" style={{fontFamily: 'emoji'}}>
                            Partner With Us to Create a{' '}
                            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                Sustainable Future
                            </span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-200 max-w-2xl leading-relaxed">
                            Join hands with leading brands to make a lasting impact through circularity, 
                            employee engagement, and innovative marketing campaigns.
                        </p>
                        
                        <div className="flex flex-wrap gap-4 mt-8">
                            <button className="px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full hover:bg-white/30 transition font-semibold" style={{fontFamily: 'emoji'}}>
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ STATS ============ */}
            <section className="py-12 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">50+</div>
                            <div className="text-sm text-gray-500 mt-1">Brand Partners</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">100+</div>
                            <div className="text-sm text-gray-500 mt-1">Campaigns Run</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">10,000+</div>
                            <div className="text-sm text-gray-500 mt-1">Items Donated</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">500+</div>
                            <div className="text-sm text-gray-500 mt-1">NGOs Supported</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ DETAILED SERVICES (Three Pillars) ============ */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4 font-sans" style={{fontFamily: 'emoji'}}>
                            How We <span className="text-green-600">Collaborate</span>
                        </h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                            Comprehensive partnership solutions designed to create meaningful impact
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Service 1 - Circularity Initiatives */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                                <FaRecycle />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3" style={{fontFamily: 'emoji'}}>
                                Circularity Initiatives
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Unleash the power of circularity to connect with your customers at a deeper level.
                            </p>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-2">
                                    <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                    <span>Product take-back and recycling initiatives</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                    <span>Closed-loop supply chain integration</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                    <span>Waste reduction and resource optimization</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                    <span>Carbon footprint tracking and reporting</span>
                                </li>
                            </ul>
                            <button className="mt-6 text-green-600 font-semibold hover:text-green-700 flex items-center gap-2">
                                Learn More <FaArrowRight className="text-sm" />
                            </button>
                        </div>

                        {/* Service 2 - Employee Engagement */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                                <FaUsers />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3" style={{fontFamily: 'emoji'}}>
                                Employee Engagement
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Supercharge your employee engagement with impactful and fun programs.
                            </p>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-2">
                                    <FaCheckCircle className="text-blue-500 mt-1 flex-shrink-0" />
                                    <span>Corporate donation drives and events</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <FaCheckCircle className="text-blue-500 mt-1 flex-shrink-0" />
                                    <span>Team building with social impact</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <FaCheckCircle className="text-blue-500 mt-1 flex-shrink-0" />
                                    <span>Volunteer programs and workshops</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <FaCheckCircle className="text-blue-500 mt-1 flex-shrink-0" />
                                    <span>Impact measurement and reporting</span>
                                </li>
                            </ul>
                            <button className="mt-6 text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
                                Learn More <FaArrowRight className="text-sm" />
                            </button>
                        </div>

                        {/* Service 3 - Bespoke Marketing Campaigns */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                                <FaChartLine />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3" style={{fontFamily: 'emoji'}}>
                                Bespoke Marketing Campaigns
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Create innovative campaigns that engage customers and drive sustainability.
                            </p>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-2">
                                    <FaCheckCircle className="text-purple-500 mt-1 flex-shrink-0" />
                                    <span>Sustainability-focused brand campaigns</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <FaCheckCircle className="text-purple-500 mt-1 flex-shrink-0" />
                                    <span>Co-branded donation initiatives</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <FaCheckCircle className="text-purple-500 mt-1 flex-shrink-0" />
                                    <span>Social media and content collaboration</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <FaCheckCircle className="text-purple-500 mt-1 flex-shrink-0" />
                                    <span>Customer engagement and loyalty programs</span>
                                </li>
                            </ul>
                            <button className="mt-6 text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-2">
                                Talk To Us <FaArrowRight className="text-sm" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ SUCCESS STORIES ============ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full mb-4">
                            🌟 Success Stories
                        </span>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{fontFamily: 'emoji'}}>
                            Brands Making a <span className="text-green-600">Difference</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-600">A</div>
                                <div>
                                    <h4 className="font-bold text-gray-800">Brand Alpha</h4>
                                    <div className="text-sm text-gray-500">Fashion Retail</div>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                                "Partnering with this platform helped us donate 5,000+ clothing items to 20+ NGOs, reducing our textile waste by 40%."
                            </p>
                            <div className="mt-3 flex items-center gap-1 text-yellow-400">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">B</div>
                                <div>
                                    <h4 className="font-bold text-gray-800">Brand Beta</h4>
                                    <div className="text-sm text-gray-500">Electronics</div>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                                "Their employee engagement program helped our team donate 200+ electronic items and raised $10,000 for local charities."
                            </p>
                            <div className="mt-3 flex items-center gap-1 text-yellow-400">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl font-bold text-purple-600">C</div>
                                <div>
                                    <h4 className="font-bold text-gray-800">Brand Gamma</h4>
                                    <div className="text-sm text-gray-500">Home Goods</div>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                                "Their marketing campaign reached 1M+ customers and drove a 25% increase in donations, while boosting our brand image."
                            </p>
                            <div className="mt-3 flex items-center gap-1 text-yellow-400">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ WHY PARTNER WITH US ============ */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{fontFamily: 'emoji'}}>
                            Why Partner With <span className="text-green-600">Us</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                <FaGlobe />
                            </div>
                            <h4 className="font-bold text-gray-800 mb-2" style={{fontFamily: 'emoji'}}>
                                Global Reach
                            </h4>
                            <p className="text-gray-500 text-sm" style={{fontFamily: 'emoji'}}>
                                Connect with NGOs and communities across 50+ cities
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                <FaHandshake />
                            </div>
                            <h4 className="font-bold text-gray-800 mb-2" style={{fontFamily: 'emoji'}}>
                                Trusted Network
                            </h4>
                            <p className="text-gray-500 text-sm" style={{fontFamily: 'emoji'}}>
                                100+ verified NGOs with transparent reporting
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                <FaAward />
                            </div>
                            <h4 className="font-bold text-gray-800 mb-2" style={{fontFamily: 'emoji'}}>
                                Measurable Impact
                            </h4>
                            <p className="text-gray-500 text-sm" style={{fontFamily: 'emoji'}}>
                                Track and report your social and environmental impact
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                <FaTree />
                            </div>
                            <h4 className="font-bold text-gray-800 mb-2" style={{fontFamily: 'emoji'}}>
                                Sustainability
                            </h4>
                            <p className="text-gray-500 text-sm" style={{fontFamily: 'emoji'}}>
                                Align with ESG goals and build a sustainable brand
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ CTA SECTION ============ */}
            <section className="py-20 bg-gradient-to-r from-orange-300 to-green-400 text-white">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold mb-4" style={{fontFamily: 'emoji'}}>
                        Ready to Partner With Us?
                    </h2>
                    <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto" style={{fontFamily: 'emoji'}}>
                        Let's work together to create a sustainable future. Contact our partnerships team today.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button className="px-8 py-4 bg-yellow-400 text-green-900 font-bold rounded-full hover:bg-yellow-300 transition shadow-lg hover:shadow-xl flex items-center gap-2">
                            <FaHandshake /> Partner Now
                        </button>
                        <Link 
    to="/contact" 
    className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full hover:bg-white/20 transition font-semibold inline-block"
>
    Schedule a Call
</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BrandDetails;