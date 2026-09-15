import express from 'express'
import type { Router } from 'express'

import { signup, login, logout } from '../controller/auth.controller.js'

const router: Router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

export default router