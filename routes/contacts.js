const express = require('express');
const router = express.Router();

const Contact = require('../models/Contact');
const { isAuthenticated } = require('../helpers/auth');

router.get('/contacts/add',isAuthenticated , (req, res)=>{
    res.render('contacts/new-contact');
});

router.post('/contacts/new-contact', isAuthenticated, async (req,res)=>{
    const {contactName, contactLastname, contactEmail, contactAge} = req.body;
    let errors =[];
    if(!contactName){
        errors.push({text: 'Por favor escriba el nombre del contacto'});
    }
    if(!contactLastname){
        errors.push({text:'Por favor escriba el apellido del contacto'});
    }
    if(!contactEmail){
        errors.push({text:'Por favor escriba el correo electrónico del contacto'});
    }
    if(!contactAge){
        errors.push({text:'Por favor escriba la edad del contacto'});
    }
    if(errors.length > 0){
        res.render('contacts/new-contact',{
            errors,
            contactName,
            contactLastname,
            contactEmail,
            contactAge
        });
    }else{
        const newContact = new Contact({contactName, contactLastname, contactEmail, contactAge});
        newContact.user = req.user.id;
        await newContact.save();
        req.flash('success_msg','Contacto agregado corectamente');
        res.redirect('/contacts');
    }
});

router.get('/contacts', isAuthenticated, async (req, res)=>{

    await Contact.find({user: req.user.id}).sort({date: 'desc'}).then(
        documents => {
            const context = {
                contacts: documents.map(document => {
                    return { 
                        _id: document._id,
                        contactName: document.contactName,
                        contactLastname: document.contactLastname,
                        contactEmail: document.contactEmail,
                        contactAge: document.contactAge,
                        date: document.date
                    }
                })
            }
            //console.log(documents);
            //console.log(context);
            res.render('contacts/all-contacts', {contacts: context.contacts});
        });
});

router.get('/contacts/edit/:id', isAuthenticated,async (req, res)=>{
    await Contact.findById(req.params.id).then(
        document => {
            const contact = {
                        _id: req.params.id,
                        contactName: document.contactName,
                        contactLastname: document.contactLastname,
                        contactEmail: document.contactEmail,
                        contactAge: document.contactAge,
                        date: document.date
                }
                //console.log(contact);
                res.render('contacts/edit-contact', {contact});
            }
        );
    
});

router.put('/contacts/edit-contact/:id',isAuthenticated,async (req, res)=>{
   const {contactName, contactLastname, contactEmail, contactAge} = req.body;
   let errors =[];
    if(!contactName){
        errors.push({text: 'Por favor escriba el nombre del contacto'});
    }
    if(!contactLastname){
        errors.push({text:'Por favor escriba el apellido del contacto'});
    }
    if(!contactEmail){
        errors.push({text:'Por favor escriba el correo electrónico del contacto'});
    }
    if(!contactAge){
        errors.push({text:'Por favor escriba la edad del contacto'});
    }
    if(errors.length > 0){
        res.render('contacts/new-contact',{
            errors,
            contactName,
            contactLastname,
            contactEmail,
            contactAge
        });
    }else{
        await Contact.findByIdAndUpdate(req.params.id,{contactName, contactLastname, contactEmail, contactAge});
        req.flash('success_msg','Contacto Actualizado correctamente');
        res.redirect('/contacts');
    }
});

router.delete('/contacts/delete/:id', isAuthenticated, async (req, res)=>{
    await Contact.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Contacto Eliminado correctamente');
    res.redirect('/contacts');
});

module.exports = router;