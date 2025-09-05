# Firebase Permissions Fix Guide

## Issue Description
You were experiencing "Missing or insufficient permissions" errors when trying to log in with Google in your Firebase + React project. This was happening because:

1. **No Firestore Security Rules**: Your project didn't have any Firestore security rules configured
2. **Default Restrictive Rules**: Firebase was using default rules that block ALL reads and writes
3. **Authentication Timing**: The code was trying to access Firestore before the authentication state was fully established

## What I Fixed

### 1. Created Firestore Security Rules (`firestore.rules`)
- **Users Collection**: Users can only read/write their own document
- **Stores Collection**: Store owners can manage their own store and products
- **Orders Collection**: Users can read their own orders, sellers can read orders for their store
- **Admin Collection**: Only admin users can access

### 2. Improved Authentication Flow
- Added proper waiting for authentication state to be established
- Enhanced error handling with specific error messages
- Added comprehensive logging for debugging

### 3. Created Deployment Scripts
- `deploy-firebase-rules.bat` (Windows batch file)
- `deploy-firebase-rules.ps1` (PowerShell script)

## How to Deploy the Fix

### Option 1: Using the Scripts (Recommended)
1. Install Firebase CLI if not already installed:
   ```bash
   npm install -g firebase-tools
   ```

2. Run one of the deployment scripts:
   - **Windows**: Double-click `deploy-firebase-rules.bat`
   - **PowerShell**: Right-click `deploy-firebase-rules.ps1` → "Run with PowerShell"

### Option 2: Manual Deployment
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Security Rules Explained

```javascript
// Users can only access their own data
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// Store owners can manage their own store
match /stores/{storeId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && request.auth.uid == storeId;
}

// Users can read their own orders, sellers can read store orders
match /orders/{orderId} {
  allow read: if request.auth != null && (
    resource.data.userId == request.auth.uid || 
    resource.data.storeId == request.auth.uid
  );
}
```

## Testing the Fix

1. **Deploy the rules** using one of the methods above
2. **Clear your browser's local storage** for the site
3. **Try logging in again** with Google
4. **Check the browser console** for the detailed logging I added

## What to Look For

- **Successful authentication** should show logs like:
  ```
  Starting Google sign-in...
  Google sign-in successful, user: [uid]
  Auth state confirmed, user: [uid]
  Attempting to fetch user data from Firestore...
  User data retrieved: [userData]
  ```

- **If errors persist**, check the console for specific error codes and messages

## Common Issues and Solutions

### "Permission denied" errors
- Make sure the Firestore rules are deployed
- Verify the user document exists in the `users` collection
- Check that the user has the correct role assigned

### "User document does not exist"
- The user needs to sign up first, not just sign in
- Use the SignupPage to create the user account

### Authentication timing issues
- The improved code now waits for auth state to be fully established
- This should resolve most timing-related permission errors

## Need Help?

If you continue to experience issues:
1. Check the browser console for error messages
2. Verify the Firestore rules are deployed correctly
3. Ensure your Firebase project ID matches the one in `.firebaserc`
4. Check that Google Authentication is enabled in your Firebase console

