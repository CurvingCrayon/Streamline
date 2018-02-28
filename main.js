var connect = require('connect');
var serveStatic = require('serve-static');
var express = require('express');
var bodyParser = require("body-parser");
var fs = require("fs");
var ejs = require("ejs");
var mstc = require("mustache");
var handlebars = require("handlebars");
var cookieParser = require("cookie-parser");
var http = require("http");
var pug = require("pug");
var nodemailer = require("nodemailer");
var template = "<h1>Template not yet loaded</h1>";
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "streamline.automated@gmail.com",
        pass: "shrekthethirdisntcanon"
    }
});
fs.readFile("template.mst","utf-8",function(err,html){
    console.log("Mustache template loaded");
    template = html;
})
var app = express()
//app.set('views', './views') // specify the views directory
.set('view engine', 'ejs') // register the template engine
function serveStatic1(path){
    //console.log(path);
    return function(req,res,next){
        console.log("static:"+req.path);
        serveStatic(path)(req,res,next);
    };
}
app.use("/",function(req,res,next){
    if(req.path.match(/\//g).length === 1 && (req.path.search("html") !== -1 || req.path ==="/")){ //Number of slashes
        var path = req.path;
        if(req.path === "/"){
            path = "/index.html";
        }
        var name = req.path.split(".")[0].split("/")[1];
        fs.readFile(__dirname+"/pages"+path,"utf-8", function(err,html){
            if(err){
                console.log(err);
            }
             var rendered =  mstc.to_html(template,{
                 content: html,
                 backgroundImg: "meeting.jpg",
                 name: name
             })
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(rendered);
            res.end();
        });
    }
    else{
        if(req.path.search("admin") === -1){
            next();
        }
    }
})
app.use(serveStatic1(__dirname))

http.createServer(app).listen(80);
//app.listen(80)
//app.get('/', function (req, res) {
//  res.render('index', { title: 'Hey', message: 'Hello there!' })
//})
/*
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
});*/
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