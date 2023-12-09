const express = require('express');
const app = express();

app.use(express.static('client'));
//app.use(express.static(__dirname));



calendarData = { '7/12/2023' : [{text:"Walk the Dog", completed:true},{text:"Walk the Cat", completed:true}] }

function getDatesString(date) {
  return date.getDate() +'/'+ (date.getMonth()+1) +'/'+ date.getFullYear()
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/getPastDaysData', function (req, resp){
  numDays = parseInt(req.query.numDays)

  pastDaysData = []

  var newdate = new Date()
  newdate.setDate(newdate.getDate() - numDays)

  for (dayI=0; dayI < numDays; dayI++) {
    newdate.setDate(newdate.getDate() + 1)
    stringDate = getDatesString(newdate)

    dayData = {stringDate:stringDate}
    if (stringDate in calendarData) {
      dayData.tasks = calendarData[stringDate]
    } else {
      dayData.tasks = []
    }
    pastDaysData.push( dayData )
  }
  resp.send( pastDaysData )
});

app.get('/getPastDaysData', function (req, resp){
  numDays = parseInt(req.query.numDays)

  pastDaysData = []

  var newdate = new Date()
  newdate.setDate(newdate.getDate() - 20)

  for (dayI=0; dayI < numDays; dayI++) {
    newdate.setDate(newdate.getDate() + 1)
    stringDate = getDatesString(newdate)

    dayData = {stringDate:stringDate}
    if (stringDate in calendarData) {
      dayData.tasks = calendarData[stringDate]
    } else {
      dayData.tasks = []
    }
    pastDaysData.push( dayData )
  }
  resp.send( pastDaysData )
});

app.listen(8000);