module.exports = app => {

   var router = require('express').Router();
   const GoldRateController = require('../controllers/gold-rate.controller')

   router.get('/', GoldRateController.findAll)
   router.get('/scrap', GoldRateController.scrap)

   app.use('/gold-rate', router)
}