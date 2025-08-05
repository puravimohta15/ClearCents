"use client";

import { useState, useEffect, useMemo } from "react";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { FinancialRecordForm } from "./financial-record-form";
import { FinancialRecordList } from "./financial-record-list";
import { ChartRadialShape } from "@/components/ui/radial-chart";
import { useFinancialRecords, type FinancialRecord } from "@/contexts/financial-records-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChartBarExpenses } from "@/components/ui/bar-chart";
import { ModeToggle } from "@/components/mode-toggle";
import { Calendar22 as DatePicker } from "@/components/ui/date-picker"; 

export const Dashboard = () => {
  const { user } = useUser();
  const { records } = useFinancialRecords();

  const [budget, setBudget] = useState<number>(0);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  // New state for date filtering
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  // State for month selection in chart
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined);

  // Fetch budget for user and month
  useEffect(() => {
    if (!user?.id) return;
    const currentMonth = selectedMonth
      ? `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, "0")}`
      : month;

    fetch(`http://localhost:3000/financial-records/${user.id}/${currentMonth}`)
      .then((res) => res.json())
      .then((data) => setBudget(data?.amount || 0));
  }, [user, month, selectedMonth]);

  // Update budget
  const handleBudgetChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBudget = Number(e.target.value);
    setBudget(newBudget);
    const currentMonth = selectedMonth
      ? `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, "0")}`
      : month;

    if (user?.id) {
      await fetch("http://localhost:3000/financial-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, month: currentMonth, amount: newBudget }),
      });
      fetch(`http://localhost:3000/financial-records/${user.id}/${currentMonth}`)
        .then((res) => res.json())
        .then((data) => setBudget(data?.amount || 0));
    }
  };

  // Calculate total spent for the selected month
  const totalMonthly = useMemo(() => {
    const currentMonth = selectedMonth
      ? `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, "0")}`
      : month;

    return records.reduce((total, record) => {
      const recordMonth = record.date?.toString().slice?.(0, 7);
      if (recordMonth === currentMonth && record.amount < 0) {
        return total + -record.amount;
      }
      return total;
    }, 0);
  }, [records, month, selectedMonth]);

  // Filtered records for list based on from and to date
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const recordDate = record.date ? new Date(record.date) : null;
      if (!recordDate) return false;

      if (fromDate && recordDate < fromDate) return false;
      if (toDate && recordDate > toDate) return false;

      return true;
    });
  }, [records, fromDate, toDate]);

  return (
    <div className="dashboard-container">
      <div className="Navbar flex justify-between items-center">
        <ModeToggle />
        <h2 className="text-lg font-semibold">Finance Tracker</h2>
      </div>

      <h1>Welcome {user?.firstName}! This is your dashboard</h1>
      <SignOutButton />

      {/* Budget and Month Selector */}
      <div className="mt-4 flex flex-col gap-4">
        <label className="flex items-center gap-2">
          Budget for selected month: ₹
          <input
            type="number"
            value={budget}
            onChange={handleBudgetChange}
            className="border px-2 py-1 rounded w-32"
          />
        </label>

        <div>
          <span className="block mb-2">Select Month for Chart:</span>
          <DatePicker
            date={selectedMonth}
            setDate={setSelectedMonth}
          />
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">Add Expense</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <FinancialRecordForm />
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row gap-6 my-6">
        <div className="flex-1">
          <ChartBarExpenses records={filteredRecords} />
        </div>
        <div className="flex-1 flex items-center justify-center ">
          <ChartRadialShape
            percent={budget > 0 ? Math.min((totalMonthly / budget) * 100, 100) : 0}
            spent={totalMonthly}
            budget={budget}
          />
        </div>
      </div>

      <div className="mt-6 flex-1 flex md:flex-row items-center justify-center">
        <div className="p-4">
          <span className="block mb-2">From Date:</span>
          <DatePicker
            date={fromDate}
            setDate={setFromDate}
          />
        </div>
        <div className="p-4">
          <span className="block mb-2">To Date:</span>
          <DatePicker
            date={toDate}
            setDate={setToDate}
          />
        </div>
      </div>
      <FinancialRecordList records={filteredRecords} />
    </div>
  );
};
