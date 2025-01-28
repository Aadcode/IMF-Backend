# IMF Backend API Documentation

## Deployed Links
- Production: `https://api.imf-gadgets.com/api/v1`

## Base URL
```
http://localhost:{PORT}/api/v1
```

## Authentication
- Authentication is handled via HTTP-only cookies
- After successful login, an `authToken` cookie is set
- Protected routes require this authentication token
- Token expires in 1 hour

## Error Responses
All error responses follow this format:
```json
{
  "success": false,
  "message": "Error message here",
  "statusCode": 400
}
```

## Success Responses
All success responses follow this format:
```json
{
  "success": true,
  "message": "Success message here",
  "data": {} // Optional data object
}
```

## User Endpoints

### 1. User Signup
- **URL:** `/user/signup`
- **Method:** `POST`
- **Body:**
```json
{
  "name": "Agent Hunt",
  "email": "hunt@imf.com",
  "password": "yourpassword"
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": 1,
    "email": "hunt@imf.com",
    "name": "Agent Hunt"
  }
}
```

### 2. User Login
- **URL:** `/user/login`
- **Method:** `POST`
- **Body:**
```json
{
  "email": "hunt@imf.com",
  "password": "yourpassword"
}
```
- **Success Response (200):**
```json
{
  "success": true,
  "message": "User signed in successfully",
  "data": {
    "userId": 1,
    "email": "hunt@imf.com",
    "name": "Agent Hunt"
  }
}
```

## Gadget Endpoints

### 1. Get All Gadgets
- **URL:** `/gadget`
- **Method:** `GET`
- **Query Parameters:**
  - `status` (optional): Filter by gadget status
- **Success Response (200):**
```json
{
  "success": true,
  "message": "Gadgets fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Exploding Gum",
      "status": "Active",
      "mission_success_probability": 8
    }
  ]
}
```

### 2. Create Gadget
- **URL:** `/gadget`
- **Method:** `POST`
- **Authentication:** Required
- **Body:**
```json
{
  "name": "Exploding Gum",
  "gadgetStatus": "Active"
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "message": "Gadget Created Successfully",
  "data": {
    "id": 1,
    "name": "Exploding Gum",
    "status": "Active",
    "userId": 1
  }
}
```

### 3. Update Gadget
- **URL:** `/gadget/:id`
- **Method:** `PUT`
- **Authentication:** Required
- **Authorization:** Owner only
- **Body:**
```json
{
  "status": "Active"
}
```
- **Success Response (200):**
```json
{
  "success": true,
  "message": "Gadget updated successfully",
  "data": {
    "id": 1,
    "name": "Exploding Gum",
    "status": "Active",
    "userId": 1
  }
}
```

### 4. Delete Gadget (Decommission)
- **URL:** `/gadget/:id`
- **Method:** `DELETE`
- **Authentication:** Required
- **Authorization:** Owner only
- **Success Response (200):**
```json
{
  "success": true,
  "message": "Gadget deleted successfully",
  "data": {
    "id": 1,
    "name": "Exploding Gum",
    "status": "Decommissioned",
    "userId": 1
  }
}
```

### 5. Destruct Gadget
#### Step 1: Get Verification Code
- **URL:** `/gadget/:id/destruct?action=getCode`
- **Method:** `POST`
- **Authentication:** Required
- **Authorization:** Owner only
- **Success Response (200):**
```json
{
  "confirmationCode": 123456
}
```

#### Step 2: Confirm Destruction
- **URL:** `/gadget/:id/destruct`
- **Method:** `POST`
- **Authentication:** Required
- **Authorization:** Owner only
- **Body:**
```json
{
  "verificationCode": 123456
}
```
- **Success Response (200):**
```json
{
  "success": true,
  "message": "Gadget deleted successfully",
  "data": {
    "id": 1,
    "name": "Exploding Gum",
    "status": "Destroyed",
    "userId": 1
  }
}
```

## Common Error Codes
- 400: Bad Request (Missing or invalid parameters)
- 401: Unauthorized (Not logged in or invalid token)
- 403: Forbidden (Not the owner of the gadget)
- 404: Not Found (Gadget or user not found)
- 409: Conflict (User already exists)
- 500: Internal Server Error

## Notes
1. All protected routes require the `authToken` cookie obtained from login
2. Gadget operations (except GET) require authentication
3. Update and delete operations require ownership of the gadget
4. Verification codes for gadget destruction expire after 5 minutes
5. The mission success probability is randomly generated for each gadget retrieval
