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

const budgets = [
  {
      "budgetCategory": "Fitness",
      "totalSpent": 380000,
      "budgetLimit": 500000,
      "expenses": [
          {
              "expenseName": "Swiss Ladder",
              "amount": 260000
          },
          {
              "expenseName": "Doctor Visit",
              "amount": 35000
          },
          {
              "expenseName": "Gym membership Pro",
              "amount": 85000
          }
      ]
  },
  {
      "budgetCategory": "Food",
      "totalSpent": 220000,
      "budgetLimit": 500000,
      "expenses": [
          {
              "expenseName": "Grocery shopping",
              "amount": 120000
          },
          {
              "expenseName": "Restaurant dining",
              "amount": 100000
          }
      ]
  },
  {
      "budgetCategory": "Entertainment",
      "totalSpent": 205000,
      "budgetLimit": 300000,
      "expenses": [
          {
              "expenseName": "The Karate Kid 3 Movie",
              "amount": 45000
          },
          {
              "expenseName": "Concert tickets",
              "amount": 80000
          },
          {
              "expenseName": "Movie tickets",
              "amount": 80000
          }
      ]
  },
  {
      "budgetCategory": "Travel",
      "totalSpent": 80000,
      "budgetLimit": 300000,
      "expenses": [
          {
              "expenseName": "Flight tickets",
              "amount": 50000
          },
          {
              "expenseName": "Hotel booking",
              "amount": 30000
          }
      ]
  },
  {
      "budgetCategory": "Books",
      "totalSpent": 47000,
      "budgetLimit": 500000,
      "expenses": [
          {
              "expenseName": "The Silent Killer - Alex Michalides",
              "amount": 25000
          },
          {
              "expenseName": "Yaar Papa - Divya Prakash Dubey 📙",
              "amount": 22000
          }
      ]
  }
]




import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import moment from 'moment'
import { apiCall } from "@/lib/api";
import useUserInfo from "@/hooks/use-user-info";
import { useQuery } from "@tanstack/react-query";
import Error from "./Error";
import ErrorSidebar from "./ErrorSidebar";




function BarGraphComponent() {
  const { userInfo } = useUserInfo()
  
  const getMonthlyExpenses = () => {
    return apiCall("GET", '/expense/monthly', userInfo?.token)
  }

  const { data: expensesByBudget } = useQuery({
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
 
