# Switch to LOCAL (Docker) Convex
# Run this in PowerShell from your project folder: .\scripts\use-local.ps1

Write-Host "Switching to LOCAL (Docker) Convex..." -ForegroundColor Cyan
Copy-Item ".env.local.local-docker" ".env.local" -Force
Write-Host ""
Write-Host "Done! Now run these 2 commands in separate terminals:" -ForegroundColor Green
Write-Host ""
Write-Host "  Terminal 1 (keep running):  npx convex dev" -ForegroundColor Yellow
Write-Host "  Terminal 2 (keep running):  npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "NOTE: Make sure Docker is running first!" -ForegroundColor Red
