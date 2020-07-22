
const passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => done(null, user.id) );

passport.deserializeUser((username, done) => { 
    done(null, {id: username})
});

passport.use(new LocalStrategy(
    function(username, password, done) {
      const user = {id: username};
      if (username !== password) {
          return done(null, false, { message: 'No user'});
      }
      return done(null, user);

    }
  ));

function initilize(app) {
    app.use(passport.initialize());
    app.use(passport.session());
}

function authenticate() {
    return passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true });
}

module.exports.initialize = initilize;
module.exports.authenticate = authenticate;