import express from 'express'
import type { Router } from 'express'

import { signup, login, logout, onboard } from '../controller/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router: Router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.post("/onboarding", protectRoute, onboard)
export default router