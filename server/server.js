const PORT= process.env.PORT ?? 8000;
const express= require('express')//getting express packages and storng it in the variable express

//this line below generates unique ids for each entry
const { v4: uuidv4 } = require('uuid')
const app = express()// now the constant app can be used to access all the packages within express

const pool = require('./db')
const cors= require ('cors')
//to hash the passwords
const bcrypt= require('bcrypt')
//this helps us to STAY signed in
const jwt=require('jsonwebtoken')

app.use(cors())
app.use(express.json())

//CODE TO GET ALL TO-DOs
app.get('/todos/:userEmail', async(req,res)=>{
    const {userEmail}= req.params
    console.log(userEmail)

    try{
      const todos =  await pool.query('SELECT * FROM todos WHERE user_email= $1',[userEmail])
      res.json(todos.rows)
    }catch(err){
        console.error(err)
    }
})


//creating a new todo
app.post('/todos',async(req,res)=>{
  const {user_email,title,progress, date} =req.body
  console.log(user_email,title,progress, date )
  const id= uuidv4()
  try{
    const newToDo = await pool.query(`INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)`,[id, user_email, title, progress, date])
    res.json(newToDo)
  }
  catch(err){
    console.error(err);
  }
})

//editing the todo
app.put('/todos/:id', async(req,res) => {
  const {id} = req.params
  const {user_email, title, progress, date}= req.body
  try{
    const editToDo= 
    await pool.query(`UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5;`, [user_email,title,progress,date,id])
    res.json(editToDo)
  }
  catch(err){
    console.error(err)
  }
})

//delete a todo
app.delete('/todos/:id', async(req,res) => {
  try{
    const {id} = req.params
  const deleteToDo= await pool.query('DELETE FROM todos WHERE id=$1;',[id])
  res.json(deleteToDo)
  }catch(err){
    console.error(err)
  }
})


//signup
app.post('/signup',async(req,res)=>{
  const {email, password} = req.body
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword= bcrypt.hashSync(password,salt)
  try{
    const signUp= await pool.query(`INSERT INTO users (email, hashed_password) VALUES($1, $2)`, [email, hashedPassword])

    //our token expires in 1hr if we do not get rid of it ourselves
    const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})

    res.json({email,token})
  }
  catch(err){
    console.error(err);
    if(err){
      res.json({detail: err.detail})
    }
  }
})


//login
app.post('/login',async(req,res)=>{
  const {email, password}=req.body
  try{
    const users= await pool.query('SELECT * from users WHERE email = $1',[email])

    //if the above query returns nothing that means that the user does not exist
    if(!users.rows.length)
    return res.json({detail: 'User does not exist'})

    const success= await bcrypt.compare(password, users.rows[0].hashed_password)
    //our token expires in 1hr if we do not get rid of it ourselves
    const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})

    if(success){
      res.json({'email' : users.rows[0].email, token})
    }
    else{
      res.json({detail: "Login Failed"})
    }
  }
  catch(err){
    console.error(err);
  }
})


app.listen(PORT, ()=>console.log(`Server running on PORT ${PORT})`))//to reflect the changes made by accessing the express on the given PORT we use app.lsten(PORT, <a function>) 