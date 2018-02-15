import { Routes } from './routes/routes';
import app from './App';
import mysql from '../node_modules/mysql';
import { get } from 'https';

const port = 6969;
//The routes file bound to the Server

let setRoutes = new Routes(app);
const Client = require('mysql');

var c = Client.createConnection({
    host:'127.0.0.1',
    user: 'root',
    password: '1221',
    database: 'schuleapi'
});

c.connect(function(err){
    if(err){
        console.error('Failed to connect');
    }
    console.log("Database are connected.")
})

app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    return console.log(`Server listening on port:${port}`);
});

app.get('/initDatabase', function(req, res){

});

app.get('/getKurseABIF', function(req, res){
    c.query('SELECT id, Kolleg, Fach, Sem from gegenstand where klasse = "ABIF"', function (erre, rows, fields){
		if(erre) {
			res.send('');
		}
		else if(rows == ''){
			res.send('');
		}
		else{
			res.send(JSON.stringify(rows));
		}
	})
});

app.get('/getKurseAKIF', function(req, res){
    c.query('SELECT id, Kolleg, Fach, Sem from gegenstand where klasse = "AKIF"', function (erre, rows, fields){
		if(erre) {
			res.send('');
		}
		else if(rows == ''){
			res.send('');
		}
		else{
			res.send(JSON.stringify(rows));
		}
	})
});

app.get('/getPickedFacher/:username', function(req, res){
    c.query('SELECT gegenstandid from picked, schueler where schueler.username = ? and schueler.id = picked.schülerid',[req.params.username], function (erre, rows, fields){
		if(erre) {
			res.send('');
		}
		else if(rows == ''){
			res.send('');
		}
		else{
			res.send(JSON.stringify(rows));
		}
	})
});

app.get('/getUser/:username', function(req, res){
    c.query('SELECT id, klasse, Firstname, lastname from schueler where username = ?',[req.params.username], function (erre, rows, fields){
		if(erre) {
			res.send('');
		}
		else if(rows == ''){
			res.send('');
		}
		else{
			res.send(JSON.stringify(rows));
		}
	})
});

app.post('/AllowedUser/:user', function(req, res){
    c.query('SELECT password from schueler where username = ?',[req.params.user], function (erre, rows, fields){
		if(erre) {
			res.send('0');
		}
		else if(rows == ''){
			res.send('0');
		}
		else{
			if(req.body.password == rows[0].password){
                res.send('1');
            }
		}
	})
});

app.post('/setPicked/:user', function(req, res){
    console.log(req.body);
});