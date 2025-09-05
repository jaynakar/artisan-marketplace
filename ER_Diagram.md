# Entity-Relationship (ER) Diagram - Artisan Marketplace

```mermaid
erDiagram
    USERS {
        string uid PK
        string email
        string displayName
        string photoURL
        boolean buyer
        boolean seller
        boolean admin
        number credits
        timestamp createdAt
        timestamp lastLogin
    }
    
    STORES {
        string uid PK, FK
        string storeName
        string storeBio
        string category
        string paymentMethod
        array deliveryOptions
        timestamp createdAt
        boolean isActive
        string ownerName
        string ownerEmail
    }
    
    PRODUCTS {
        string productId PK
        string storeId FK
        string name
        string category
        number price
        number stock
        string status
        string imageUrl
        string description
        timestamp createdAt
        timestamp updatedAt
    }
    
    ORDERS {
        string orderId PK
        string userId FK
        array items
        number totalAmount
        string status
        timestamp orderDate
        timestamp deliveryDate
        string deliveryAddress
        string paymentMethod
    }
    
    CART_ITEMS {
        string cartItemId PK
        string userId FK
        string productId FK
        string storeId FK
        string name
        number price
        number qty
        string imageUrl
        timestamp addedAt
    }
    
    ORDER_ITEMS {
        string orderItemId PK
        string orderId FK
        string productId FK
        string storeId FK
        string name
        number price
        number qty
        number totalPrice
        string imageUrl
    }
    
    STORE_CATEGORIES {
        string categoryId PK
        string categoryName
        string description
        boolean isActive
    }
    
    PRODUCT_CATEGORIES {
        string categoryId PK
        string categoryName
        string description
        boolean isActive
    }
    
    USER_ROLES {
        string roleId PK
        string roleName
        string description
        array permissions
    }
    
    PAYMENT_TRANSACTIONS {
        string transactionId PK
        string orderId FK
        string userId FK
        number amount
        string paymentMethod
        string status
        timestamp transactionDate
    }

    %% Relationships
    USERS ||--o{ STORES : "owns"
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ CART_ITEMS : "has"
    USERS ||--o{ PAYMENT_TRANSACTIONS : "makes"
    
    STORES ||--o{ PRODUCTS : "sells"
    STORES ||--o{ ORDER_ITEMS : "fulfills"
    STORES ||--o{ CART_ITEMS : "in_cart"
    
    PRODUCTS ||--o{ ORDER_ITEMS : "ordered_as"
    PRODUCTS ||--o{ CART_ITEMS : "added_to_cart"
    
    ORDERS ||--o{ ORDER_ITEMS : "contains"
    ORDERS ||--o{ PAYMENT_TRANSACTIONS : "has_payment"
    
    STORE_CATEGORIES ||--o{ STORES : "categorizes"
    PRODUCT_CATEGORIES ||--o{ PRODUCTS : "categorizes"
    USER_ROLES ||--o{ USERS : "defines"
```

## Entity-Relationship Diagram Description:

### **Core Entities:**

#### **1. USERS Entity:**
- **Primary Key**: `uid` (Firebase Auth UID)
- **Attributes**: Basic user information, role flags, credit balance
- **Relationships**: One-to-many with stores, orders, cart items, and payments

#### **2. STORES Entity:**
- **Primary Key**: `uid` (references USERS.uid)
- **Attributes**: Store information, payment methods, delivery options
- **Relationships**: One-to-many with products, order items, and cart items

#### **3. PRODUCTS Entity:**
- **Primary Key**: `productId` (auto-generated)
- **Attributes**: Product details, pricing, inventory, status
- **Relationships**: Many-to-one with stores, one-to-many with order/cart items

#### **4. ORDERS Entity:**
- **Primary Key**: `orderId` (auto-generated)
- **Attributes**: Order summary, status, dates, delivery information
- **Relationships**: Many-to-one with users, one-to-many with order items and payments

#### **5. CART_ITEMS Entity:**
- **Primary Key**: `cartItemId` (auto-generated)
- **Attributes**: Cart item details, quantities, pricing
- **Relationships**: Many-to-one with users, products, and stores

#### **6. ORDER_ITEMS Entity:**
- **Primary Key**: `orderItemId` (auto-generated)
- **Attributes**: Individual item details within orders
- **Relationships**: Many-to-one with orders, products, and stores

### **Supporting Entities:**

#### **7. STORE_CATEGORIES & PRODUCT_CATEGORIES:**
- **Purpose**: Categorization and classification
- **Relationships**: One-to-many with stores and products respectively

#### **8. USER_ROLES:**
- **Purpose**: Role-based access control
- **Relationships**: One-to-many with users

#### **9. PAYMENT_TRANSACTIONS:**
- **Purpose**: Payment tracking and history
- **Relationships**: Many-to-one with orders and users

### **Key Relationships:**

- **User-Store**: One user can own one store (1:1)
- **Store-Products**: One store can have many products (1:N)
- **User-Orders**: One user can place many orders (1:N)
- **Order-Items**: One order can contain many items (1:N)
- **Product-Cart**: One product can be in many carts (1:N)

### **Database Design Principles:**

- **Normalization**: Proper separation of concerns
- **Referential Integrity**: Foreign key relationships maintained
- **Scalability**: Efficient querying and indexing
- **Flexibility**: Support for future feature additions

