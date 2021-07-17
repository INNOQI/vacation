const router = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { myQuery } = require("../middlewares/sqlConfig")

 const getUsers= async () => {
try {

    const users = await myQuery("SELECT users.* FROM users")

    return (users)
  } catch (err) {
    res.status(500).send(err);
  }
}

router.post("/register", async (req, res) => {
  const { u_name, password, f_name, l_name } = req.body


    if (!u_name || !password || !f_name || !l_name) {
      return res.status(400).send("missing some info")
    }

     const users = await getUsers()

     
     
     if (users.some((user) => user.u_name === u_name)) {
       return res.status(400).send("username is taken")
      }
      
      const hashedPass = await bcrypt.hash(password, 10)
      
      try {
        
        await myQuery (`INSERT INTO users 
        ( f_name ,l_name , u_name , password , role )
        VALUES ('${f_name}' ,'${l_name}' , '${u_name}' ,'${hashedPass}','0');`)
        
        
      console.log('all good')
      res.status(201).send('all good')
      } catch (err) {
      res.status(500).send(err)
    }
})


router.post("/login", async (req, res) => {
    const { u_name, password } = req.body
    
    console.log("hellooooooo")
console.log(u_name, password)

    if (!u_name || !password) {
        return res.status(400).send({err:"missing some info"})
    }
    
    const users = await getUsers()



    const user = users.find((user) => user.u_name === u_name)

    // console.log(user)
    
    if (!user) {
        return res.status(400).send({err:"  Username not found"})
    }
    
    if (!(await bcrypt.compare(password, user.password))) {
        return res.status(400).send({err:"  Wrong password"})
    }

    
    const token = jwt.sign(
      {
        id: user.u_id,
            username: user.u_name,
            fname: user.f_name,
            role: user.role,
          },
          process.env.TOKEN_SECRET,
          {
            expiresIn:"5000h"
          }
          )
          
          console.log('gottoken')
          console.log(token)
          res.send({token})
})

module.exports = router
