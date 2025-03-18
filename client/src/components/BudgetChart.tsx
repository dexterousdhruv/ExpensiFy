import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import chroma from 'chroma-js'

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import moment from 'moment'
import { apiCall } from "@/lib/api";
import useUserInfo from "@/hooks/use-user-info";
import { useQuery } from "@tanstack/react-query";



function BarGraphComponent() {
  const { userInfo } = useUserInfo()
  
  const getMonthlyExpenses = () => {
    return apiCall("GET", '/expense/monthly', userInfo?.token)
  }

  const { data: expensesByBudget, } = useQuery({
    queryKey: ["monthlyExpenseByBudget"],
    queryFn: getMonthlyExpenses,
    select: data => data?.data,
    refetchOnMount: "always",
    placeholderData: (previousData, _) => previousData
  })

  const chartData = expensesByBudget?.map(({ budgetCategory, totalSpent, budgetLimit }: any) => ({
    budgetCategory,
    totalSpent,
    budgetLimit
  }))

  const colors = chroma.scale("Set3").mode('lab').colors(2);

  const chartConfig = {
    totalSpent: {
      label: "Total Expense",
      color: colors[0],
    },
    budgetLimit: {
      label: "Budget Limit",
      color: colors[1],
    },
  } satisfies ChartConfig


  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription className="text-center text-lg font-geist">{ moment().format("MMMM YYYY") }</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="budgetCategory"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
              className="font-inter"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="w-[180px]" indicator="line" />}
            />
            <Bar dataKey="totalSpent" fill="var(--color-totalSpent)" radius={4} />
            <Bar dataKey="budgetLimit" fill="var(--color-budgetLimit)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="">
        <div className="leading-none text-center mx-auto text-sm font-inter text-accent-foreground">
          Showing total expenses per budget for the current month
        </div>
      </CardFooter>
    </Card>
  )
}

export default BarGraphComponent
 
