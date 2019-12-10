const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const database = {
	users:[
	{
		id: '123',
		name:'Onur',
		email:'abc@gmail.com',
		password:'ekmek',
		entries: 0,
		joined: new Date()
	},
	{
		id: '124',
		name:'Ozan',
		email:'abcd@gmail.com',
		password:'toprak',
		entries: 0,
		joined:new Date()
	}
	]
}

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req, res) => {
	if(req.body.email === database.users[1].email  && 
		req.body.password === database.users[1].password) {
		res.json('succes');
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

app.listen(3000, ()=> {
	console.log('app running');
})


/*

--> res =this is working
--> signin --> POST = sucess / fail
register --> POIST= user
profile/:userId --> GET = user
/imegae --> PUT  --> user update

*/