const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require ('bcrypt-nodejs');
const cors = require ('cors');
const knex = require ('knex');

const db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'zerotomastery',
    database : 'smartface'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
	.where('email', '=', req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
		if(isValid){
			db.select('*').from('users')
			 .where('email', '=', req.body.email)
			 .then(user => {
			 	res.json(user[0])
			 })
			 .catch(err => res.status(400).json('unable getting user'))
		} else {
			res.status(400).json('email and password are not valid')
		}
	})
	.catch(err => res.status(400).json('email and password are not valid'))
})

app.post('/register', (req, res) => {
	const {email, name, password} = req.body;
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
	   trx
	    .insert({hash, email})
	    .into('login')
	    .returning('email')
	    .then(loginEmail => {
	    	return trx('users')
			.returning('*')
			.insert({
				email: loginEmail[0],
				name: name,
				joined: new Date()
			})
			.then(user => {
				res.json(user[0]);
			})
			.catch(err => res.status(400).json('can not be register'))
	    })
	    .then(trx.commit)
    	.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('can not be register'))
})

app.get('/profile/:id', (req,res) =>{
	const { id } = req.params;
	db.select('*').from('users').where({
		id: id
	})
		.then(user => {
			if (user.length){
				res.json(user[0])
			}else {
				res.status(400).json('Not Found')
			}
	})
		.catch(err => res.status(400).json('ERRROOORR'))
})

app.put ('/image', (req, res) => {
	const { id } = req.body;
	db('users')
	  .where('id', '=', id)
	  .increment('entries', 1)
	  .returning('entries' )
	  .then(entries	=> {
	  	res.json(entries[0]);
	  })
	  .catch(err => res.status(400).json('unable get entries'))	
})

app.listen(3001, ()=> {
	console.log('app running on port 3001');
})
