# REST API Documentation

Base URL: `http://localhost:5000/api` (Development)  
Production URL: `https://fundsroom-oxsc.onrender.com/api`

---

## 🔑 Authentication

All protected endpoints require a Bearer token in the HTTP Authorization header:
```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 1. Auth Endpoints (`/api/auth`)

### Register / Signup
- **`POST /api/auth/signup`**
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "SALES"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "User created successfully",
    "token": "<JWT_TOKEN>",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "SALES"
    }
  }
  ```

### Login
- **`POST /api/auth/login`**
- **Request Body:**
  ```json
  {
    "email": "admin@fundsroom.com",
    "password": "password123"
  }
  ```

---

## 2. Customer Management (`/api/customers`)

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/customers` | `ADMIN`, `SALES` | Get paginated list of customers (supports `?page=1&limit=10&search=xyz`) |
| `GET` | `/api/customers/:id` | `ADMIN`, `SALES` | Get single customer details by ID |
| `POST` | `/api/customers` | `ADMIN`, `SALES` | Create a new customer lead or account |
| `PUT` | `/api/customers/:id` | `ADMIN`, `SALES` | Update customer info |
| `DELETE` | `/api/customers/:id` | `ADMIN` | Delete customer record |
| `POST` | `/api/customers/:id/notes` | `ADMIN`, `SALES` | Append follow-up note to customer profile |

---

## 3. Product & Inventory (`/api/products`)

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | All Roles | Fetch product list with current stock levels |
| `GET` | `/api/products/low-stock` | `ADMIN`, `WAREHOUSE` | Fetch products where stock <= minStock |
| `GET` | `/api/products/:id` | All Roles | Fetch product details by ID |
| `POST` | `/api/products` | `ADMIN`, `WAREHOUSE` | Add new product SKU to inventory |
| `PUT` | `/api/products/:id` | `ADMIN`, `WAREHOUSE` | Update product details |
| `DELETE` | `/api/products/:id` | `ADMIN`, `WAREHOUSE` | Remove product record |
| `POST` | `/api/products/:id/stock` | `ADMIN`, `WAREHOUSE` | Adjust product stock (Log IN/OUT movement) |

---

## 4. Sales Challans (`/api/challans`)

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/challans` | `ADMIN`, `SALES`, `ACCOUNTS` | Fetch all sales challans |
| `GET` | `/api/challans/:id` | `ADMIN`, `SALES`, `ACCOUNTS` | Fetch challan details with line items |
| `POST` | `/api/challans` | `ADMIN`, `SALES` | Create a new Sales Challan |
| `PUT` | `/api/challans/:id/status` | `ADMIN`, `SALES` | Update challan status (`DRAFT`, `CONFIRMED`, `CANCELLED`) |
