var connect = require('connect');
var serveStatic = require('serve-static');
var express = require('express');
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "streamline.automated@gmail.com",
        pass: "shrekthethirdisntcanon"
    }
});
connect()
    .use(bodyParser.urlencoded({ extended: true })) //To map request bodys correctly
    .use(cookieParser()) //To pass cookies
    .use(checkCredentials)
    .use(serveStatic(__dirname))
    
    .use("/login", function(req,res,next){  
    
    })
    .use("/request",function(req,res,next){
        var email = req.body.email;
        var name = req.body.name;
        var enquiry = req.body.text;
        var mailOptions = {
            from: "streamline.automated@gmail.com",
            to: "tutoring.streamline@gmail.com",
            subject: "Automated enquiry from website",
            html: "<p>This is an automated message. <br/><b>"+name+"</b> from contact <b>"+email+"</b> has sent the following message:<br/><i>"+enquiry+"</i></p>"
        };
//        console.log(mailOptions);

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    })
    .listen(80, function(){
    console.log('Server running on 80...');
});
function checkCredentials(req,res,next){
    console.log(req.cookies)
    if(req.originalUrl.search("admin") !== -1){
        if(req.cookies.pass === undefined){
            next();
        }
        else{
            console.log("Unauthorized user with pass: "+req.cookies.pass);
            res.setHeader("Content-Type","text/plain");
            res.write("Unauthorized user with pass: "+req.cookies.pass);
            res.end("END");
        }
    }
    else{
        next();
    }
}