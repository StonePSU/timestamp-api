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

app.listen(8080);   
console.log("Server is listening on port 8080");


function processParameter(parm) {
    var retVal;
    var unixVal;
    var naturalDate;
    
    // if the parameter is NaN then assume it's not a unix timestamp
    if (isNaN(parm)) {
        var dateString = parm.replace(",", "");
        dateString = dateString.replace(".", "-");
        
        // need to check the various format a non-unix date could be coming in as and return the unix and natural language equivalents
        var arr = checkDate(dateString);
        
        // if the returning array has an invalid value then set the unix and natural language dates to null
        if (arr[0] === "Invalid") {
            unixVal = null;
            naturalDate = null;
        } else {
            unixVal = arr[1];
            naturalDate = arr[0];
        }
    // code to deal with unix timestamp;
    } else {
        
      var newDate = moment.unix(parm);
      unixVal = parm;
      naturalDate = moment(newDate).format('MMMM D, YYYY');
    }
    
    // create the json object to return;
    retVal = {
                "unix": unixVal,
                "natural language": naturalDate
             }
    
    return retVal;
    
}

function convertMonth(parm) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",  "November", "December"];
    
    return months[parm];
    
}

function checkDate(str) {
    var validDate = true;
    var arrRet = [];
    
    // hard code the various formats.  there must be a better way to do this;
    if (!moment(str, "MMM DD YYYY", true).isValid()) {
        if (!moment(str, "MMMM DD YYYY", true).isValid()) {
            if (!moment(str, "MM-DD-YYYY", true).isValid()) {
                if(!moment(str, "MM-DD-YY", true).isValid()) {
                    if (!moment(str, "M-D-YY", true).isValid()) {
                        if (!moment(str, "M-D-YYYY", true).isValid()) {
                            if (!moment(str, "M-DD-YY", true).isValid()) {
                                if (!moment(str, "MMMM D YYYY", true).isValid()) {
                                  if (!moment(str, "MMMM D YY", true).isValid()) {
                                      if (!moment(str, "MMM D YYYY", true).isValid()) {
                                          if (!moment(str, "MMM D YY", true).isValid()) {
                                              validDate = false;    
                                          }
                                      }
                                  }    
                                }
                                
                            }
                        }
                    }
                }
            }
        }
    }
    
    if (!validDate) {
        return arrRet.push("Invalid");
        
    } else {
        arrRet.push(moment(str).format("MMMM DD, YYYY"));
        arrRet.push(moment(str).format("X"));
        return arrRet;
    }
}