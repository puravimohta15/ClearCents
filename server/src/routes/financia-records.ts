import express, { Request, Response } from "express";
import FinancialRecordModel from '../schema/financial-record';

const router: express.Router = express.Router();

router.get("/getAllByUserId/:userId", async(req: Request<{ userId: string }>,res: Response) => {
    try {
        const userId = req.params.userId;
        const records = await FinancialRecordModel.find({ userId: userId });
        if (!records || records.length === 0) {
            res.status(404).json({ message: "No financial records found for this user." });
        }
        res.status(200).json(records);
    } catch (error) {
        console.error("Error fetching financial records:", error);
         res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/add", async (req: Request, res: Response) => {
    try{
        const newRecordBody= req.body;
        const newRecord = new FinancialRecordModel(newRecordBody);
        const savedRecord = await newRecord.save();
        res.status(200).send(savedRecord);
    } catch (error) {
        console.error("Error fetching financial records:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/:userId",async (req: Request<{ userId: string }>, res: Response) => {
    try{
        const idText = req.params.userId;
        const newRecordBody= req.body;
        const record = await FinancialRecordModel.findByIdAndUpdate(idText,newRecordBody,{ new: true });
        if(!record) {
            res.status(404).json({ message: "Financial record not found." })
        }
        res.status(200).send(record);
    } catch (error) {
        console.error("Error fetching financial records:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/:userId", async (req: Request<{ userId: string }>, res: Response) => {
    try {
        const idText = req.params.userId;
        const record = await FinancialRecordModel.findByIdAndDelete(idText);
        if (!record) {
            res.status(404).json({ message: "Financial record not found." });
        }
        res.status(200).send(record);
    } catch (error) {
        console.error("Error deleting financial record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
export default router;