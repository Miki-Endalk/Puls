import type { AuthenticatedUser } from "../models/User.js";

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser
            cookies: {
                jwt?: string;
            };
        }
    }
}

export {}