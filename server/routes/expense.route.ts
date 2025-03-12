import { Router } from "express";

import { verifyUser } from "../utils/verifyUser";
import { createExpense, deleteExpense, getAllExpenses, getExpenseById, getMonthlyExpenses, updateExpense } from "../controllers/expense.controller";

const router = Router()

router.post("/create", verifyUser, createExpense);

// Get all Expenses
router.get("/all", verifyUser, getAllExpenses);

// Get monthly expenses
router.get("/monthly", verifyUser, getMonthlyExpenses);

// Get a specific Expense by ID
router.get("/:id", verifyUser, getExpenseById);

// Update an Expense by ID
router.put("/update/:id", verifyUser, updateExpense);

// Delete an Expense by ID
router.delete("/delete/:id", verifyUser, deleteExpense);


export default router