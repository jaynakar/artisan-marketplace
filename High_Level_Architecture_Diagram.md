# High-Level Architecture Diagram - Artisan Marketplace

```mermaid
graph TB
    subgraph "Frontend (React)"
        UI[User Interface Components]
        Auth[Authentication Components]
        Cart[Cart Management]
        Admin[Admin Dashboard]
        Seller[Seller Dashboard]
        Buyer[Buyer Interface]
    end
    
    subgraph "Backend Services"
        Firebase[Firebase Services]
        Cloudinary[Cloudinary Image Service]
    end
    
    subgraph "Firebase Services"
        AuthService[Authentication]
        Firestore[Firestore Database]
        Storage[Cloud Storage]
    end
    
    subgraph "External APIs"
        GoogleOAuth[Google OAuth]
        PaymentAPI[Payment Processing]
    end
    
    subgraph "Data Storage"
        Users[(Users Collection)]
        Stores[(Stores Collection)]
        Products[(Products Collection)]
        Orders[(Orders Collection)]
        CartItems[(Cart Items)]
    end
    
    UI --> Auth
    UI --> Cart
    UI --> Admin
    UI --> Seller
    UI --> Buyer
    
    Auth --> Firebase
    Cart --> Firebase
    Admin --> Firebase
    Seller --> Firebase
    Buyer --> Firebase
    
    Firebase --> AuthService
    Firebase --> Firestore
    Firebase --> Storage
    
    AuthService --> GoogleOAuth
    
    Firestore --> Users
    Firestore --> Stores
    Firestore --> Products
    Firestore --> Orders
    Firestore --> CartItems
    
    Seller --> Cloudinary
    Buyer --> Cloudinary
    
    style UI fill:#e1f5fe
    style Firebase fill:#ffeb3b
    style Cloudinary fill:#4caf50
    style GoogleOAuth fill:#2196f3
    style Users fill:#ff9800
    style Stores fill:#ff9800
    style Products fill:#ff9800
    style Orders fill:#ff9800
    style CartItems fill:#ff9800
```

## Architecture Components Description:

### **Frontend Layer:**
- **User Interface Components**: Reusable UI elements (cards, forms, navigation)
- **Authentication Components**: Login, signup, role-based access control
- **Cart Management**: Shopping cart state and operations
- **Admin Dashboard**: User management, system oversight
- **Seller Dashboard**: Store management, inventory, sales analytics
- **Buyer Interface**: Product browsing, purchasing, order tracking

### **Backend Services:**
- **Firebase Services**: Authentication, database, storage, hosting
- **Cloudinary**: Image upload, storage, and CDN delivery

### **Data Layer:**
- **Users Collection**: User profiles, roles, credits
- **Stores Collection**: Store information, settings, metadata
- **Products Collection**: Product catalog with store relationships
- **Orders Collection**: Transaction records and order tracking
- **Cart Items**: User shopping cart data

### **External Integrations:**
- **Google OAuth**: User authentication and identity management
- **Payment Processing**: Credit-based transaction system

