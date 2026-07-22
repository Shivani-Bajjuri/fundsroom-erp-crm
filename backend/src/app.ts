import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import testRoutes from "./routes/test.routes";
import customerRoutes from "./routes/customer.routes";
import productRoutes from "./routes/product.routes";
import challanRoutes from "./routes/challan.routes";
import { errorHandler, notFound } from "./middleware/error.middleware";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Mini ERP CRM API is running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/challans", challanRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;