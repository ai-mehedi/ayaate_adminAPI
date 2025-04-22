const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    console.log(email)
    const user = await User.findOne({ email });
    if (!user) return done(null, false);
    const match = await bcrypt.compare(password, user.password);
    if (!match) return done(null, false);
    return done(null, user);
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
        user = await User.create({
            googleId: profile.id,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails[0].value,
            profilePic: profile.photos[0].value
        });
    }
    return done(null, user);
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ facebookId: profile.id });
        
        if (!user) {
            // Create a new user if not found
            user = await User.create({
                facebookId: profile.id,
                firstname: profile.name.givenName,
                lastname: profile.name.familyName,
                email: profile.emails[0].value,
                profilePic: profile.photos[0].value // or a default profile picture if empty
            });
        }
        
        // Pass the user to the done callback
        return done(null, user);
    } catch (err) {
        console.error(err);
        return done(err, null);
    }
}));