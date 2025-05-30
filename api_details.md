## API Base URL

Assuming your Spring Boot application is running locally on port 8080, the base URL for all API endpoints will be:

`http://localhost:8080`

## Authentication

This API uses JWT (JSON Web Tokens) for authentication.

1.  **Sign Up/Sign In**:
    *   The client (React app) will send a request to the `/api/v1/auth/signup` or `/api/v1/auth/signin` endpoint.
    *   Upon successful authentication or registration, the server will respond with a JWT.
    *   This JWT should be stored securely on the client-side (e.g., in `localStorage` or `sessionStorage`, though `HttpOnly` cookies are generally more secure if you can set that up).
2.  **Authenticated Requests**:
    *   For any subsequent request to a protected endpoint, the client must include the JWT in the `Authorization` header with the `Bearer` prefix.
    *   Example: `Authorization: Bearer <your_jwt_token>`

## API Endpoints and Schemas

Based on your DTOs and common Spring Boot practices, here's a comprehensive guide to your API:

### 1. Authentication Endpoints

Controller: `AuthController` (likely in `com.crs.lost_and_found_app.controller`)

*   **Endpoint**: `POST /api/v1/auth/signup`
    *   **Description**: Registers a new user.
    *   **Request Body**: `SignUpRequest`
        ```json
        {
            "username": "string (unique)",
            "email": "string (unique, valid email format)",
            "password": "string",
            "role": "string (USER, STAFF, ADMIN) (optional, defaults to USER if not provided or if backend logic enforces default)"
        }
        ```
    *   **Response (Success - 2xx)**: `JwtAuthenticationResponse`
        ```json
        {
            "token": "string (JWT)",
            "username": "string",
            "role": "string (USER, STAFF, ADMIN)"
        }
        ```
    *   **Response (Error - 4xx/5xx)**: Standard Spring Boot error response or custom error object (e.g., for duplicate username/email).
    *   **Authorization**: None required.

*   **Endpoint**: `POST /api/v1/auth/signin`
    *   **Description**: Authenticates an existing user.
    *   **Request Body**: `SignInRequest`
        ```json
        {
            "username": "string",
            "password": "string"
        }
        ```
    *   **Response (Success - 2xx)**: `JwtAuthenticationResponse` (same as signup)
    *   **Response (Error - 4xx/5xx)**: Standard error response (e.g., 401 Unauthorized for invalid credentials).
    *   **Authorization**: None required.

### 2. Item Endpoints

Controller: `ItemController` (likely in `com.crs.lost_and_found_app.controller`)

*   **Endpoint**: `POST /api/v1/items`
    *   **Description**: Creates a new lost or found item.
    *   **Request Body**: `ItemRequestDto`
        ```json
        {
            "name": "string",
            "description": "string",
            "category": "string",
            "locationFound": "string", // Or locationLost
            "dateReported": "string (ISO Date format, e.g., YYYY-MM-DD)",
            "status": "string (LOST, FOUND, CLAIMED, RETURNED, DISPOSED)" // Initial status
        }
        ```
    *   **Response (Success - 201 Created)**: `ItemResponseDto`
        ```json
        {
            "id": "long",
            "name": "string",
            "description": "string",
            "category": "string",
            "locationFound": "string",
            "dateReported": "string (ISO Date)",
            "status": "string (ItemStatus enum)",
            "reportedById": "long",
            "reportedByUsername": "string",
            "heldById": "long (nullable)",
            "heldByUsername": "string (nullable)",
            "claimedById": "long (nullable)",
            "claimedByUsername": "string (nullable)",
            "createdAt": "string (ISO DateTime)",
            "updatedAt": "string (ISO DateTime)"
        }
        ```
    *   **Authorization**: `Bearer <token>` required. Roles: `USER`, `STAFF`, `ADMIN`.

