import AddBudgetForm from "@/components/AddBudgetForm";
import AddExpenseForm from "@/components/AddExpenseForm";
import useUserInfo from "@/hooks/use-user-info";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/helpers";
import { formatDate } from "date-fns";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api";
import { Expense } from "@/lib/types";
import ExpenseActions from "@/components/ExpenseActions";

const Dashboard = () => {
  const { userInfo } = useUserInfo();

  const getAllExpenses = () => {
    const params = { sort: "desc", limit: 8 };
    return apiCall("GET", `/expense/all`, userInfo?.token, params);
  };

  const { data } = useQuery({
    queryKey: ["expenses"],
    queryFn: getAllExpenses,
    refetchOnMount: "always",
    select: data => (data?.data),
    placeholderData: (previousData, _) => previousData,
  });

  const expenses: Expense[] | any = data?.expenses || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-6 gap-5">
      <div className="col-span-1 sm:col-span-3 xl:col-span-6 text-center sm:text-left">
        <h1 className="text-4xl font-inter font-semibold leading- ">
          Welcome back,{" "}
          <span className="text-blue-500">{userInfo?.firstName}!</span>👋
        </h1>

        <p className="font-rubik text-lg text-zinc-500 font-light my-2 ">
          Create a budget to get started!
        </p>
      </div>

      <div className="flex flex-col gap-5 col-span-1 sm:col-span-3 xl:col-span-2 lg:flex-row xl:flex-col ">
        <AddBudgetForm />
        <AddExpenseForm />
      </div>

      <div className="bg-white col-span-1 shadow sm:col-span-3 xl:col-span-4 border rounded-md h-full p-3 sm:p-4">
        <div className="">
          <h3 className="font-inter text-xl md:text-2xl font-medium mb-3">
            Recent Expense History
          </h3>

          <div className="border pb-3 rounded-md overflow-hidden">
            <Table className="bg-white border-b ">
              <TableHeader className="font-geist ">
                <TableRow className="lg:text-[15px] ">
                  <TableHead className="py-1 lg:py-3">
                    Expense Name
                  </TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Budget Category</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="font-inter ">
                {!!expenses.length ? expenses?.map((expense: Expense, idx: number) => (
                  <TableRow
                    key={idx}
                    className={`lg:text-base py-3 ${
                      idx % 2 === 0
                        ? "bg-[#F4F4F5] text-zinc-700"
                        : " text-zinc-800"
                    }`}
                  >
                    <TableCell className="py-3 lg:py-5">
                      {expense.expenseName}
                    </TableCell>
                    <TableCell>{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>{expense.budgetCategory}</TableCell>
                    <TableCell>
                      {formatDate(expense.createdAt, "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      <ExpenseActions expense={expense} />
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center font-inter md:text-base"
                  >
                    No data found.
                  </TableCell>
                </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="!w-full mx-auto text-center pt-3">
              <Link
                to="expenses"
                className="underline font-inter text-sm lg:text-base "
              >
                View all expenses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
