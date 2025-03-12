import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useMutation } from '@tanstack/react-query'
import { apiUrl } from "@/lib/api";
import axios from "axios";
import toast from "react-hot-toast";
import useRefetch from "@/hooks/use-refetch";
import useUserInfo from "@/hooks/use-user-info";

const budgetSchema = z.object({
  budgetCategory: z.string().trim().min(2, {
    message: "This field is required.",
  }),
  budgetLimit: z.coerce.number().min(1, {
    message: "Limit must be greater than 0.",
  }),
});

type BudgetValues = z.infer<typeof budgetSchema>;

function AddBudgetForm() {
  const form = useForm<BudgetValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      budgetCategory: "",
      budgetLimit: 0,
    },
  });
  const { reset } = form
  const refetch = useRefetch()
  const { userInfo: { token } } = useUserInfo()

  const createNewBudget = (budgetData: BudgetValues): Promise<any> => {
    return axios.post(`${apiUrl}/budget/create`, budgetData, {
      headers: {
        Access_Token: token
      }
    })
  }

  const { mutate: newBudget } = useMutation({
    mutationFn: createNewBudget,
    onSuccess: () => {
      toast.success("Budget created successfully! ")
      reset()
      refetch()
    },
    onError: () => {
      toast.error('Failed to create budget!')
    }
  })

  function onSubmit(values: BudgetValues) {
    newBudget(values)
  }

  return (
    <Card className="w-full font-inter rounded-md border h-fit" >
      <CardHeader>
        <CardTitle>Create New Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
      

            <FormField
              control={form.control}
              name="budgetCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-inter !text-black">Budget Category</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. Groceries..." {...field} />
                  </FormControl>
                  <FormMessage className="text-[#FB2C36]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budgetLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-inter !text-black">Budget Limit</FormLabel>
                  <FormControl>
                    <Input type="number"  placeholder="E.g. ₹256" {...field} />
                  </FormControl>
                  <FormMessage className="text-[#FB2C36]" />
                </FormItem>
              )}
            />
            <Button  type="submit" className="font-inter bg-zinc-800 " >
              Add Budget <PlusCircle />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default AddBudgetForm
