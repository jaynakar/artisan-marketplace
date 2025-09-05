// src/pages/LoginPage.js
import { useState } from 'react';
import { auth, provider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import './LoginPage.css'; // Import the CSS file
import React from 'react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (role) => {
    // Special handling for Admin button: navigate directly
    if (role === 'Admin') {
      navigate('/admin/login');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Starting Google sign-in...');
      
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

      console.log('Attempting to fetch user data from Firestore...');
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.log('User document does not exist, signing out...');
        await signOut(auth);
        alert('No account found. Please sign up first.');
        setIsLoading(false);
        return;
      }

      const userData = userSnap.data();
      console.log('User data retrieved:', userData);

      // Check if the user has the selected role
      if (!userData[role.toLowerCase()]) {
        console.log(`User does not have ${role} role, signing out...`);
        await signOut(auth);
        alert(`You don't have a ${role} account. Please sign up as a ${role}.`);
        setIsLoading(false);
        return;
      }

      console.log(`User has ${role} role, proceeding...`);

      // Store appropriate ID based on role
      if (role === 'Seller') {
        localStorage.setItem('storeId', user.uid);
        console.log('Stored storeId:', user.uid);
      } else {
        localStorage.setItem('userId', user.uid);
        console.log('Stored userId:', user.uid);
      }
      
      setIsLoading(false);
      console.log(`Navigating to ${role === 'Seller' ? '/manage' : '/buyer'}`);
      navigate(role === 'Seller' ? '/manage' : '/buyer');
    } catch (error) {
      console.error('Login Error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Provide more specific error messages
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check your account access.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Service temporarily unavailable. Please try again later.';
      } else if (error.code === 'unauthenticated') {
        errorMessage = 'Authentication failed. Please try signing in again.';
      }
      
      alert(errorMessage);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="loading-container">
        <CircularProgress size={60} className="loading-spinner" />
        <p className="loading-text">Logging in...</p>
      </section>
    );
  }

  return (
    <main className="login-container">
      <section className="login-card">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/6738/6738021.png" 
          alt="Market Icon" 
          className="login-logo"
        />
        <h1 className="login-title">Casa di Arté</h1>
        <p className="login-subtitle">Handcrafted treasures await</p>
        
        <section className="button-container">
          <button 
            onClick={() => handleLogin('Buyer')}
            className="buyer-button"
          >
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" 
              alt="Google" 
              className="icon"
            />
            Continue as Buyer
          </button>
          
          <button 
            onClick={() => handleLogin('Seller')}
            className="seller-button"
          >
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" 
              alt="Google" 
              className="icon"
            />
            Continue as Seller
          </button>
          <button
            onClick={() => handleLogin('Admin')}
            className="admin-button"
          >
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" 
              alt="Admin Icon" 
              className="icon"
            />
            Continue as Admin
          </button>
        </section>
      </section>
    </main>
  );
}