type User = {
    id: number
}

declare namespace Express {
    export interface Request {
        user?: User
    }
}