import { prismaDb } from "../connect/db";
const moment = require("moment");
import fs from "fs";
import path from "path";

export const formatCurrency = (amt: any) => {
  amt /= 100;
  return amt.toLocaleString(undefined, {
    style: "currency",
    currency: "INR",
  });
};

export const logError = (error: Error | string) => {
  const logDir = path.join(__dirname, "logs");
  const logFile = path.join(logDir, "error.log");

  // Ensure logs directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Format log message
  const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
  const logMessage = `[${timestamp}] ERROR: ${
    error instanceof Error ? error.stack : error
  }\n`;

  // Append error to log file
  fs.appendFile(logFile, logMessage, (err: any) => {
    if (err) console.error("Failed to write to log file", err);
  });
};

export const getMonthlyReport = async (userId: string) => {
  const now = moment();
  const startOfMonth = now.startOf("month").toDate();
  const endOfMonth = now.endOf("month").toDate();
  const [
    totalMonthlyBudget,
    totalMonthlyExpense,
    aggregatedExpenses,
    expenseListByBudgets,
    expenseList,
  ] = await Promise.all([
    prismaDb.budget.aggregate({
      where: {
        userId,
        deletedAt: null,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        budgetLimit: true,
      },
    }),
    prismaDb.expense.aggregate({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        deletedAt: null,
      },
      _sum: {
        amount: true,
      },
    }),
    prismaDb.expense.groupBy({
      by: ["budgetCategory"],
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
    }),
    prismaDb.budget.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      select: {
        budgetCategory: true,
        budgetLimit: true,
        expenses: {
          where: {
            createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
            }
          },
          select: {
            expenseName: true,
            amount: true,
          },
        },
      },
    }),
    prismaDb.expense.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        deletedAt: null,
      },
      orderBy: {
        amount: "desc",
      },
    }),
  ]);

  const highestExpenseBudget =
    aggregatedExpenses.slice(0, 1).map((e) => ({
      budgetCategory: e?.budgetCategory || "",
      totalSpent: e?._sum?.amount || 0,
    }))[0] || null;

  const largestIndividualExpense = expenseList?.[0] || null;

  return {
    expenseListByBudgets,
    totalMonthlyBudget: totalMonthlyBudget?._sum?.budgetLimit,
    totalExpenses: totalMonthlyExpense?._sum?.amount,
    highestExpenseBudget,
    largestIndividualExpense,
    budgets: aggregatedExpenses.map((expense) => ({
      budgetCategory: expense.budgetCategory,
      totalSpent: expense._sum.amount || 0,
      ...expenseListByBudgets
        .filter((e) => e.budgetCategory === expense.budgetCategory)
        .reduce(
          (_, e): any => ({
            budgetLimit: e?.budgetLimit,
            expenses: e?.expenses,
          }),
          {}
        ),
    })),
    expenses: expenseList,
    
  };
};

// sample data returned by monthly data Format
const monthlyDataFormat = {
  totalMonthlyBudget: 3200000,
  totalExpenses: 722000,
  highestExpenseBudget: {
    budgetCategory: "Food",
    totalSpent: 220000,
  },
  largestIndividualExpense: {
    id: "cm7x52ws50001t1f83hkbsj01",
    createdAt: "2025-03-07T10:20:00.123Z",
    updatedAt: "2025-03-07T10:20:00.123Z",
    expenseName: "Car Repair",
    amount: 1000,
    budgetCategory: "Miscellaneous",
    deletedAt: null,
    timestamp: 1741352399,
    userId: "cm7x1d34n0004t1t031mq65iv",
    budgetId: "cm7x4pcx70001t1qs77rp36du",
  },
  budgets: [
    {
      budgetCategory: "Food",
      totalSpent: 220000,
      budgetLimit: 500000,
      expenses: [
        {
          expenseName: "Grocery shopping",
          amount: 120000,
        },
        {
          expenseName: "Restaurant dining",
          amount: 100000,
        },
      ],
    },
  ],
  expenses: [
    {
      id: "cm7x52ws50001t1f83hkbsj01",
      createdAt: "2025-03-07T10:20:00.123Z",
      updatedAt: "2025-03-07T10:20:00.123Z",
      expenseName: "Car Repair",
      budgetCategory: "Miscellaneous",
      amount: 1000,
      deletedAt: null,
      timestamp: 1741352399,
      userId: "cm7x1d34n0004t1t031mq65iv",
      budgetId: "cm7x4pcx70001t1qs77rp36du",
    },
  ],
};

// sample data returned by yearly data Format
const yearlyDataFormat = {
  totalAnnualBudget: 60000,
  totalExpenses: 42500,
  averageMonthlyExpense: 3542, 
  largestExpense: { expenseName: "Car Repair", amount: 2000 }, // "largestIndividualExpense"
  mostFrequentCategory: "Food & Dining",
  highestSpendingMonth: { month: "December", amount: 5200 },
  lowestSpendingMonth: { month: "February", amount: 2800 },
  budgetBreakdown: [
    { budgetCategory: "Groceries", annualBudget: 12000, amountSpent: 10500 },
    { budgetCategory: "Rent", annualBudget: 24000, amountSpent: 24000 },
    { budgetCategory: "Entertainment", annualBudget: 6000, amountSpent: 4000 },
    { budgetCategory: "Food & Dining", annualBudget: 9600, amountSpent: 10800 },
  ],
  topExpenses: [
    {
      expenseName: "Car Repair",
      budgetCategory: "Miscellaneous",
      amount: 2000,
      createdAt: "2024-06-20T14:00:00Z",
    },
  ],
  monthlySpending: [
    {
      month: "January 2024",
      totalBudget: 5000,
      totalExpenses: 3500,
      percentageSpent: 70,
    },
  ],
};

