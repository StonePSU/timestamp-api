const express = require('express');
const fs = require('fs');
const moment = require('moment');
var app = express();


app.use((req, resp, next) => {
   console.log(`Log: Incoming request using ${req.method} method`); 
   console.log(`Log: The requested URL is '${req.url}'`);
   next();
});

app.get("/", (req, resp) => {
    var home = fs.readFile("./index.html", "UTF-8", (err, data) => {
        if (err) throw err;
        //console.log(data);
        resp.send(data);
    });
});

app.get("/:dateParm", (req, resp) => {
   var dateParm = req.params.dateParm;
   
   if (dateParm !== "favicon.ico") {
       console.log(`Log: Incoming parameter being passed is ${dateParm}`);
       
       // NEED TO MULTIPLY THE DATE PARAMETER BY 1000 IN ORDER TO CONVERT IT FROM SECONDS TO MILLISECONDS
       resp.json(processParameter(dateParm));
   }
    
});

app.listen(process.env.PORT || 8080);   
console.log("Server is listening on port 8080");


function processParameter(parm) {
    var retVal;
    var unixVal;
    var naturalDate;
    var dateValue;
    
    // if the parameter is NaN then assume it's not a unix timestamp
    if (isNaN(parm)) {
      dateValue = moment(parm, "MMMM D, YYYY");
    // code to deal with unix timestamp;
    } else {
      dateValue = moment(parm, "X");
      console.log(dateValue);
    }
    
    // create the json object to return;
    if (dateValue.isValid()) {
    retVal = {
                "unix": dateValue.format("X"),
                "natural language": dateValue.format("MMMM D, YYYY")
             }
    } else {
        retVal = {
                    "unix": null,
                    "natural language": null
        }
    }
    
    return retVal;
    
}