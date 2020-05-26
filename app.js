
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const mongoose =require('mongoose');
const Handlebars = require("handlebars");
var cookieParser = require('cookie-parser')
let path = require('path')

const bodyParser = require('body-parser');

const passport = require('passport');

const keys = require('./configs/mongo-db');

const jwt = require('jsonwebtoken');

const app = express()
const port = process.env.PORT || 3000



//set view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

const users = require ('./routes/users');


const db = require('./configs/mongo-db').mongoURI;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.raw());
app.use(cookieParser(keys.secretOrKey))


mongoose.connect(db, { useFindAndModify: false, useNewUrlParser:true })
    .then(()=>console.log('Mongodb connected'))
    .catch(err=>console.log(err));


require('./configs/passport')(passport);

app.use(passport.initialize());

app.get('/verify-test', (req, res)=>{
    let decoded =jwt.verify(req.cookies['login-token'], keys.secretOrKey);
    res.send(decoded);
})

app.get('/check-cookie', (req,res)=>{
    res.send(req.cookies['login-token'])
})

app.get('/', (req, res) => res.render('index'));
app.use('/api/users', users);



app.listen(port, () => console.log(`Example app listening on port ${port}!`))