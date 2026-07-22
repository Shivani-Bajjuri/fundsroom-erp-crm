# Features & Role-Based Access Control (RBAC)

**Fundsroom ERP CRM** implements a comprehensive Role-Based Access Control matrix to ensure operational isolation and security.

---

## 🔒 Role Permission Matrix

| Feature / Module | Admin | Sales | Warehouse | Accounts |
| :--- | :---: | :---: | :---: | :---: |
| **System Dashboard** | Full System Overview | Sales Metrics & Leads | Stock & Movement Stats | Financial Metrics |
| **User Management** | ✅ Create / Edit / Delete | ❌ | ❌ | ❌ |
| **Customer Management** | ✅ Full Access | ✅ Create / Edit Leads | ❌ | 👁️ View Only |
| **Product Management** | ✅ Full Access | 👁️ View Catalog | ✅ Manage SKUs & Stock | 👁️ View Catalog |
| **Stock IN/OUT Logging** | ✅ Full Access | ❌ | ✅ Log Movement | ❌ |
| **Sales Challans** | ✅ Full Access | ✅ Create / Manage | 👁️ View & Dispatch | 👁️ View Reports |
| **Reports & Analytics** | ✅ All Reports | 📈 Sales Reports | 📦 Inventory Reports | 💰 Financial Reports |
| **System Settings** | ✅ Config & Audit | ❌ | ❌ | ❌ |

---

## 💡 Detailed Feature Breakdown

### 1. 🔑 Authentication & RBAC System
- **Secure JWT Auth:** Token-based session management stored securely in browser `localStorage`.
- **Role Routing Guard:** Automatic path protection (`/admin/*`, `/sales/*`, `/warehouse/*`, `/accounts/*`).
- **Fallback / Mock Engine:** Graceful degradation allowing offline development and testing.

### 2. 👥 Customer Relationship Management (CRM)
- Customer lead tracking (Retail, Wholesale, Distributor types).
- Follow-up date scheduling and notes history.
- Real-time customer search and status toggling (Lead, Active, Inactive).

### 3. 📦 Product & Inventory Management
- Stock SKU tracking with minimum stock threshold alerts.
- Stock movement logs (Movement type `IN` vs `OUT` with audit reasons).
- Automatic stock update upon Sales Challan confirmation.

### 4. 📄 Sales Challan Generation
- Multi-item sales challan generation with calculated totals.
- Status workflow (`DRAFT` $\rightarrow$ `CONFIRMED` $\rightarrow$ `CANCELLED`).
- Auto-deduction of product inventory when challan status becomes `CONFIRMED`.

### 5. 📊 Analytics & Reporting
- Sales overview charts and revenue metrics.
- Stock reorder recommendations.
- Customer conversion rate tracking.
