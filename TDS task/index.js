const express = require('express')
const app = express()
const port =  3000


const connectDb = require('./app/database/dbconnect')
connectDb()
app.use(express.json())

app.use('/',require('./app').routes)

app.listen(port, () => {
    console.log('Server started on port ' + port)
})

