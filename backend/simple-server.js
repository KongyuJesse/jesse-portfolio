const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.post('/api/auth/login', (req, res) => {
  console.log('Login attempt:', req.body)
  
  if (req.body.email === 'kongyujesse@gmail.com') {
    res.json({
      token: 'test-token-123',
      user: {
        id: '1',
        username: 'kongyujesse',
        email: 'kongyujesse@gmail.com',
        role: 'admin'
      }
    })
  } else {
    res.status(401).json({ message: 'Invalid credentials' })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' })
})

app.listen(5000, () => {
  console.log('Simple server running on port 5000')
})