const router = require("express").Router()

const { myQuery } = require("../middlewares/sqlConfig")
const { usersOnly } = require("../middlewares/verifyUser")


////get vacations
router.get("/", usersOnly , async (req, res) => {
    try {

      console.log(req.user)

      if ( !req.user.id  ) {
        return res.status(400).send("Can't identify user")
      }

      const vacations = await myQuery(
       `SELECT vacations.* , follows.u_id , follows.f_id
       FROM vacations
       LEFT JOIN follows ON vacations.v_id = follows.v_id 
       AND u_id = ${req.user.id}`
      )
    
      console.log('goody')
      res.send(vacations)
    } catch (err) {
      res.status(500).send(err)
    }
  })


//// add follow
  router.put("/", usersOnly , async (req, res) => {
    try {
      const { u_id , v_id } = req.body

      if ( !v_id || !u_id ) {
        return res.status(400).send("missing some info")
      }

      await myQuery(`INSERT INTO follows ( u_id , v_id ) VALUES ('${u_id}' , '${v_id}')`)
      await myQuery(`UPDATE vacations SET followers = followers + 1 WHERE v_id = '${v_id}'`)

      
      res.status(201).send()

    } catch (err) {

      res.status(500).send(err)
    }
  })


//// remove follow
  router.delete("/", usersOnly , async (req, res) => {
    try {
      const { f_id , v_id  } = req.body

      if ( !f_id || !v_id  ) {
        return res.status(400).send("missing some info")
      }

      await myQuery(`DELETE FROM follows WHERE f_id = '${f_id}'`)
      await myQuery(`UPDATE vacations SET followers = followers - 1 WHERE v_id = '${v_id}'`)
      
      res.status(201).send()

    } catch (err) {
      res.status(500).send(err)
    }
  })


module.exports = router