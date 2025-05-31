import React from 'react';
import { Link } from 'react-router-dom';
import type { Item } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ItemCardProps {
  item: Item;
  onStatusUpdate?: (itemId: number, newStatus: string) => void;
  onDelete?: (itemId: number) => void;
  showActions?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  onStatusUpdate, 
  onDelete, 
  showActions = false 
}) => {
  const { user } = useAuth();

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

  const canModify = user && (
    user.role === 'ADMIN' || 
    user.role === 'STAFF' || 
    user.id === item.reportedById
  );

  const canClaim = user && (
    item.status === 'FOUND' && 
    user.id !== item.reportedById
  );

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      {/* Item Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
        <span className={getStatusClass(item.status)}>
          {item.status}
        </span>
      </div>

      {/* Item Details */}
      <div className="space-y-2 mb-4">
        <p className="text-gray-600">{item.description}</p>
        
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {item.locationFound}
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {item.category}
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z" />
          </svg>
          {new Date(item.dateReported).toLocaleDateString()}
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Reported by: {item.reportedByUsername}
        </div>

        {item.claimedByUsername && (
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Claimed by: {item.claimedByUsername}
          </div>
        )}

        {item.heldByUsername && (
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Held by: {item.heldByUsername}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
        {canClaim && (
          <button className="btn-primary text-sm">
            Request Item
          </button>
        )}

        {showActions && canModify && (
          <>
            {onStatusUpdate && (
              <div className="flex gap-1">
                {item.status === 'LOST' && (
                  <button
                    onClick={() => onStatusUpdate(item.id, 'FOUND')}
                    className="btn-success text-xs"
                  >
                    Mark Found
                  </button>
                )}
                {item.status === 'FOUND' && (
                  <button
                    onClick={() => onStatusUpdate(item.id, 'CLAIMED')}
                    className="btn-warning text-xs"
                  >
                    Mark Claimed
                  </button>
                )}
                {item.status === 'CLAIMED' && (
                  <button
                    onClick={() => onStatusUpdate(item.id, 'FOUND')}
                    className="btn-secondary text-xs"
                  >
                    Mark Found
                  </button>
                )}
              </div>
            )}

            <Link
              to={`/items/${item.id}/edit`}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              Edit
            </Link>

            {onDelete && (
              <button
                onClick={() => onDelete(item.id)}
                className="text-red-600 hover:text-red-500 text-sm font-medium"
              >
                Delete
              </button>
            )}
          </>
        )}

        <Link
          to={`/items/${item.id}`}
          className="text-gray-600 hover:text-gray-500 text-sm font-medium ml-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ItemCard; 