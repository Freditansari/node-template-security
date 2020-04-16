module.exports = {
    mongoURI: process.env.DATABASE_URL ||'mongodb://127.0.0.1:27017/superapp',
    secretOrKey: process.env.SECRETKEY ||'secret'
  };