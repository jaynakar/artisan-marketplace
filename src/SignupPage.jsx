import {useState } from 'react';
import React from 'react'; 
import { auth, provider, db } from './firebase';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { Google, Storefront, ShoppingBag } from '@mui/icons-material';
import './signup.css'; // Import the CSS file

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (role) => {
    try {
      setLoading(true);
      setError('');
      console.log(`Starting signup process for role: ${role}`);
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log('Google sign-in successful, user:', user.uid);
      console.log('Waiting for auth state to be ready...');
      
      // Wait for auth state to be fully established
      await new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            console.log('Auth state confirmed, user:', user.uid);
            unsubscribe();
            resolve();
          }
        });
      });

      console.log('Attempting to create/update user document...');
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        console.log('User document exists, updating role...');
        await updateDoc(userRef, {
          [role.toLowerCase()]: true,
        });
        console.log(`Updated user document with ${role} role`);
      } else {
        console.log('Creating new user document...');
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          buyer: role === 'Buyer',
          seller: role === 'Seller',
          createdAt: new Date()
        });
        console.log('New user document created successfully');
      }

      // Store appropriate ID based on role
      if (role === 'Seller') {
        localStorage.setItem('storeId', user.uid);
        console.log('Stored storeId:', user.uid);
      } else {
        localStorage.setItem('userId', user.uid);
        console.log('Stored userId:', user.uid);
      }
      
      console.log(`Signup successful, navigating to ${role === 'Seller' ? '/createStore' : '/buyer'}`);
      navigate(role === 'Seller' ? '/createStore' : '/buyer');
    } catch (error) {
      console.error('Signup Error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Provide more specific error messages
      let errorMessage = error.message || 'Sign-up failed. Please try again.';
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check your account access.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Service temporarily unavailable. Please try again later.';
      } else if (error.code === 'unauthenticated') {
        errorMessage = 'Authentication failed. Please try signing in again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup-container">
      <section className="signup-card">
        {/* Market Logo */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/6738/6738021.png"
          alt="Market Logo"
          className="signup-logo"
        />

        <h1 className="signup-title">Join Casa di Arté</h1>
        <p className="signup-subtitle">Choose your role to get started</p>
        
        {loading ? (
          <section className="loading-container">
            <CircularProgress size={40} className="loading-spinner" />
            <p>Creating your account...</p>
          </section>
        ) : (
          <>
            <section className="button-container">
              <button 
                onClick={() => handleSignup('Buyer')}
                className="role-button buyer-button"
                disabled={loading}
              >
                <Google />
                <ShoppingBag />
                Continue as Buyer
              </button>
              
              <button 
                onClick={() => handleSignup('Seller')}
                className="role-button seller-button"
                disabled={loading}
              >
                <Google />
                <Storefront />
                Continue as Seller
              </button>
            </section>

            {error && <p className="error-message">{error}</p>}

            <p className="signin-message">
              Already have an account? <br />
              Just sign in with Google - we'll recognize your account!
            </p>
          </>
        )}
      </section>
    </main>
  );
}