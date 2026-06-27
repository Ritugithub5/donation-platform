import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [openDropdown, setOpenDropdown] = useState(null);
    const closeTimeoutRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const getDashboardLink = () => {
        switch (user.role) {
            case 'donor': return '/donor';
            case 'ngo': return '/ngo';
            case 'admin': return '/admin';
            default: return '/';
        }
    };

    // Handle mouse enter with clear timeout
    const handleMouseEnter = (dropdown) => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setOpenDropdown(dropdown);
    };

    // Handle mouse leave with delay
    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setOpenDropdown(null);
            closeTimeoutRef.current = null;
        }, 300); // 300ms delay - gives time to move to dropdown
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    🎯 DonateNow
                </Link>

                <div className="nav-menu">
                    {/* HOME */}
                    <Link to="/" className="nav-link">Home</Link>

                    {/* ABOUT DROPDOWN */}
                    <div 
                        className="dropdown-container"
                        onMouseEnter={() => handleMouseEnter('about')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button className="nav-link dropdown-trigger">
                            About ▾
                        </button>
                        {openDropdown === 'about' && (
                            <div 
                                className="dropdown-menu show"
                                onMouseEnter={() => {
                                    if (closeTimeoutRef.current) {
                                        clearTimeout(closeTimeoutRef.current);
                                        closeTimeoutRef.current = null;
                                    }
                                }}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Link to="/about" className="dropdown-item">About Us</Link>
                                <Link to="/privacy-terms" className="dropdown-item">Privacy & Terms</Link>
                                <Link to="/contact" className="dropdown-item">Contact</Link>
                            </div>
                        )}
                    </div>

                    {/* SERVICES DROPDOWN */}
                    <div 
                        className="dropdown-container"
                        onMouseEnter={() => handleMouseEnter('services')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button className="nav-link dropdown-trigger">
                            Services ▾
                        </button>
                        {openDropdown === 'services' && (
                            <div 
                                className="dropdown-menu show"
                                onMouseEnter={() => {
                                    if (closeTimeoutRef.current) {
                                        clearTimeout(closeTimeoutRef.current);
                                        closeTimeoutRef.current = null;
                                    }
                                }}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Link to="/employee-engagement" className="dropdown-item">
                                    👥 Employee Engagement
                                </Link>
                                <Link to="/brand-partnerships" className="dropdown-item">
                                    🤝 Brand Partnerships
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* AUTH LINKS */}
                    {token ? (
                        <>
                            <Link to={getDashboardLink()} className="nav-link">
                                Dashboard
                            </Link>
                            <span className="nav-user">👤 {user.name}</span>
                            <button onClick={handleLogout} className="nav-logout">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link nav-register">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;