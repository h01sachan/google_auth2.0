const passport=require('passport');
const googlestrategy=require('passport-google-oauth20').Strategy;
const keys=require('../config/keys')
const User=require('../models/user')

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    User.findByPk(id)
    .then(user=>{
        done(null,user);
    })
    .catch(error=>{
        console.log(error);
    })
});

passport.use(
    new googlestrategy
        ({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback'
        },
            (accessToken, refreshToken, profile, done) => {


                console.log('accessToken ', accessToken);
                console.log('refreshToken ', refreshToken);
                console.log('profile ', profile);
                User.findOne({
                    where: {
                        googleId: profile.id
                    }
                })
                .then(savedUser=>{
                    if(savedUser)
                    {
                        //user already exist with given id
                        console.log("user already exist in database");
                        done(null,savedUser);
                    }
                    else
                    {
                        //create new user
                        const newUser=User.create({
                            googleId:profile.id,
                            name:profile.displayName,
                            email:profile.emails[0].value
                        })
                        .then(user=>{
                            done(null,user);
                        })
                        .catch(error=>{
                            console.log(error);
                        })
                    }
                })
                .catch((error)=>{
                    console.log(error);
                })
            })
);
