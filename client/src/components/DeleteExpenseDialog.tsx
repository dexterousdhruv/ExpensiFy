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
} from "@/components/ui/alert-dialog"
import useRefetch from "@/hooks/use-refetch";
import useUserInfo from "@/hooks/use-user-info";
import { apiCall } from "@/lib/api";
import { Expense } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

type Props = {
  children: React.ReactNode,
  expense: Expense
};



const DeleteExpenseDialog = ({ children, expense }: Props) => {
  const { userInfo: { token } } = useUserInfo()
  const refetch = useRefetch()
  
  const deleteExpense = () => {
    return apiCall("DELETE", `/expense/delete/${expense?.id}`, token);
  };
  
  const { mutate: handleDelete } = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      toast.success("Expense deleted successfully! ");
      refetch()
    },
    onError: () => {
      toast.error("Failed to delete expense!");
    },
  });


  return (
    <AlertDialog>
      <AlertDialogTrigger>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="font-inter">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-geist">
            Confirm Delete
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-800">
            Are you sure you want to delete the expense "{expense?.expenseName}
            "? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-500"
            onClick={() => {
              handleDelete()
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteExpenseDialog;
