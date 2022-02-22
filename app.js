// requiring express,cors,express-ejs-layouts,crsf,express-session,cookie-parser,express-flash
const express =require('express')
const expressLayouts = require( "express-ejs-layouts")
// const cors = require("cors");
require('dotenv').config();
const cookieparser = require("cookie-parser")
const csurf = require("csurf");
const session =require('express-session'); 
const csrf =require("csurf");
const flash = require("express-flash");
app = express()




//  *********middleware***
//   mounting static files note .use indicate its a middleware
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(expressLayouts);
app.use(flash())
// cookie
app.use(cookieparser());
// expresssession
app.use(session({
    secret:process.env.SECRET,
    resave:true,
    saveUninitialized:true,
    cookie: { maxAge: 5 * 60 * 1000 ,secure:false} // 5mins
  
}))

// allows  acces
// app.use(cors())



// csrf

const  csrfProtection = csrf({cookie:true});
app.use(csrfProtection);


// **** view setting
// seting variables for views.*set layout  is for rendering views
app.set("layout","./layouts/main")
// engine
app.set("view engine","ejs")

// requiring approute



const userroute = require("./server/routes/userRoutes");
app.use('/',userroute)



const route = require("./server/routes/pageRoutes")
app.use('/',route)

const slotroute = require("./server/routes/slotRoutes")
app.use('/slots',slotroute)

const bookingroute = require("./server/routes/bookingRoutes")
app.use('/bookings',bookingroute)


const failedbookingroute = require("./server/routes/failedbookingRoutes")
app.use('/failedbookings',failedbookingroute)




// error hadler 404
app.all('*' ,(req,res)=>{
    res.render('./error/404',{title:"Error"})
})

// csurf
app.use((error,req,res,next)=>{
 res.render('./error/500',{title:"Server Error",error:error})
   
})

// port
const PORT= process.env.PORT|3000
app.listen(PORT ,()=>{
    console.log(`Port is listening on  port ${PORT}`)
})