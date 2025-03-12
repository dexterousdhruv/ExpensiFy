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
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api";
import { Expense } from "@/lib/types";
import EditBudgetForm from "@/components/EditBudgetForm";
import BudgetCard from "@/components/BudgetCard";
import ExpenseActions from "@/components/ExpenseActions";
import ErrorSidebar from "@/components/ErrorSidebar";
import moment from "moment";

const BudgetPageById = () => {
  const { userInfo } = useUserInfo();
  const { id } = useParams();


  const getBudget = () => {
    return apiCall("GET", `/budget/${id}`, userInfo?.token);
  };

  const { data: budgetData, isFetching, isLoading, isError} = useQuery({
    queryKey: ["budgetById"],
    queryFn: getBudget,
    refetchOnMount: "always",
    select: (data) => data?.data,
    placeholderData: (previousData, _) => previousData,
  });

  const expenses: any = budgetData?.expenses || [];

  if (isLoading || isFetching) return (
    <div className="h-full grid place-content-center">
      <img src="/dots.gif" alt="" className="w-22 rotate-[.5deg]" />
    </div>
  )


  if (isError) {
    return <ErrorSidebar />
  }


  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-6 gap-5">
      <div className="col-span-1 sm:col-span-3 xl:col-span-6 text-center sm:text-left">
        <h1 className="text-4xl font-inter font-semibold leading- ">
          <span className="text-blue-500">{budgetData?.budgetCategory} </span>
          Overview
        </h1>
      </div>

      <div className="flex flex-col gap-5 col-span-1 sm:col-span-3 xl:col-span-6 lg:flex-row ">
        <EditBudgetForm budget={budgetData} />
        <BudgetCard budget={budgetData} />
        <AddExpenseForm budgetIdProp={budgetData?.id} />
      </div>

      <div className="bg-white col-span-1 shadow sm:col-span-3 xl:col-span-6 border rounded-md h-full p-3 sm:p-4">
        <div className="">
          <h3 className="font-inter text-xl md:text-2xl font-medium mb-3">
            {budgetData?.budgetCategory} Expenses
          </h3>

            <div className="border pb-3 rounded-md overflow-hidden">
              <Table className="bg-white border-b ">
                <TableHeader className="font-geist">
                  <TableRow className="lg:text-[15px] ">
                    <TableHead className="py-1 lg:py-3 ">
                      Expense Name
                    </TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Budget Category</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="font-inter ">
                  {!!expenses?.length ? expenses?.slice(0, 8).sort((a: Expense, b: Expense) => moment(b.createdAt).unix() - moment(a.createdAt).unix()).map((expense: Expense, idx: number) => (
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
                        {moment(expense.createdAt).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>
                        <ExpenseActions expense={expense} />
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
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
                  to="/main/expenses"
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

export default BudgetPageById;
