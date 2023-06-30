const express = require('express')
const routes = express.Router()
const controller = require('./routes/controller')

routes.post('/user', controller.user)
routes.post('/passbookentry',controller.passbookEntry)
routes.post('/tds', controller.tdsCount)


module.exports = { routes }