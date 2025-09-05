import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { CartProvider } from './components/CartContext';
import SellerProfile from './SellerProfile';

// Mock Firebase modules
jest.mock('firebase/firestore');

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ storeId: 'test-store-1' })
}));

// Test wrapper component
const TestWrapper = ({ children }) => (
  <CartProvider>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </CartProvider>
);

describe('SellerProfile', () => {
  const mockStoreInfo = {
    storeName: 'Test Store',
    ownerName: 'Test Owner',
    storeBio: 'This is a test store description'
  };

  const mockProducts = [
    {
      id: 'product-1',
      name: 'Test Product 1',
      price: 99.99,
      imageUrl: 'https://example.com/image1.jpg',
      storeId: 'test-store-1'
    },
    {
      id: 'product-2',
      name: 'Test Product 2',
      price: 149.99,
      imageUrl: 'https://example.com/image2.jpg',
      storeId: 'test-store-1'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => mockStoreInfo
    });

    getDocs.mockResolvedValue({
      docs: mockProducts.map(product => ({
        id: product.id,
        data: () => product
      }))
    });

    render(
      <TestWrapper>
        <SellerProfile />
      </TestWrapper>
    );

    expect(screen.getByText('Loading seller profile...')).toBeInTheDocument();
  });

  test('renders store information and products when data loads', async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => mockStoreInfo
    });

    getDocs.mockResolvedValue({
      docs: mockProducts.map(product => ({
        id: product.id,
        data: () => product
      }))
    });

    render(
      <TestWrapper>
        <SellerProfile />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Store')).toBeInTheDocument();
    });

    expect(screen.getByText('by Test Owner')).toBeInTheDocument();
    expect(screen.getByText('This is a test store description')).toBeInTheDocument();
    expect(screen.getByText('Products (2)')).toBeInTheDocument();
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
  });

  test('renders error state when store not found', async () => {
    getDoc.mockResolvedValue({
      exists: () => false,
      data: () => null
    });

    render(
      <TestWrapper>
        <SellerProfile />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Store not found')).toBeInTheDocument();
    });
  });

  test('renders no products message when store has no products', async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => mockStoreInfo
    });

    getDocs.mockResolvedValue({
      docs: []
    });

    render(
      <TestWrapper>
        <SellerProfile />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Products (0)')).toBeInTheDocument();
      expect(screen.getByText("This seller hasn't added any products yet.")).toBeInTheDocument();
    });
  });

  test('back button navigates to previous page', async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => mockStoreInfo
    });

    getDocs.mockResolvedValue({
      docs: []
    });

    render(
      <TestWrapper>
        <SellerProfile />
      </TestWrapper>
    );

    await waitFor(() => {
      const backButton = screen.getByText('Back');
      fireEvent.click(backButton);
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  test('handles missing store information gracefully', async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        // Missing storeName and ownerName
        storeBio: 'Test description'
      })
    });

    getDocs.mockResolvedValue({
      docs: []
    });

    render(
      <TestWrapper>
        <SellerProfile />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Unknown Store')).toBeInTheDocument();
      expect(screen.getByText('by Unknown Owner')).toBeInTheDocument();
    });
  });
});
