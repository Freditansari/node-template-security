
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const mongoose =require('mongoose');

const bodyParser = require('body-parser');

const passport = require('passport');

const keys = require('../configs/mongo-db');

const app = express()
const port = process.env.PORT || 3000



//set view engine
app.set('view engine', 'hbs')

const users = require ('./routes/users');


const db = require('./configs/mongo-db').mongoURI;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.raw());
app.use(cookieParser(keys.secretOrKey))


mongoose.connect(db, { useFindAndModify: false, useNewUrlParser:true })
    .then(()=>console.log('Monggo db connected'))
    .catch(err=>console.log(err));


require('./configs/passport')(passport);

app.use(passport.initialize());


app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/users', users);

app.get('/cookies', (req,res)=>{
    res.cookie('my-secret-cookie',uuidv4() )
});

app.get('/read-cookies', (req, res)=>{
    res.send('cookies : '+req.cookie('my-secret-cookie'))
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))