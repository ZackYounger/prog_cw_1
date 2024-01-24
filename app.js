const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use(express.static('client'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// const calendarData = fetch('./data.json')
//  .then((response) => response.json());

const calendarData = require('./data.json');
console.log(calendarData);
function getDatesString (date) {
  return date.getDate() + '|' + (date.getMonth() + 1) + '|' + date.getFullYear();
}

function getDaysData (relativeStart, numDays) {
  const pastDaysData = [];

  const newdate = new Date();
  newdate.setDate(newdate.getDate() - relativeStart - 1);

  for (let dayI = 0; dayI < numDays; dayI++) {
    newdate.setDate(newdate.getDate() + 1);
    const stringDate = getDatesString(newdate);

    const dayData = { stringDate };
    if (stringDate in calendarData) {
      dayData.tasks = calendarData[stringDate];
    } else {
      dayData.tasks = [];
    }
    pastDaysData.push(dayData);
  }
  return pastDaysData;
}

app.get('/getPastDaysData', function (req, resp) {
  const numDays = parseInt(req.query.numDays);

  const pastDaysData = getDaysData(numDays, numDays);

  resp.send(pastDaysData);
});

app.get('/getFutureDaysData', function (req, resp) {
  const numDays = parseInt(req.query.numDays);

  const futureDaysData = getDaysData(0, numDays);

  resp.send(futureDaysData);
});

app.post('/addTask', function (req, resp) {
  const receivedData = req.body;

  resp.send(req.body);

  const stringDate = receivedData.stringDate;
  const taskText = receivedData.taskText;
  console.log(stringDate, taskText);
  if (stringDate in calendarData) {
    calendarData[stringDate].push({ text: taskText, completed: false });
  } else {
    calendarData[stringDate] = [{ text: taskText, completed: false }];
  }
});

app.post('/removeTask', function (req, resp) {
  const receivedData = req.body;

  resp.send(req.body);

  const taskText = receivedData.taskText;
  const stringDate = receivedData.stringDate;

  calendarData[stringDate] = calendarData[stringDate].filter(task => task.text !== taskText);
});

app.post('/toggleCompletion', function (req, resp) {
  const receivedData = req.body;

  resp.send(req.body);

  const taskText = receivedData.taskText;
  const stringDate = receivedData.stringDate;

  try {
    for (const task of calendarData[stringDate]) {
      if (task.text === taskText) {
        task.completed = !task.completed;
      }
    }
  } catch (e) { console.log('Task does not exist in DB'); }
});

module.exports = app;
