import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddExpenseForm from "@/components/AddExpenseForm"
// import BudgetChart from "@/components/BudgetChart"
import { columns } from "@/components/expense-table/columns"
import DataTable from "@/components/expense-table/ExpensesTable"
import useUserInfo from "@/hooks/use-user-info"
import { apiCall } from "@/lib/api"
import { downloadFile } from "@/lib/helpers"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";

const Expenses = () => {
  const { userInfo } = useUserInfo();
  const generateReport = (reportType: any) => {
    const data = {
      reportType,
      userName: `${userInfo?.firstName} ${userInfo?.lastName}`
    }
    return apiCall("POST", `/user/generate-report`, userInfo?.token, null, data );
  };

  const { mutate: downloadReport } = useMutation({
    mutationFn: generateReport,
    onMutate: () => {},
    onSuccess: (data) => { 
      // toast.success(data?.data?.msg)
      const downloadUrl = data?.data.downloadUrl
      downloadFile(downloadUrl)
    },
    onError: () => {
      toast.error(" Request failed! Please try again. 😞")
    },

  })

  
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-6 gap-5">
      <div className="col-span-1 sm:col-span-3 xl:col-span-6 flex items-center justify-between">
      <h1 className="text-4xl font-inter font-semibold ">
        Expenses 💸
      </h1>

      <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <Button variant="outline" size={"sm"} className="w-fit border-zinc-700 border-2 sm:p-4 ">
          <span className="font-inter hidden sm:block">Generate Report</span>
          <MoreHorizontal className=" sm:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className=" font-inter min-w-40">
        <DropdownMenuLabel className="font-geist font-semibold text-[15px] sm:hidden">
          Generate
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="!bg-gray-100 h-[1px]" />
        <DropdownMenuItem variant="default" onClick={() => downloadReport("monthly")}>
          Monthly Report
        </DropdownMenuItem>
        <DropdownMenuItem variant="default" onClick={() => downloadReport("yearly")}>
          Yearly Report
        </DropdownMenuItem>

      </DropdownMenuContent>
      </DropdownMenu>

      </div>


      <div className="flex flex-col gap-5 col-span-1 sm:col-span-3 lg:flex-row xl:col-span-2 xl:flex-col ">
        <AddExpenseForm />
        {/* <BudgetChart /> */}
      </div>

      <div className="col-span-1 shadow sm:col-span-3  xl:col-span-4 border rounded-md h-full p-3 sm:p-4 bg-white">
        <div className="">
          <h3 className="font-inter text-xl md:text-2xl font-medium mb-3">Expense History</h3>

          <DataTable columns={columns} />
        </div>
      </div>
      
      
    </section>
  )
}

export default Expenses