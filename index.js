const express = require('express')
const cors  = require('cors')
const connectDB = require('./src/config/db')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>{
  res.json({
    message: 'Lead Ingestion and campaign Tracking API is live'
  })
})

app.listen(PORT,()=>{
  console.log(`Server listening on port ${PORT}`)
})