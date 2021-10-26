const Router = require('express')
const router = new Router()
const controller = require('./authController.js')
const {check} = require('express-validator')

router.post('/registration',[
    check('username', "имя пользователя не может быть пустым").notEmpty(),
    check('password',"пароль должен быть больше пяти и меньше 12 символов").isLength({min:4,max:10})
],controller.registration)
router.post('/login',controller.login)
router.get('/users',controller.getUser)

module.exports=  router