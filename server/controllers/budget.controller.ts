import { NextFunction, Request, Response } from "express";
import { prismaDb } from "../connect/db";
import { errorHandler } from "../utils/error";
const moment = require("moment")
const subCurrency = (amt: number | string) => Number(amt) * 100


export const createBudget = async (req: Request, res: Response, next: NextFunction) => {
  const { userId,  body: { budgetCategory, budgetLimit } } = req as any

  if (!budgetCategory || !budgetLimit) {
    return next(errorHandler(400, 'All fields are required!'))
  }

  try {
    const newBudget = await prismaDb.budget.create({
      data: {
        budgetCategory,
        budgetLimit: subCurrency(budgetLimit),
        userId,
        timestamp: moment().unix()
      }
    });

    res.status(201).json(newBudget)
  } catch (e) {
    console.log("Error in create budget controller", e);
    return next(errorHandler(500, "Server error, Please try again later!"))
  }
}

export const getAllBudgets = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as any

  try {
    const allBudgets = await prismaDb.budget.findMany({ where: { userId } });
    res.status(200).json(allBudgets)

  } catch (e) {
    console.log("Error in get budget controller", e);
    return next(errorHandler(500, "Server error, Please try again later!"))
  }
}

export const getBudgetById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    return next(errorHandler(404, 'Invalid credential!'))
  }

  try {  
    const budget = await prismaDb.budget.findUnique({
      where: { id },
      include: {
        expenses: true,
      }, 
    });

    if (!budget) {
      return next(errorHandler(404, 'No budget found'))
    }

    res.status(200).json(budget)

  } catch (e) {
    console.log("Error in get budget by id controller", e);
    return next(errorHandler(500, "Server error, Please try again later!"))
  }
}

export const updateBudget = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, body: { budgetLimit, budgetCategory }} = req as any
  const { id } = req.params;

  try {  
    const budget = await prismaDb.budget.findUnique({
      where: { id },
    });

    if (!budget) {
      return next(errorHandler(404, 'No budget found'))
    }

    if (budget.userId !== userId) {
      return next(errorHandler(401, "You are not allowed to update this budget"))
    }

    if (budget.budgetLimit === subCurrency(budgetLimit) && budget.budgetCategory === budgetCategory) {
      res.status(200).json(budget); 
    }

    const update: any = {}
    if(budget.budgetLimit !== subCurrency(budgetLimit)) update.budgetLimit = subCurrency(budgetLimit)
    if(budget.budgetCategory === budgetCategory) update.budgetCategory = (budgetCategory)
  

    const [updatedBudget, updatedExpenses]= await Promise.all([
      (!!JSON.stringify(update) && prismaDb.budget.update({
        where: { id },
        data: { 
          budgetLimit: subCurrency(budgetLimit),
          budgetCategory
        }
      })),
      (budgetCategory!== budget.budgetCategory && prismaDb.expense.updateMany({
        where: {
          budgetId: budget.id
        },
        data: {
          budgetCategory
        }
      }))
    ])
 

    res.status(200).json(updatedBudget)

  } catch (e) {
    console.log("Error in update budget by id controller", e);
    return next(errorHandler(500, "Server error, Please try again later!"))
  }
}

export const deleteBudget = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as any
  const { id } = req.params;

  try {
    const budget = await prismaDb.budget.findUnique({ where: { id }})

    if (!budget) {
      return next(errorHandler(404, "No budget found"))
    }

    if (budget.userId !== userId) {
      return next(errorHandler(401, "You are not allowed to delete this budget"))
    }

    
    await Promise.all([
      prismaDb.expense.deleteMany({ where: { budgetId: budget?.id }}),
      prismaDb.budget.delete({where: { id }}),
    ]);

    res.status(200).json({ message: "success"})
    
  } catch (e) {
    console.log("Error in delete budget by id controller", e);
    return next(errorHandler(500, "Server error, Please try again later!"))
  }
}