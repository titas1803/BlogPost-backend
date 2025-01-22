# README.md

# BlogPost Backend

This is the backend for the BlogPost application, built using Node.js, Express, and MongoDB. It provides APIs for user authentication, blog post management, comments, and subscriptions.

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

- `POST /api/v1/login` - Login a user

### Users

- `POST /api/v1/user/createUser` - Create a new user
- `GET /api/v1/user/username-available/:username` - Check if a username is available
- `PATCH /api/v1/user/update` - Update user details (authenticated users only)
- `DELETE /api/v1/user/delete` - Delete a user (authenticated users only)
- `GET /api/v1/user/getall` - Get all users (admin only)

### Posts

- `POST /api/v1/post/create` - Create a new post (authenticated users only)
- `PATCH /api/v1/post/like/:postid` - Like a post (authenticated users only)
- `PATCH /api/v1/post/unlike/:postid` - Unlike a post (authenticated users only)
- `PATCH /api/v1/post/:postid` - Update a post (authenticated users only)
- `DELETE /api/v1/post/:postid` - Delete a post (authenticated users only)

### Comments

- `POST /api/v1/comment/add` - Add a comment to a post (authenticated users only)
- `PATCH /api/v1/comment/:id` - Update a comment (authenticated users only)
- `DELETE /api/v1/comment/:id` - Delete a comment (authenticated users only)
- `PUT /api/v1/comment/:id/like` - Like a comment (authenticated users only)
- `PUT /api/v1/comment/:id/unlike` - Unlike a comment (authenticated users only)
- `POST /api/v1/comment/seeAllComments` - Get all comments of a post

### Subscriptions

- `PUT /api/v1/sub/subscribe/:authorid` - Subscribe to an author (authenticated users only)
- `PUT /api/v1/sub/unsubscribe/:authorid` - Unsubscribe from an author (authenticated users only)

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=3000
CONNECTION_STRING=your_mongodb_connection_string
DBNAME=your_database_name
JWTSECRTKEY=your_jwt_secret_key
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
