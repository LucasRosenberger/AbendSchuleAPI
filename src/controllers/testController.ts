import { Request, Response } from "express";

export class testController {
    private static instance: testController;
    public static getInstance(): testController {
        if (!this.instance)
            this.instance = new testController()
        return this.instance;
    }
    private constructor() {
        console.log("TestControllerInitialized")
    }
    public testRoute(req: Request, res: Response) {
        res.send("Hello it worked!")
    }
}