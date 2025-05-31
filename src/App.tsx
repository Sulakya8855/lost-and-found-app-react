import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Import pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Placeholder routes for features to be implemented */}
            <Route
              path="/items"
              element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Browse Items</h2>
                    <p className="text-gray-600">This page will show all lost and found items</p>
                  </div>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/items/new"
              element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Report Item</h2>
                    <p className="text-gray-600">This page will allow users to report lost or found items</p>
                  </div>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/my-items"
              element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">My Items</h2>
                    <p className="text-gray-600">This page will show user's reported items</p>
                  </div>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/my-requests"
              element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">My Requests</h2>
                    <p className="text-gray-600">This page will show user's claim requests</p>
                  </div>
                </ProtectedRoute>
              }
            />
            
            {/* Admin/Staff routes */}
            <Route
              path="/manage-items"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Manage Items</h2>
                    <p className="text-gray-600">This page will allow staff to manage all items</p>
                  </div>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/manage-requests"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Manage Requests</h2>
                    <p className="text-gray-600">This page will allow staff to approve/reject requests</p>
                  </div>
                </ProtectedRoute>
              }
            />
            
            {/* Admin only routes */}
            <Route
              path="/manage-users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
                    <p className="text-gray-600">This page will allow admin to manage user roles</p>
                  </div>
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 page */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Page not found</p>
                    <a href="/dashboard" className="btn-primary">
                      Go to Dashboard
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
