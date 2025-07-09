"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import { z } from "zod"
import { useUser } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useState } from "react"
import { useFinancialRecords } from "@/contexts/financial-records-context"


const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number(),
  category: z.enum(["Food", "Rent", "Salary", "Utilities", "Entertainment", "Others"]),
  paymentMethod: z.enum(["UPI", "Debit/Credit Card", "Cash"]),
})

export const FinancialRecordForm = () => {
    const { user } = useUser();
    // const [description, setDescription] = useState<string>("");
    // const [amount, setAmount] = useState<number>(0);
    // const [category, setCategory] = useState<string>("");   
    // const [paymentMethod, setPaymentMethod] = useState<string>("");
    const {addRecord} = useFinancialRecords();
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      category: "Food",
      paymentMethod: "UPI",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newRecord = {
        userId : user?.id ?? "",
        date : new Date(),
        amount: values.amount,
        category: values.category,  
        description: values.description,  
        paymentMethod: values.paymentMethod,
    }
    addRecord(newRecord)
    console.log("Form Submitted", values)
    form.reset({
        description: "",
        amount: 0,
        category: "Food",
        paymentMethod: "UPI",
      });
  }

  return (

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">Description</FormLabel>
                  <FormControl className="text-gray-400">
                    <Input placeholder="e.g., Grocery shopping" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">Amount</FormLabel>
                  <FormControl className="text-gray-400">
                    <Input type="number" placeholder="e.g., 1500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="text-gray-600">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="text-gray-400">
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Rent">Rent</SelectItem>
                      <SelectItem value="Salary">Salary</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Method */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">Payment Method</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="text-gray-400">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="text-gray-400">
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Debit/Credit Card">Debit/Credit Card</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </Form>

  )
}
