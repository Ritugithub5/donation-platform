import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import AdminDashboard from './pages/AdminDashboard';
import BeneficiariesPage from './pages/BeneficiariesPage'; // ✅ New Import
import CategoryPage from './pages/CategoryPage';
import DonationDetails from './pages/DonationDetails';
import BrandDetails from './pages/BrandDetails';
import EmployeeEngagement from './pages/EmployeeEngagement';
import About from './pages/About';
import PrivacyTerms from './pages/PrivacyTerms';
import Contact from './pages/Contact';

function App() {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/privacy-terms" element={<PrivacyTerms />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/category/:categoryName" element={<CategoryPage />} />
                        <Route path="/donation/:donationId" element={<DonationDetails />} />
                        <Route path="/brand-partnerships" element={<BrandDetails />} />
                        <Route path="/employee-engagement" element={<EmployeeEngagement />} />

                        {/* Protected Routes */}
                        <Route 
                            path="/donor" 
                            element={
                                <ProtectedRoute allowedRoles={['donor']}>
                                    <DonorDashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/ngo" 
                            element={
                                <ProtectedRoute allowedRoles={['ngo']}>
                                    <NGODashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/admin" 
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } 
                        />
                        {/* ✅ New Beneficiaries Route - Only NGO can access */}
                        <Route 
                            path="/beneficiaries" 
                            element={
                                <ProtectedRoute allowedRoles={['ngo']}>
                                    <BeneficiariesPage />
                                </ProtectedRoute>
                            } 
                        />
                    </Routes>
                </main>
                <Footer />
                <ToastContainer 
                    position="top-right" 
                    autoClose={3000} 
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>
        </Router>
    );
}

export default App;