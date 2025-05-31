import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import type { Item, ItemFormData } from '../types';

const EditItem: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<Item | null>(null);

  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    description: '',
    category: '',
    locationFound: '',
    dateReported: '',
    status: 'LOST',
  });

  // Redirect if user is not staff/admin
  if (!user || (user.role !== 'STAFF' && user.role !== 'ADMIN')) {
    navigate('/dashboard');
    return null;
  }

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        navigate('/dashboard');
        return;
      }

      try {
        setLoadingItem(true);
        const fetchedItem = await apiService.getItemById(parseInt(id));
        setItem(fetchedItem);
        
        // Populate form with existing item data
        setFormData({
          name: fetchedItem.name,
          description: fetchedItem.description,
          category: fetchedItem.category,
          locationFound: fetchedItem.locationFound,
          dateReported: fetchedItem.dateReported,
          status: fetchedItem.status,
        });
      } catch (err: any) {
        console.error('Error fetching item:', err);
        setError('Failed to load item. Please try again.');
      } finally {
        setLoadingItem(false);
      }
    };

    fetchItem();
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !item) return;

    setLoading(true);
    setError(null);

    try {
      await apiService.updateItem(parseInt(id), formData);
      navigate('/dashboard', { 
        state: { message: 'Item updated successfully!' } 
      });
    } catch (err: any) {
      console.error('Error updating item:', err);
      setError(err.response?.data?.message || 'Failed to update item. Please try again.');
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

  if (loadingItem) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Item Not Found</h1>
            <p className="text-gray-600 mb-4">The requested item could not be found.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Edit Item</h1>
            <p className="mt-1 text-sm text-gray-600">
              Update the details of "{item.name}".
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
                {loading ? 'Updating...' : 'Update Item'}
              </button>
            </div>
          </form>

          {/* Item Metadata */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Item Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Created:</span> {new Date(item.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span> {new Date(item.updatedAt).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Reported by:</span> {item.reportedByUsername}
              </div>
              {item.claimedByUsername && (
                <div>
                  <span className="font-medium">Claimed by:</span> {item.claimedByUsername}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditItem; 