import { Router } from "express";
import {
	addChallan,
	changeChallanStatus,
	fetchChallanById,
	fetchChallans,
} from "../controllers/challan.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.post("/", authenticate, authorize("ADMIN", "SALES"), addChallan);

router.get(
	"/",
	authenticate,
	authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
	fetchChallans
);

router.get(
	"/:id",
	authenticate,
	authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
	fetchChallanById
);

router.patch(
	"/:id/status",
	authenticate,
	authorize("ADMIN", "SALES"),
	changeChallanStatus
);

export default router;
