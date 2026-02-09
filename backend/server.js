import express from "express";
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
dotenv.config({quiet: true});
import {connectDB} from "./config/db.js"

const app = express()

const PORT = process.env.PORT || 5000

console.log("ennv is", PORT);
 

app.get("/", (req, res) => {
     res.send("hello wwworld")
})

app.use(express.json());

app.use("/api/users", authRoutes)



connectDB() 

app.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
})

