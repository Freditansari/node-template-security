const express = require('express');
const mongoose =require('mongoose');

const bodyParser = require('body-parser');

const passport = require('passport');


const app = express()
const port = process.env.PORT || 3000


const users = require ('./routes/users');


const db = require('./configs/mongo-db').mongoURI;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.raw());



mongoose.connect(db, { useFindAndModify: false, useNewUrlParser:true })
    .then(()=>console.log('Monggo db connected'))
    .catch(err=>console.log(err));


require('./configs/passport')(passport);

app.use(passport.initialize());


app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/users', users);



app.listen(port, () => console.log(`Example app listening on port ${port}!`))