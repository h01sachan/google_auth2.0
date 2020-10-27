const express=require('express');
const router=express.Router()
const passport = require('passport');
//const passportConfig=require('./services/passport');
router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

router.get('/auth/google/callback', passport.authenticate('google'));

router.get('/current_user/testing', (req, res) => {
    res.send(req.user);
});

router.get('/logout',(req,res)=>{
    req.logout();
    //send this to see blank screen after logout
    res.send(req.user);
})
module.exports=router;
