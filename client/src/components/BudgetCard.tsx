import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/helpers";
import { Budget } from "@/lib/types";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { apiCall } from "@/lib/api";
import useUserInfo from "@/hooks/use-user-info";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useRefetch from "@/hooks/use-refetch";

type BudgetProps = {
  budget: Budget;
};

const BudgetCard = ({ budget }: BudgetProps) => {
  const {
    userInfo: { token },
  } = useUserInfo();
  const navigate = useNavigate();

  const refetch = useRefetch()

  const deleteBudget = () => {
    return apiCall("DELETE", `/budget/delete/${budget?.id}`, token);
  };

  const { mutate: handleDelete } = useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      toast.success("Budget deleted successfully! ");
      refetch()
    },
    onError: () => {
      toast.error("Failed to delete budget!");
    },
  });

  return (
    <Card className=" w-full font-inter border rounded-md h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between text-base sm:text-xl">
          <h3 className="text-zinc-600 ">{budget?.budgetCategory}</h3>
          <p className="text-stone-500 font-medium text-wrap text-right">
            Limit: {formatCurrency(budget?.budgetLimit)}
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress
          value={(budget?.amountSpent * 100) / budget?.budgetLimit}
          className="h-3"
        />

        <div className="flex justify-between items-center mt-2 text-zinc-400 text-sm">
          <small className="sm:text-sm">
            {formatCurrency(budget?.amountSpent)} spent
          </small>
          <small className="sm:text-sm text-right">
            {formatCurrency(budget?.budgetLimit - budget?.amountSpent)}{" "}
            remaining
          </small>
        </div>

        <div className="mx-auto w-fit mt-8 flex justify-center items-center flex-wrap gap-3 sm:gap-5">
          <Button
            variant={"outline"}
            className="rounded-sm"
            onClick={() => navigate(`/main/budgets/${budget.id}`)}
          >
            View Details
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className=" sm:w-28 rounded-sm border bg-white hover:bg-white border-red-500 text-red-500 ">
                Delete <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="font-inter ">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-geist">
                  Confirm Delete
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the budget "
                  {budget?.budgetCategory}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-500 cursor-pointer"
                  onClick={() => {
                    handleDelete();
                    navigate("/main/budgets");
                  }}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetCard;
