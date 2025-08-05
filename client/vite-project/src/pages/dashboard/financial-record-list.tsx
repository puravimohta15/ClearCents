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
import { useMemo, useState } from "react"
import { useFinancialRecords, type FinancialRecord } from "@/contexts/financial-records-context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FinancialRecordListProps {
  records?: FinancialRecord[]; 
}

const EditableCell = ({ getValue, row, column, table }: any) => {
  const initialValue = getValue()
  const [value, setValue] = useState(initialValue)
  const [isEditing, setIsEditing] = useState(false)

  const onBlur = () => {
    setIsEditing(false)
    table.options.meta?.updateData(row.index, column.id, value)
  }

  return isEditing ? (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      autoFocus
      onBlur={onBlur}
      className="w-full border px-2 py-1 rounded"
    />
  ) : (
    <div onClick={() => setIsEditing(true)} className="cursor-pointer">
      {value}
    </div>
  )
}

const CategoryDropdown = ({ getValue, row, column, table }: any) => {
  const value = getValue()
  return (
    <Select
      value={value}
      onValueChange={(val) => {
        table.options.meta?.updateData(row.index, column.id, val)
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Rent">Rent</SelectItem>
        <SelectItem value="Food">Food</SelectItem>
        <SelectItem value="Salary">Salary</SelectItem>
        <SelectItem value="Utilities">Utilities</SelectItem>
        <SelectItem value="Entertainment">Entertainment</SelectItem>
        <SelectItem value="Travel">Travel</SelectItem>
        <SelectItem value="Others">Others</SelectItem>
      </SelectContent>
    </Select>
  )
}

const PaymentMethodDropdown = ({ getValue, row, column, table }: any) => {
  const value = getValue()
  return (
    <Select
      value={value}
      onValueChange={(val) => {
        table.options.meta?.updateData(row.index, column.id, val)
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select payment method" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="UPI">UPI</SelectItem>
        <SelectItem value="Debit/Credit Card">Debit/Credit Card</SelectItem>
        <SelectItem value="Cash">Cash</SelectItem>
      </SelectContent>
    </Select>
  )
}

export const FinancialRecordList = ({ records: propRecords }: FinancialRecordListProps) => {
  const { records: contextRecords, updateRecord, deleteRecord } = useFinancialRecords()

  const recordsToDisplay = propRecords ?? contextRecords

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
        cell: CategoryDropdown,
      },
      {
        header: "Payment Method",
        accessorKey: "paymentMethod",
        cell: PaymentMethodDropdown,
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: ({ getValue }: any) => {
          const date = getValue()
          return date ? new Date(date).toLocaleString() : ""
        },
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
    data: recordsToDisplay,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        const row = recordsToDisplay[rowIndex]
        if (!row || !row._id) return
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
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                No records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
