import express from 'express'
import type { Express, Request, Response } from 'express'
import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'

import env from './config/env.js'
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'

const PORT = env.PORT
const app: Express = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
    connectDB()
})