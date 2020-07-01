const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');//para las plantillas
const methodOverride = require('method-override'); //para enviar métodos PUT DELETE 
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

//Initiliazations
const app = express();
const db = require('./db');
require('./config/passport');

//Settings
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),//para incluir los diseños
    partialsDir: path.join(app.get('views'),'partials'),//para incluir formularios por ejemplo
    extname: '.hbs'
}));
app.set('view engine','.hbs');

//Middlewares
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global Variables
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


//Routes
app.use(require('./routes/index'));
app.use(require('./routes/contacts'));
app.use(require('./routes/users'));

//Static Files
app.use(express.static(path.join(__dirname,'public')));

//Server is listening
app.listen(app.get('port'),()=>{
    console.log('Server rinning on port ', app.get('port'));
});