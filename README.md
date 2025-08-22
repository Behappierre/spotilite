# 🎵 SpotiLite - TypeScript Edition

A clean, minimal Spotify-lite application built with **TypeScript** and modern web technologies. Features full playback controls, search functionality, and a beautiful UI.

## ✨ **Features**

- 🔐 **Spotify OAuth 2.0 with PKCE** - Secure authentication
- 🎵 **Full Track Playback** - Using Spotify Web Playback SDK
- 🔍 **Advanced Search** - Tracks, artists, albums, and playlists
- 🎛️ **Complete Player Controls** - Play, pause, stop, next, previous, seek
- 📱 **Responsive Design** - Works on all devices
- 🚀 **Modern Architecture** - TypeScript, ES6+, modular design

## 🏗️ **Project Structure**

```
spotilite/
├── src/
│   ├── types/
│   │   └── spotify.ts          # TypeScript interfaces
│   ├── services/
│   │   ├── spotify-auth.ts     # Authentication service
│   │   ├── spotify-api.ts      # API calls service
│   │   └── spotify-player.ts   # Web Playback SDK service
│   ├── components/
│   │   └── ui-manager.ts       # UI management
│   ├── app.ts                  # Main application logic
│   └── main.ts                 # Entry point
├── index.html                  # Clean HTML structure
├── package.json                # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
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
- **`SpotifyApiService`** - Manages all Spotify API calls
- **`SpotifyPlayerService`** - Controls Web Playback SDK

### **UI Layer**
- **`UIManager`** - Manages all DOM interactions and UI updates
- **Event-driven** - Uses custom events for loose coupling

### **Main Application**
- **`SpotiLiteApp`** - Orchestrates all services and UI components
- **Clean separation** - Each component has a single responsibility

## 🔧 **Key Improvements Over Vanilla JS**

1. **Type Safety** - No more runtime errors from typos
2. **Modular Design** - Easy to test and maintain individual components
3. **Better Error Handling** - Compile-time error detection
4. **IDE Support** - Full IntelliSense and refactoring capabilities
5. **Code Organization** - Clear structure and separation of concerns
6. **Maintainability** - Easier to add features and fix bugs

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

### **Development Tips**
- Use `npm run type-check` to catch TypeScript errors
- Check browser console for detailed error messages
- Verify Spotify app settings match your local setup

## 📚 **API Reference**

### **Spotify Web API**
- [Authentication Guide](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow)
- [Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk)
- [Search API](https://developer.spotify.com/documentation/web-api/reference/search)

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

---

**Built with ❤️ and TypeScript**
