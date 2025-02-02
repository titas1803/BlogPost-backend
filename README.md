# README.md

# BlogPost Backend

This is the backend for the BlogPost application, built using the MERN stack (MongoDB, Express, React, Node.js). This backend handles user authentication, blog post management, comments, and subscriptions.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Folder Structure](#folder-structure)
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

3. Create a `.env.dev` or `.env.prod` file in the root directory and add the necessary environment variables (see [Environment Variables](#environment-variables)).

4. Build the project:
   ```sh
   npm run build
   ```

## Usage

1. Start the development server:

   ```sh
   npm run dev
   ```

2. Start the production server:
   ```sh
   npm run prod
   ```

## API Endpoints

### Authentication

- `POST /api/v1/login`: Login a user.

### Users

- `POST /api/v1/user/createUser`: Create a new user.
- `GET /api/v1/user/username-available/:username` - Check if a username is available
- `PATCH /api/v1/user/update`: Update user details.
- `DELETE /api/v1/user/delete`: Delete the logged-in user.
- `GET /api/v1/user/search?keyword={search-keyword}`: Search for users.
- `GET /api/v1/user/getall`: Get all users (Admin only).
- `DELETE /api/v1/user/delete-user/:userid`: Delete a user by ID (Admin only).

### Posts

- `POST /api/v1/post/create`: Create a new post.
- `PATCH /api/v1/post/:postid`: Update a post.
- `DELETE /api/v1/post/:postid`: Delete a post.
- `PUT /api/v1/post/like/:postid`: Like a post.
- `PUT /api/v1/post/unlike/:postid`: Unlike a post.
- `GET /api/v1/post/search?keyword={search-keyword}`: Search for posts.

### Comments

- `POST /api/v1/comment/add/:postid`: Add a comment to a post.
- `PATCH /api/v1/comment/:commentid`: Update a comment.
- `DELETE /api/v1/comment/:commentid`: Delete a comment.
- `PUT /api/v1/comment/:commentid/like`: Like a comment.
- `PUT /api/v1/comment/:commentid/unlike`: Unlike a comment.
- `GET /api/v1/comment/seeAllComments/:postid`: Get all comments of a post.

### Subscriptions

- `PUT /api/v1/sub/subscribe/:authorid`: Subscribe to an author.
- `PUT /api/v1/sub/unsubscribe/:authorid`: Unsubscribe from an author.
- `GET /api/v1/sub/getSubscribers`: Get the list of subscribers.

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
BLOGPOST_BACKEND_PORT=3000
BLOGPOST_BACKEND_CONNECTION_STRING=your_mongodb_connection_string
BLOGPOST_BACKEND_DBNAME=your_database_name
BLOGPOST_BACKEND_JWTSECRTKEY=your_jwt_secret_key
```

## Scripts

- `npm start` - Start the server
- `npm run build` - Build the project
- `npm run watch` - Watch for changes and rebuild
- `npm run dev` - Start the server in development mode
- `npm run lint` - Run Prettier to format the code

## Folder Structure

```
BlogPost-backend/
├── dist/                   # Compiled files
├── src/                    # Source files
│   ├── controllers/        # Controllers for handling requests
│   ├── middlewares/        # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── utilities/          # Utility functions and types
│   └── app.ts              # Entry point of the application
├── .env                    # environment variable file
├── .gitignore              # Git ignore file
├── .prettierrc             # Prettier configuration
├── .prettierignore         # Prettier ignore file
├── lint-staged.config.js   # Lint-staged configuration
├── package.json            # NPM package configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Contributing

Contributions and suggestions are welcome! Please open an issue or submit a pull request for any changes. If you have any suggestion on how to improve myself please connect with me on linkedin [@titassarkar](https://www.linkedin.com/in/titassarkar)

## License

This project is licensed under the ISC License.

## 🚀 About Me

I'm a Frontend React developer, with 3+ years of experience. Currently In process of becoming a full stack developer...
This is my first project on `node`, `EXPRESS` and `MONGODB`. Please excuse my mistakes.

## Authors

- [@titassarkar](https://www.linkedin.com/in/titassarkar)
