# 🎵 SpotiLite

A clean, minimal Spotify web application that runs locally with full playback capabilities. Built with vanilla HTML/CSS/JS and the Spotify Web Playback SDK.

## ✨ Features

- **🔐 Spotify OAuth 2.0 Authentication** - Secure login with PKCE flow
- **🔍 Advanced Search** - Search across tracks, artists, albums, and playlists
- **🎧 Full Track Playback** - Complete song playback using Spotify Web Playback SDK
- **⏭️ Auto-Play Navigation** - Automatic progression through search results
- **🎮 Interactive Controls** - Play, pause, skip, and seek functionality
- **📱 Responsive Design** - Modern, mobile-friendly interface
- **🔒 Local Development** - Runs completely locally with HTTPS support

## 🚀 Quick Start

### Prerequisites

- **Spotify Premium Account** - Required for full playback functionality
- **Node.js** (v14 or higher)
- **Git** (for cloning the repository)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/spotilite.git
cd spotilite
```

### 2. Spotify Developer Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Copy your **Client ID**
4. Add these Redirect URIs:
   - `https://127.0.0.1:5173/` (for development)
   - `https://localhost:5173/` (alternative)
5. Save your changes

### 3. Configure the App

1. Open `index.html`
2. Replace `YOUR_SPOTIFY_CLIENT_ID` with your actual Client ID
3. Save the file

### 4. Install Dependencies

```bash
npm install
```

### 5. Generate SSL Certificates (for HTTPS)

```bash
npm run certs
```

### 6. Start Development Server

```bash
npm run dev
```

The app will open at `https://127.0.0.1:5173/`

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with HTTPS
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run serve` - Serve static files
- `npm run start` - Start production server
- `npm run certs` - Generate SSL certificates

### Project Structure

```
spotilite/
├── index.html          # Main application file
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
├── .gitignore          # Git ignore rules
├── README.md           # This file
├── setup.md            # Detailed setup instructions
└── generate-certs.js   # SSL certificate generator
```

## 🎮 How to Use

### Authentication
1. Click "Log in with Spotify"
2. Authorize the application
3. You'll be redirected back to SpotiLite

### Search and Playback
1. **Search** - Enter any song, artist, album, or playlist
2. **Filter** - Use the type pills to narrow results
3. **Play** - Click "Play Full" on any track
4. **Navigate** - Use the player controls to skip tracks
5. **Seek** - Click on the progress bar to jump to any position

### Player Controls
- **⏮️ Previous** - Go to previous track in search results
- **⏯️ Play/Pause** - Control playback
- **⏭️ Next** - Go to next track in search results
- **⏹️ Stop** - Stop playback and reset player

## 🔧 Technical Details

### Technologies Used
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Build Tool**: Vite
- **Authentication**: OAuth 2.0 with PKCE
- **Playback**: Spotify Web Playback SDK
- **Styling**: CSS Custom Properties, Flexbox, Grid

### Key Features Implementation
- **OAuth 2.0 Flow**: Implements the recommended Authorization Code with PKCE
- **Web Playback SDK**: Full integration with Spotify's playback system
- **Auto-play**: Intelligent track progression through search results
- **Progress Bar**: Real-time updates with click-to-seek functionality
- **Sticky Search**: Search bar remains accessible while scrolling

### API Endpoints Used
- `https://api.spotify.com/v1/search` - Search for content
- `https://api.spotify.com/v1/me/player/play` - Start playback
- `https://api.spotify.com/v1/me/player/pause` - Pause playback
- `https://api.spotify.com/v1/me/player/seek` - Seek to position

## 🚨 Troubleshooting

### Common Issues

#### "Invalid redirect URI" Error
- Ensure your Spotify Dashboard redirect URI exactly matches your app URL
- Check for trailing slashes and correct protocol (HTTPS)
- Try using `127.0.0.1` instead of `localhost`

#### SSL Certificate Errors
- Run `npm run certs` to generate new certificates
- Ensure you're using HTTPS in development
- Check that `vite.config.js` has the correct certificate paths

#### Playback Not Working
- Verify you have a Spotify Premium account
- Check browser console for Web Playback SDK errors
- Ensure the `streaming` scope is included in authentication

#### Search Not Working
- Check that you're logged in to Spotify
- Verify your access token hasn't expired
- Check browser console for API errors

### Browser Compatibility
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

## 📱 Mobile Support

The application is fully responsive and works on mobile devices. The sticky search bar and touch-friendly controls provide an optimal mobile experience.

## 🔒 Security Features

- **HTTPS Only**: All development and production builds use HTTPS
- **OAuth 2.0**: Secure authentication flow
- **PKCE**: Protection against authorization code interception
- **Local Storage**: Secure token storage with expiration handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Spotify** for providing the Web API and Web Playback SDK
- **Vite** for the excellent development experience
- **Open Source Community** for inspiration and tools

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Ensure all prerequisites are met
4. Open an issue on GitHub with detailed information

---

**Built with ❤️ using Spotify Web API + Web Playback SDK**

*Full playback available with Premium account*
