# Switch to CLOUD Convex
# Run this in PowerShell from your project folder: .\scripts\use-cloud.ps1

Write-Host "Switching to CLOUD Convex..." -ForegroundColor Cyan
Copy-Item ".env.local.cloud" ".env.local" -Force
Write-Host ""
Write-Host "Done! Now run these 2 commands in separate terminals:" -ForegroundColor Green
Write-Host ""
Write-Host "  Terminal 1 (keep running):  npx convex dev" -ForegroundColor Yellow
Write-Host "  Terminal 2 (keep running):  npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "NOTE: You must be logged in to Convex cloud (npx convex login)" -ForegroundColor Red
