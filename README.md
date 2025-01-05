# Neeto
Neeto is a simple note taking api.

# Usage
Below is how you can use the api endpoints

## User Routes
User routes handle authentication (e.g., login, registration). For simplicity, let's assume the user can register, login, and get their own profile.


### User Registration (POST /api/users/register)

Purpose: To create a new user account.

URL: /api/users/register  
Method: POST  
Request Body (JSON):  

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}

```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011", 
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### User Login (POST /api/users/login)
Purpose: To authenticate the user and provide a token.

URL: /api/users/login  
Method: POST  
Request Body (JSON):  

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

Response:

```json
{
  "message": "Login successful",
  "token": "jwt_token_here"
}
```

Note: The token is used for authentication in subsequent requests.

### Get User Profile (GET /api/users/profile)

Purpose: To get the profile details of the currently authenticated user.

URL: /api/users/profile  
Method: GET  
Headers: Include the Authorization header with the Bearer token.  

```bash
Authorization: Bearer <jwt_token_here>
```

Response:

```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Note Routes

### Create a New Note (POST /api/notes)
Purpose: To create a new note for the authenticated user.

URL: /api/notes  
Method: POST  
Headers: Include the Authorization header with the Bearer token.  

```bash
Authorization: Bearer <jwt_token_here>
```

Request Body (JSON):  

```json
{
  "title": "My First Note",
  "content": "This is the content of my first note."
}
```

Response:  

```json
{
  "note": {
    "id": "507f1f77bcf86cd799439011",
    "title": "My First Note",
    "content": "This is the content of my first note.",
    "user": "507f1f77bcf86cd799439011"
  }
}
```

### Get All Notes for the Authenticated User (GET /api/notes)

Purpose: To retrieve all notes created by the currently authenticated user.

URL: /api/notes  
Method: GET  
Headers: Include the Authorization header with the Bearer token.  

```bash
Authorization: Bearer <jwt_token_here>
```

Response:

```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "My First Note",
    "content": "This is the content of my first note.",
    "user": "507f1f77bcf86cd799439011"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "title": "My Second Note",
    "content": "This is the content of my second note.",
    "user": "507f1f77bcf86cd799439011"
  }
]
```

### Update a Note (PUT /api/notes/:noteId)

Purpose: To update an existing note for the authenticated user. The user can only update their own notes.

URL: /api/notes/:noteId  
Method: PUT  
Headers: Include the Authorization header with the Bearer token.  

```bash
Authorization: Bearer <jwt_token_here>
```

Request Body (JSON):

```json
{
  "title": "Updated Note Title",
  "content": "This is the updated content of my note."
}
```

Response:

```json
{
  "note": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Updated Note Title",
    "content": "This is the updated content of my note.",
    "user": "507f1f77bcf86cd799439011"
  }
}
```

### Delete a Note (DELETE /api/notes/:noteId)
Purpose: To delete an existing note for the authenticated user. The user can only delete their own notes.

URL: /api/notes/:noteId  
Method: DELETE  
Headers: Include the Authorization header with the Bearer token.  

```bash
Authorization: Bearer <jwt_token_here>
```

Response:

```json
{
  "message": "Note deleted successfully",
  "note": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Updated Note Title",
    "content": "This is the updated content of my note.",
    "user": "507f1f77bcf86cd799439011"
  }
}
```


## Example Workflow:

1. User Registration:
    - You register a new user using POST /api/users register.
    - You get a response with the user data.

2. User Login:
    - You log in using POST /api/users/login with your email and password.
    - You receive a JWT token in the response.

3. Create a New Note:
    - You make a POST /api/notes request with the token in the Authorization header and provide the note's title and content.
    - The note gets created, and you receive the new note in the response.

4. Get All Notes:
    - You make a GET /api/notes request with the token in the Authorization header to retrieve all notes created by the authenticated user.

5. Update a Note:
    - You make a PUT /api/notes/:noteId request with the token and provide the updated note details.

6. Delete a Note:
    - You make a DELETE /api/notes/:noteId request with the token to delete a note that belongs to the authenticated user.



## Testing with Postman or CURL
You can use tools like Postman or CURL to test these API endpoints.

Example using CURL:  

1. Login (to get the token):
```bash
curl -X POST http://localhost:3000/api/users/login \
-H "Content-Type: application/json" \
-d '{"email": "user@example.com", "password": "securepassword123"}'
```
This returns a token, which you'll use in the Authorization header for the other requests.

2. Create a Note:
```bash
curl -X POST http://localhost:3000/api/notes \
-H "Authorization: Bearer <jwt_token_here>" \
-H "Content-Type: application/json" \
-d '{"title": "My First Note", "content": "This is my first note."}'
```

3. Get All Notes:
```bash
curl -X GET http://localhost:3000/api/notes \
-H "Authorization: Bearer <jwt_token_here>"
```

4. Update a Note:
```bash
curl -X PUT http://localhost:3000/api/notes/507f1f77bcf86cd799439011 \
-H "Authorization: Bearer <jwt_token_here>" \
-H "Content-Type: application/json" \
-d '{"title": "Updated Title", "content": "Updated content."}'
```

5. Delete a Note:
```bash
curl -X DELETE http://localhost:3000/api/notes/507f1f77bcf86cd799439011 \
-H "Authorization: Bearer <jwt_token_here>"
```
