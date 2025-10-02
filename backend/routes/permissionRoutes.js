import express from "express";
import { protect } from "../midddleware/authMiddleware.js";
import {
  grantPermission,
  revokePermission,
  getPermissions
} from "../controllers/permissionController.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Grant permission
router.post("/grant", grantPermission);

// Revoke permission
router.delete("/:resourceType/:resourceId/revoke/:userId", revokePermission);

// Get permissions for a resource
router.get("/:resourceType/:resourceId", getPermissions);

export default router;
