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

const database = {
	users:[
	{
		id: '123',
		name:'Onur',
		email:'abc@gmail.com',
		password: 'ekmek',
		entries: 0,
		joined: new Date()
	},
	{
		id: '124',
		name:'Ozan',
		email:'abcd@gmail.com',
		password: 'toprak',
		entries: 0,
		joined:new Date()
	}
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com'
		}
	]
}

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req, res) => {
	bcrypt.compare("meyve", '$2a$10$7x1C3V3FPbDO68RBDEcQq.WIXn4LnithHA8dhxZ5DP6L.7KexgXbu', function(err, res) {
	});
	bcrypt.compare("veggies", '$2a$10$7x1C3V3FPbDO68RBDEcQq.WIXn4LnithHA8dhxZ5DP6L.7KexgXbu' , function(err, res) {
	});
	if(req.body.email === database.users[0].email  && 
		req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	} else {
		res.status(404).json('logging in  erroor')
	}
})

app.post('/register', (req, res) => {
	const {email, name, password} = req.body;
	db('users')
		.returning('*')
		.insert({
			email: email,
			name: name,
			joined: new Date()
		})
		.then(user => {
			res.json(user[0]);
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
