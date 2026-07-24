const express = require('express')
const cors  = require('cors')
const connectDB = require('./src/config/db')
const authRoutes = require('./src/routes/auth.routes')
const campaignRoutes = require('./src/routes/campaign.routes')
const leadRoutes = require('./src/routes/lead.routes');

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(express.json())
app.use(cors())
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/leads', leadRoutes);

app.get('/',(req,res)=>{
  res.json({
    message: 'Lead Ingestion and campaign Tracking API is live'
  })
})

app.listen(PORT,()=>{
  console.log(`Server listening on port ${PORT}`)
})