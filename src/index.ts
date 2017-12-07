import { Routes } from './routes/routes';
import app from './App';

const port = 6969;
//The routes file bound to the Server

let setRoutes = new Routes(app);

app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    return console.log(`Server listening on port:${port}`);
});
