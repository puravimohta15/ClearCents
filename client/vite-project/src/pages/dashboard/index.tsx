import { useState, useEffect, useMemo } from 'react';
import { SignOutButton, useUser } from '@clerk/clerk-react'
import { FinancialRecordForm } from './financial-record-form';
import { FinancialRecordList } from './financial-record-list';
import { ChartRadialShape } from "@/components/ui/radial-chart"
import { useFinancialRecords, type FinancialRecord } from "@/contexts/financial-records-context"
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChartBarExpenses } from "@/components/ui/bar-chart"; // Add this import

export const Dashboard = () => {
    const { user } = useUser();
    const { records } = useFinancialRecords();
    const [budget, setBudget] = useState<number>(0);
    const [month, setMonth] = useState(() => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });

    // Fetch budget for user and month
    useEffect(() => {
      if (!user?.id) return;
      fetch(`http://localhost:3000/financial-records/${user.id}/${month}`)
        .then(res => res.json())
        .then(data => setBudget(data?.amount || 0));
    }, [user, month]);

    // Update budget
    const handleBudgetChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const newBudget = Number(e.target.value);
      setBudget(newBudget);
      if (user?.id) {
        await fetch("http://localhost:3000/financial-records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, month, amount: newBudget }),
        });
        fetch(`http://localhost:3000/financial-records/${user.id}/${month}`)
          .then(res => res.json())
          .then(data => setBudget(data?.amount || 0));
      }
    };

    // Calculate total spent for the month
    const totalMonthly = useMemo(() => {
      let totalAmount = 0;
      records.forEach((record) => {
        const recordMonth = record.date?.toString().slice?.(0, 7); // "YYYY-MM"
        if (recordMonth === month) totalAmount += record.amount;
      });
      return totalAmount;
    }, [records, month]);

    return (
      <div className="dashboard-container">
        <h1>Welcome {user?.firstName}! This is your dashboard</h1>
        <SignOutButton />
        <div>
          <label>
            Budget for {month}: ₹
            <input
              type="number"
              value={budget}
              onChange={handleBudgetChange}
              style={{ marginLeft: 8, width: 120 }}
            />
          </label>
        </div>
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Expense</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Add Expense</DialogTitle>
                </DialogHeader>
                <FinancialRecordForm />
            </DialogContent>
        </Dialog>

        {/* Insert Bar Chart above Radial Chart */}
        <div className="flex flex-col md:flex-row gap-6 my-6">
            <div className="flex-1">
                <ChartBarExpenses records={records} />
            </div>
            <div className="flex-1 flex items-center justify-center ">
                <ChartRadialShape
                percent={budget > 0 ? Math.min((totalMonthly / budget) * 100, 100) : 0}
                spent={totalMonthly}
                budget={budget}
                />
            </div>
        </div>

        <FinancialRecordList />
      </div>
    );
};

