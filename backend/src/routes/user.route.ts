import express from "express"
import type { Request, Response, Router } from 'express'
import { protectRoute } from "../middleware/auth.middleware.js"

const router: Router = express.Router()

// apply auth middleware to all routes
router.use(protectRoute)

router.get("/", (req, res) => { res.json("success") })
router.get("/friends", (req, res) => { res.json("success") })

export default router