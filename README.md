# Lost & Found Application - React Frontend

A comprehensive Lost and Found management system built with React, TypeScript, and Tailwind CSS, designed for educational institutions.

## 🌟 Features

### Authentication & Authorization
- **JWT-based Authentication**: Secure login/signup system
- **Role-based Access Control**: Three user roles with different permissions
  - **USER**: Report items, make claims, view own items
  - **STAFF**: Manage all items, approve/reject requests
  - **ADMIN**: Full system access, user management
- **Protected Routes**: Route-level security based on user roles
- **Persistent Sessions**: Token-based session management with auto-refresh

### Item Management
- **Report Lost/Found Items**: Users can report lost or found items
- **Item Status Tracking**: LOST → FOUND → CLAIMED workflow
- **Rich Item Details**: Description, category, location, contact info, images
- **Search & Filter**: Find items by category, status, keywords
- **Image Upload**: Visual identification support

### Request Management
- **Claim Requests**: Users can request found items
- **Request Workflow**: PENDING → APPROVED/REJECTED
- **Staff Review**: Admin/Staff can approve or reject claims
- **Notification System**: Track request status updates

### User Management (Admin Only)
- **Role Management**: Upgrade/downgrade user roles
- **User Overview**: View all registered users
- **Account Management**: Enable/disable accounts

### Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Dashboard**: Real-time statistics and quick actions
- **Intuitive Navigation**: Role-based menu system
- **Loading States**: Smooth user experience with loading indicators
- **Error Handling**: User-friendly error messages

## 🚀 Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive UI
- **Routing**: React Router v6 for SPA navigation
- **State Management**: React Context API for authentication
- **HTTP Client**: Axios for API communication
- **Authentication**: JWT token handling with jwt-decode
- **Build Tool**: Vite for fast development and building

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation with role-based menu
│   ├── ProtectedRoute.tsx  # Route protection component
│   └── ItemCard.tsx    # Item display component
├── contexts/           # React Context providers
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   ├── Signup.tsx      # Registration page
│   └── Dashboard.tsx   # Main dashboard
├── services/           # API service layer
│   └── api.ts          # HTTP client and API methods
├── types/              # TypeScript type definitions
│   └── index.ts        # Application interfaces
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Spring Boot backend API running on `http://localhost:8080`

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lost-and-found-app-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   Update the API base URL in `src/services/api.ts` if your backend runs on a different port:
   ```typescript
   const API_BASE_URL = 'http://localhost:8080/api';
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in terminal)

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production-ready application
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checking

## 🎯 Usage Guide

### First Time Setup

1. **Admin Account**: Ensure your backend has a pre-configured admin account
2. **Demo Credentials** (if available):
   - Admin: admin@example.com / admin123
   - Staff: staff@example.com / staff123
   - User: user@example.com / user123

### User Workflows

#### For Regular Users:
1. **Sign Up**: Create account (defaults to USER role)
2. **Report Items**: Submit lost or found items
3. **Browse Items**: Search for lost/found items
4. **Make Claims**: Request found items that belong to you
5. **Track Requests**: Monitor claim request status

#### For Staff Members:
1. **Manage Items**: Review and update item statuses
2. **Process Requests**: Approve or reject claim requests
3. **Verify Claims**: Ensure proper item-owner matching

#### For Administrators:
1. **User Management**: Upgrade user roles from USER to STAFF
2. **System Overview**: Monitor overall system activity
3. **Full Access**: All features available to lower roles

## 🔐 Security Features

- **Input Validation**: Client-side and server-side validation
- **XSS Protection**: Sanitized user inputs
- **JWT Security**: Secure token handling with expiration
- **Route Protection**: Unauthorized access prevention
- **Role Verification**: Server-side permission checking

## 🎨 UI Components

### Custom CSS Classes
The application uses custom Tailwind CSS classes for consistent styling:

- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons
- `.btn-success` - Success state buttons
- `.btn-warning` - Warning state buttons
- `.btn-danger` - Danger state buttons
- `.form-input` - Styled form inputs
- `.form-label` - Form labels
- `.card` - Content cards
- `.status-*` - Status badges for items and requests

## 🌐 API Integration

The application integrates with a Spring Boot backend through RESTful APIs:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user

### Item Management
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `PUT /api/items/{id}` - Update item
- `DELETE /api/items/{id}` - Delete item
- `GET /api/items/my-items` - Get user's items

### Request Management
- `GET /api/requests` - Get all requests
- `POST /api/requests` - Create claim request
- `PUT /api/requests/{id}/status` - Update request status

### User Management (Admin only)
- `GET /api/users` - Get all users
- `PUT /api/users/{id}/role` - Update user role

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Create a `.env` file for environment-specific configurations:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Notes

### Code Style
- Use TypeScript for type safety
- Follow React functional component patterns
- Implement proper error handling
- Use meaningful component and variable names

### State Management
- Authentication state managed via React Context
- Local component state for UI interactions
- API state fetched on component mount

### Performance Considerations
- Lazy loading for route components (can be implemented)
- Image optimization for item photos
- Efficient re-rendering with proper dependency arrays

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend allows frontend domain
2. **Authentication Issues**: Check JWT token expiration
3. **API Connection**: Verify backend URL and status
4. **Build Errors**: Clear node_modules and reinstall

### Support
For technical support or questions, please create an issue in the repository.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for educational institutions to manage lost and found items efficiently.
