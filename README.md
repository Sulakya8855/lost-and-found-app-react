# Lost & Found React Application

A modern web application for managing lost and found items with role-based access control and comprehensive request management.

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Heroicons (SVG)

## ✨ Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (USER, STAFF, ADMIN)

### Item Management
- Add, edit, delete, and view lost/found items
- Item status tracking (LOST, FOUND, CLAIMED)
- Detailed item information with descriptions

### Request System
- Users can submit requests for items
- Staff/Admin can approve or reject requests
- Mandatory admin notes for request decisions
- Request status tracking (PENDING, APPROVED, REJECTED)

### User Management (Admin Only)
- View all users
- Update user roles
- Delete users
- User search and filtering

### UI/UX
- Responsive design
- Modern and clean interface
- Loading states and error handling
- Professional modal dialogs

## 🚀 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lost-and-found-app-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

- Update API base URL in `src/services/api.ts` if needed
- Backend API should be running on the configured endpoint
- Ensure CORS is properly configured on the backend

## 📱 Usage

1. **Register/Login**: Create an account or sign in
2. **Browse Items**: View all lost and found items
3. **Submit Requests**: Request items you believe are yours
4. **Manage Items**: Add items you've found (authenticated users)
5. **Admin Functions**: Manage users and approve requests (admin only)

## 🎯 User Roles

- **USER**: Can browse items, submit requests, and add found items
- **STAFF**: All user permissions + approve/reject requests
- **ADMIN**: All permissions + user management

## 🔗 API Integration

This frontend integrates with a Spring Boot backend API. Refer to `backend_api.md` for API documentation.
