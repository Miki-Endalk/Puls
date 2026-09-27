import express from 'express'
import type { Request, Response, Router } from 'express'

import { signup, login, logout, onboard } from '../controller/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'
import { success } from 'zod'

const router: Router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.post("/onboarding", protectRoute, onboard)

// check if user is logged in
router.get("/me", protectRoute, (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        user: req.user
    })
})
export default router