import { htmlSetup, htmlUpdate, removeAddedElements } from './html-setup.js';
import { graphSetup, drawGraph, clearCanvas } from './graph.js';

const dayWidth = 100;

let n;

let previousDaysTasks;
let nextDaysTasks;

// runs on load to setup the page
window.onload = function () {
  htmlSetup();
  graphSetup();
  updatePage();
};

// runs anytime the amount of content on a page needs to change. eg on a resize
async function updatePage () {
  // remove all content added by htmlupdate()
  removeAddedElements();

  n = Math.round(document.body.offsetWidth / dayWidth);

  // Fetch calander data for both the past and future days
  try {
    const response = await fetch('http://127.0.0.1:8000/getPastDaysData?numDays=' + n);
    previousDaysTasks = JSON.parse(await response.text());
  } catch (e) {
    alert(e);
  }
  try {
    const response = await fetch('http://127.0.0.1:8000/getFutureDaysData?numDays=' + n);
    nextDaysTasks = JSON.parse(await response.text());
  } catch (e) {
    alert(e);
  }

  // calculate arrays for the number of set and completed past days
  const prevNumTasksSetList = [];
  const prevNumTasksCompletedList = [];
  for (const dayData of previousDaysTasks) {
    let numTasks = 0;
    let numTasksCompleted = 0;
    for (const task of dayData.tasks) {
      numTasks += 1;
      if (task.completed) numTasksCompleted += 1;
    }
    prevNumTasksSetList.push(numTasks);
    prevNumTasksCompletedList.push(numTasksCompleted);
  }

  // populate the last n days with artificial data as they will be empty and i want to demonstrate the graph functionality
  for (let i = 0; i < n; i++) {
    prevNumTasksSetList[i] = Math.abs(hash(previousDaysTasks[i].stringDate)) % 9;
    prevNumTasksCompletedList[i] = Math.min(Math.abs(hash(previousDaysTasks[i].stringDate + '0')) % 9, prevNumTasksSetList[i]);
  }

  // draws all fetched data onto the page
  htmlUpdate(previousDaysTasks, nextDaysTasks, prevNumTasksSetList, prevNumTasksCompletedList);

  // draws the graph
  drawGraph(prevNumTasksCompletedList);
}

let funcCall;

window.onresize = function () {
  clearCanvas();
  clearTimeout(funcCall);
  funcCall = setTimeout(updatePage, 100);
};

// hash function for populating the past days
// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
function hash (s) {
  return s.split('').reduce(function (a, b) {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
}
