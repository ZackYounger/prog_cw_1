const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use(express.static('client'));
//app.use(express.static(__dirname));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var calendarData = { '7|12|2023' : [{text:"Walk the Dog", completed:true},{text:"Walk the Cat", completed:true}] }

function getDatesString(date) {
  return date.getDate() +'|'+ (date.getMonth()+1) +'|'+ date.getFullYear()
}


function getDaysData(relativeStart, numDays) {
  pastDaysData = []

  var newdate = new Date()
  newdate.setDate(newdate.getDate() - relativeStart - 1)

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
  return pastDaysData
}


app.get('/getPastDaysData', function (req, resp){
  numDays = parseInt(req.query.numDays)

  pastDaysData = getDaysData(numDays, numDays)

  resp.send( pastDaysData )
});


//for testing
app.get('/getCalendarData', function (req, resp){
  resp.send( calendarData )
});


app.get('/getFutureDaysData', function (req, resp){
  numDays = parseInt(req.query.numDays)

  futureDaysData = getDaysData(0, numDays)

  resp.send( futureDaysData )
});


app.post('/addTask', function (req, resp){

  const receivedData = req.body;
  console.log(receivedData)
  resp.json({ message: 'Data received successfully' });


  taskText = receivedData.taskText
  stringDate = receivedData.stringDate
  if (stringDate in calendarData) {
    calendarData[stringDate].push( {text:taskText, completed:false} )
  } else {
    calendarData[stringDate] = [{text:taskText, completed:false}]
  }
});


app.post('/removeTask', function (req, resp){

  const receivedData = req.body;
  console.log(receivedData)
  resp.json({ message: 'Data received successfully' });

  taskText = receivedData.taskText
  stringDate = receivedData.stringDate
});


app.post('/toggleCompletion', function (req, resp){

  const receivedData = req.body;
  console.log(receivedData)
  resp.json({ message: 'Data received successfully' });

  taskText = receivedData.taskText
  stringDate = receivedData.stringDate
});


app.listen(8000);