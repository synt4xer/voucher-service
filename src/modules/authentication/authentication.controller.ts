import { Request, Response } from "express";

class AuthenticationController {
    login = async (req: Request, res: Response) => {
        res.send({
            hostname: req.hostname,
            path: req.path,
            method: req.method
        })
    }
}

export default AuthenticationController;
