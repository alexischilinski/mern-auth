const router = require('express').Router()
const User = require('../models/User')
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs')

//validation
// const Joi = require('@hapi/joi')
// const schema = Joi.object({
//     name: Joi.string().min(6).required(),
//     email: Joi.string().min(6).required().email(),
//     password: Joi.string().min(6).required()
// })

router.post('/register', async (req, res) => {

    //validate data before making user
    // const { error } = schema.validate(req.body)
    const { error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //check if user is already in database
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send('email exists in db')

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    try{
        const savedUser = await user.save()
        res.send(savedUser)
    }catch(err){
        res.status(400).send(err)
    }
})

// router.post('/login', (req, res)=>{

// })

module.exports = router