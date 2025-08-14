import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import FloatingCTA from './components/FloatingCTA';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import QuoteRequest from './components/QuoteRequest';
import EmailMigrationPage from './pages/EmailMigrationPage';
import EmailSecurityPage from './pages/EmailSecurityPage';
import SSLSetupPage from './pages/SSLSetupPage';
import CloudManagementPage from './pages/CloudManagementPage';
import DataMigrationPage from './pages/DataMigrationPage';
import HostingSupportPage from './pages/HostingSupportPage';
import BlogPostPage from './pages/BlogPostPage';
import ClientLogin from './pages/ClientLogin';
import ClientRegister from './pages/ClientRegister';
import ClientDashboard from './pages/ClientDashboard';
import ServicePurchase from './pages/ServicePurchase';
import PaymentSuccess from './pages/PaymentSuccess';
import InvoiceView from './pages/InvoiceView';
import Testimonials from './components/Testimonials';

function App() {
  const location = useLocation();

  React.useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Services />
              <About />
              <Testimonials />
              <Blog />
              <Contact />
              <FloatingCTA />
            </>
          } />
          <Route path="/services/email-migration" element={<EmailMigrationPage />} />
          <Route path="/services/email-security" element={<EmailSecurityPage />} />
          <Route path="/services/ssl-setup" element={<SSLSetupPage />} />
          <Route path="/services/cloud-management" element={<CloudManagementPage />} />
          <Route path="/services/data-migration" element={<DataMigrationPage />} />
          <Route path="/services/hosting-support" element={<HostingSupportPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/register" element={<ClientRegister />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/purchase/:serviceId" element={<ServicePurchase />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/invoice/:id" element={<InvoiceView />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;