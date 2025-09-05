import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateStore from './CreateStore';

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock Firebase auth and firestore
const mockCurrentUser = {
  uid: 'test-uid',
  displayName: 'Test User',
  email: 'test@example.com',
};

jest.mock('./../firebase', () => ({
  auth: {
    currentUser: mockCurrentUser,
  },
  db: {},
}));

// Mock firestore functions
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(() => ({ id: 'mockDocRef' })),
  setDoc: jest.fn(() => Promise.resolve()),
}));

// Mock the sellerNav component
jest.mock('./sellerNav', () => {
  return function MockNavi() {
    return <nav data-testid="mock-seller-nav">Seller Navigation</nav>;
  };
});

describe('CreateStore', () => {
  const originalAlert = window.alert;
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    window.alert = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    window.alert = originalAlert;
    console.error = originalConsoleError;
  });

  // Test 1: Component renders correctly with default values
  test('renders form elements with default values', () => {
    render(<CreateStore />);

    expect(screen.getByTestId('mock-seller-nav')).toBeInTheDocument();
    expect(screen.getByLabelText(/Store name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Store Bio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Payment Method/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save & Continue/i })).toBeInTheDocument();

    // Check default form values
    expect(screen.getByLabelText(/Store name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Store Bio/i)).toHaveValue('');
    expect(screen.getByLabelText(/Payment Method/i)).toHaveValue('card');
  });

  // Test 2: Input field changes update state
  test('input field changes update form state', () => {
    render(<CreateStore />);
    const storeNameInput = screen.getByLabelText(/Store name/i);
    const storeBioTextarea = screen.getByLabelText(/Store Bio/i);

    fireEvent.change(storeNameInput, { target: { name: 'name', value: 'My Test Store' } });
    fireEvent.change(storeBioTextarea, { target: { name: 'bio', value: 'A cool place.' } });

    expect(storeNameInput).toHaveValue('My Test Store');
    expect(storeBioTextarea).toHaveValue('A cool place.');
  });

  // Test 3: Select field changes update state
  test('select field changes update form state', () => {
    render(<CreateStore />);
    const paymentSelect = screen.getByLabelText(/Payment Method/i);

    fireEvent.change(paymentSelect, { target: { name: 'payment', value: 'cash' } });

    expect(paymentSelect).toHaveValue('cash');
  });

  // Test 4: Form submission button is present and clickable
  test('form submission button is present and clickable', () => {
    render(<CreateStore />);
    
    const submitButton = screen.getByRole('button', { name: /Save & Continue/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });
});