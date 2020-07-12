const express = require('express')
const app = express()
const port = 3001
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
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

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

passport.use(new LocalStrategy(
    function(username, password, done) {
      const user = {id: username};
      if (username !== password) {
          return done(null, false, { message: 'No user'});
      }
      return done(null, user);

    }
  ));

passport.serializeUser((user, done) => done(null, user.id) );
passport.deserializeUser((username, done) => { 
    done(null, {id: username})
});

app.get('/', checkAuthenticated,  (req, res) => res.send('Hello World!'));

app.get('/login', (req, res) => {
    res.send( {
        page: 'login',
        messages: req.flash('error')
    });
});

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

function checkAuthenticated( req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

function checkNotAuthenticated( req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    return next();
}

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
} )

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))