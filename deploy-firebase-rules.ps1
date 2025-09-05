Write-Host "Deploying Firestore security rules to Firebase..." -ForegroundColor Green
Write-Host ""

# Check if Firebase CLI is installed
try {
    $firebaseVersion = firebase --version 2>$null
    Write-Host "Firebase CLI version: $firebaseVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Firebase CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g firebase-tools" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to continue"
    exit 1
}

# Deploy Firestore rules
Write-Host "Deploying Firestore rules..." -ForegroundColor Cyan
firebase deploy --only firestore:rules

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
Read-Host "Press Enter to continue"
