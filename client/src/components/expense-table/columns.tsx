import { formatCurrency } from "@/lib/helpers";
import { Expense } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import ExpenseActions from "../ExpenseActions";
// import { ArrowUpDown } from "lucide-react"
import { Button } from "../ui/button";
import { format } from "date-fns";
import {  CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "expenseName",
    header: "Expense Name",
  },
  {
    accessorKey: "amount",
    header: () => "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount")) as number;
      const formatted = formatCurrency(amount);

      return <div>{formatted}</div>;
    },
    filterFn: (row, _, filterValue) => {
      const isNumber = /^[0-9]*\.?[0-9]+$/.test(filterValue);
      const amount = (row.getValue("amount") as number) / 100
      return isNumber && amount === +filterValue
    }
  },
  {
    accessorKey: "budgetCategory",
    header: "Budget Category",
    filterFn: (row, _, filterValue) => {
      const lowercase = (s: string) => s.toLowerCase().trim()
      const isNumber = /^[0-9]*\.?[0-9]+$/.test(filterValue);
      const category = row.getValue("budgetCategory") as string
      const isPresent = lowercase(category).includes(lowercase(filterValue))
      return !isNumber && isPresent;
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      const [date, setDate] = useState<Date>();
      
      return (
        <div className="flex items-center gap-1 max-h-5">
          Date
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                className={cn(
                  " justify-start text-left font-normal !py-1 ",
                  date && "text-zinc-900"
                )}
              >
                <CalendarIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(e) => {
                  setDate(e as Date);
                  column?.setFilterValue(format(e as Date, "dd/MM/yyyy"));
                  console.log(format(e as Date, "dd/MM/yyyy"));
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      const formatted = formatDate(createdAt, "dd/MM/yyyy hh:mm");

      return <div >{formatted}</div>;
    },
    filterFn: (row, _, filterValue) => {
      if (!filterValue) return true;
      const createdAt = row.getValue("createdAt") as string;
      const formatted = formatDate(createdAt, "dd/MM/yyyy");
      return formatted === filterValue;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const expense = row.original;
      return <ExpenseActions expense={expense} />;
    },
  },
];
