const express = require('express')
const app = express()
const port = 3001
const authentication = require('./authentication/setup');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override')


app.use(express.urlencoded({ extended: false }))
app.use(flash());
app.use(session({
    secret: 'cat',
    resave: false,
    saveUninitialized: false
}));


authentication.initialize(app);


app.use(methodOverride('_method'));

app.get('/', checkAuthenticated,  (req, res) => res.send('Hello World!'));

app.get('/login', (req, res) => {
    res.send( {
        page: 'login',
        messages: req.flash('error')
    });
});

app.post('/login', 
    authentication.authenticate()
);

function checkAuthenticated( req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
} )

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))