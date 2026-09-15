import express from 'express'
import type { Express, Request, Response } from 'express'
import { connectDB } from './lib/db.js'

import env from './config/env.js'
import authRoutes from './routes/auth.route.js'

const PORT = env.PORT
const app: Express = express()

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
    connectDB()
})