"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"
import { useMemo } from "react"
import { EditableCell } from "./editable-cell"
import { useFinancialRecords } from "@/contexts/financial-records-context"

export const FinancialRecordList = () => {
  const { records, updateRecord, deleteRecord } = useFinancialRecords()

  const columns = useMemo(
    () => [
      {
        header: "Description",
        accessorKey: "description",
        cell: EditableCell,
      },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: EditableCell,
      },
      {
        header: "Category",
        accessorKey: "category",
        cell: EditableCell,
      },
      {
        header: "Payment Method",
        accessorKey: "paymentMethod",
        cell: EditableCell,
      },
      {
        header: "Date",
        accessorKey: "date",
      },
      {
        header: "Delete",
        id: "delete",
        cell: ({ row }: any) => (
          <button
            onClick={() => deleteRecord(row.original._id)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        ),
      },
    ],
    [deleteRecord]
  )

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        const row = records[rowIndex]
        if (!row || !row._id){
            console.log(row, row._id)
            console.error("Row or row ID is undefined", row, rowIndex, columnId, value)
            return
        }
        if(columnId === "Payment Method" && value != "UPI" || value != "Debit/Credit Card" || value != "Cash") {
          console.error("Invalid payment method value:", value)
          return}
        updateRecord(row._id, { ...row, [columnId]: value })
      },
    },
  })

  return (
    <div className="p-4 border rounded-md shadow-md w-full max-w-4xl mx-auto">
      <Table>
        <TableCaption>Your financial records</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead className="text-left" key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow className="text-left" key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
