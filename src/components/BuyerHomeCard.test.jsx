// src/components/__tests__/BuyerHomeCard.test.jsx

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import BuyerHomeCard from './BuyerHomeCard';

// Mock Firebase modules
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('./CartContext', () => ({
  useCart: () => ({
    addToCart: jest.fn()
  })
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, ...props }) => <a {...props}>{children}</a>
}));

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('BuyerHomeCard', () => {
  const mockProduct = {
    id: 'test-product-1',
    storeId: 'test-store-1',
    name: 'Test Product',
    imageUrl: 'https://example.com/image.jpg',
    price: 99.99,
    prevPrice: 149.99,
    storeName: 'Test Store',
    ownerName: 'Test Seller'
  };

  const mockAddToCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mocks
    getAuth.mockReturnValue({
      currentUser: { uid: 'test-user' }
    });
    
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ stock: 10 })
    });
  });

  test('renders product information correctly', async () => {
    render(
      <TestWrapper>
        <BuyerHomeCard product={mockProduct} />
      </TestWrapper>
    );

    // Check product name
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    
    // Check seller name
    expect(screen.getByText('Sold by: Test Store')).toBeInTheDocument();
    
    // Check image
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Product');
    
    // Check prices
    expect(screen.getByText('R149.99')).toBeInTheDocument(); // prevPrice
    expect(screen.getByText('R99.99')).toBeInTheDocument(); // price
    
    // Wait for stock to load
    await waitFor(() => {
      expect(screen.getByText('In stock: 10')).toBeInTheDocument();
    });
  });

  test('displays seller name with fallback', () => {
    const productWithoutStoreName = {
      ...mockProduct,
      storeName: undefined,
      ownerName: 'Fallback Seller'
    };

    render(
      <TestWrapper>
        <BuyerHomeCard product={productWithoutStoreName} />
      </TestWrapper>
    );

    expect(screen.getByText('Sold by: Fallback Seller')).toBeInTheDocument();
  });

  test('displays unknown seller when no seller info available', () => {
    const productWithoutSellerInfo = {
      ...mockProduct,
      storeName: undefined,
      ownerName: undefined
    };

    render(
      <TestWrapper>
        <BuyerHomeCard product={productWithoutSellerInfo} />
      </TestWrapper>
    );

    expect(screen.getByText('Sold by: Unknown Seller')).toBeInTheDocument();
  });

  test('seller name is clickable and navigates to seller profile', () => {
    render(
      <TestWrapper>
        <BuyerHomeCard product={mockProduct} />
      </TestWrapper>
    );

    const sellerName = screen.getByText('Sold by: Test Store');
    expect(sellerName).toHaveClass('clickable');
    
    fireEvent.click(sellerName);
    expect(mockNavigate).toHaveBeenCalledWith('/seller/test-store-1');
  });

  test('seller name has hover title', () => {
    render(
      <TestWrapper>
        <BuyerHomeCard product={mockProduct} />
      </TestWrapper>
    );

    const sellerName = screen.getByText('Sold by: Test Store');
    expect(sellerName).toHaveAttribute('title', 'Click to view seller profile');
  });

  test('does not navigate when storeId is missing', () => {
    const productWithoutStoreId = {
      ...mockProduct,
      storeId: undefined
    };

    render(
      <TestWrapper>
        <BuyerHomeCard product={productWithoutStoreId} />
      </TestWrapper>
    );

    const sellerName = screen.getByText('Sold by: Test Store');
    fireEvent.click(sellerName);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('shows out of stock when stock is 0', async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ stock: 0 })
    });

    render(
      <TestWrapper>
        <BuyerHomeCard product={mockProduct} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Out of stock')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addButton).toBeDisabled();
  });

  test('add to cart button is enabled when stock is available', async () => {
    render(
      <TestWrapper>
        <BuyerHomeCard product={mockProduct} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('In stock: 10')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addButton).not.toBeDisabled();
  });
});