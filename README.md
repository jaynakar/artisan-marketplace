## 🛍️ Casa di Arté

[![codecov](https://codecov.io/gh/TakudzwaT/artisanMarketPlace/graph/badge.svg?token=UKP63ICR92)](https://codecov.io/gh/TakudzwaT/artisanMarketPlace)

🔗 **Live Demo:** [Click here](https://lemon-desert-03c525f10.6.azurestaticapps.net)

---

Welcome to **Casa di Arté**, a sleek and fast frontend application built with **React** and **Vite**. Browse and shop for unique handmade goods crafted by local artisans.

---

## 🚀 Features

* 🖼️ Browse products by category
* 🔍 Search and filter items
* 🛒 Add to cart and checkout
* 🔐 User authentication (Firebase)
* 👤 Admin profile management
* 📦 Order tracking

## 🆕 Recent Updates

* 🏪 Seller storefront pages at `/seller/:storeId` with seller info and products
* 🧰 Seller tools: create store, manage store, and add products
* 🛡️ Admin Dashboard to manage users and products (search, disable/delete)
* 🧭 Buyer Home filters by category, price, color; search and reset controls
* 💳 Payment flow with dedicated Payment and Payment Success pages
* 💰 Credits widget on Buyer Home to load and track credits
* 🖼️ Cloudinary image upload utility for product images
* 🔒 Optional Firebase App Check (reCAPTCHA v3) via `VITE_RECAPTCHA_KEY`
* 🧪 Dev helper: `window.runBackfill()` to backfill products in development
* ✨ Animated landing page with scroll-in effects

---

## 📦 Tech Stack

* **React** (with Hooks)
* **Vite** (lightning-fast bundler)
* **React Router**
* **Tailwind CSS**
* **Firebase** (Auth & Firestore)

---

## 🛠️ Getting Started

### Prerequisites

Ensure the following are installed on your machine:

* [Node.js](https://nodejs.org/) v16 or newer
* npm (comes with Node) or [Yarn](https://classic.yarnpkg.com/en/docs/install)

### Installation

```bash
# Clone the repository
git clone https://github.com/TakudzwaT/artisanMarketPlace.git
cd artisanMarketPlace

# Install dependencies
npm install
# or
yarn install
```

### Run the App Locally

```bash
npm run dev
# or
yarn dev
```

Then open your browser and go to: `http://localhost:5173`

### Run Tests

```bash
npm test
# or
yarn test
```

---

## 📬 Contact

If you have questions or run into issues, feel free to reach out. We're happy to help! 😊

* **GitHub Repository:** [artisanMarketPlace](https://github.com/TakudzwaT/artisanMarketPlace)
