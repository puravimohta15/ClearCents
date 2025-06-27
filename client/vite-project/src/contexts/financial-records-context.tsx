import { createContext } from 'react';
interface FinancialRecord {
    id?: string;
    userId: string;
    date: Date;
    amount: number;
    description: string;
    category: string;
    paymentMethod: string;
}
interface FinancialRecordsContextType {
    records: FinancialRecord[];
    addRecord: (record: FinancialRecord) => void;
    updateRecord: (id: string, updatedRecord: Partial<FinancialRecord>) => void;
    deleteRecord: (id: string) => void;
}
export const FinancialRecordsContext = createContext<FinancialRecordsContextType|undefined>(undefined);

export const FinancialRecordsProvider = ({children}: {children: React.ReactNode}) => {
    return (
        <FinancialRecordsContext.Provider value={{
            records: [],
            addRecord: (record: FinancialRecord) => {
                console.log('Adding record:', record);
            },  
            updateRecord: (id: string, updatedRecord: Partial<FinancialRecord>) => {
                console.log('Updating record:', id, updatedRecord);
            },
            deleteRecord: (id: string) => {
                console.log('Deleting record:', id);
            }
        }}>
            {children}
        </FinancialRecordsContext.Provider>
    )
}