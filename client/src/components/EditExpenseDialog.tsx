import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiCall } from "@/lib/api";
import { Budget, Expense } from "@/lib/types";
import useUserInfo from "@/hooks/use-user-info";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useRefetch from "@/hooks/use-refetch";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/helpers";

interface EditExpenseDialogProps {
  expense: Expense;
  children: React.ReactNode;
}

const expenseSchema: any = (maxAmount: number) =>
  z.object({
    expenseName: z.string().min(2, {
      message: "This field is required.",
    }),
    amount: z.coerce
      .number()
      .min(0, {
        message: "Amount spent must be greater than zero.",
      })
      .max(maxAmount, {
        message: `Amount must not exceed ${formatCurrency(maxAmount * 100)}`,
      }),
  });

type FormValues = {
  expenseName: string;
  amount: number;
};

function EditExpenseDialog({
  expense,
  children,
}: EditExpenseDialogProps) {
  const [maxBudgetLimit, setMaxBudgetLimit] = useState<number>(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(expenseSchema(maxBudgetLimit)),
    defaultValues: {
      expenseName: expense?.expenseName,
      amount: expense?.amount / 100,
    },
  });

  const { reset } = form;
  const refetch = useRefetch();
  const {
    userInfo: { token },
  } = useUserInfo();

  const getBudget = () => {
    return apiCall("GET", `/budget/${expense?.budgetId}`, token);
  };
  const updateExpense = (expenseData: any) => {
    return apiCall(
      "PUT",
      `/expense/update/${expense?.id}`,
      token,
      {},
      expenseData
    );
  };

  const { data: budgetData } = useQuery({
    queryKey: ["budgetById"],
    queryFn: getBudget,
    refetchOnMount: true,
    staleTime: 20000,
    select: (data): Budget => data?.data,
  });

  const { mutate: newExpense } = useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      toast.success("Expense updated successfully! ");
      reset();
      refetch();
    },
    onError: () => {
      toast.error("Failed to update expense!");
    },
  });

  const [watchAmount] = useWatch({
    control: form.control,
    name: ["amount"],
  });

  useEffect(() => {
    if (budgetData) {
      const { budgetLimit, amountSpent } = budgetData;
      const remainingLimit =
        budgetLimit - amountSpent > 0 ? (budgetLimit - amountSpent) / 100 : 0;
      const limit = remainingLimit + expense?.amount / 100;
      setMaxBudgetLimit(limit);
    }
  }, [budgetData, watchAmount]);

  const onSubmit = (values: FormValues) => {
    const { expenseName, amount } = expense;
    if (
      JSON.stringify(values) !==
      JSON.stringify({ expenseName, amount: amount / 100 })
    ) {
      newExpense(values)
      reset(values)
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] font-inter">
        <DialogHeader>
          <DialogTitle className="font-geist">
            Edit Expense
          </DialogTitle>
          <DialogDescription className="">
            Make changes to your expense here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 sm:space-y-6"
          >
            <FormField
              control={form.control}
              name="expenseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" !text-black">Expense Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g. NIKE Air Jordan..."
                      {...field}
                      className=""
                    />
                  </FormControl>
                  <FormMessage className="text-[#FB2C36]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" !text-black">Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. ₹256" {...field} className="" />
                  </FormControl>
                  <FormMessage className="text-[#FB2C36]" />
                </FormItem>
              )}
            />

            <DialogFooter className=" space-x-1">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => reset()}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditExpenseDialog
