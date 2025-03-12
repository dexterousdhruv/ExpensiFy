import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api";
import useUserInfo from "@/hooks/use-user-info";
import { ClockArrowDown, ClockArrowUp } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

function DataTable<TData, TValue>({ columns }: DataTableProps<TData, TValue>) {
  const { userInfo } = useUserInfo();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: false,
    },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 1, 
    pageSize: 6,
  });

  const getAllExpenses = () => {
    const params = {
      sort: sorting.find((item) => item.id === "createdAt")?.desc
        ? "desc"
        : "asc",
      page: pagination.pageIndex,
      limit: pagination.pageSize,
    };
    return apiCall("GET", `/expense/all`, userInfo?.token, params);
  };

  // Generate query key
  const queryKey = useMemo(() => {
    return ["expenses", sorting, pagination];
  }, [sorting, pagination]);

  const { data: expenseData } = useQuery({
    queryKey: queryKey,
    queryFn: getAllExpenses,
    refetchOnMount: "always",
    select: (data) => data?.data,
    placeholderData: (previousData, _) => previousData,
  });

  const table = useReactTable({
    data: expenseData?.expenses || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    manualSorting: true,
    manualPagination: true,
    enableSortingRemoval: false,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: pagination.pageIndex - 1,
        pageSize: pagination.pageSize,
      },
    },
    rowCount: expenseData?.totalExpenses || 0,
    pageCount: expenseData?.totalPages || 0,
  });

  const sortValue = sorting.find((item) => item.id === "createdAt")?.desc;

  return (
    <div className="font-inter">
      <div className="flex gap-2 xl:gap-3 items-center py-4">
        <Input
          className="max-w-sm"
          placeholder="Filter by amount..."
          value={(table.getColumn("amount")?.getFilterValue() as string) || ""}
          onChange={(e) => table.getColumn("amount")?.setFilterValue(e.target.value)}
        />
        <Input
          className="max-w-sm"
          placeholder="Filter by category..."
          value={(table.getColumn("budgetCategory")?.getFilterValue() as string) || ""}
          onChange={(e) => table.getColumn("budgetCategory")?.setFilterValue(e.target.value)}
        />

        <Button
          variant="outline"
          className=""
          onClick={() => table.getColumn("createdAt")?.toggleSorting()}
        >
          {sortValue ? "Desc" : "Asc"}{" "}
          {sortValue ? <ClockArrowUp /> : <ClockArrowDown />}
        </Button>
      </div>
      <div className="rounded-md border overflow-hidden">
        <Table className="bg-white ">
          <TableHeader className="font-geist">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="py-1 lg:py-3 lg:text-[15px]"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow
                  key={row.id}
                  className={`lg:text-base py-3 font-normal ${
                    idx % 2 === 0
                      ? "bg-[#F4F4F5] text-zinc-700"
                      : " text-zinc-800"
                  }`}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 lg:py-5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center font-inter md:text-base"
                >
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setPagination((prev) => ({
              ...prev,
              pageIndex: prev.pageIndex - 1,
            }));
            table.previousPage();
          }}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setPagination((prev) => ({
              ...prev,
              pageIndex: prev.pageIndex + 1,
            }));
            table.nextPage();
          }}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default DataTable;
