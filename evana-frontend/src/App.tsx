import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import EventManagement from './pages/EventManagement';
import ArtistManagement from './pages/ArtistManagement';
import UserManagement from './pages/UserManagement';
import Artists from './pages/Artists';
import Schedule from './pages/Schedule';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import About from './pages/About';
import Tickets from './pages/Tickets';
import AdminProfile from './pages/AdminProfile';
import UserProfile from './pages/UserProfile';



const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Dashboards */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/user" element={<UserDashboard />} />

            {/* Admin gestion événements */}
            <Route path="/admin/events" element={<EventManagement />} />
            <Route path="/admin/artists" element={<ArtistManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />

            {/* Autres pages publiques */}
            <Route path="/artists" element={<Artists />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
<Route path="/user/profile" element={<UserProfile />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;