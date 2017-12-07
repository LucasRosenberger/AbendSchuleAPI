import { testController } from './../controllers/testController';


export class Routes {
    private server;
    private testController: testController;
    constructor(app) {
        this.server = app;
        this.testController = testController.getInstance();
        this.setRoutes();
    }

    //All the routes
    private setRoutes() {
        this.server.get('/testRoute', this.testController.testRoute);
    }
}