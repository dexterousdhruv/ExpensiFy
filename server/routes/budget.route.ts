import { Router } from "express";
import { verifyUser } from "../utils/verifyUser";
import { createBudget, deleteBudget, getAllBudgets, getBudgetById, updateBudget } from "../controllers/budget.controller";

const router = Router()

router.post("/create", verifyUser, createBudget);

// Get all Budgets
router.get("/all", verifyUser, getAllBudgets);

// Get a specific Budget by ID
router.get("/:id", verifyUser, getBudgetById);

// Update a Budget by ID
router.put("/update/:id", verifyUser, updateBudget);

// Delete a Budget by ID
router.delete("/delete/:id", verifyUser, deleteBudget);

export default router