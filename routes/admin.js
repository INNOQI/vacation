const router = require("express").Router()

const { myQuery } = require("../middlewares/sqlConfig")
const { adminOnly } = require("../middlewares/verifyAdmin")


///// add vacation
router.post("/", adminOnly, async(req, res) => {
    try {

        const { destenation, description, s_date, e_date, image, price } = req.body

        if (!destenation || !description || !s_date || !e_date || !image || !price) {
            return res.status(400).send("missing some info")
        }

        await myQuery(`INSERT INTO vacations 
             ( destenation , description , s_date , e_date , image , price , followers )
      VALUES ('${destenation}' , '${description}' , '${s_date}' , '${e_date}' , '${image}' , '${price}' , '0')`)
        res.status(201).send()
    } catch (err) {
        res.status(500).send(err)
    }
})


///// edit vacation
router.put("/", adminOnly, async(req, res) => {
    try {

        const { destenation, description, s_date, e_date, image, price, v_id } = req.body

        if (!destenation || !description || !s_date || !e_date || !image || !price || !v_id) {
            return res.status(400).send("missing some info")
        }

        await myQuery(`UPDATE vacations
        SET 
                destenation = '${destenation}', 
                description = '${description}', 
                s_date = '${s_date}', 
                e_date = '${e_date}', 
                image = '${image}', 
                price = '${price}'
        WHERE
                v_id = '${v_id}'`)

        res.status(201).send()
    } catch (err) {
        res.status(500).send(err)
    }
})


///// delete vacation
router.delete("/", adminOnly, async(req, res) => {
    try {

        const { v_id } = req.body

        if (!v_id) {
            return res.status(400).send("missing some info")
        }

        console.log(v_id)

        await myQuery(`DELETE FROM follows WHERE v_id= '${v_id}'`)
        await myQuery(`DELETE FROM vacations WHERE v_id= '${v_id}'`)


        res.status(201).send()
    } catch (err) {

        res.status(500).send(err)
    }
})














module.exports = router