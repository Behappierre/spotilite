Write-Host "Setting up SpotiLite Git repository..." -ForegroundColor Green
Write-Host ""

# Initialize git repository
Write-Host "1. Initializing Git repository..." -ForegroundColor Yellow
git init

# Add all files
Write-Host "2. Adding files to repository..." -ForegroundColor Yellow
git add .

# Create initial commit
Write-Host "3. Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: SpotiLite - Minimal Spotify Search with Full Playback"

# Set up remote origin (you'll need to update this URL)
Write-Host "4. Setting up remote origin..." -ForegroundColor Yellow
Write-Host "Please update the remote URL with your actual GitHub repository URL" -ForegroundColor Cyan
Write-Host "Example: git remote add origin https://github.com/yourusername/spotilite.git" -ForegroundColor Cyan
Write-Host ""

# Show status
Write-Host "5. Repository status:" -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "Git repository setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a new repository on GitHub named 'spotilite'" -ForegroundColor White
Write-Host "2. Update the remote URL: git remote add origin https://github.com/yourusername/spotilite.git" -ForegroundColor White
Write-Host "3. Push to GitHub: git push -u origin main" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue"
