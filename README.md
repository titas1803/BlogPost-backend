# README

## BlogPost Backend APIs

### Overview

This project is the backend for a BlogPost application built using the MERN stack (MongoDB, Express, React, Node.js). It provides various APIs to manage users, posts, comments, and authentication.

### Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
  - [User Routes](#user-routes)
  - [Login Routes](#login-routes)
  - [Comment Routes](#comment-routes)
  - [Post Routes](#post-routes)
- [Error Handling](#error-handling)

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd BlogPost-backend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
PORT=3000
CONNECTION_STRING=<your-mongodb-connection-string>
DBNAME=<your-database-name>
JWTSECRTKEY=<your-jwt-secret-key>
```

### Scripts

- `start`: Start the application
- `build`: Compile TypeScript files
- `watch`: Watch for changes and compile
- `dev`: Start the application in development mode
- `prod`: Start the application in production mode
- `lint`: Run Prettier to format code

### API Endpoints

#### User Routes

- `POST /api/v1/user/createUser`: Create a new user
- `PATCH /api/v1/user/update`: Update user details
- `DELETE /api/v1/user/delete`: Delete a user
- `GET /api/v1/user/getAll`: Get all users (Admin only)

#### Login Routes

- `POST /api/v1/login`: Login a user

#### Comment Routes

- `POST /api/v1/comment/add`: Add a new comment
- `POST /api/v1/comment/seeAllComments`: Get all comments of a post
- `DELETE /api/v1/comment/:id`: Delete a comment
- `PATCH /api/v1/comment/:id`: Update a comment
- `PUT /api/v1/comment/:id/like`: Like a comment
- `PUT /api/v1/comment/:id/unlike`: Unlike a comment

#### Post Routes

- `POST /api/v1/post/create`: Create a new post
- `PATCH /api/v1/post/update`: Update a post
- `DELETE /api/v1/post/delete`: Delete a post

### Error Handling

All errors are handled by a global error handler middleware which sends a JSON response with the error message and status code.

### License

This project is licensed under the MIT License.
