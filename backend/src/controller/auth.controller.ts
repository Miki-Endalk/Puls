import type { Request, Response } from "express"

export const signup = async (
    req: Request, 
    res: Response
) => {
    res.send('Signup')
}

export const login = async (
    req: Request, 
    res: Response
) => {
    res.send('Login')
}

export const logout = (
    req: Request, 
    res: Response
) => {
    res.send('Logout')
}