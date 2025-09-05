// src/components/AddProduct.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { CircularProgress, IconButton } from '@mui/material';
import { ArrowBack, CloudUpload, Category, AttachMoney, Inventory, CurrencyRupee } from '@mui/icons-material';
import './AddProducts.css'
import { uploadImageToCloudinary } from '../cloudinaryUpload';

const categoryOptions = [
  'Textile', 'Jewelry',
  'Woodwork', 'Textile','Ceramics' , 'Other'
];

export default function AddProduct() {
  const navigate = useNavigate();
  const storeId = localStorage.getItem('storeId');
  const [product, setProduct] = useState({
    imageFile: null, name: '', category: '', price: '', stock: '', previewUrl: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!product.imageFile) newErrors.imageFile = 'Product image is required';
    if (!product.name.trim()) newErrors.name = 'Product name is required';
    if (!product.category.trim()) newErrors.category = 'Category is required';
    // Ensure price and stock are parsed before validation to avoid string issues
    if (parseFloat(product.price) <= 0 || isNaN(parseFloat(product.price))) newErrors.price = 'Valid price is required';
    if (parseInt(product.stock, 10) <= 0 || isNaN(parseInt(product.stock, 10))) newErrors.stock = 'Valid quantity is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct(prev => ({
        ...prev,
        imageFile: file,
        previewUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isUploading) return;
    setIsUploading(true);

    try {
      // Upload image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(product.imageFile);

      // Create the document first
      const docRef = await addDoc(collection(db, 'stores', storeId, 'products'), {
        name: product.name.trim(),
        category: product.category.trim(),
        price: parseFloat(product.price),
        stock: parseInt(product.stock, 10),
        status: 'Active',
        imageUrl, // Cloudinary URL
        storeId: storeId, // Store document owner is the seller, using seller's uid as storeId
        ownerId: auth.currentUser ? auth.currentUser.uid : storeId, // explicit owner reference for rules/queries
        role: 'seller', // optional marker to support role-based queries
        createdAt: new Date()
      });

      // Update the document with its own ID as productId
      await updateDoc(docRef, {
        productId: docRef.id
      });



      navigate('/manage');
    } catch (error) {
      console.error("Error uploading product:", error);
      setErrors({ submit: 'Failed to save product. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
  <section className="container">
    <article className="formCard">
      <header className="formHeader">
        <IconButton onClick={() => navigate('/manage')} className="backButton">
          <ArrowBack />
        </IconButton>
        <h1 className="formTitle">Create New Product</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <section>
          <input
            id="imageUpload" // Keep this ID
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
            data-testid="image-upload-input" // Add a data-testid for easier selection
          />
          <label htmlFor="imageUpload" className="uploadArea">
            {product.previewUrl ? (
              <img src={product.previewUrl} alt="Preview" className="imagePreview" />
            ) : (
              <>
                <CloudUpload className="uploadIcon" />
                <p className="uploadText">Click to upload product image</p>
                <p className="uploadSubtext">Recommended size: 800x800px</p>
              </>
            )}
          </label>
          {errors.imageFile && <p className="errorMessage">{errors.imageFile}</p>}
        </section>

        <section className="formGroup">
          <label htmlFor="productName" className="inputLabel"> {/* Add htmlFor */}
            <Inventory className="inputIcon" />
            Product Name
          </label>
          <input
            id="productName" // Add id
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className={`formInput${errors.name ? ' inputError' : ''}`}
            placeholder="e.g., Handcrafted Ceramic Vase"
          />
          {errors.name && <p className="errorMessage">{errors.name}</p>}
        </section>

        <section className="formGroup">
          <label htmlFor="productCategory" className="inputLabel"> {/* Add htmlFor */}
            <Category className="inputIcon" />
            Category
          </label>
          <select
            id="productCategory" // Add id
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
            className={`formInput${errors.category ? ' inputError' : ''}`}
          >
            <option value="">Select a category</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="errorMessage">{errors.category}</p>}
        </section>

        <section className="priceStockRow">
          <section className="formGroup halfWidth">
            <label htmlFor="productPrice" className="inputLabel"> {/* Add htmlFor */}
              <CurrencyRupee className="inputIcon" />
              Price
            </label>
            <input
              id="productPrice" // Add id
              type="number"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              className={`formInput${errors.price ? ' inputError' : ''}`}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            {errors.price && <p className="errorMessage">{errors.price}</p>}
          </section>

          <section className="formGroup halfWidth">
            <label htmlFor="productStock" className="inputLabel"> {/* Add htmlFor */}
              <Inventory className="inputIcon" />
              Stock Quantity
            </label>
            <input
              id="productStock" // Add id
              type="number"
              value={product.stock}
              onChange={(e) => setProduct({ ...product, stock: e.target.value })}
              className={`formInput${errors.stock ? ' inputError' : ''}`}
              placeholder="0"
              min="0"
            />
            {errors.stock && <p className="errorMessage">{errors.stock}</p>}
          </section>
        </section>

        {errors.submit && <p className="errorMessage">{errors.submit}</p>}

        <button
          type="submit"
          className={`submitButton${isUploading ? ' buttonDisabled' : ''}`}
          disabled={isUploading}
        >
          {isUploading ? (
            <CircularProgress size={24} style={{ color: 'white' }} />
          ) : (
            'Publish Product'
          )}
        </button>
      </form>
    </article>
  </section>
);

}