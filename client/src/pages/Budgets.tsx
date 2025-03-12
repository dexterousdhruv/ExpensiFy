import AddBudgetForm from "@/components/AddBudgetForm";
import BudgetCard from "@/components/BudgetCard";
import BarGraphComponent  from "@/components/BudgetChart";
import useUserInfo from "@/hooks/use-user-info";
import { apiCall } from "@/lib/api";
import { Budget } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const Budgets = () => {
  const { userInfo } = useUserInfo();

  const getAllBudgets = (): Promise<any> => {
    return apiCall("GET", `/budget/all`, userInfo?.token);
  };

  const { data } = useQuery({
    queryKey: ["budgets"],
    queryFn: getAllBudgets,
    refetchOnMount: "always",
    select: data => data?.data
  });

  const budgets: Budget[] | any = data || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-6 gap-5 ">
      <div className="col-span-1 sm:col-span-3 xl:col-span-6 text-center sm:text-left">
        <h1 className="text-4xl font-inter font-semibold leading- ">
          Budgets 📒
        </h1>

        <p className="font-rubik text-lg text-zinc-500 font-light my-2 ">
          Create a budget to get started!
        </p>
      </div>

      <div className="flex flex-col gap-5 col-span-1 sm:col-span-3 lg:flex-row xl:col-span-2 xl:flex-col ">
        <AddBudgetForm />
        <BarGraphComponent />
      </div>

      <div className="col-span-1 shadow sm:col-span-3  xl:col-span-4 border rounded-md h-full p-3 sm:p-4 bg-white">
        <div className="">
          <h3 className="font-inter text-xl md:text-2xl font-medium mb-3">
            Existing Budgets
          </h3>

          <div className="grid lg:grid-cols-2 gap-3 h-full xl:max-h-[600px] overflow-auto">
            {(!!budgets?.length && budgets.length) ? (
              budgets.map((budget: Budget) => {
                return (
                  <div key={budget.id} className="grid-cols-2 xl:grid-cols-1">
                    <BudgetCard budget={budget} />
                    {/* <EditBudgetForm budget={budget} /> */}
                  </div>
                );
              })
            ) : (
              <div className="grid place-content-center col-span-2 min-h-[50vh] font-inter text-lg ">
                No data found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;
