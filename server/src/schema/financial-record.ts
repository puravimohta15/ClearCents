import mongoose from "mongoose";

interface FinancialRecord {
    userId: string;
    date: Date;
    amount: number;
    description: string;
    category: string;
    paymentMethod: string;
}
const financialRecordSchema = new mongoose.Schema<FinancialRecord>({
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    paymentMethod: { type: String, required: true }
});

const FinancialRecordModel = mongoose.model<FinancialRecord>("FinancialRecord", financialRecordSchema);

export default FinancialRecordModel;