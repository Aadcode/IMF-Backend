import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import gadgetRoutes from './routes/gadget.routes.js';
import cookieparser from "cookie-parser"

const app = express();


dotenv.config();
app.use(cors());
app.use(cookieparser())
app.use(express.json());

app.use('/api/v1', userRoutes);
app.use('/api/v1', gadgetRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Listening at ${process.env.PORT}`);
});
