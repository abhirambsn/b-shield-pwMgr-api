const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({ origin: ["http://127.0.0.1", "http://localhost:8080", "http://b-shield.local", "http://localhost", "https://127.0.0.1", "https://b-shield.local", "https://localhost"] }))
app.use(express.json())

// Routes
const authRoutes = require('./routers/Auth')
const pwdMgrRoutes = require('./routers/Passwords')

app.use("/api/user", authRoutes)
app.use("/api/password", pwdMgrRoutes)

module.exports = app