export const getYearlyReport = async (userId: string) => {
  const now = moment();
  const startOfYear = now.clone().startOf("year").toDate();
  const endOfYear = now.clone().endOf("year").toDate();

  const [
    totalAnnualBudget,
    annualBudgets,
    monthlyBudgets,
    totalExpenses,
    topExpenses,
    expensesByCategory,
    monthlyExpenses,
  ] = await Promise.all([
    prismaDb.budget.aggregate({
      where: { userId, createdAt: { gte: startOfYear, lte: endOfYear } },
      _sum: { budgetLimit: true },
    }),
    await prismaDb.budget.findMany({
      where: { userId, createdAt: { gte: startOfYear, lte: endOfYear } },
      select: { budgetCategory: true, budgetLimit: true, timestamp: true },
    }),
    await prismaDb.budget.groupBy({
      by: ["createdAt"],
      where: { userId, createdAt: { gte: startOfYear, lte: endOfYear } },
      _sum: { budgetLimit: true },
    }),
    prismaDb.expense.aggregate({
      where: { userId, createdAt: { gte: startOfYear, lte: endOfYear } },
      _sum: { amount: true },
    }),
    prismaDb.expense.findMany({
      where: { userId, createdAt: { gte: startOfYear, lte: endOfYear } },
      orderBy: { amount: "desc" },
      take: 10,
    }),
    prismaDb.expense.groupBy({
      by: ["budgetCategory"],
      where: { userId, createdAt: { gte: startOfYear, lte: endOfYear } },
      _count: { budgetCategory: true },
      _sum: { amount: true },
      orderBy: { _count: { budgetCategory: "desc" } },
      // take: 1,
    }),
    prismaDb.expense.groupBy({
      by: ["timestamp"],
      where: { userId, createdAt: { gte: startOfYear, lte: endOfYear } },
      _sum: { amount: true },
      orderBy: {
        timestamp: "asc",
      },
    }),
  ]);

  const totalSavings =
    (totalAnnualBudget._sum.budgetLimit || 0) -
    (totalExpenses._sum.amount || 0);
  const averageMonthlyExpense = +(((totalExpenses._sum.amount || 0) / 12).toFixed(2));

  // Aggregate monthly expenses by month
  const monthTotals = monthlyExpenses
    .reduce((acc: any, exp) => {
      const month = moment(exp.timestamp * 1000).format("MMMM YYYY");
      const itemIdx = acc.findIndex((i: any) => i.month === month);

      if (itemIdx !== -1) {
        acc[itemIdx].amount += exp?._sum?.amount || 0;
      } else {
        acc.push({ month, amount: exp?._sum?.amount || 0 });
      }
      return acc;
    }, [])
  
  const sortByAmount = monthTotals.slice().sort((a: any, b: any) => a.amount - b.amount)
  const lowestSpendingMonth = sortByAmount[0] || { month: "N/A", amount: 0 };
  const highestSpendingMonth = sortByAmount[monthTotals.length - 1] || { month: "N/A", amount: 0}


  const budgetBreakdown = annualBudgets.map((budget) => {
    const expense = expensesByCategory.find(
      (e) => e.budgetCategory === budget.budgetCategory
    );
    const amountSpent = expense?._sum.amount || 0;
    return {
      budgetCategory: budget.budgetCategory,
      annualBudget: budget.budgetLimit,
      amountSpent,
      remainingBudget: budget.budgetLimit - amountSpent,
      percentageSpent: +(((amountSpent / budget.budgetLimit) * 100).toFixed(2)),
    };
  });

  const getTotalBudget = (month: any) => monthlyBudgets.reduce((acc, b) => {
    if (moment(b.createdAt).format("MMMM YYYY") === month) {
      acc += b._sum?.budgetLimit || 0;
    }
    return acc;
  }, 0);

  const monthlySpendingTrend = (monthTotals).map((el: any, i: number) => {
    let totalBudget = getTotalBudget(el.month)

    if (totalBudget === 0 && i > 0) {
      const previousMonth = monthTotals[i - 1]?.month;
      if(previousMonth)
        totalBudget = getTotalBudget(previousMonth)  
    }

    return {
      month: el.month,
      totalExpenses: el.amount,
      totalBudget,
      percentageSpent: +(((el.amount / totalBudget) * 100).toFixed(2)),
    } 
  })

  return {
    totalAnnualBudget: totalAnnualBudget._sum.budgetLimit || 0,
    totalExpenses: totalExpenses._sum.amount || 0,
    totalSavings,
    averageMonthlyExpense,
    largestExpense: topExpenses?.[0] || [],
    mostFrequentCategory: expensesByCategory[0]?.budgetCategory || "N/A",
    highestSpendingMonth,
    lowestSpendingMonth,
    budgetBreakdown,
    topExpenses,
    monthlySpending: monthlySpendingTrend,
  };
};




const now = moment();
const startOfMonth = now.startOf("month").toDate();
const endOfMonth = now.endOf("month").toDate();
const startOfYear = now.clone().startOf("year").toDate();
const endOfYear = now.clone().endOf("year").toDate();

