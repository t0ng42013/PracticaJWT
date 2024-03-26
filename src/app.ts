import dotenv  from "dotenv";
import  express  from "express";
import authRoutes from "./routes/authRoutes";
import clientsRoutes from "./routes/clientsRoutes";
dotenv.config()


const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/client', clientsRoutes);


export default app