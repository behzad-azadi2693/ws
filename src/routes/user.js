const express = require('express')
// controller
const userController = require('../controllers/userController')
// middlewares
// const auth = require('../middlewares/auth')

const router = express.Router()

router
  // .get('/', auth.decode, userController.getAll)
  // .post('/', (req, res) => {
  //     res.send('hello');
  // })
  // .get('/:id', userController.getById)
   .get('/', userController.contactList)
  // .put('/:id', userController.updateUser)
  // .delete('/:id', userController.deleteUser)

module.exports = router
