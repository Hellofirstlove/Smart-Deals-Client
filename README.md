# HELLO FIRST LOVE

<div align="center">

# 🛒 SMART DEALS

### A Local Online Marketplace for Buying & Selling with Bids

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28?logo=firebase)

> *Post. Bid. Sell. — Where every deal feels like home.*

</div>

---

## 📖 Overview

**SMART DEALS** is a community-driven online marketplace where users can:

- 📦 **Post items for sale** (Products)
- 💰 **Place bids on items** (Bids)
- 🤝 **Negotiate prices** through a bidding system
- ✅ **Mark items as sold** or keep them pending

> Think of it as your neighborhood OLX or Craigslist — but with a built-in bidding system.

---

## 🧰 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React + Vite / HTML + CSS + JS      |
| Backend    | Node.js + Express                   |
| Database   | MongoDB (NoSQL)                     |
| Auth       | Firebase Authentication             |
| API Style  | RESTful                             |

---

## 🗄️ Database Collections

### 1. Products Collection *(Item Listings)*

| Field            | Type           | Description                        |
|------------------|----------------|------------------------------------|
| `_id`            | ObjectId       | Auto-generated ID                  |
| `title`          | String         | Item name                          |
| `price_min`      | Number         | Minimum acceptable price           |
| `price_max`      | Number         | Maximum asking price               |
| `email`          | String         | Seller's email                     |
| `category`       | String         | e.g., Electronics, Furniture       |
| `created_at`     | ISODate        | Timestamp of posting               |
| `image`          | String (URL)   | Item photo                         |
| `status`         | String         | `pending` / `sold`                 |
| `location`       | String         | City or area                       |
| `seller_image`   | String (URL)   | Seller profile picture             |
| `seller_name`    | String         | Seller's full name                 |
| `condition`      | String         | `fresh` / `used`                   |
| `usage`          | String         | e.g., "6 months old"               |
| `description`    | String         | Full item details                  |
| `seller_contact` | String         | Phone or contact info              |

---

### 2. Bids Collection *(Buyer Offers)*

| Field           | Type         | Description                    |
|-----------------|--------------|--------------------------------|
| `_id`           | ObjectId     | Unique bid ID                  |
| `product`       | ObjectId     | Reference to `Products._id`    |
| `buyer_image`   | String (URL) | Buyer's profile picture        |
| `buyer_name`    | String       | Buyer's name                   |
| `buyer_contact` | String       | Buyer's phone                  |
| `buyer_email`   | String       | Buyer's email                  |
| `bid_price`     | Number       | Offer amount                   |
| `status`        | String       | `pending` / `confirmed`        |

---

## 🔌 API Endpoints

### Products

| Method   | Endpoint                           | Description                        |
|----------|------------------------------------|------------------------------------|
| `GET`    | `/products?email=user@example.com` | Get all ads (or filter by seller)  |
| `GET`    | `/products/:id`                    | Get single ad                      |
| `POST`   | `/products`                        | Create new ad                      |
| `PUT`    | `/products/:id`                    | Update ad                          |
| `DELETE` | `/products/:id`                    | Delete ad                          |
| `PATCH`  | `/products/status/:text`           | Change status: `sold` or `pending` |

### Bids

| Method   | Endpoint             | Description                     |
|----------|----------------------|---------------------------------|
| `GET`    | `/bids/:email`       | Get all bids placed by a user   |
| `POST`   | `/bids`              | Place a new bid                 |
| `DELETE` | `/bids/:id`          | Delete a single bid             |
| `DELETE` | `/bids/product/:id`  | Delete all bids for a product   |
| `PATCH`  | `/bids/status/:id`   | Update bid status (`confirmed`) |

---

## 🖥️ Frontend Pages

| Page               | Purpose                              |
|--------------------|--------------------------------------|
| `Home`             | Show all active ads                  |
| `Register`         | User signup                          |
| `Login`            | User login                           |
| `All-Products`     | Browse all listings                  |
| `My-Products`      | View & manage your posted items      |
| `My Bids`          | View bids you have placed            |
| `Product Details`  | View item details + place a bid      |
| `Post Products`    | Create a new listing                 |
| `Update Products`  | Edit your existing ad                |
| `Error Page`       | 404 / error handling                 |

---

## 🔄 User Flow Example

```
1. Seller posts: "iPhone 13 – Used – $500–$550"
   → POST /products

2. Buyer 1 bids $510
   → POST /bids

3. Buyer 2 bids $530
   → POST /bids

4. Seller accepts Buyer 2
   → PATCH /bids/status/{bidId}      → status: "confirmed"
   → PATCH /products/status/sold     → status: "sold"

5. System cleans up remaining bids
   → DELETE /bids/product/{productId}
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- Firebase project

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/smart-deals-client.git
cd smart-deals-client

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your Firebase credentials in .env

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:3000
```

---

## 📄 License

**MIT © SMART DEALS**

---

<div align="center">

*Start dealing locally.*
**Post. Bid. Sell.**

Built for the community, by the community.

**SMART DEALS – Where every deal feels like home.** 🏡

</div>
