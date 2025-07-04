import express from 'express'
import crypto from 'crypto'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(cors())

app.use(express.json())

let users = []


app.post('/auth/register', (req, res) => {
  const { email, username, password } = req.body

  if (!email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const userExists = users.find(user => user.email === email)
  if (userExists) {
    return res.status(409).json({ message: 'User already exists' })
  }

  users.push({ email, username, password })

  res.status(201).json({ message: 'User created successfully' })
})


app.post('/auth/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = users.find(u => u.email === email && u.password === password)
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = crypto.randomBytes(16).toString('hex')

  res.json({
    access_token: token,
    token_type: 'bearer'
  })
})


app.get('/test', (req, res) => {
  res.json({ message: 'Всё работает' })
})

app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`)
})