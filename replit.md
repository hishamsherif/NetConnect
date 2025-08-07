# Overview

This is a comprehensive Network Contact Tracker application built as a full-stack web application. The system allows users to manage their professional network by tracking contacts, logging interactions, visualizing relationships, and gaining insights into their networking activities. The application features contact management with categorization, interaction logging, network visualization using D3.js, and analytics dashboards to help users maintain and grow their professional relationships effectively.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with React and TypeScript, utilizing a component-based architecture. The application uses Vite as the build tool and development server. The UI is built with shadcn/ui components for consistent design, styled with Tailwind CSS for responsive layouts. React Query (@tanstack/react-query) handles server state management and caching. The routing is handled by Wouter for lightweight client-side navigation. The application follows a pages-based structure with shared components organized by feature areas (contacts, dashboard, network, layout).

## Backend Architecture
The server is built with Express.js and TypeScript, following a RESTful API design pattern. The application uses a layered architecture with separate concerns for routing, business logic, and data access. Database operations are abstracted through a storage interface pattern, promoting loose coupling and testability. The server includes middleware for request logging, error handling, and user authentication simulation. API endpoints are organized by resource type (contacts, interactions, relationships) with proper HTTP status codes and error handling.

## Data Storage Solutions
The application uses PostgreSQL as the primary database, accessed through Drizzle ORM for type-safe database operations. The database schema is defined in shared TypeScript files, ensuring consistency between client and server. Database migrations are managed through Drizzle Kit. The schema includes tables for users, contacts, interactions, relationships, tags, and contact tags with proper foreign key relationships and cascading deletes. Neon Database serverless PostgreSQL is used as the cloud database provider.

## Authentication and Authorization
Currently implements a simplified authentication system with mock user sessions for development purposes. The architecture includes middleware for user authentication that simulates JWT-based auth by setting a default user ID. All API routes are protected with authentication middleware. The system is designed to easily integrate with proper JWT authentication and authorization mechanisms in production.

## Network Visualization
The application includes an interactive network visualization component built with D3.js. This creates force-directed graphs showing relationships between contacts, with features like zoom, pan, and dynamic node sizing based on relationship strength. The visualization supports filtering and clustering of contacts by various attributes like company, category, or relationship strength.

# External Dependencies

## Database and ORM
- **Neon Database**: Serverless PostgreSQL database hosting with WebSocket support for real-time connections
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL with schema definition and migration support
- **Drizzle Kit**: Database migration and introspection toolkit

## Frontend UI and Styling
- **Radix UI**: Headless, accessible UI components (@radix-ui/react-*) for building the interface
- **Tailwind CSS**: Utility-first CSS framework for responsive design and styling
- **shadcn/ui**: Pre-built component library based on Radix UI and Tailwind CSS
- **Lucide React**: Icon library providing consistent iconography throughout the application

## State Management and Data Fetching
- **TanStack React Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form state management and validation with TypeScript support
- **Zod**: Runtime type validation and schema definition for forms and API data

## Data Visualization
- **D3.js**: Data visualization library for creating interactive network graphs and charts
- **Date-fns**: Date manipulation and formatting utilities for interaction timestamps

## Development and Build Tools
- **Vite**: Fast build tool and development server with hot module replacement
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds

## Session Management
- **Connect PG Simple**: PostgreSQL session store for Express sessions (prepared for production auth)

## Routing and Navigation
- **Wouter**: Lightweight client-side routing library for React applications