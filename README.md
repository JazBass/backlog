# React Express Starter

This repo is the foundation for all my web development tutorials at the site that has yet to be determined.

A modern full-stack application built with **React** (frontend) and **Express** (backend), featuring TypeScript throughout for type safety and better developer experience.

## Tech Stack

### Frontend (Client)

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and formatting

### Backend (Server)

- **Express** - Web application framework
- **TypeScript** - Type-safe server-side development
- **ts-node** - TypeScript execution for Node.js
- **Nodemon** - Automatic server restart during development
- **CORS** - Cross-origin resource sharing support

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/internetdrew/react-express-starter.git
   cd react-express-starter
   ```

2. **Install dependencies for both client and server**

   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

### Running the Application

You'll need to run both the client and server in separate terminal windows:

#### Terminal 1 - Start the Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:3000` (or your configured port) with hot reloading enabled.

#### Terminal 2 - Start the Frontend Client

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173`.

### Development Workflow

- **Frontend Development**: Make changes in the `client/src` directory
- **Backend Development**: Make changes in the `server/src` directory
- Both servers support hot reloading, so changes will be reflected automatically

### Available Scripts

#### Client Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

#### Server Scripts

- `npm run dev` - Start development server with auto-restart
- `npm start` - Start production server

### Troubleshooting

#### Common Issues

**Port Already in Use**
If you get a port error, you can:

- Kill the process using the port: `lsof -ti:5173 | xargs kill` (for client) or `lsof -ti:3000 | xargs kill` (for server)
- Change the port in the configuration files

**Module Not Found Errors**

- Ensure you've installed dependencies: `npm install` in both `client` and `server` directories
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

**TypeScript Errors**

- Check that TypeScript is properly installed: `npx tsc --version`
- Restart your IDE/editor's TypeScript service

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions:

- Check the [Issues](https://github.com/internetdrew/react-express-starter/issues) page
- Create a new issue if your problem isn't already documented
