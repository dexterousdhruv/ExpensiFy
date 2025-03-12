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
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PencilLine } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiCall } from "@/lib/api";
import toast from "react-hot-toast";
import useRefetch from "@/hooks/use-refetch";
import useUserInfo from "@/hooks/use-user-info";
import { Budget } from "@/lib/types";
import { useEffect } from "react";

const budgetSchema = z.object({
  budgetCategory: z.string().trim().min(2, {
    message: "This field is required.",
  }),
  budgetLimit: z.coerce.number().min(1, {
    message: "Limit must be greater than 0.",
  }),
});

type BudgetValues = z.infer<typeof budgetSchema>;
type Props = {
  budget: Budget;
};
function EditBudgetForm({ budget }: Props) {
  const {
    userInfo: { token },
  } = useUserInfo();

  const form = useForm<BudgetValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      budgetCategory: "",
      budgetLimit: 0,
    },
  });
  const { reset, setValue } = form;
  const refetch = useRefetch();

  const updateBudget = (budgetData: BudgetValues): Promise<any> => {
    return apiCall(
      "PUT",
      `/budget/update/${budget?.id}`,
      token,
      false,
      budgetData
    );
  };

  const { mutate: newBudget } = useMutation({
    mutationFn: updateBudget,
    onSuccess: () => {
      toast.success("Budget updated successfully! ");
      refetch();
    },
    onError: () => {
      toast.error("Failed to update budget");
      refetch;
    },
  })

  const [watchCategory, watchLimit] = useWatch({
    control: form.control,
    name: ["budgetCategory", "budgetLimit"]
  })

  useEffect(() => {
    if (watchCategory === "")
      setValue("budgetCategory", budget?.budgetCategory)

    if (watchLimit === 0)
      setValue("budgetLimit", budget?.budgetLimit/100)

  }, [])
  
 


  function onSubmit(values: BudgetValues) {
    const { budgetCategory, budgetLimit } = budget;
    if ( 
      JSON.stringify(values) !==
      JSON.stringify({ budgetCategory, budgetLimit: budgetLimit / 100 })
    )
      newBudget(values);
    reset(values);
  }

  return (
    <Card className="w-full font-inter rounded-md border h-fit">
      <CardHeader>
        <CardTitle>Update Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 sm:space-y-6"
          >
            <FormField
              control={form.control}
              name="budgetCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-inter !text-black">
                    Budget Category
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="dropdown"
                      placeholder="e.g Groceries..."
                      {...field}
                    />
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
                  <FormLabel className="font-inter !text-black">
                    Budget Limit
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0.0}
                      placeholder="e.g ₹256"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[#FB2C36]" />
                </FormItem>
              )}
            />
            <Button type="submit" className="font-inter bg-zinc-800 ">
              Update Budget <PencilLine />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default EditBudgetForm;
