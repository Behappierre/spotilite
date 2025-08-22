@echo off
echo Setting up SpotiLite Git repository...
echo.

REM Initialize git repository
echo 1. Initializing Git repository...
git init

REM Add all files
echo 2. Adding files to repository...
git add .

REM Create initial commit
echo 3. Creating initial commit...
git commit -m "Initial commit: SpotiLite - Minimal Spotify Search with Full Playback"

REM Set up remote origin (you'll need to update this URL)
echo 4. Setting up remote origin...
echo Please update the remote URL with your actual GitHub repository URL
echo Example: git remote add origin https://github.com/yourusername/spotilite.git
echo.

REM Show status
echo 5. Repository status:
git status

echo.
echo Git repository setup complete!
echo.
echo Next steps:
echo 1. Create a new repository on GitHub named 'spotilite'
echo 2. Update the remote URL: git remote add origin https://github.com/yourusername/spotilite.git
echo 3. Push to GitHub: git push -u origin main
echo.
pause
