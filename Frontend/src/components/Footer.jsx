import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import api from '../services/api';

const Footer = () => {
    const [contactInfo, setContactInfo] = useState({
        email: 'info@donatenow.com',
        phone: '+91 98765 43210',
        address: 'Mumbai, India'
    });
    const [loading, setLoading] = useState(true);

    const fetchContactInfo = async () => {
        try {
            const response = await api.get('/contact-info');
            console.log('📞 Contact info response:', response.data);
            
            if (response.data && response.data.success) {
                const info = response.data.data;
                setContactInfo({
                    email: info.email || 'info@donatenow.com',
                    phone: info.phone || '+91 98765 43210',
                    address: info.address || 'Mumbai, India'
                });
            } else if (response.data && response.data.data) {
                const info = response.data.data;
                setContactInfo({
                    email: info.email || 'info@donatenow.com',
                    phone: info.phone || '+91 98765 43210',
                    address: info.address || 'Mumbai, India'
                });
            } else if (response.data) {
                setContactInfo({
                    email: response.data.email || 'info@donatenow.com',
                    phone: response.data.phone || '+91 98765 43210',
                    address: response.data.address || 'Mumbai, India'
                });
            }
        } catch (error) {
            console.log('Error fetching contact info:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContactInfo();
        
        // Refresh every 30 seconds
        const interval = setInterval(fetchContactInfo, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <h3 className="footer-logo">🎯 DonateNow</h3>
                        <p className="footer-description">
                            Making a difference, one donation at a time.
                            Connect with verified NGOs and donate your unused items.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="social-link" aria-label="Facebook">📘</a>
                            <a href="#" className="social-link" aria-label="Twitter">🐦</a>
                            <a href="#" className="social-link" aria-label="Instagram">📸</a>
                            <a href="#" className="social-link" aria-label="LinkedIn">💼</a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/brand-partnerships">Brand Partnerships</Link></li>
                            <li><Link to="/register">Donate Now</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4 className="footer-heading">Support</h4>
                        <ul>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/privacy-terms">Privacy Policy</Link></li>
                            <li><Link to="/privacy-terms">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4 className="footer-heading">Get in Touch</h4>
                        {loading ? (
                            <p className="text-gray-400">Loading...</p>
                        ) : (
                            <>
                                {/* ✅ Clickable Email - Opens default email client */}
                                <p>
                                    📧{' '}
                                    <a 
                                        href={`mailto:${contactInfo.email}`}
                                        className="footer-contact-link"
                                        onClick={() => console.log('📧 Email clicked:', contactInfo.email)}
                                    >
                                        {contactInfo.email}
                                    </a>
                                </p>
                                
                                {/* ✅ Clickable Phone - Opens dialer on mobile */}
                                <p>
                                    📞{' '}
                                    <a 
                                        href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                                        className="footer-contact-link"
                                        onClick={() => console.log('📞 Phone clicked:', contactInfo.phone)}
                                    >
                                        {contactInfo.phone}
                                    </a>
                                </p>
                                
                                {/* ✅ Clickable Address - Opens Google Maps */}
                                <p>
                                    📍{' '}
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer-contact-link"
                                        onClick={() => console.log('📍 Address clicked:', contactInfo.address)}
                                    >
                                        {contactInfo.address}
                                    </a>
                                </p>
                            </>
                        )}
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} DonateNow. All rights reserved.</p>
                    <p className="footer-tagline">Making a difference, one donation at a time.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;