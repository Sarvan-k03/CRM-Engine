const express = require('express')
const cors  = require('cors')
const bcrypt = require('bcryptjs')
const connectDB = require('./src/config/db')
const User = require('./src/models/User.models')
const authRoutes = require('./src/routes/auth.routes')
const campaignRoutes = require('./src/routes/campaign.routes')
const leadRoutes = require('./src/routes/lead.routes');
const clientRoutes = require('./src/routes/client.routes');

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

const seedDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@crm.com' })
    if (existingAdmin) {
      return
    }

    const hashedPassword = await bcrypt.hash('password123', 10)
    await User.create({
      name: 'Admin User',
      email: 'admin@crm.com',
      password: hashedPassword,
      role: 'Admin',
    })
    console.log('Seeded default admin user')
  } catch (error) {
    console.error('Seed admin error:', error.message)
  }
}

connectDB()
  .then(() => seedDefaultAdmin())
  .then(() => {
    app.use(express.json())
    app.use(cors())
    app.use('/api/auth', authRoutes);
    app.use('/api/campaigns', campaignRoutes);
    app.use('/api/leads', leadRoutes);
    app.use('/api/clients', clientRoutes);

    app.get('/',(req,res)=>{
      res.json({
        message: 'Lead Ingestion and campaign Tracking API is live'
      })
    })

    app.listen(PORT,()=>{
      console.log(`Server listening on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message)
    process.exit(1)
  })