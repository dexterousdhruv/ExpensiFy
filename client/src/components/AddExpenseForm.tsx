import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDollarSign } from "lucide-react";
import useRefetch from "@/hooks/use-refetch";
import useUserInfo from "@/hooks/use-user-info";
import axios from "axios";
import { apiCall, apiUrl } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Budget } from "@/lib/types";
import { formatCurrency } from "@/lib/helpers";
import { useEffect, useState } from "react";

type ExpenseValues = {
  expenseName: string,
  budgetCategory: string,
  amount: number,
};

type Props = {
  budgetIdProp?: string;
};

// generate budget schema dynamically
const budgetSchema: any = (maxAmount: number) => z.object({
  expenseName: z.string().trim().min(2, {
    message: "This field is required.",
  }),
  budgetCategory: z.string().trim().min(2, {
    message: "This field is required.",
  }),
  amount: z.coerce.number().min(1, {
    message: "Amount must be greater than 0.",
  }).max(maxAmount, {
    message: `Amount must not exceed ${formatCurrency(maxAmount * 100)}`,
  }),
});

function AddExpenseForm({ budgetIdProp }: Props) {
  const [maxBudgetLimit, setMaxBudgetLimit] = useState<number>(0)

  const form = useForm<ExpenseValues>({
    resolver: zodResolver(budgetSchema(maxBudgetLimit)),
    defaultValues: {
      expenseName: "",
      budgetCategory: "",
      amount: 0,
    },
  });

  const { reset } = form;
  const refetch = useRefetch();
  const { userInfo: { token }} = useUserInfo();

  const createNewExpense = (expenseData: any) => {
    return axios.post(`${apiUrl}/expense/create`, expenseData, {
      headers: {
        Access_Token: token,
      },
    });
  };

  const getAllBudgets = () => {
    return apiCall("GET", `/budget/all`, token);
  };

  const { mutate: newExpense } = useMutation({
    mutationFn: createNewExpense,
    onSuccess: () => {
      toast.success("Expense added successfully! ");
      reset();
      refetch();
    },
    onError: () => {
      toast.error("Failed to add expense!");
      reset();
    },
  });

  const { data } = useQuery({
    queryKey: ["budgets"],
    queryFn: getAllBudgets,
  });
  
  const budgets: Budget[] | any = data?.data || [];

  // Validation to limit expense amount within budget limit
  const [watchBudgetCategory, watchAmount] = useWatch({
    control: form.control,
    name: ["budgetCategory", "amount"],
  });
  

  useEffect(() => {
    if (watchBudgetCategory && budgets.length > 0) {
      const budgetId = watchBudgetCategory.split(" ")[1];
      const { budgetLimit, amountSpent}: Budget = budgets.find(({ id }: Budget) => id === budgetId)
      const remainingLimit = (budgetLimit - amountSpent) > 0 ? (budgetLimit - amountSpent) / 100 : 0

      setMaxBudgetLimit(remainingLimit);
    }
  }, [watchBudgetCategory, budgets, watchAmount])

  
  function onSubmit(values: ExpenseValues) {
    const [budgetCategory, budgetId] = values?.budgetCategory.split(" ");
    
    newExpense({
      ...values,
      budgetCategory,
      budgetId,
    });

  }

  return (
    <Card className=" w-full font-inter border rounded-md">
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 sm:space-y-6 "
          >
            <FormField
              control={form.control}
              name="expenseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-inter !text-black">
                    Expense Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. NIKE Air Jordans..." {...field} />
                  </FormControl>
                  <FormMessage className="text-[#FB2C36]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budgetCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-inter !text-black">
                    Budget Category
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="font-inter">
                      {!!budgets &&
                        budgets?.map((item: Budget) => {
                          if (budgetIdProp && item.id !== budgetIdProp) return;
                          else { 
                            return (
                              <SelectItem
                                key={item?.id}
                                value={`${item?.budgetCategory} ${item?.id}`}
                              >
                                {item?.budgetCategory}
                              </SelectItem>
                            );
                          }
                        })}
                    </SelectContent>
                  </Select>

                  <FormMessage className="text-[#FB2C36]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-inter !text-black">
                    Amount
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Amount" {...field} />
                  </FormControl>
                  <FormMessage className="text-[#FB2C36]" />
                </FormItem>
              )}
            />
            <Button type="submit" className="font-inter bg-zinc-800 ">
              Add Expense <BadgeDollarSign />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default AddExpenseForm;