*   **Endpoint**: `GET /api/v1/items`
    *   **Description**: Retrieves a list of all items. May support pagination and filtering via query parameters (you'd need to check your `ItemController` for specifics, e.g., `?page=0&size=10&status=FOUND`).
    *   **Request Body**: None.
    *   **Response (Success - 200 OK)**: `List<ItemResponseDto>`
    *   **Authorization**: `Bearer <token>` required (typically, but could be public depending on your `SecurityConfig`).

*   **Endpoint**: `GET /api/v1/items/{id}`
    *   **Description**: Retrieves a specific item by its ID.
    *   **Request Body**: None.
    *   **Path Variable**: `id` (long) - The ID of the item.
    *   **Response (Success - 200 OK)**: `ItemResponseDto`
    *   **Response (Error - 404 Not Found)**: If item with ID doesn't exist.
    *   **Authorization**: `Bearer <token>` required (typically, but could be public).

*   **Endpoint**: `PUT /api/v1/items/{id}`
    *   **Description**: Updates an existing item.
    *   **Request Body**: `ItemRequestDto` (or a specific `ItemUpdateRequestDto` if you have one)
    *   **Path Variable**: `id` (long) - The ID of the item to update.
    *   **Response (Success - 200 OK)**: `ItemResponseDto` (updated item)
    *   **Response (Error - 404 Not Found)**: If item with ID doesn't exist.
    *   **Authorization**: `Bearer <token>` required. Roles: `STAFF`, `ADMIN`, or owner of the item (check your service logic).

*   **Endpoint**: `DELETE /api/v1/items/{id}`
    *   **Description**: Deletes an item.
    *   **Request Body**: None.
    *   **Path Variable**: `id` (long) - The ID of the item to delete.
    *   **Response (Success - 204 No Content or 200 OK with a message)**
    *   **Response (Error - 404 Not Found)**: If item with ID doesn't exist.
    *   **Authorization**: `Bearer <token>` required. Roles: `ADMIN` or owner.

*   **Endpoint**: `PATCH /api/v1/items/{id}/status` (Example - could be a PUT)
    *   **Description**: Updates the status of an item (e.g., from FOUND to CLAIMED).
    *   **Request Body**:
        ```json
        {
            "status": "string (ItemStatus enum, e.g., CLAIMED)"
            // Potentially other fields like claimedById if status is CLAIMED
        }
        ```
    *   **Path Variable**: `id` (long)
    *   **Response (Success - 200 OK)**: `ItemResponseDto` (updated item)
    *   **Authorization**: `Bearer <token>` required. Roles: `STAFF`, `ADMIN`.

### 3. Request Endpoints (for claiming items, etc.)

Controller: `RequestController` (likely)

*   **Endpoint**: `POST /api/v1/requests`
    *   **Description**: Creates a new request (e.g., a user claiming a found item).
    *   **Request Body**: `RequestCreateDto`
        ```json
        {
            "itemId": "long",
            "message": "string (optional)"
        }
        ```
    *   **Response (Success - 201 Created)**: `RequestResponseDto`
        ```json
        {
            "id": "long",
            "itemId": "long",
            "itemName": "string",
            "requesterId": "long",
            "requesterUsername": "string",
            "status": "string (RequestStatus enum, e.g., PENDING, APPROVED, REJECTED)",
            "message": "string",
            "requestDate": "string (ISO DateTime)",
            "resolutionDate": "string (ISO DateTime, nullable)",
            "adminNotes": "string (nullable)",
            "createdAt": "string (ISO DateTime)",
            "updatedAt": "string (ISO DateTime)"
        }
        ```
    *   **Authorization**: `Bearer <token>` required. Roles: `USER`, `STAFF`, `ADMIN`.

*   **Endpoint**: `GET /api/v1/requests`
    *   **Description**: Retrieves all requests (likely for admin/staff). May support filtering.
    *   **Response (Success - 200 OK)**: `List<RequestResponseDto>`
    *   **Authorization**: `Bearer <token>` required. Roles: `STAFF`, `ADMIN`.

*   **Endpoint**: `GET /api/v1/requests/{id}`
    *   **Description**: Retrieves a specific request by ID.
    *   **Path Variable**: `id` (long)
    *   **Response (Success - 200 OK)**: `RequestResponseDto`
    *   **Authorization**: `Bearer <token>` required. User who made the request, or `STAFF`/`ADMIN`.

*   **Endpoint**: `GET /api/v1/requests/user/{userId}` (Example, actual path may vary)
    *   **Description**: Retrieves all requests made by a specific user.
    *   **Path Variable**: `userId` (long)
    *   **Response (Success - 200 OK)**: `List<RequestResponseDto>`
    *   **Authorization**: `Bearer <token>` required. The user themselves, or `STAFF`/`ADMIN`.

*   **Endpoint**: `PATCH /api/v1/requests/{id}` (or PUT)
    *   **Description**: Updates a request (e.g., admin approving/rejecting a claim).
    *   **Request Body**: `RequestUpdateDto`
        ```json
        {
            "status": "string (RequestStatus enum, e.g., APPROVED, REJECTED)",
            "adminNotes": "string (optional)"
        }
        ```
    *   **Path Variable**: `id` (long)
    *   **Response (Success - 200 OK)**: `RequestResponseDto` (updated request)
    *   **Authorization**: `Bearer <token>` required. Roles: `STAFF`, `ADMIN`.

### 4. User Management Endpoints (Admin only)

Controller: `UserController` (likely)

*   **Endpoint**: `GET /api/v1/users`
    *   **Description**: Retrieves a list of all users.
    *   **Response (Success - 200 OK)**: `List<UserResponseDto>`
        ```json
        // UserResponseDto structure
        {
            "id": "long",
            "username": "string",
            "email": "string",
            "role": "string (UserRole enum)",
            "createdAt": "string (ISO DateTime)",
            "updatedAt": "string (ISO DateTime)"
        }
        ```
    *   **Authorization**: `Bearer <token>` required. Role: `ADMIN`.

*   **Endpoint**: `GET /api/v1/users/{id}`
    *   **Description**: Retrieves a specific user by ID.
    *   **Path Variable**: `id` (long)
    *   **Response (Success - 200 OK)**: `UserResponseDto`
    *   **Authorization**: `Bearer <token>` required. Role: `ADMIN`.

*   **Endpoint**: `PUT /api/v1/users/{id}` (or `PATCH`)
    *   **Description**: Updates a user's details (e.g., role).
    *   **Request Body**: `UserUpdateRequestDto`
        ```json
        {
            "role": "string (UserRole enum)"
            // Potentially other fields like isEnabled, isLocked
        }
        ```
    *   **Path Variable**: `id` (long)
    *   **Response (Success - 200 OK)**: `UserResponseDto` (updated user)
    *   **Authorization**: `Bearer <token>` required. Role: `ADMIN`.

*   **Endpoint**: `DELETE /api/v1/users/{id}`
    *   **Description**: Deletes a user.
    *   **Path Variable**: `id` (long)
    *   **Response (Success - 204 No Content or 200 OK with message)**
    *   **Authorization**: `Bearer <token>` required. Role: `ADMIN`.

## Enums

Your frontend will need to be aware of the possible values for these enums:

*   `UserRole`: (e.g., `USER`, `STAFF`, `ADMIN`) - Check `com.crs.lost_and_found_app.enums.UserRole`
*   `ItemStatus`: (e.g., `LOST`, `FOUND`, `CLAIMED`, `RETURNED`, `DISPOSED`) - Check `com.crs.lost_and_found_app.enums.ItemStatus`
*   `RequestStatus`: (e.g., `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`) - Check `com.crs.lost_and_found_app.enums.RequestStatus`

## Necessary Information for React Frontend Development

1.  **API Documentation Tool**: Use the `/swagger-ui.html` endpoint. This will give you an interactive way to see all endpoints, request parameters, and response schemas. The `/api-docs` endpoint provides the raw OpenAPI JSON, which can also be imported into tools like Postman or other API clients.
2.  **Base URL**: `http://localhost:8080` (or your production URL).
3.  **Authentication Flow**:
    *   How to sign up and sign in.
    *   How to store the JWT securely.
    *   How to include the JWT in the `Authorization` header for protected requests.
    *   How to handle token expiration and renewal (if implemented).
4.  **Error Handling**:
    *   Understand common HTTP status codes (200, 201, 204, 400, 401, 403, 404, 500).
    *   How the backend structures error responses (e.g., a JSON object with a `message` or `errors` field).
5.  **CORS Configuration**: Your Spring Boot backend's `SecurityConfig` already includes CORS configuration. Ensure the `allowedOrigins` list includes the URL where your React app will be running during development (e.g., `http://localhost:3000` if using Create React App) and in production.
    ```java
    // In SecurityConfig.java
    configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:8081")); // Add your React app's dev port
    ```
6.  **Date/Time Formatting**: Be consistent with how dates and times are sent and received (ISO 8601 format is standard for JSON APIs).
7.  **State Management**: Plan how you'll manage application state in React (e.g., user authentication status, fetched data, loading states). Libraries like Redux, Zustand, or React Context API can be helpful.
8.  **API Client**: Use a library like `axios` or the built-in `fetch` API for making HTTP requests from your React app. Create a centralized API service/module in your React project to handle all backend communication.
9.  **Environment Variables**: Store the API base URL in environment variables in your React app (e.g., `.env` files for development and production).
10. **Roles and Permissions**: Understand which user roles can access which endpoints and perform which actions. Your React app will need to conditionally render UI elements or restrict actions based on the logged-in user's role. The JWT often contains the user's role.

## Next Steps for You (React Frontend)

1.  **Set up your React Project**: Use `create-react-app` or Vite.
2.  **Install an HTTP Client**: `npm install axios` or `yarn add axios`.
3.  **Create an API Service Module**: A set of functions to interact with each endpoint.
4.  **Implement Authentication**:
    *   Create signup and signin forms.
    *   Store the JWT upon successful login.
    *   Create an interceptor for your HTTP client to automatically add the `Authorization` header.
5.  **Develop UI Components**: For listing items, viewing item details, creating items, managing requests, etc.
6.  **Implement Routing**: Using `react-router-dom`.
7.  **State Management**: Choose and implement a state management solution.
8.  **Protect Routes**: Ensure that only authenticated users (and users with specific roles) can access certain parts of your application.

This detailed breakdown should give you a solid foundation for building your React frontend. Remember to refer to your `/swagger-ui.html` for the most up-to-date and precise API schema as you develop.
