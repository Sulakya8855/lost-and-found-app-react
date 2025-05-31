import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import type { ItemFormData } from '../types';

const AddItem: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    description: '',
    category: '',
    locationFound: '',
    dateReported: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    status: 'LOST',
  });

  // Redirect if user is not staff/admin
  if (!user || (user.role !== 'STAFF' && user.role !== 'ADMIN')) {
    navigate('/dashboard');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiService.createItem(formData);
      navigate('/dashboard', { 
        state: { message: 'Item created successfully!' } 
      });
    } catch (err: any) {
      console.error('Error creating item:', err);
      setError(err.response?.data?.message || 'Failed to create item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Personal Items',
    'Accessories',
    'Sports Equipment',
    'Bags',
    'Keys',
    'Documents',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Add New Item</h1>
            <p className="mt-1 text-sm text-gray-600">
              Report a new lost or found item to the system.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Item Name */}
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Item Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., iPhone 13, Blue backpack, etc."
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="LOST">Lost</option>
                  <option value="FOUND">Found</option>
                  <option value="CLAIMED">Claimed</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="locationFound" className="block text-sm font-medium text-gray-700">
                  Location {formData.status === 'LOST' ? 'Last Seen' : 'Found'} *
                </label>
                <input
                  type="text"
                  id="locationFound"
                  name="locationFound"
                  required
                  value={formData.locationFound}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Library, Cafeteria, Room 101"
                />
              </div>

              {/* Date Reported */}
              <div>
                <label htmlFor="dateReported" className="block text-sm font-medium text-gray-700">
                  Date Reported *
                </label>
                <input
                  type="date"
                  id="dateReported"
                  name="dateReported"
                  required
                  value={formData.dateReported}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide detailed description including color, brand, distinctive features, etc."
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !formData.name || !formData.category || !formData.description}
              >
                {loading ? 'Creating...' : 'Create Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItem; 