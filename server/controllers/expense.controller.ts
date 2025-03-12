import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../utils/error";
import { prismaDb } from "../connect/db";
import { getMonthlyReport, getYearlyReport } from "../utils/helpers";
const moment = require("moment");
const subCurrency = (amt: number | string) => Number(amt) * 100;

export const createExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    userId,
    body: { expenseName, amount, budgetCategory, budgetId },
  } = req as any;

  if (!expenseName || !amount || !budgetCategory || !budgetId) {
    return next(errorHandler(400, "All fields are required!"));
  }

  try {
    const [newExpense, updateAmountInBudget] = await Promise.all([
      prismaDb.expense.create({
        data: {
          expenseName,
          amount: subCurrency(amount),
          budgetCategory,
          budgetId,
          userId,
          timestamp: moment().unix(),
        },
      }),
      prismaDb.budget.update({
        where: { id: budgetId },
        data: {
          amountSpent: { increment: subCurrency(amount) },
        },
      }),
    ]);

    res.status(201).json({
      // message: 'Expense created and budget updated successfully',
      message: "success",
      expense: newExpense,
      updatedBudget: updateAmountInBudget,
    });
  } catch (e) {
    console.log("Error in create expense controller", e);
    return next(errorHandler(500, "Server error, Please try again later!"));
  }
};

export const getAllExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req as any;
  let {
    amount = null,
    date = "",
    category = "",
    page = 1,
    limit = 10,
    sort = "asc",
  } = req.query;
  // console.log(subCurrency(amount as string))

  try {
    const filters: any = { userId };
    if (amount) filters.amount = subCurrency(amount as string);
    if (category) filters.budgetCategory = category;
    if (date) {
      const selectedDate = moment(date as string, "YYYY-MM-DD");
      const startOfDay = selectedDate.startOf("day").toDate();
      const endOfDay = selectedDate.endOf("day").toDate();

      filters.createdAt = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);
    const orderBy = [
      { ["createdAt"]: sort === "desc" ? "desc" : "asc" }, 
    ] as any;

    const [allExpenses, totalExpenses] = await Promise.all([
      prismaDb.expense.findMany({
        where: filters,
        skip,
        take,
        orderBy,
      }),
      prismaDb.expense.count({ where: filters }),
    ]);

    const totalPages = Math.ceil(totalExpenses / take) > 1 ? Math.ceil(totalExpenses / take) : 1;

    res.status(200).json({
      message: "success",
      expenses: allExpenses,
      totalPages,
      totalExpenses,
      page,
      limit,
    });
  } catch (e) {
    console.log("Error in get expenses controller", e);
    return next(errorHandler(500, "Server error, Please try again later!"));
  }
};

export const getExpenseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const expense = await prismaDb.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      return next(errorHandler(404, "No expense found"));
    }

    res.status(200).json(expense);
  } catch (e) {
    console.log("Error in get expense by id controller", e);
    return next(errorHandler(500, "Server error, Please try again later!"));
  }
};

export const getMonthlyExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req as any;

  try {
    const expenseDataByMonth = await getMonthlyReport(userId);
 
    res.status(200).json(expenseDataByMonth.budgets);
  } catch (e) {
    console.log("Error in get monthly expense controller ", e);
    return next(errorHandler(500, "Server error, Please try again later!"));
  }
};

export const updateExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    userId,
    body: { expenseName, amount },
  } = req as any;
  const { id } = req.params;

  if (!id) {
    return next(errorHandler(404, "Invalid credentials"));
  }

  try {
    const expense = await prismaDb.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      return next(errorHandler(404, "No expense found"));
    }

    if (expense.userId !== userId) {
      return next(
        errorHandler(401, "You are not allowed to update this expense")
      );
    }

    const update: any = {};
    if (expenseName) update.expenseName = expenseName;
    if (amount && amount !== expense.amount)
      update.amount = subCurrency(amount);

    if (Object.keys(update).length === 0) {
      return next(errorHandler(400, "Empty request body"));
    }

    const [updatedExpense, updateAmountInBudget] = await Promise.all([
      prismaDb.expense.update({
        where: { id },
        data: update,
      }),
      update.amount
        ? prismaDb.budget.update({
            where: { id: expense.budgetId },
            data: {
              amountSpent: {
                increment: subCurrency(amount) - expense.amount,
              },
            },
          })
        : Promise.resolve(0),
    ]);

    res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
      ...(update.amount && { updatedBudget: updateAmountInBudget }),
    });
  } catch (e) {
    console.log("Error in create expense controller", e);
    return next(errorHandler(500, "Server error, Please try again later!"));
  }
};

export const deleteExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req as any;
  const { id } = req.params;

  try {
    const expense = await prismaDb.expense.findUnique({ where: { id } });

    if (!expense) {
      return next(errorHandler(404, "No expense found"));
    }

    if (expense.userId !== userId) {
      return next(
        errorHandler(401, "You are not allowed to delete this expense")
      );
    }

    await Promise.all([
      prismaDb.expense.delete({ where: { id } }),
      prismaDb.budget.update({
        where: { id: expense.budgetId },
        data: {
          amountSpent: {
            decrement: expense.amount,
          },
        },
      }),
    ]);

    res.status(200).json({ message: "success" });
  } catch (e) {
    console.log("Error in delete expense by id controller", e);
    return next(errorHandler(500, "Server error, Please try again later!"));
  }
};
