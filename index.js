const express = require("express")
const app = express()
const cors = require("cors")
const path = require('path')

require("dotenv").config()


app.use(cors())
app.use(express.json())
app.use("/auth", require('./routes/auth'))
app.use("/user", require('./routes/user'))
app.use("/admin", require('./routes/admin'))

app.use(express.static(path.join(__dirname, 'build')))

app.get('/*', function(_req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.listen(80, () => console.log("rockin'1000 go visit on http://localhost"))

///// 161.35.25.79 //////