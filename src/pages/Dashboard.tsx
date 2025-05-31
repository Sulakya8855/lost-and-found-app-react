import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import type { Item, Request } from '../types';

interface DashboardStats {
  totalItems: number;
  lostItems: number;
  foundItems: number;
  claimedItems: number;
  myItems: number;
  myRequests: number;
  pendingRequests: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    lostItems: 0,
    foundItems: 0,
    claimedItems: 0,
    myItems: 0,
    myRequests: 0,
    pendingRequests: 0,
  });
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all items for stats
        const allItems = await apiService.getAllItems();
        const myItems = await apiService.getMyItems();
        const myRequests = await apiService.getMyRequests();
        
        // Calculate stats
        const lostItems = allItems.filter(item => item.status === 'LOST').length;
        const foundItems = allItems.filter(item => item.status === 'FOUND').length;
        const claimedItems = allItems.filter(item => item.status === 'CLAIMED').length;
        const pendingRequests = myRequests.filter(req => req.status === 'PENDING').length;

        setStats({
          totalItems: allItems.length,
          lostItems,
          foundItems,
          claimedItems,
          myItems: myItems.length,
          myRequests: myRequests.length,
          pendingRequests,
        });

        // Get recent items (last 5)
        const recentItems = allItems
          .sort((a, b) => new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime())
          .slice(0, 5);
        setRecentItems(recentItems);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set default values on error to prevent crash
        setStats({
          totalItems: 0,
          lostItems: 0,
          foundItems: 0,
          claimedItems: 0,
          myItems: 0,
          myRequests: 0,
          pendingRequests: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'LOST':
        return 'status-lost';
      case 'FOUND':
        return 'status-found';
      case 'CLAIMED':
        return 'status-claimed';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium';
    }
  };

  // Function to get display name
  const getDisplayName = () => {
    if (!user) return 'User';
    if (user.firstName) {
      return user.firstName;
    }
    return user.username;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {getDisplayName()}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening in the Lost & Found system
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lost Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lostItems}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Found Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.foundItems}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.myItems}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Link
                to="/items/new"
                className="block w-full btn-primary text-center"
              >
                Report Lost/Found Item
              </Link>
              
              <Link
                to="/items"
                className="block w-full btn-secondary text-center"
              >
                Browse All Items
              </Link>
              
              <Link
                to="/my-items"
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-center"
              >
                View My Items ({stats.myItems})
              </Link>
              
              <Link
                to="/my-requests"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-center"
              >
                My Requests ({stats.myRequests})
              </Link>
            </div>
          </div>

          {/* Recent Items */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Items</h2>
              <Link
                to="/items"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                View all
              </Link>
            </div>
            
            {recentItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No items reported yet</p>
            ) : (
              <div className="space-y-3">
                {recentItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.location}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.dateReported).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={getStatusClass(item.status)}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Admin/Staff Section */}
        {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
          <div className="mt-8">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/manage-items"
                  className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <h3 className="font-medium text-blue-900">Manage Items</h3>
                  <p className="text-sm text-blue-700 mt-1">Review and update item statuses</p>
                </Link>
                
                <Link
                  to="/manage-requests"
                  className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <h3 className="font-medium text-green-900">Manage Requests</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Handle claim requests ({stats.pendingRequests} pending)
                  </p>
                </Link>
                
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/manage-users"
                    className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <h3 className="font-medium text-purple-900">Manage Users</h3>
                    <p className="text-sm text-purple-700 mt-1">Manage user roles and permissions</p>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 