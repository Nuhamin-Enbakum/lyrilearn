const express = require('express')
const cors = require('cors')
require('dotenv').config()
const pool = require('./db')
const authRoutes = require('./routes/auth')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.send(`LyriLearn server is running 🎵 - Database connected at ${result.rows[0].now}`)
  } catch (err) {
    console.error(err)
    res.send('Database connection failed')
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})