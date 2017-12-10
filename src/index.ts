import { Routes } from './routes/routes';
import app from './App';
import mysql from '../node_modules/mysql';
import { get } from 'https';

const port = 6969;
//The routes file bound to the Server

let setRoutes = new Routes(app);
var Client = require('mysql');

var c = Client.createConnection({
    host:'127.0.0.1',
    user: 'root',
    password: '',
    database: 'schuleapi'
});

c.connect(function(err){
    if(err){
        console.error('Failed to connect');
    }
})

app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    return console.log(`Server listening on port:${port}`);
});

app.get('/initDatabase', function(req, res){

});
