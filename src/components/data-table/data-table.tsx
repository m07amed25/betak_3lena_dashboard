"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  SortingState
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDataTableParams } from "@/hooks/use-data-table-params"
import { DataTablePagination } from "./data-table-pagination"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
}: DataTableProps<TData, TValue>) {
  const { page, setPage, pageSize, setPageSize, sort, setSort } = useDataTableParams()

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: pageSize,
  }

  const sorting: SortingState = sort ? [
    {
      id: sort.split('.')[0],
      desc: sort.split('.')[1] === 'desc',
    }
  ] : []

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater(pagination)
        setPage(newState.pageIndex + 1)
        setPageSize(newState.pageSize)
      } else {
        setPage(updater.pageIndex + 1)
        setPageSize(updater.pageSize)
      }
    },
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater(sorting)
        if (newState.length > 0) {
          setSort(`${newState[0].id}.${newState[0].desc ? 'desc' : 'asc'}`)
        } else {
          setSort(null)
        }
      } else {
        if (updater.length > 0) {
          setSort(`${updater[0].id}.${updater[0].desc ? 'desc' : 'asc'}`)
        } else {
          setSort(null)
        }
      }
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
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
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
