"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData = {}, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultSorting?: SortingState;
  searchColumn?: string;
  searchPlaceholder: string;
  customFilter?: {
    label: string;
    key: string;
    value: any;
  };
  customFilters?: Array<{
    label: string;
    key: string;
    value: any;
  }>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  defaultSorting = [],
  searchColumn,
  searchPlaceholder = "Search...",
  customFilter,
  customFilters,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [activeFilters, setActiveFilters] = React.useState<
    Record<string, boolean>
  >({});

  // Initialize active filters
  React.useEffect(() => {
    if (customFilters) {
      const initialFilters = Object.fromEntries(
        customFilters.map((filter) => [filter.key, false]),
      );
      setActiveFilters(initialFilters);
    }
  }, [customFilters]);

  const filteredData = React.useMemo(() => {
    let result = data;

    // Handle legacy single filter
    if (customFilter && activeFilters[customFilter.key]) {
      result = result.filter(
        (item: any) => item[customFilter.key] === customFilter.value,
      );
    }

    // Handle multiple filters
    if (customFilters) {
      Object.entries(activeFilters).forEach(([key, isActive]) => {
        if (isActive) {
          const filterConfig = customFilters.find((f) => f.key === key);
          if (filterConfig) {
            result = result.filter(
              (item: any) => item[key] === filterConfig.value,
            );
          }
        }
      });
    }

    return result;
  }, [data, customFilter, customFilters, activeFilters]);

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4 space-x-4">
        {searchColumn && (
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchColumn)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        {/* Render legacy single filter if no multiple filters */}
        {customFilter && !customFilters && (
          <Button
            onClick={() => toggleFilter(customFilter.key)}
            variant={activeFilters[customFilter.key] ? "default" : "outline"}
          >
            {activeFilters[customFilter.key] ? "Show All" : customFilter.label}
          </Button>
        )}
        {/* Render multiple filters */}
        {customFilters && (
          <div className="flex gap-2">
            {customFilters.map((filter) => (
              <Button
                key={filter.key}
                onClick={() => toggleFilter(filter.key)}
                variant={activeFilters[filter.key] ? "default" : "outline"}
              >
                {activeFilters[filter.key]
                  ? `Hide ${filter.label}`
                  : filter.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      <div className="rounded-md border p-3">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className={row.original ? "bg-zinc-300 " : ""}
                >
                  {row.getVisibleCells().map((cell) => {
                    // Ensure cell value is treated as a string before performing operations
                    const cellValue = cell.getValue();
                    // Check if the cell value is a string and includes the "|" character
                    if (
                      typeof cellValue === "string" &&
                      cellValue.includes("|")
                    ) {
                      // Split the string by "|" and map over the parts to render them with <br /> in between
                      return (
                        <TableCell key={cell.id}>
                          {cellValue.split("|").map((part, index, array) => (
                            <React.Fragment key={index}>
                              {part}
                              {index < array.length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </TableCell>
                      );
                    } else {
                      // Use flexRender for other cell values
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex items-center justify-start space-x-2 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Column Visibility
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Pagination>
            <PaginationContent>
              <Button
                variant="ghost"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft />
                Previous
              </Button>
              {/* Display the current page number and total page count */}
              <div className="flex items-center justify-center text-sm text-zinc-500 px-4">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <Button
                variant="ghost"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                // disabled={!table.getCanNextPage()}
              >
                Next
                <ChevronRight />
              </Button>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
