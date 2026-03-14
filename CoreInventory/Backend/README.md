# Core Inventory Backend API

Complete REST API for inventory management system built with Express.js and PostgreSQL.

## Setup

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with database credentials:
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=inventorydb
DB_PASSWORD=1234
DB_PORT=5432
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_in_production
```

3. Start the server:
```bash
npm run dev    # Development with nodemon
npm start      # Production
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/:id` - Update product (auth required)
- `DELETE /api/products/:id` - Delete product (auth required)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (auth required)
- `PUT /api/categories/:id` - Update category (auth required)
- `DELETE /api/categories/:id` - Delete category (auth required)

### Stock
- `GET /api/stock` - Get all stock levels
- `GET /api/stock/product/:productId` - Get stock by product
- `GET /api/stock/low-stock` - Get low stock products
- `PUT /api/stock/:productId/:warehouseId` - Update stock level (auth required)

### Warehouses
- `GET /api/warehouses` - Get all warehouses
- `POST /api/warehouses` - Create warehouse (auth required)
- `PUT /api/warehouses/:id` - Update warehouse (auth required)
- `DELETE /api/warehouses/:id` - Delete warehouse (auth required)

### Movements
- `GET /api/movements` - Get all movements
- `GET /api/movements/history` - Get movement history with filters
- `POST /api/movements` - Create movement (auth required)

### Receipts
- `GET /api/receipts` - Get all receipts
- `GET /api/receipts/:id` - Get receipt details
- `POST /api/receipts` - Create receipt (auth required)

### Deliveries
- `GET /api/deliveries` - Get all deliveries
- `GET /api/deliveries/:id` - Get delivery details
- `POST /api/deliveries` - Create delivery (auth required)

### Transfers
- `GET /api/transfers` - Get all transfers
- `POST /api/transfers` - Create transfer (auth required)

### Adjustments
- `GET /api/adjustments` - Get all adjustments
- `POST /api/adjustments` - Create adjustment (auth required)

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create supplier (auth required)
- `PUT /api/suppliers/:id` - Update supplier (auth required)
- `DELETE /api/suppliers/:id` - Delete supplier (auth required)

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer (auth required)
- `PUT /api/customers/:id` - Update customer (auth required)
- `DELETE /api/customers/:id` - Delete customer (auth required)

### Barcodes
- `GET /api/barcodes` - Get all barcodes
- `GET /api/barcodes/value/:barcode_value` - Get barcode by value
- `POST /api/barcodes` - Create barcode (auth required)
- `DELETE /api/barcodes/:id` - Delete barcode (auth required)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (auth required)
- `GET /api/dashboard/stock-summary` - Get stock summary (auth required)
- `GET /api/dashboard/movement-stats` - Get movement statistics (auth required)
- `GET /api/dashboard/warehouse-utilization` - Get warehouse utilization (auth required)

## Request Examples

### Signup
```json
POST /api/auth/signup
{
  "email": "<email>",
  "password": "<password>",
  "name": "<name>",
  "role": "user"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "<email>",
  "password": "<password>"
}
```

### Create Product
```json
POST /api/products
Authorization: Bearer <token>
{
  "name": "Product Name",
  "sku": "SKU123",
  "category_id": 1,
  "unit_price": 99.99,
  "reorder_level": 10
}
```

### Create Receipt
```json
POST /api/receipts
Authorization: Bearer <token>
{
  "supplier_id": 1,
  "warehouse_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 100,
      "unit_price": 50.00
    }
  ],
  "notes": "Initial stock"
}
```

### Create Delivery
```json
POST /api/deliveries
Authorization: Bearer <token>
{
  "customer_id": 1,
  "warehouse_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 10,
      "unit_price": 99.99
    }
  ],
  "notes": "Customer order"
}
```

### Create Transfer
```json
POST /api/transfers
Authorization: Bearer <token>
{
  "product_id": 1,
  "from_warehouse_id": 1,
  "to_warehouse_id": 2,
  "quantity": 50,
  "notes": "Stock rebalancing"
}
```

### Create Adjustment
```json
POST /api/adjustments
Authorization: Bearer <token>
{
  "product_id": 1,
  "warehouse_id": 1,
  "adjustment_type": "increase",
  "quantity": 5,
  "reason": "Inventory correction"
}
```

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

Token is obtained from login/signup response and expires in 24 hours.

## Error Handling

All errors return JSON with error message:
```json
{
  "error": "Error message"
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad request
- 401: Unauthorized
- 404: Not found
- 500: Server error

## Database Schema

The backend uses 16 tables:
- users
- products
- categories
- warehouses
- stock_levels
- movements
- receipts
- receipt_items
- deliveries
- delivery_items
- transfers
- adjustments
- suppliers
- customers
- barcodes
- audit_logs

## Project Structure

```
Backend/
├── controllers/      # Business logic
├── routes/          # API endpoints
├── middleware/      # Auth & error handling
├── utils/           # Helper functions
├── db.js            # Database connection
├── server.js        # Main server file
├── .env             # Environment variables
└── package.json     # Dependencies
```

## Development

- Use `npm run dev` for development with auto-reload
- All endpoints are documented above
- Authentication required for write operations
- Database connection pooling for performance
