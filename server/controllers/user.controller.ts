import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../utils/error";
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import { formatCurrency, logError, getMonthlyReport, getYearlyReport} from "../utils/helpers";
const moment = require("moment");


export const generateReportController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req as any;
  const { reportType, userName } = req.body;

  if (!["monthly", "yearly"].includes(reportType)) {
    return next(errorHandler(400, "Invalid report type"));
  }

  if (!userName) {
    return next(errorHandler(400, "Invalid username"));
  }

  try {
    let generatedFileName = await generateReport(reportType, userId, userName)

    res.status(200).json({
      message: "Url valid for 5 minutes only!",
      downloadUrl: `${process.env.BASE_URL}/files/export/${generatedFileName}.xlsx`,
      generatedFileName, 
    });
  } catch (e:any) {
    console.log("Error in generate report controller", e);
    logError(e)
    return next(errorHandler(500, "Server error, Please try again later!"));
  }
}

async function generateReport(
  reportType: string,
  userId: string,
  userName: string
) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(
    `${reportType[0].toUpperCase() + reportType.slice(1)} Report`
  );

  if (reportType === "monthly") {
    const reportData = await getMonthlyReport(userId)
    monthlyReport(sheet, reportData, userName)
  }

  if (reportType === "yearly") {
    const reportData = await getYearlyReport(userId)
    yearlyReport(sheet, reportData, userName)
  } 

  // Create folder if it itsn't
  if (!fs.existsSync('public/files/export')) 
    fs.mkdirSync("public/files/export", { recursive: true });
  
  // Save the file
  const fileName = `${userName.split(" ").join("_")}_${reportType}`;
  const filePath = path.join("./public/files/export/", `${fileName}.xlsx`);
  await workbook.xlsx.writeFile(filePath);

  // Schedule file deletion after 5 minutes
  setTimeout(() => {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
  }, 5 * 60 * 1000);

  return fileName;
};


function monthlyReport(worksheet: any, reportData: any,  userName: string): void {
  const now = moment();
  const month = now.month(now.get("month")).format("MMMM");

  worksheet.columns = [
    { width: 30 },
    { width: 30 },
    { width: 30 },
    { width: 30 },
  ];

  // User Details
  worksheet.addRow(["User Details"]).font = { bold: true, size: 14. };
  worksheet.addRow(["User Name", userName]);
  worksheet.addRow(["Report Month", `${month} ${now.get("year")}`]);
  worksheet.addRow(["Generated On", `${now.format("DD-MM-YYYY hh:mm A")}`]);
  worksheet.addRow([]);

  // Monthly Financial Summary
  worksheet.addRow(["Monthly Financial Summary"]).font = {
    bold: true,
    size: 14,
  };
  worksheet.addRow(["Metric", "Value (in INR)"]).font = { bold: true };

  worksheet.addRow([
    "Total Monthly Budget",
    `${formatCurrency(reportData.totalMonthlyBudget)}`,
  ]);
  worksheet.addRow(["Total Expenses", `${formatCurrency(reportData.totalExpenses)}`]);

  const remainingBudget = reportData.totalMonthlyBudget - reportData.totalExpenses;
  worksheet.addRow(["Remaining Budget", `${formatCurrency(remainingBudget)}`]);

  const percentageSpent = ((reportData.totalExpenses / reportData.totalMonthlyBudget) * 100).toFixed(2);
  worksheet.addRow(["Percentage Spent", `${percentageSpent}%`]);

  worksheet.addRow([
    "Highest Expense Category",
    `${reportData.highestExpenseBudget?.budgetCategory} (${reportData.highestExpenseBudget?.totalSpent})`,
  ]);

  worksheet.addRow([
    "Largest Individual Expense",
    `${reportData.largestIndividualExpense?.expenseName} (${formatCurrency(reportData.largestIndividualExpense?.amount)})`,
  ]);

  worksheet.addRow([]);

  // Monthly Budget Breakdown
  worksheet.addRow(["Monthly Budget Breakdown"]).font = {
    bold: true,
    size: 14,
  };
  worksheet.addRow([
    "Category",
    "Monthly Budget",
    "Total Expenditure",
    "Remaining",
    "% Spent",
  ]).font = { bold: true };

  reportData.budgets.forEach((item: any) => {
    const remaining = item.budgetLimit - item.totalSpent;
    const percentage = ((item.totalSpent / item.budgetLimit) * 100).toFixed(2);
    const row = worksheet.addRow([
      item.budgetCategory,
      `${formatCurrency(item.budgetLimit)}`,
      `${formatCurrency(item.totalSpent)}`,
      `${formatCurrency(remaining)}`,
      `${percentage}%`,
    ]);

    // 🚨 Highlight if overspending occurs
    if (remaining < 0) {
      row.getCell(4).font = { color: { argb: "FF0000" }, bold: true }; // Red 
      row.getCell(4).value += " 🚨";
    }
  });

  worksheet.addRow([]);

  // Monthly Expense Breakdown
  worksheet.addRow(["Monthly Expense Breakdown"]).font = {
    bold: true,
    size: 14,
  };
  worksheet.addRow(["Expense Name", "Category", "Amount", "Date & Time"]).font =
    { bold: true };

  reportData.expenses.forEach((expense: any) => {
    worksheet.addRow([
      expense.expenseName,
      expense.budgetCategory,
      `${formatCurrency(expense.amount)}`,
      moment(expense.createdAt).format("DD-MM-YYYY hh:mm A"),
    ]);
  });
}


