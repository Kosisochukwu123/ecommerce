import express from "express";
const app = express()
const PORT = 4000
import  product  from "./product.js"
import checkout from "./checkout.js"

app.get("/", (req, res) => {
   res.send(product)
})


app.get('/api/checkout', (req, res) => {
    res.send(checkout)
})

app.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
})