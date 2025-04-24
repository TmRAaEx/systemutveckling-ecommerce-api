# My Express Project 🚀

This is a Node.js + Express project using TypeScript, following best practices for structure and maintainability.

## 📂 Project Structure

/src
/models # Database models
/controllers # Route logic
/routes # API routes
/middlewares # Custom middlewares
/config # Configuration files
/utils # Utility functions
/services # Business logic
/interfaces # TypeScript interfaces
index.ts # Entry point for the Express server
tsconfig.json # TypeScript configuration
package.json # Dependencies & scripts
.gitignore # Git ignored files
.env # Envirnment virables
README.md # Project documentation

## 🚀 Getting Started

navigate to the correct folder

```sh
cd /<projectname>
```

### 1️⃣ Install dependencies

```sh
npm install
```

2️⃣ Start the development server

```sh
npm run dev
```

The server will start, and you should see output indicating it's running.

## 🛠 Available Scripts

npm run dev - Starts the development server with live reload
npm run build - Compiles TypeScript files to JavaScript
⚠️ Note: The build setup is not yet complete, so the server can currently only run in development mode. Use npm run dev to start the server. Production support will be added in a future update.
npm start - Runs the compiled JavaScript server

## 📌 Notes

Make sure you have Node.js and npm installed.
Change the variables in .env to fit your needs
Adjust configurations in /config/ as needed.
TypeScript will automatically check for type errors.
