// src/pages/BuyerHome.jsx
import React, { useEffect, useState } from "react";
import { collection, collectionGroup, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from "./firebase";
import BuyerHomeCard from "./components/BuyerHomeCard";
import Sidebar from "./Sidebar/Sidebar";
import Nav from "./components/nav";
import LoadCredits from "./components/LoadCredits";
import { Search } from "lucide-react";
import "./styling/BuyerHome.css";

export default function BuyerHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Function to fetch store information
  const fetchStoreInfo = async (storeId) => {
    if (!storeId) return null;
    try {
      const storeRef = doc(db, 'stores', storeId);
      const storeSnap = await getDoc(storeRef);
      return storeSnap.exists() ? storeSnap.data() : null;
    } catch (err) {
      console.error("Error fetching store:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const auth = getAuth();
        const uid = auth.currentUser?.uid;
        console.log('[BuyerHome] fetching products... currentUser:', uid || '(none)');

        // Fetch from all subcollections named "products" (spans every store)
        const groupSnap = await getDocs(collectionGroup(db, "products"));
        console.log('[BuyerHome] collectionGroup products count:', groupSnap.size);
        const groupItems = groupSnap.docs.map((d) => {
          // Derive storeId from doc path if missing in the data
          const data = d.data();
          const parentStoreId = d.ref?.parent?.parent?.id || null; // stores/{storeId}/products/{productId}
          return { id: d.id, ...data, storeId: data.storeId || parentStoreId };
        });
        console.log('[BuyerHome] products total (group):', groupItems.length);

        // Also fetch from top-level products (for newly published items)
        const topSnap = await getDocs(collection(db, 'products'));
        console.log('[BuyerHome] top-level products count:', topSnap.size);
        const topItems = topSnap.docs.map((d) => ({ id: d.id, ...d.data(), storeId: d.data().storeId || null }));

        // Merge with dedupe by productId + storeId key
        const mergedMap = new Map();
        [...groupItems, ...topItems].forEach((p) => {
          const key = `${p.id || p.productId}::${p.storeId || ''}`;
          if (!mergedMap.has(key)) mergedMap.set(key, p);
        });
        const items = Array.from(mergedMap.values());

        // Log raw results before any category/status filtering or enrichment
        console.log('[BuyerHome] merged raw products total:', items.length);
        console.log('[BuyerHome] raw products (first 20 shown):', items.slice(0, 20));
        
        // Fetch store information for each product
        const productsWithStoreInfo = await Promise.all(
          items.map(async (product) => {
            if (product.storeId) {
              const storeInfo = await fetchStoreInfo(product.storeId);
              return {
                ...product,
                storeName: storeInfo?.storeName || 'Unknown Store',
                ownerName: storeInfo?.ownerName || 'Unknown Seller'
              };
            }
            return {
              ...product,
              storeName: 'Unknown Store',
              ownerName: 'Unknown Seller'
            };
          })
        );
        
        setProducts(productsWithStoreInfo);
      } catch (error) {
        console.error("[BuyerHome] Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    // Wait for auth to be established before querying Firestore (rules require request.auth)
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchProducts();
      } else {
        console.warn('[BuyerHome] No authenticated user; skipping product fetch.');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Filter logic
  const filteredProducts = products.filter((product) => {
    const matchSearch = searchQuery
      ? (product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         product.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    const matchCategory = selectedCategory
      ? product.category?.toLowerCase() === selectedCategory.toLowerCase()
      : true;

    let matchPrice = true;
    if (selectedPrice) {
      const price = Number(product.newPrice || product.price);
      if (selectedPrice === "50") matchPrice = price <= 50;
      if (selectedPrice === "100") matchPrice = price > 50 && price <= 100;
      if (selectedPrice === "150") matchPrice = price > 100 && price <= 150;
      if (selectedPrice === "200") matchPrice = price > 150 && price <= 200;
      if (selectedPrice === "250") matchPrice = price > 200 && price <= 250;
      if (selectedPrice === "1000") matchPrice = price > 250 && price <= 1000;
      if (selectedPrice === "5000000") matchPrice = price > 1000 && price <= 5000000;
    }

    const matchColor = selectedColor
      ? product.color?.toLowerCase() === selectedColor.toLowerCase()
      : true;

    return matchSearch && matchCategory && matchPrice && matchColor;
  });

  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handlePriceChange = (e) => setSelectedPrice(e.target.value);
  const handleColorChange = (e) => setSelectedColor(e.target.value);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedPrice("");
    setSelectedColor("");
    setSearchQuery("");
  };

  return (
    <main className="buyer-home-container">
      <header>
        <Nav />
      </header>

      <section className="buyer-home-content">
        <Sidebar
          handleCategoryChange={handleCategoryChange}
          handlePriceChange={handlePriceChange}
          handleColorChange={handleColorChange}
          selectedCategory={selectedCategory}
          selectedPrice={selectedPrice}
          selectedColor={selectedColor}
        />

        <section className="buyer-main-content">
          {/* Load credits widget */}
          <LoadCredits />

          {/* Search & reset */}
          <form
            className="search-container"
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="search-wrapper">
              <Search size={20} className="search-icon" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
                aria-label="Search products"
              />
            </label>
            <button
              type="button"
              onClick={resetFilters}
              className="reset-button"
              aria-label="Reset all filters"
            >
              Reset Filters
            </button>
          </form>

          {/* Product grid */}
          <ul className="buyer-card-container" aria-label="Product List">
            {loading ? (
              <li className="buyer-loading">Loading products...</li>
            ) : filteredProducts.length === 0 ? (
              <li className="buyer-no-products">
                No products found matching your criteria
              </li>
            ) : (
              filteredProducts.map((product) => (
                <li key={product.id} className="product-item">
                  <BuyerHomeCard
                    img={product.imageUrl || "/placeholder.jpg"}
                    title={product.name || "Product"}
                    star={product.star || 0}
                    reviews={product.reviews || 0}
                    prevPrice={`Rs.${product.prevPrice || product.price}`}
                    newPrice={`Rs.${product.newPrice || product.price}`}
                    product={product}
                  />
                </li>
              ))
            )}
          </ul>
        </section>
      </section>
    </main>
  );
}