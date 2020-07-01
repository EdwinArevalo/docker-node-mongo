const express = require('express');
const router = express.Router();
 
const User = require('../models/User');

const passport = require('passport');

router.get('/users/signin',(req, res)=>{
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local',{
    successRedirect: '/contacts',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup',(req, res)=>{
    res.render('users/signup');
});

router.post('/users/signup', async (req, res)=>{
    const {name, email, password, confirm_password} = req.body;
    let errors= [];
    if (name.length <= 0){ 
        errors.push({text: 'Por favor ingrese su nombre'});
    }
    if (email.length <= 0){ 
        errors.push({text: 'Por favor ingrese un correo electrónico'});
    }
    if (password != confirm_password){ 
        errors.push({text: 'Las contraseñas no coinciden'});
    }
    if (password.length < 4){ 
        errors.push({text: 'La contraseña debe tener al menos 4 carácteres'});
    }
    const emailUser = await User.findOne({email: email});
    if(emailUser){
        //req.flash('error_msg','The Email is already in use');
        //res.redirect('/users/signup');
        errors.push({text: 'El correo electrónico ingresado ya se encuentra en uso'});
    }
    if (errors.length > 0){ 
        res.render('users/signup',{errors, name, email, password, confirm_password});
    }else{
        const newUser = new User({name, email, password});
        newUser.password =  await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg','Registrado correctamente');
        res.redirect('/users/signin');
    }
    
});

router.get('/users/logout',(req, res)=>{
    req.logout();
    res.redirect('/');
});

module.exports = router;