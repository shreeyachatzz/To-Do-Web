const Pool = require('pg').Pool
require('dotenv').config()

//this is how we are going to communicate with our PostGreSQL Database
const pool= new Pool({
    user:process.env.USERNAME,
    password:process.env.PASSWORD,
    host:process.env.HOST,
    port:process.env.DBPORT,
    database: 'todoapp'
})

module.exports=pool