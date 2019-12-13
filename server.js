const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require ('bcrypt-nodejs');
const cors = require ('cors');

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
	    console.log('first deneme', res)
	});
	bcrypt.compare("veggies", '$2a$10$7x1C3V3FPbDO68RBDEcQq.WIXn4LnithHA8dhxZ5DP6L.7KexgXbu' , function(err, res) {
	    console.log('second deneme', res)
	});
	if(req.body.email === database.users[0].email  && 
		req.body.password === database.users[0].password) {
		res.json('success');
	} else {
		res.status(404).json('logging in  erroor')
	}
})

app.post('/register', (req, res) => {
	const {email, name, password} = req.body;
	database.users.push({
		id: '125',
		name:name,
		email:email,
		password:password,
		entries: 0,
		joined:new Date()
	})
	res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req,res) =>{
	const { id } = req.params;
	let userFound = false;
	database.users.forEach(user =>{
		if(user.id === id) {
			userFound = true;
			res.json(user);
		} 
	})
	if (!userFound) {
		res.status(404).json('user isnt found')
	}
})

app.post('/image', (req, res) => {
	const { id } = req.body;
	let userFound = false;
	database.users.forEach(user =>{
		if(user.id === id) {
			userFound = true;
			user.entries++
			res.json(user.entries);
		} 
	})
	if (!userFound) {
		res.status(404).json('user isnt found')
	}
})


app.listen(3001, ()=> {
	console.log('app running on port 3001');
})
