import { config } from "dotenv";
import express from "express"
import { errorResponse } from "./utils/error";
import authRouter from "./routes/auth.route";
import budgetRouter from "./routes/budget.route";
import expenseRouter from "./routes/expense.route";
import userRouter from "./routes/user.route";
const cors = require("cors")
const cookieParser = require("cookie-parser")

const app = express();
const PORT = process.env.PORT || 3000;
config()

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))
 
app.use('/files', express.static('./public/files'))
app.use(cookieParser())
app.use(express.json())


app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/budget", budgetRouter)
app.use("/api/expense", expenseRouter)
  
app.use(errorResponse)



app.listen(PORT, () => {
  console.log(`Yo! Server is running on port ${PORT} `)
}) 

  