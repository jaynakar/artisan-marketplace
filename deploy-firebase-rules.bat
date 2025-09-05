@echo off
echo Deploying Firestore security rules to Firebase...
echo.

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Firebase CLI is not installed. Please install it first:
    echo npm install -g firebase-tools
    echo.
    pause
    exit /b 1
)

REM Deploy Firestore rules
echo Deploying Firestore rules...
firebase deploy --only firestore:rules

echo.
echo Deployment complete!
pause
