# NetworkTracker - Professional Network Management Application

A comprehensive full-stack application for managing professional contacts, tracking interactions, and visualizing your network.

## 🚀 Features

- **Contact Management**: Add, edit, and organize professional contacts
- **Interaction Tracking**: Log meetings, calls, emails, and other interactions
- **Network Visualization**: Interactive D3.js network graph showing relationships
- **Analytics Dashboard**: Comprehensive insights into your network health
- **Mobile Responsive**: Optimized for both desktop and mobile devices
- **Search & Filtering**: Advanced contact search and categorization
- **Export/Import**: CSV import/export capabilities (planned)

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** components for accessibility
- **React Hook Form** with Zod validation
- **TanStack Query** for data fetching
- **D3.js** for network visualization
- **Wouter** for routing

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **PostgreSQL** (Neon) for data storage
- **Zod** for schema validation

## 🐛 Recent Fixes & Improvements

### Button Functionality
- ✅ Fixed all non-working buttons across the application
- ✅ Removed debugging alerts and console logs that interfered with functionality
- ✅ Improved form submission handling
- ✅ Added proper click handlers for all interactive elements

### Mobile Experience
- ✅ Added mobile navigation toggle functionality
- ✅ Implemented proper mobile sidebar with touch support
- ✅ Fixed mobile contact cards and interactions
- ✅ Improved responsive layout for all screen sizes

### Form Handling
- ✅ Fixed contact creation forms
- ✅ Fixed interaction logging forms
- ✅ Improved form validation and error handling
- ✅ Added proper form reset functionality

### Navigation
- ✅ Fixed sidebar navigation links
- ✅ Added mobile menu button
- ✅ Improved search functionality
- ✅ Fixed routing between pages

### UI/UX Improvements
- ✅ Removed placeholder alerts and debugging code
- ✅ Added proper loading states
- ✅ Improved error handling
- ✅ Better mobile touch interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon serverless)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NetConnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   DATABASE_URL="your-postgresql-connection-string"
   PORT=5000
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## 📱 Usage

### Adding Contacts
1. Click "Add Contact" from any page
2. Fill in contact details (name, company, category, etc.)
3. Set relationship strength (1-5 scale)
4. Add notes and source information
5. Save the contact

### Logging Interactions
1. Navigate to a contact's details
2. Click the "+" button to add an interaction
3. Select interaction type (meeting, call, email, etc.)
4. Add notes and outcome
5. Set follow-up reminders if needed

### Network Visualization
1. Go to the Network Map page
2. View your contacts as an interactive graph
3. Drag nodes to rearrange the layout
4. Use filters to focus on specific categories
5. Zoom and pan to explore connections

### Analytics
1. Visit the Analytics page for network insights
2. View contact distribution and growth metrics
3. Monitor relationship strength trends
4. Identify contacts needing follow-up

## 🔧 Development

### Project Structure
```
NetConnect/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utilities and API
├── server/                 # Express backend
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Database operations
│   └── db.ts             # Database connection
├── shared/                 # Shared schemas and types
└── drizzle.config.ts      # Database configuration
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run check` - TypeScript type checking

### API Endpoints
- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact
- `GET /api/interactions` - Get interactions
- `POST /api/interactions` - Log interaction
- `GET /api/analytics/stats` - Get network statistics
- `GET /api/network/graph` - Get network graph data

## 🎯 Roadmap

### Planned Features
- [ ] CSV import/export functionality
- [ ] Email integration for follow-ups
- [ ] Advanced filtering and search
- [ ] Contact tagging system
- [ ] Relationship strength tracking over time
- [ ] Network growth analytics
- [ ] Mobile app (React Native)
- [ ] API rate limiting and authentication
- [ ] Multi-user support

### Known Issues
- Some buttons show console logs (intentional for development)
- Export functionality is placeholder (TODO)
- Advanced filtering needs implementation
- Mobile search modal needs implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your database connection
3. Ensure all environment variables are set
4. Check the browser's network tab for API errors

For additional help, please open an issue in the repository.
