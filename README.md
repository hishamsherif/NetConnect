# Nodal - Brand System Implementation

A React + Tailwind application showcasing the Nodal brand system with modern, minimal, trustworthy design.

## 🎨 Brand System

**Vibe**: Modern, minimal, trustworthy, networked, precise

### Logo
The Nodal logo features a teal circular icon with a central network node connected to four satellite nodes, representing connectivity and networking. The wordmark uses Space Grotesk font for a modern, trustworthy appearance.

**Logo Usage**:
- **Full Logo**: Icon + "Nodal" wordmark (default)
- **Logo Only**: Icon only for compact spaces
- **Sizes**: Small (20px), Medium (28px), Large (32px)
- **Clear Space**: Maintain height of "N" as minimum spacing around logo

### Colors (Light Mode)
- **Primary/Teal**: `#2F7C85`
- **Teal-600**: `#1F5A61` 
- **Teal-300**: `#4FA1AC`
- **Ink/Text**: `#1C1C1C`
- **BG/Base**: `#F4F2ED`
- **Surface/Card**: `#FFFFFF`
- **Border/Subtle**: `#E4E2DC`
- **Muted/Caption**: `#6E6E6E`

### Status Colors
- **Success**: `#2FA36B`
- **Warning**: `#E59F1A`
- **Error**: `#D13B3B`
- **Info**: `#2E6EEA`

### Dark Mode
- **BG/Base**: `#0F1113`
- **Surface**: `#15181B`
- **Ink**: `#F2F2F2`
- **Border**: `#242A2E`
- **Muted**: `#9AA3AB`
- **Primary**: `#4FA1AC` (hover: `#2F7C85`)

### Typography
- **UI/Body**: Inter (400/500/600/700)
- **Display/Headings**: Space Grotesk (500/600)
- **Mono**: JetBrains Mono (400/600)

### Scale
- **Display**: 48px
- **H1**: 36px
- **H2**: 28px
- **H3**: 22px
- **Body**: 16px
- **Small**: 14px
- **Caption**: 12px

### Spacing
4, 8, 12, 16, 20, 24, 32, 40, 48px

### Border Radius
- **Inputs**: 6px
- **Buttons**: 10px
- **Cards**: 16px
- **Pills**: 999px

### Shadows
**Light Mode**:
- **SM**: `0 1px 2px rgba(0,0,0,.06)`
- **MD**: `0 4px 12px rgba(0,0,0,.08)`
- **LG**: `0 10px 24px rgba(0,0,0,.10)`

**Dark Mode**:
- **SM**: `0 1px 2px rgba(0,0,0,.5)`
- **MD**: `0 6px 18px rgba(0,0,0,.45)`
- **LG**: `0 18px 40px rgba(0,0,0,.4)`

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🧩 Components

### Base Components
- **Button**: Primary, ghost, danger variants with sm/md/lg sizes
- **Input**: Form inputs with focus states and proper styling
- **Card**: Surface containers with consistent spacing
- **Badge**: Status indicators with multiple variants
- **Navbar**: Header navigation with theme toggle

### Features
- ✅ **Dark Mode Support**: Toggle between light and dark themes
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Accessibility**: Proper focus states and contrast ratios
- ✅ **Brand Consistency**: All components use design tokens

## 🎯 Demo Page

The demo page showcases:
- All component variants
- Typography scale
- Spacing system
- Border radius examples
- Shadow variations
- Theme toggle functionality

## 🔧 Customization

All design tokens are defined in `src/index.css` as CSS custom properties and mapped to Tailwind classes in `tailwind.config.js`.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

MIT License
