import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // Function to get display name
  const getDisplayName = () => {
    if (!user) return '';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-blue-600">Lost & Found</h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/dashboard')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/items"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/items')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Browse Items
            </Link>

            <Link
              to="/my-requests"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/my-requests')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              My Requests
            </Link>

            {(user.role === 'ADMIN' || user.role === 'STAFF') && (
              <>
                <Link
                  to="/manage-items"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/manage-items')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Manage Items
                </Link>
                <Link
                  to="/manage-requests"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/manage-requests')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Manage Requests
                </Link>
              </>
            )}

            {user.role === 'ADMIN' && (
              <Link
                to="/manage-users"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/manage-users')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Manage Users
              </Link>
            )}

            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
              <span className="text-sm text-gray-700">
                {getDisplayName()}
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/dashboard')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                to="/items"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/items')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Items
              </Link>

              <Link
                to="/my-requests"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/my-requests')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Requests
              </Link>

              {(user.role === 'ADMIN' || user.role === 'STAFF') && (
                <>
                  <Link
                    to="/manage-items"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/manage-items')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Manage Items
                  </Link>
                  <Link
                    to="/manage-requests"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/manage-requests')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Manage Requests
                  </Link>
                </>
              )}

              {user.role === 'ADMIN' && (
                <Link
                  to="/manage-users"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/manage-users')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Manage Users
                </Link>
              )}

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="px-3 py-2">
                  <p className="text-sm text-gray-700">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 