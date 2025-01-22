#README.md

# BlogPost Backend

This is the backend for the BlogPost application, built using Node.js, Express, and MongoDB. It provides APIs for user authentication, blog post management, and comment handling.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/blogpost-backend.git
   cd blogpost-backend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env.dev` or `.env.prod` file in the root directory and add the following variables:
   ```env
   CONNECTION_STRING=your_mongodb_connection_string
   DBNAME=your_database_name
   JWTSECRTKEY=your_jwt_secret_key
   PORT=your_port_number
   ```

## Usage

1. Build the project:

   ```sh
   npm run build
   ```

2. Start the server:

   ```sh
   npm start
   ```

3. For development, use:
   ```sh
   npm run dev
   ```

## API Endpoints

### User Routes

- `POST /api/v1/user/createUser` - Create a new user
- `GET /api/v1/user/username-available/:username` - Check if a username is available
- `PATCH /api/v1/user/update` - Update user details (authenticated)
- `DELETE /api/v1/user/delete` - Delete user account (authenticated)
- `GET /api/v1/user/getall` - Get all users (admin only)

### Post Routes

- `POST /api/v1/post/create` - Create a new post (authenticated)
- `PATCH /api/v1/post/like/:postid` - Like a post (authenticated)
- `PATCH /api/v1/post/unlike/:postid` - Unlike a post (authenticated)
- `DELETE /api/v1/post/:postid` - Delete a post (authenticated, same user)
- `PATCH /api/v1/post/:postid` - Update a post (authenticated, same user)

### Comment Routes

- `POST /api/v1/comment/add` - Add a comment (authenticated)
- `POST /api/v1/comment/seeAllComments` - Get all comments of a post
- `DELETE /api/v1/comment/:id` - Delete a comment (authenticated)
- `PATCH /api/v1/comment/:id` - Update a comment (authenticated)
- `PUT /api/v1/comment/:id/like` - Like a comment (authenticated)
- `PUT /api/v1/comment/:id/unlike` - Unlike a comment (authenticated)

### Login Routes

- `POST /api/v1/login` - Login a user

## Environment Variables

- `CONNECTION_STRING` - MongoDB connection string
- `DBNAME` - Name of the MongoDB database
- `JWTSECRTKEY` - Secret key for JWT
- `PORT` - Port number for the server

## Scripts

- `npm start` - Start the server
- `npm run build` - Build the project
- `npm run watch` - Watch for changes and rebuild
- `npm run dev` - Start the server in development mode
- `npm run lint` - Run Prettier to format the code

## Contributing

Contributions are welcome! Please provide suggestions about how can I improve this project.

## License

This project is licensed under the ISC License.

## 🚀 About Me

I'm a Frontend React developer, with 3+ years of experience. Currently In process of becoming a full stack developer...
This is my first project on `node`, `EXPRESS` and `MONGODB`. Please excuse my mistakes.
