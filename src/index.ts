import { Routes } from './routes/routes';
import app from './App';
import mysql from '../node_modules/mysql';
import { get } from 'https';

const port = 6969;
//The routes file bound to the Server

let setRoutes = new Routes(app);
const Client = require('mysql');
var randomstring = require("randomstring");
var dateFormat = require('dateformat');
 
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
	else{
		console.log("Database are connected.");
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

app.get('/getPickedFacher/:session', function(req, res){
	c.query('SELECT starttime from usersession where usersession.SessionString = ?',[req.params.session], function(err, row, field){
		if(err){
			res.send('');
		}
		else if(row == ''){
			res.send('');
		}
		else{
			var now = new Date(row[0].starttime);
			var h = now.getHours() + 3;
			now.setHours(h);
			if(new Date() < now){	
    			c.query('SELECT gegenstandid from picked, schueler, usersession where usersession.SessionString = ? and schueler.id = picked.schülerid and usersession.SchuelerId = schueler.Id',[req.params.session], function (erre, rows, fields){
					if(erre) {
						res.send('');
					}
					else if(rows == ''){
						res.send('');
					}
					else{
						res.send(JSON.stringify(rows));
					}
				});
			}
			else{
				res.send('{gegenstandid : 0}');
			}
		}
	});
});

app.get('/getUser/:session', function(req, res){
	c.query('SELECT starttime from usersession where usersession.SessionString = ?',[req.params.session], function(err, row, field){
		if(err){
			res.send('');
		}
		else if(row == ''){
			res.send('');
		}
		else{
			var now = new Date(row[0].starttime);
			var h = now.getHours() + 3;
			now.setHours(h);
			if(new Date() < now){	
    			c.query('SELECT schueler.id, klasse, firstname, lastname from schueler,usersession where sessionstring = ? and schueler.id = usersession.schuelerid',[req.params.session], function (erre, rows, fields){
					if(erre) {
						res.send('');
					}
					else if(rows == ''){
						res.send('');
					}
					else{
						res.send(JSON.stringify(rows));
					}
				});
			}
			else{
				res.send('[{\"id\" : \"0\" }]');
			}
		}
	});
});

app.post('/AllowedUser/:user', function(req, res){
    c.query('SELECT password, id from schueler where username = ?',[req.params.user], function (erre, rows, fields){
		if(erre) {
			res.send('0');
		}
		else if(rows == ''){
			c.query('Select password, id from admin where username = ?', [req.params.user], function(err, row, field){
				if(err){
					res.send('0');
				}
				else if(row == ''){
					res.send('0');
				}
				else{
					if(req.body.password == row[0].password){
						c.query('Select sessionstring from adminsession where admin_id = ?', [row[0].id], function(error, reihe, felder){
							if(error){
								res.send('0');
							}
							else if(reihe == ''){
								var sessionstring = randomstring.generate(30);
								var now = new Date();
								dateFormat(now, "yyyy-mm-dd hh:MM:ss");
								c.query('Insert into adminsession (Sessionstring, StartTime, admin_id) values (?, ?, ?)', [sessionstring,now,row[0].id], function(errors, reihes, felders){
									if(errors){
										res.send('0');
									}
									else{
										var x = "{\"sessionstring\":\"" + sessionstring + "\", \"id\":\"1\"}"; 
										res.send(x);
									}
								})
							}
							else{
								var now = new Date();
								dateFormat(now, "yyyy-mm-dd hh:MM:ss");
								c.query('Update adminsession set starttime = ? where sessionstring = ?', [now, reihe[0].sessionstring], function(errors, reihes, felders){
									if(error){
										res.send('0');
									}
									else{
										var x = "{\"sessionstring\":\"" + reihe[0].sessionstring + "\", \"id\":\"1\"}";
										res.send(x);	
									}
								});
							}
						});
					}
				}
			});
		}
		else{
			if(req.body.password == rows[0].password){
                c.query('Select sessionstring from usersession where usersession.schuelerid = ?', [rows[0].id], function(err, row, field){
					if(err){
						res.send('0');
					}
					else if(row == ''){
						var sessionstring = randomstring.generate(30);
						var now = new Date();
						dateFormat(now, "yyyy-mm-dd hh:MM:ss");
						c.query('Insert into usersession (Sessionstring, StartTime, SchuelerId) values (?, ?, ?)', [sessionstring,now,rows[0].id], function(error, reihe, felder){
							if(error){
								res.send('0');
							}
							else{
								var x = "{\"sessionstring\":\"" + sessionstring + "\", \"id\":\"0\"}"; 
								res.send(x);
							}
						})
					}
					else{
						var now = new Date();
						dateFormat(now, "yyyy-mm-dd hh:MM:ss");
						c.query('Update usersession set starttime = ? where sessionstring = ?', [now, row[0].sessionstring], function(error, reihe, felder){
							if(error){
								res.send('0');
							}
							else{
								var x = "{\"sessionstring\":\"" + row[0].sessionstring + "\", \"id\":\"0\"}";
								res.send(x);	
							}
						});
					}
				})
            }
		}
	})
});

app.post('/setPicked/:session', function(req, res){
    
});


app.post('/sendnewPupils/:adminsession', function(req, res){
	c.query('Select starttime from adminsession where sessionstring = ?', [req.params.adminsession], function(err, row, field){
		if(err){
			res.send('');
		}
		else if(row == ''){
			res.send('');
		}
		else{
			var now = new Date(row[0].starttime);
			var h = now.getHours() + 3;
			now.setHours(h);
			if(new Date() < now){
				var y = req.body.newPupils;
				var x = 0;
				while(y[x] != undefined)
				{
					var password = randomstring.generate(8);
					var user = y[x].klasse.replace(/[0-9]/ , "");
					var search = user + new Date().getFullYear().toString().substring(2,4);
					var t;
					c.query('SELECT count(id) as c FROM `schueler` WHERE username like ?', [search] , function(error, reihe, felder){
						if(error){
							console.log('shit');
						}
						else{
							t = reihe[0].c;
						}
					});
					var number = parseInt(new Date().getFullYear().toString().substring(2,4));
					number = number *1000 + parseInt(t);
					console.log(t);
					user = user + number.toString();
//					c.query('Insert into schueler (Klasse, Firstname, Lastname, password, username) values (?, ? ,?, ?, ?)', [y[x].klasse, y[x].firstname, y[x].lastname, password, user],  function(erre, rows, fields){
//						if(erre){
//							console.log('problem')
//						}
//						else{
//							
//						}
//					});
					x++;
				}
			}
			else{
				res.send('error');
			}
		}
	});
});

app.post('/sendnewFacher/:adminsession', function(req, res){
	c.query('Select starttime from adminsession where sessionstring = ?', [req.params.adminsession], function(err, row, field){
		if(err){
			res.send('');
		}
		else if(row == ''){
			res.send('');
		}
		else{
			var now = new Date(row[0].starttime);
			var h = now.getHours() + 3;
			now.setHours(h);
			if(new Date() < now){
				var y = req.body.newFacher;
				var x = 0;
				do{
					c.query('Insert into gegenstand (Kolleg, Fach, Sem, Klasse) values (?, ? ,?, \"AKIF\")', [y[x].Kolleg, y[x].Fach, y[x].Sem],  function(erre, rows, fields){
						if(erre){
							res.send('');
						}
						else{
						}
					});
					x++;
				}while(y[x] != undefined);
			}
			else{
				res.send('error');
			}
		}
	});
});