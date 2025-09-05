import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './../firebase';
import Navi from "./sellerNav";

export default function CreateStore() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    bio: '',
    payment: 'card',
    delivery: [],
    category: 'N/A' // Default value
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setForm(prev => {
        const delivery = prev.delivery.includes(value)
          ? prev.delivery.filter(v => v !== value)
          : [...prev.delivery, value];
        return { ...prev, delivery };
      });
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      alert("Please log in to create a store.");
      return;
    }

    const storeData = {
      uid: user.uid,
      ownerName: user.displayName,
      ownerEmail: user.email,
      storeName: form.name,
      storeBio: form.bio,
      category: form.category,
      paymentMethod: form.payment,
      deliveryOptions: form.delivery,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'stores', user.uid), storeData);
      localStorage.setItem('storeId', user.uid);
      navigate('/manage');
    } catch (error) {
      console.error('Error creating store:', error);
      alert("There was a problem creating the store.");
    }
  };

  // Inline styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    headerTitle: {
      fontSize: '2.5rem',
      color: '#333',
      margin: '0',
      fontWeight: 'bold'
    },
    form: {
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    section: {
      marginBottom: '30px'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      color: '#333',
      marginBottom: '20px',
      fontWeight: '600',
      borderBottom: '2px solid #8C5E3D',
      paddingBottom: '10px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '1rem',
      color: '#555',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e1e1e1',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e1e1e1',
      borderRadius: '8px',
      fontSize: '1rem',
      minHeight: '120px',
      resize: 'vertical',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box',
      fontFamily: 'inherit'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e1e1e1',
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: 'white',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box'
    },
    submitButton: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#8C5E3D',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      marginTop: '20px'
    },
    hoverInput: {
      boxShadow: '0 0 0 3px rgba(140, 94, 61, 0.1)'
    },
    hoverSubmit: {
      backgroundColor: '#8C5E3D'
    }
  };

  return (
    <main style={styles.container}>
      <Navi />
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Create Your Casa di Arté Store</h1>
      </header>
      
      <form 
        onSubmit={handleSubmit} 
        data-testid="create-store-form" 
        style={styles.form}
      >
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Store Details</h2>
  
          <label style={styles.label}>
            Store name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.boxShadow = styles.hoverInput.boxShadow}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
              placeholder="Your unique store name"
            />
          </label>
  
          <label style={styles.label}>
            Store Bio
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              style={styles.textarea}
              onFocus={(e) => e.target.style.boxShadow = styles.hoverInput.boxShadow}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
              placeholder="Tell customers about your craft and what makes your products special..."
            />
          </label>
        </section>
  
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Preferred Payment Method</h2>
  
          <label style={styles.label}>
            Payment Method
            <select
              name="payment"
              value={form.payment}
              onChange={handleChange}
              style={styles.select}
              onFocus={(e) => e.target.style.boxShadow = styles.hoverInput.boxShadow}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            >
              <option value="card">Card Only</option>
              <option value="cash">Cash Only</option>
              <option value="cash&card">Cash & Card</option>
            </select>
          </label>

        </section>
  
        <button 
          type="submit" 
          style={styles.submitButton}
          onMouseOver={(e) => e.target.style.backgroundColor = styles.hoverSubmit.backgroundColor}
          onMouseOut={(e) => e.target.style.backgroundColor = styles.submitButton.backgroundColor}
        >
          Save & Continue
        </button>
      </form>
    </main>
  );
  
}