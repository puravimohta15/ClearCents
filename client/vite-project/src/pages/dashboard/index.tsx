import { useUser } from '@clerk/clerk-react'
import { FinancialRecordForm } from './financial-record-form';
import { FinancialRecordList } from './financial-record-list';
import { Button } from '@/components/ui/button';
export const Dashboard = () => {
    const { user } = useUser();
    return <div className="dashboard-container">
        <h1>Welcome { user?.firstName }! This is your dashboard</h1>
        <Button className="mb-4" variant="outline">Add Financial Record</Button>
        <FinancialRecordForm />
        <FinancialRecordList />
    </div>
}