import { AuthenticatedUser } from "../models/User.ts";

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