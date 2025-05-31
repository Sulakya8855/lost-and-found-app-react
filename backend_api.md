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
            "status": "string (LOST, FOUND, CLAIMED)" // Initial status
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
*   `ItemStatus`: (e.g., `LOST`, `FOUND`, `CLAIMED`) - Check `com.crs.lost_and_found_app.enums.ItemStatus`
*   `RequestStatus`: (e.g., `PENDING`, `APPROVED`, `REJECTED`) - Check `com.crs.lost_and_found_app.enums.RequestStatus`
