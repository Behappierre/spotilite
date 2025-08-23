# 🎵 SpotiLite - TypeScript Edition

A clean, minimal Spotify-lite application built with **TypeScript** and modern web technologies. Features full playback controls, advanced search functionality, jukebox mode, and a beautiful touch-optimized UI.

## ✨ **Features**

- 🔐 **Spotify OAuth 2.0 with PKCE** - Secure authentication
- 🎵 **Full Track Playback** - Using Spotify Web Playback SDK
- 🔍 **Advanced Search** - Tracks, artists, albums, and playlists with drill-down capability
- 🎛️ **Complete Player Controls** - Play, pause, stop, next, previous, seek, volume control
- 🎪 **Jukebox Mode** - Multi-user queue management with touch-optimized controls
- 📱 **Responsive Design** - Works on all devices, optimized for tablets
- 🚀 **Modern Architecture** - TypeScript, ES6+, modular design
- 🎨 **Beautiful UI** - Clean search interface with magnifying glass icon

## 🏗️ **Project Structure**

```
spotilite/
├── src/
│   ├── types/
│   │   └── spotify.ts          # TypeScript interfaces
│   ├── services/
│   │   ├── spotify-auth.ts     # Authentication service
│   │   ├── spotify-api.ts      # API calls service
│   │   ├── spotify-player.ts   # Web Playback SDK service
│   │   ├── queue-manager.ts    # Jukebox queue management
│   │   └── user-manager.ts     # User identification service
│   ├── components/
│   │   └── ui-manager.ts       # UI management and rendering
│   ├── app.ts                  # Main application logic
│   └── main.ts                 # Entry point
├── index.html                  # Clean HTML structure with jukebox layout
├── package.json                # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
├── netlify.toml               # Netlify deployment configuration
└── README.md                  # This file
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- Spotify Premium account (for full playback)
- Spotify Developer account

### **1. Setup Spotify App**
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add redirect URI: `http://127.0.0.1:5173/`
4. Copy your Client ID

### **2. Install Dependencies**
```bash
npm install
```

### **3. Configure Client ID**
Update `src/services/spotify-auth.ts` with your Client ID:
```typescript
private static readonly CLIENT_ID = "YOUR_CLIENT_ID_HERE";
```

### **4. Run Development Server**
```bash
npm run dev
```

The app will be available at `http://127.0.0.1:5173/`

## 🎪 **Jukebox Features**

### **Queue Management**
- **Multi-user support** - Each user can add songs to the queue
- **User limits** - Configurable song limits per user
- **Queue persistence** - Queue survives page refreshes
- **Smart playback** - Automatically plays next song from queue

### **Touch-Optimized Controls**
- **Large buttons** - Easy to use on tablets and touch devices
- **Dedicated jukebox panel** - Separate from main player controls
- **Volume synchronization** - Both volume sliders stay in sync
- **User identification** - Simple username input system

### **Playback Controls**
- **Play/Pause** - Start/stop queue playback
- **Next/Previous** - Navigate through queue
- **Stop** - Clear current track and stop playback
- **Volume control** - Master volume with mute toggle
- **Progress bar** - Click to seek through tracks

## 🔍 **Search & Discovery**

### **Multi-Type Search**
- **Tracks** - Individual songs with play buttons
- **Artists** - View top tracks and artist information
- **Albums** - Browse complete album tracklists
- **Playlists** - Explore curated music collections

### **Drill-Down Navigation**
- **View Tracks** - Click on playlists, albums, or artists to see individual tracks
- **Back to Search** - Easy navigation back to search results
- **Seamless Playback** - Selected tracks become available for immediate playback

### **Enhanced Search Interface**
- **Magnifying Glass Icon** - Clean, modern search button
- **Sticky Search Bar** - Stays visible while scrolling
- **Responsive Design** - Optimized for all screen sizes
- **Type Selection** - Choose what to search for

## 🛠️ **Development**

### **Available Scripts**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - TypeScript type checking

### **TypeScript Benefits**
- **Type Safety** - Catch errors at compile time
- **Better IDE Support** - IntelliSense, refactoring, navigation
- **Modular Architecture** - Clean separation of concerns
- **Maintainability** - Easier to understand and modify
- **Scalability** - Better for growing applications

## 🎯 **Architecture Overview**

### **Services Layer**
- **`SpotifyAuthService`** - Handles OAuth flow and token management
- **`SpotifyApiService`** - Manages all Spotify API calls and drill-down functionality
- **`SpotifyPlayerService`** - Controls Web Playback SDK and volume
- **`QueueManager`** - Handles jukebox queue logic and user limits
- **`UserManager`** - Manages user identification and session

### **UI Layer**
- **`UIManager`** - Manages all DOM interactions, search results, and jukebox UI
- **Event-driven** - Uses custom events for loose coupling between components
- **Responsive Design** - Touch-optimized controls and mobile-friendly layout

### **Main Application**
- **`SpotiLiteApp`** - Orchestrates all services and UI components
- **Clean separation** - Each component has a single responsibility
- **Volume Synchronization** - Keeps all volume controls in sync

## 🔧 **Key Improvements Over Vanilla JS**

1. **Type Safety** - No more runtime errors from typos
2. **Modular Design** - Easy to test and maintain individual components
3. **Better Error Handling** - Compile-time error detection
4. **IDE Support** - Full IntelliSense and refactoring capabilities
5. **Code Organization** - Clear structure and separation of concerns
6. **Maintainability** - Easier to add features and fix bugs
7. **Jukebox Features** - Full queue management and multi-user support
8. **Drill-Down Search** - Navigate into playlists, albums, and artists
9. **Volume Control** - Bidirectional synchronization between all controls

## 🌐 **Deployment**

### **Netlify (Recommended)**
1. Push to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### **Manual Build**
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🐛 **Troubleshooting**

### **Common Issues**
- **"Player not ready"** - Wait for Web Playback SDK to initialize
- **Authentication errors** - Check Client ID and redirect URI
- **Playback issues** - Ensure you have Spotify Premium
- **Volume sync issues** - Both sliders should automatically stay in sync

### **Development Tips**
- Use `npm run type-check` to catch TypeScript errors
- Check browser console for detailed error messages
- Verify Spotify app settings match your local setup
- Test jukebox features with multiple users

## 📚 **API Reference**

### **Spotify Web API**
- [Authentication Guide](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow)
- [Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk)
- [Search API](https://developer.spotify.com/documentation/web-api/reference/search)
- [Playlist Tracks](https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks)
- [Album Tracks](https://developer.spotify.com/documentation/web-api/reference/get-albums-tracks)
- [Artist Top Tracks](https://developer.spotify.com/documentation/web-api/reference/get-artists-top-tracks)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

MIT License - see LICENSE file for details

## 🙏 **Acknowledgments**

- Spotify for the excellent APIs and SDKs
- Vite team for the fast build tool
- TypeScript team for the amazing language
- Netlify for seamless deployment

---

**Built with ❤️, TypeScript, and a love for music**
