import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import BuyerHomeCard from './components/BuyerHomeCard';
import Nav from './components/nav';
import { ArrowLeft } from 'lucide-react';
import './styling/SellerProfile.css';

const SellerProfile = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [storeInfo, setStoreInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) {
        setError('Store ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch store information
        const storeRef = doc(db, 'stores', storeId);
        const storeSnap = await getDoc(storeRef);
        
        if (!storeSnap.exists()) {
          setError('Store not found');
          setLoading(false);
          return;
        }

        const storeData = storeSnap.data();
        setStoreInfo(storeData);

        // Fetch products for this store
        const productsRef = collection(db, 'stores', storeId, 'products');
        const productsSnapshot = await getDocs(productsRef);
        
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          storeId: storeId,
          storeName: storeData.storeName,
          ownerName: storeData.ownerName
        }));

        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching store data:', err);
        setError('Failed to load store information');
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId]);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="seller-profile-container">
        <header>
          <Nav />
        </header>
        <main className="seller-profile-content">
          <div className="loading-spinner">Loading seller profile...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-profile-container">
        <header>
          <Nav />
        </header>
        <main className="seller-profile-content">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={handleBackClick} className="back-button">
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="seller-profile-container">
      <header>
        <Nav />
      </header>
      
      <main className="seller-profile-content">
        {/* Back button */}
        <button onClick={handleBackClick} className="back-button">
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Store header */}
        <section className="store-header">
          <div className="store-info">
            <h1 className="store-name">{storeInfo?.storeName || 'Unknown Store'}</h1>
            <p className="store-owner">by {storeInfo?.ownerName || 'Unknown Owner'}</p>
            {storeInfo?.storeBio && (
              <p className="store-description">{storeInfo.storeBio}</p>
            )}
          </div>
        </section>

        {/* Products section */}
        <section className="products-section">
          <h2 className="products-title">
            Products ({products.length})
          </h2>
          
          {products.length === 0 ? (
            <div className="no-products">
              <p>This seller hasn't added any products yet.</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <BuyerHomeCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default SellerProfile;
