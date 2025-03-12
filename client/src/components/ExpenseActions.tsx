import { Expense } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PencilLine, Trash2 } from 'lucide-react';
import EditExpenseDialog from './EditExpenseDialog';
import DeleteExpenseDialog from './DeleteExpenseDialog';
import { Button } from './ui/button';

type Props = {
  expense: Expense
}

const ExpenseActions = ({ expense }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className=" font-inter">
        <DropdownMenuLabel className="font-geist">
          Actions
        </DropdownMenuLabel>
        {/* Edit */}
        <DropdownMenuItem asChild>
          <EditExpenseDialog expense={expense}>
            <div className="py-1.5 leading-5 px-2 rounded-sm mt-0.5 w-31 flex gap-1 text-sm justify-between items-center cursor-default hover:bg-zinc-100">
              Edit &nbsp;
              <PencilLine size={15} />
            </div>
          </EditExpenseDialog>
        </DropdownMenuItem>

        {/* Delete */}
        <DropdownMenuItem asChild>
          <DeleteExpenseDialog expense={expense}>
            <div className="py-1.5 leading-5 px-2 rounded-sm mt-0.5 w-31 flex gap-1 text-sm  justify-between items-center text-red-600 hover:bg-[#ffeaeb]">
              Delete <Trash2 className="" size={14} />
            </div>
          </DeleteExpenseDialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ExpenseActions