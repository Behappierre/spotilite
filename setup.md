# 🚀 SpotiLite Setup Guide

## Prerequisites

- Node.js 16+ installed
- A Spotify account
- A modern web browser

## Step-by-Step Setup

### 1. Spotify Developer Dashboard Setup

1. **Visit the Dashboard**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Sign in with your Spotify account

2. **Create a New App**
   - Click "Create an App"
   - Fill in the app details:
     - **App name**: `SpotiLite` (or any name you prefer)
     - **App description**: `A minimal Spotify search application`
     - **Website**: `http://localhost:5173` (for development)
     - **Redirect URIs**: 
       - `http://localhost:5173/` (for Vite)
       - `http://127.0.0.1:8080/` (for static server)
       - `http://localhost:8080/` (for static server)
   - Click "Save"

3. **Copy Your Client ID**
   - From your app dashboard, copy the **Client ID**
   - You'll need this in the next step

### 2. Configure the Application

1. **Open `index.html`**
2. **Find line 200** (look for `const CLIENT_ID = "YOUR_SPOTIFY_CLIENT_ID";`)
3. **Replace `YOUR_SPOTIFY_CLIENT_ID`** with your actual Client ID
4. **Save the file**

### 3. Run the Application

#### Option A: Using Vite (Recommended for Development)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open automatically at `http://localhost:5173`

#### Option B: Using a Static Server

```bash
# Using npx serve
npx serve . -p 8080

# Or using Python
python -m http.server 8080

# Or using Node.js http-server
npx http-server -p 8080
```

Then open `http://localhost:8080` in your browser

### 4. First Login

1. **Click "Log in with Spotify"**
2. **Authorize the application** when prompted
3. **You'll be redirected back** to the app
4. **Start searching!** 🎵

## 🔧 Troubleshooting

### Common Issues

**"Invalid redirect URI" error**
- Make sure the redirect URI in your Spotify app settings exactly matches your local URL
- Check for trailing slashes and port numbers

**"Client ID not found" error**
- Verify you've replaced `YOUR_SPOTIFY_CLIENT_ID` in `index.html`
- Check that the Client ID is copied correctly

**"State mismatch" error**
- Clear your browser's localStorage and try again
- This usually happens if the authorization flow was interrupted

**Search not working**
- Make sure you're logged in (check the header for your profile)
- Verify you've selected at least one search type (track, artist, album, or playlist)

### Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: iOS 14+ and macOS 11+
- **Mobile browsers**: Should work on most modern mobile browsers

## 🎯 Next Steps

Once you have the basic app running:

1. **Customize the UI** by modifying the CSS variables in `index.html`
2. **Add more scopes** if you want additional functionality
3. **Deploy to a static hosting service** like Netlify, Vercel, or GitHub Pages
4. **Add new features** like pagination or search history

## 📚 Additional Resources

- [Spotify Web API Reference](https://developer.spotify.com/documentation/web-api/reference)
- [OAuth 2.0 PKCE Flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow-with-proof-key-for-code-exchange-pkce)
- [Spotify Design Guidelines](https://developer.spotify.com/documentation/design)

---

**Need help?** Check the main README.md for more detailed information or open an issue on GitHub!
