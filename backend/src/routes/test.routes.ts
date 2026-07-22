import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin!",
    });
  }
);

router.get(
  "/sales",
  authenticate,
  authorize("ADMIN", "SALES"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Sales!",
    });
  }
);

export default router;