function yearlyReport(worksheet: any, reportData: any, userName: string): void {
  worksheet.columns = [
    { width: 30 },
    { width: 30 },
    { width: 30 },
    { width: 30 },
  ];

  // User Details
  worksheet.addRow(["User Details"]).font = { bold: true, size: 14 };
  worksheet.addRow(["User Name", userName]);
  worksheet.addRow(["Report Year", moment().get("year")]);
  worksheet.addRow(["Generated On", `${moment().format("DD-MM-YYYY hh:mm A")}`]);
  worksheet.addRow([]); 

  // Annual Financial Summary
  worksheet.addRow(["📊 Annual Financial Summary"]).font = { bold: true, size: 14 };
  worksheet.addRow(["Metric", "Value (in INR)"]).font = { bold: true };

  worksheet.addRow(["Total Annual Budget", `${formatCurrency(reportData.totalAnnualBudget)}`]);
  worksheet.addRow(["Total Expenses (This Year)", `${formatCurrency(reportData.totalExpenses)}`]);

  const totalSavings = reportData.totalAnnualBudget - reportData.totalExpenses;
  worksheet.addRow(["Total Savings (This Year)", `${formatCurrency(totalSavings)}`]);

  worksheet.addRow(["Remaining Budget", `${formatCurrency(totalSavings)}`]);

  const percentageSpent = ((reportData.totalExpenses / reportData.totalAnnualBudget) * 100).toFixed(2);
  worksheet.addRow(["Percentage Spent", `${percentageSpent}%`]);

  worksheet.addRow(["Average Monthly Expense", `${formatCurrency(reportData.averageMonthlyExpense)}`]);

  worksheet.addRow([
    "Largest Expense Item",
    `${reportData.largestExpense?.expenseName} (${formatCurrency(reportData.largestExpense?.amount)})`,
  ]);

  worksheet.addRow([
    "Most Frequent Expense Category",
    `${reportData.mostFrequentCategory}`,
  ]);

  worksheet.addRow([
    "Month with Highest Spending",
    `${reportData.highestSpendingMonth.month} (${formatCurrency(reportData.highestSpendingMonth.amount)})`,
  ]);

  worksheet.addRow([
    "Month with Lowest Spending",
    `${reportData.lowestSpendingMonth.month} (${formatCurrency(reportData.lowestSpendingMonth.amount)})`,
  ]);

  worksheet.addRow([]); 

  // Annual Budget Breakdown
  worksheet.addRow(["Annual Budget Breakdown"]).font = { bold: true, size: 14 };
  worksheet.addRow(["Budget Category", "Annual Budget", "Amount Spent", "Remaining Budget", "% Spent"]).font = { bold: true };

  reportData.budgetBreakdown.forEach((item: any) => {
    const remaining = item.annualBudget - item.amountSpent;
    const percentage = +(((item.amountSpent / item.annualBudget) * 100).toFixed(2)); // change to number
    const row = worksheet.addRow([
      item.budgetCategory,
      `${formatCurrency(item.annualBudget)}`,
      `${formatCurrency(item.amountSpent)}`,
      `${formatCurrency(remaining)}`,
      `${percentage}%`,
    ]);

    // 🚨 Highlight if overspending occurs
    if (remaining < 0) {
      row.getCell(4).font = { color: { argb: "FF0000" }, bold: true }; // Red color
      row.getCell(4).value += " 🚨";
    }
  });

  worksheet.addRow([]); 

  // Top 10 Expenses of the Year
  worksheet.addRow(["Top 10 Expenses of the Year"]).font = { bold: true, size: 14 };
  worksheet.addRow(["Expense Name", "Category", "Amount", "Date & Time"]).font = { bold: true };

  reportData.topExpenses.forEach((expense: any) => {
    worksheet.addRow([
      expense.expenseName,
      expense.budgetCategory,
      `${formatCurrency(expense.amount)}`,
      moment(expense.createdAt).format("DD-MM-YYYY hh:mm A"),
    ]);
  });

  worksheet.addRow([]); 

  // Monthly Spending Trend
  worksheet.addRow(["📈 Monthly Spending Trend"]).font = { bold: true, size: 14 };
  worksheet.addRow(["Month", "Total Budget", "Total Expenses", "% Spent"]).font = { bold: true };

  reportData.monthlySpending.forEach((month: any) => {
    const row = worksheet.addRow([
      month.month,
      `${formatCurrency(month.totalBudget)}`,
      `${formatCurrency(month.totalExpenses)}`,
      `${month.percentageSpent}%`,
    ]);

    // 🚨 Highlight if spending exceeded 100%
    if (month.percentageSpent > 80) {
      row.getCell(3).font = { color: { argb: "FF0000" }, bold: true }; // Red color
      row.getCell(3).value += " 🚨";
    }
  });

}



   