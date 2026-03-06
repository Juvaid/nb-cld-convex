# Seed admin user and site data for LOCAL Convex
# Run this ONCE after switching to local with use-local.ps1
# Usage: .\scripts\seed-local.ps1

Write-Host "Seeding local Convex database..." -ForegroundColor Cyan
Write-Host "This will create site content and an admin login." -ForegroundColor Gray
Write-Host ""

Write-Host "[1/3] Seeding site stats & services..." -ForegroundColor Yellow
npx convex run seed:seedSiteData --env-file .env.convex-local

Write-Host "[2/3] Setting up pages..." -ForegroundColor Yellow
npx convex run initialize_pages:setupCorePages --env-file .env.convex-local

Write-Host "[3/3] Creating admin user (admin@naturesboon.com / admin123)..." -ForegroundColor Yellow
npx convex run seed_admin:createDefaultAdmin '{"email":"admin@naturesboon.com","password":"admin123"}' --env-file .env.convex-local

Write-Host ""
Write-Host "All done! Login at http://localhost:3000/login" -ForegroundColor Green
Write-Host "  Email:    admin@naturesboon.com" -ForegroundColor Cyan
Write-Host "  Password: admin123" -ForegroundColor Cyan
