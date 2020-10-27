const express=require('express');
const cookiesession=require('cookie-session');
const passport=require('passport');
const keys=require('./config/keys');
const sequelize=require('./utils/database');
const bodyParser=require('body-parser');
const passportConfig=require('./services/passport');
const PORT=process.env.PORT || 5000;
const app=express();

// To remove CROS (cross-resource-origin-platform) problem
app.use((req, res, next) =>{   
    res.setHeader('Access-Control-Allow-Origin',"*"); // to allow all client we use *
    res.setHeader('Access-Control-Allow-Methods',"OPTIONS,GET,POST,PUT,PATCH,DELETE"); //these are the allowed methods 
    res.setHeader('Access-Control-Allow-Headers', "*"); // allowed headers (Auth for extra data related to authoriaztiom)
    next();
})

app.use(
    cookiesession({
        maxAge:60*1000,
        keys: [keys.cookieKey]
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(require('./routes/auth'))

// Express middleware that allows POSTing data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

sequelize
    .sync(
        //{force:true}
    )
    .then(result => {
        //console.log(result);
        app.listen(PORT);
        console.log("--------server started-----------");
    })
    .catch(err => {
        console.log(err);
    });

// app.listen(PORT);
