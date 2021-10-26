const User= require('./models/User.js')
const Role = require('./models/Role.js')
const  bcrypt  =  require ( 'bcrypt' ) ;
const jwt = require('jsonwebtoken')
const {validationResult}=require('express-validator');
const { secret } = require('./config.js');

const generatorAccessToken =(id,roles)=>{
    const payload ={
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn:"24h"})
}

class authController {
    async registration(req,res) {
        try {
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:"ошибка при регистрации", errors})
            }
            const {username , password}=req.body
            const candidate=await User.findOne({username,email})
            if(candidate){
                return res.status(400).json({message:"Пользователь с таким именем уже существует"})
            }
            const hashPassword= bcrypt.hashSync(password,4)
            const userRole= await Role.findOne({value:"USER"})
            const user = new User({username,email, password: hashPassword, roles : [userRole.value]})
            await user.save()
            return res.json({message:"Полбзователь успешно зарегистрирован!"})

        } catch (error) {
            console.log(error)
            res.status(400).json({mssage:'registration error'})
        }
    }

    async login(req,res) {
        try {
            const {username, password}=req.body
            const user = await User.findOne({username})
            if (!user){
                return res.status(400).json({message:`пользователь ${username} не найден `})
            }
            const validPassword= bcrypt.compareSync(password,user.password)
            if (!validPassword){
                return res.status(400).json({message:`Неверный пароль  `})
            }

            const token = generatorAccessToken(user._id,user.roles)

           return res.json({token})
        } catch (error) {
            console.log(error)
            res.status(400).json({mssage:'login error'})
        }
    }

    async getUser(req,res) {
        try {
            const users = await User.find()
            res.json(users)
            res.json("server working")
        } catch (error) {
            console.log(error);
        }
    }
}


module.exports = new authController()