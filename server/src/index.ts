//PW: n1s6QMjIo7AxJs0q
import express, {Express} from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/financia-records';
import cors from 'cors';
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI: string = process.env.MONGO_URI || 'mongodb+srv://puravimohta5:n1s6QMjIo7AxJs0q@clearcents.zmgctmi.mongodb.net/';

app.use(express.json());
app.use(cors()); // Enable CORS for all routes
mongoose.connect(MONGO_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

app.use("/financial-records", router);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});