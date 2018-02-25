var connect = require('connect');
var serveStatic = require('serve-static');
var horse = require("./main.js");
var heldTableData = []; //Array of records
var $ = require("cheerio");
var interval = 30000; //How often to check timetables (ms)
var intervalTicket = 0;
var intervalOn = false;
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var pass= "shrek";
var dummyRes = {
    setHeader: function(text){
        console.log("Dummres header set: "+text);
    },
    write: function(text){
        console.log("Dummyres write: " + text);
    },
    end : function(){
        console.log("Dummres ended");
    }
}
horse.init();

connect()
    .use(bodyParser.urlencoded({ extended: true })) //To map request bodys correctly
    .use(cookieParser()) //To pass cookies
    .use(serveStatic(__dirname))
    .use(checkCredentials)
    .use("/timetable", function(req,res,next){  
        horse.log("Received timetable request.");
        res.setHeader('Content-Type', 'text/plain');
        horse.getProcessing(function(processing){
           if(!processing){
                console.log("Horseman not processing, initiating request.");
                horse.getTimetables(handleData,res);
            }
            else{
                console.log("Request ignored due to a request already being processed.")
                res.write("Currently processing");
                res.end();
            } 
        });
    })
    .use("/progress",function(req,res,next){
        res.setHeader("Content-Type","text/plain");
        horse.getProgress(function(currentLog){
            if(currentLog === ""){
                res.write("EMPTY");
                res.end("EMPTY");
            }
            else{
                horse.getProgress(function(prog){
                    res.write(prog);
                    res.end();
                });
            }
        });
        
    })
    .use("/clearlog",function(req,res,next){
        res.setHeader("Content-Type","text/plain");
        horse.clearLog();
        res.write("Cleared log");
        res.end("");
    })
    .use("/startauto",function(req,res,next){
        res.setHeader("Content-Type","text/plain");
        interval = Number(req.body.length * 1000);
        if(intervalOn){
            res.write("Interval is already on.");
        }
        else{
            res.write("Started auto for "+String(interval)+" ms");
            automate();
        }
        res.end("");
    })
    .use("/stopauto",function(req,res,next){
        res.setHeader("Content-Type","text/plain");
        if(intervalOn){
            res.write("Stopped auto");
            clearInterval(intervalTicket);
            intervalOn = false;
        }
        else{
            res.write("Interval is already off");
        }
        res.end("");
    })
    .listen(8080, function(){
    console.log('Server running on 8080...');
});
function handleData(tableData,res){
    //Return data to front end
    var newTableData = "";
    for(var tab = 0; tab < tableData.length; tab++){
        newTableData += tableData[tab].join("<br/>")+"<br/>";
    }
    if(res !== undefined){
        res.write(tableData.join(","));
        res.end();
    }
    var numTables = tableData.length;
    //Process data for gmail and calendars
    for(var t = 0; t < numTables; t++){ //Each table
        var tableBody = $(tableData[t][1]).children().eq(1);
        columns = tableBody.children();
        numCols = columns.length;
        var newTable = [];
        for(col = 0; col < numCols; col++){ //Each column
            rows = columns.eq(col).children();
            //The 3rd and 4th rows are conjoined, and the 6th row is underneath them
            //The follow code changes this so its a linear column
            var miniTable = rows.eq(2);
            var time1 = miniTable.children().eq(0).children().eq(0).children().eq(0).children().eq(0).text();
            var time2 = miniTable.children().eq(0).children().eq(0).children().eq(0).children().eq(1).text();
            var position = miniTable.children().eq(0).children().eq(0).children().eq(1).children().eq(0).text();
            position = fixPos(position);
            newCol = [rows.eq(0).text(),rows.eq(1).text(),time1,time2,rows.eq(3).text(),position];
            newTable.push(newCol);
            //CREATE TIMETABLE (GOTO calendar.js)
            horse.handleRoster(newCol);
        }
        updateData(newTable);
    }
}
function updateData(tableData){//Check heldTableData for duplicates and add new data
    //New table is a 2d array, the desired structure is an object
    //[Day, date, start, end, hours, position]
    var newObj = {
        "day": tableData[0],
        "date": tableData[1],
        "start": tableData[2],
        "end": tableData[3],
        "hours": tableData[4],
        "position": tableData[5]
    }
    
}
function checkProcessing(){
    
}
function fixPos(pos){
    //Position often has an acronym such as the following
    // TDH: Table Delivery Host
    //Sometimes there is whitespace, sometimes not
    var arrPos = pos.split(":");
    pos = arrPos[arrPos.length-1]; 
    pos = pos.trim();
    return pos;
}
function automate(){
    intervalOn = true;
    intervalTicket = setInterval(function(){
        console.log("Starting routine check.");
        horse.getProcessing(function(processing){
           if(!processing){
                console.log("Horseman not processing, initiating routine request.");
                horse.getTimetables(handleData);
            }
            else{
                console.log("Routine check ignored due to a request already being processed.")
            } 
        });
    },interval);
}
exports.timetableFailed = function(msg){
    console.log("Timetable failed due to :" + msg);
    console.log("Restarting interval");
    clearInterval(intervalTicket);
    automate();
}
function checkCredentials(req,res,next){
    if(req.cookies.pass === pass){
        next();
    }
    else{
        console.log("Unauthorized user with pass: "+req.cookies.pass);
        res.setHeader("Content-Type","text/plain");
        res.write("Unauthorized user with pass: "+req.cookies.pass);
        res.end("END");
    }
}