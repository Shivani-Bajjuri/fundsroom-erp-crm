# System Architecture & Database Design

This document details the architectural principles, data flow, component design, and database schema for **Fundsroom ERP CRM**.

---

## 🏛️ High-Level Architecture

The system follows a classic **3-Tier Architecture**:

```mermaid
graph TD
    Client["Frontend SPA (React + Vite + TailwindCSS)"]
    API["Backend API Server (Express + TypeScript)"]
    Auth["JWT Authentication & Role Middleware"]
    ORM["Prisma ORM Client"]
    DB[("PostgreSQL Database (Neon DB Cloud)")]

    Client -->|HTTP / REST (Axios)| API
    API --> Auth
    Auth --> ORM
    ORM -->|TCP Connection Pool| DB
```

---

## 📊 Database Schema (Prisma / PostgreSQL)

### Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o{ InventoryLog : "creates"
    User ||--o{ SalesChallan : "creates"
    Customer ||--o{ SalesChallan : "belongs to"
    Product ||--o{ InventoryLog : "logs movement"
    Product ||--o{ SalesChallanItem : "included in"
    SalesChallan ||--|{ SalesChallanItem : "contains"

    User {
        Int id PK
        String name
        String email UK
        String password
        Role role
        Boolean isActive
        DateTime createdAt
        DateTime updatedAt
    }

    Customer {
        Int id PK
        String name
        String mobile
        String email UK
        String businessName
        String gst
        CustomerType type
        String address
        CustomerStatus status
        DateTime followUpDate
        String notes
        DateTime createdAt
        DateTime updatedAt
    }

    Product {
        Int id PK
        String name
        String sku UK
        String category
        Float unitPrice
        Int stock
        Int minStock
        String location
        DateTime createdAt
        DateTime updatedAt
    }

    InventoryLog {
        Int id PK
        Int productId FK
        Int quantity
        MovementType movement
        String reason
        Int createdBy FK
        DateTime createdAt
    }

    SalesChallan {
        Int id PK
        String challanNumber UK
        Int customerId FK
        ChallanStatus status
        Int totalQuantity
        Int createdBy FK
        DateTime createdAt
    }

    SalesChallanItem {
        Int id PK
        Int challanId FK
        Int productId FK
        String productName
        Float unitPrice
        Int quantity
    }
```

---

## 🔐 Key Data Models & Enums

### Enums
- **`Role`**: `ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`
- **`CustomerType`**: `RETAIL`, `WHOLESALE`, `DISTRIBUTOR`
- **`CustomerStatus`**: `LEAD`, `ACTIVE`, `INACTIVE`
- **`ChallanStatus`**: `DRAFT`, `CONFIRMED`, `CANCELLED`
- **`MovementType`**: `IN`, `OUT`

---

## ⚙️ Core Business Workflows

### 1. Inventory & Stock Movement Workflow
1. When stock is received or dispatched, an `InventoryLog` entry is created (`IN` or `OUT`).
2. Atomically, `Product.stock` is updated in a transaction or service routine.
3. If `Product.stock <= Product.minStock`, low-stock alerts are triggered in the Warehouse dashboard.

### 2. Sales Challan Workflow
1. Sales representative creates a `SalesChallan` with line items (`SalesChallanItem`).
2. Initial status is `DRAFT`.
3. Upon confirmation (`CONFIRMED`), stock is automatically deducted from `Product.stock` and an `OUT` `InventoryLog` is recorded.
