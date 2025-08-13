import { useUser } from '@clerk/clerk-react';
import { createContext, useContext } from 'react';
import { useState, useEffect } from 'react';
export interface FinancialRecord {
    _id?: string;
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
    const [records, setRecords] = useState<FinancialRecord[]>([]);
    const {user} = useUser();
    const fetchRecords = async () => {
      if(!user || !user.id) return;
        try {
            const response = await fetch(`http://localhost:3000/financial-records/getAllByUserId/${user?.id}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched records:', data);
                setRecords(data);
            } else {
                console.error('Failed to fetch records:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };
    useEffect(() => {
        fetchRecords();
    },[user,records]);
    const addRecord = async (record: FinancialRecord) => {
        const response = await fetch("http://localhost:3000/financial-records/add", 
            {method: "POST",body: JSON.stringify(record),headers: {
                'Content-Type': 'application/json',}}
        );
        if(response.ok){
            console.log('Record added successfully:', record);
            const newRecord = await response.json();
            setRecords((prevRecords) => [...prevRecords, newRecord]);
        }
    };
    const updateRecord = async (id: string, updatedRecord: Partial<FinancialRecord>) => {

        const original = records.find(r => r._id === id);
        if (!original) return;
        const fullRecord = { ...original, ...updatedRecord };
    
        const response = await fetch(
          `http://localhost:3000/financial-records/${id}`,
          {
            method: "PUT",
            body: JSON.stringify(fullRecord),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
    
        try {
          if (response.ok) {
            const updated = await response.json();
            setRecords((prev) =>
              prev.map((record) => {
                if ((record._id) === id) {
                  return updated;
                } else {
                    console.log('Record not found for update:', record);
                  return record;
                }
              })
            );
          }
        } catch (err) 
        {
            console.error('Error updating record:', err);
        }
      };
      const deleteRecord = async (id: string) => {
        // if(!user || !user.id) return;
        const response = await fetch(
          `http://localhost:3000/financial-records/${id}`,
          {
            method: "DELETE",
          }
        );
    
        try {
          if (response.ok) {
            const deletedRecord = await response.json();
            setRecords((prev) =>
              prev.filter((record) => record._id !== deletedRecord._id)
            );
          }
        } catch (err) {}
      };
    
    return (
        <FinancialRecordsContext.Provider value={{ records, addRecord , updateRecord, deleteRecord
        }}>
            {children}
        </FinancialRecordsContext.Provider>
    )
}

export const useFinancialRecords = () => {
    const context = useContext<FinancialRecordsContextType | undefined>(FinancialRecordsContext);
    if(!context) {
        throw new Error('useFinancialRecords must be used within a FinancialRecordsProvider');
    }
    return context;
}
