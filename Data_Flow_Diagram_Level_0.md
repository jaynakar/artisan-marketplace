# Data Flow Diagram (DFD) - Level 0 - Artisan Marketplace

```mermaid
graph LR
    subgraph "External Entities"
        Buyer[Buyer Users]
        Seller[Seller Users]
        Admin[Admin Users]
        Cloudinary[Cloudinary API]
        Google[Google OAuth]
    end
    
    subgraph "System Boundary"
        ArtisanMarketplace[Artisan Marketplace System]
    end
    
    subgraph "Data Stores"
        Firebase[(Firebase Database)]
        ImageStorage[(Image Storage)]
    end
    
    Buyer -->|Browse Products, Place Orders, Manage Cart| ArtisanMarketplace
    Seller -->|Create Store, Add Products, Manage Inventory| ArtisanMarketplace
    Admin -->|User Management, System Oversight| ArtisanMarketplace
    Cloudinary -->|Image Upload/Storage| ArtisanMarketplace
    Google -->|User Authentication| ArtisanMarketplace
    
    ArtisanMarketplace -->|User Data, Orders, Store Info| Firebase
    ArtisanMarketplace -->|Product Images| ImageStorage
    
    ArtisanMarketplace -->|Order Confirmations, Product Listings| Buyer
    ArtisanMarketplace -->|Sales Reports, Order Notifications| Seller
    ArtisanMarketplace -->|System Analytics, User Reports| Admin
    
    style ArtisanMarketplace fill:#ffeb3b
    style Firebase fill:#ff9800
    style ImageStorage fill:#4caf50
    style Buyer fill:#e3f2fd
    style Seller fill:#e8f5e8
    style Admin fill:#fff3e0
    style Cloudinary fill:#f3e5f5
    style Google fill:#e8eaf6
```

## Level 0 DFD Description:

### **External Entities:**
- **Buyer Users**: End consumers who browse products, manage shopping carts, and place orders
- **Seller Users**: Store owners who create stores, add products, and manage inventory
- **Admin Users**: System administrators who oversee user management and system operations
- **Cloudinary API**: External image hosting and CDN service
- **Google OAuth**: External authentication service provider

### **System Process:**
- **Artisan Marketplace System**: The main application that processes all business logic, manages data, and coordinates between different user roles

### **Data Stores:**
- **Firebase Database**: Primary data storage for users, stores, products, orders, and cart information
- **Image Storage**: Cloudinary-based storage for product images and media files

### **Data Flows:**
- **Input Flows**: User actions, authentication requests, image uploads
- **Output Flows**: Product listings, order confirmations, sales reports, system analytics
- **Storage Flows**: Data persistence and retrieval operations

