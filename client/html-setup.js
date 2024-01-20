monthAbrebiations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

taskContainerElements = []

futureDayLabels = []

let futureNumTasksSetList;
let futureNumTasksCompletedList;

currentVisibleDayI = 0;
let currentVisibleDay;

function htmlSetup(previousDaysTasks, futureDaysTasks, prevNumTasksSetList, prevNumTasksCompletedList) {

    console.log(previousDaysTasks)
    console.log()

    futureNumTasksSetList = []
    futureNumTasksCompletedList = []
    for (dayData of futureDaysTasks) {
        numTasks = 0
        numTasksCompleted = 0
        for (task of dayData.tasks) {
            numTasks += 1
            if (task.completed) numTasksCompleted += 1
        }
        futureNumTasksSetList.push(numTasks)
        futureNumTasksCompletedList.push(numTasksCompleted)
    }

    dayContainers = document.getElementsByClassName('days-container');

    for (dayI=0; dayI < previousDaysTasks.length; dayI++) {

        day = previousDaysTasks[dayI].stringDate.split('|')[0]
        sup = getSup(day)

        newDay = document.createElement('div');
        dayLabel = document.createElement("p");
        dayLabel.innerText = day+sup +'\n'+ prevNumTasksCompletedList[dayI] + '/' + prevNumTasksSetList[dayI];

        newDay.appendChild(dayLabel)

        newDay.classList.add('day-container')

        dayContainers[0].appendChild(newDay)
    }


    selectorContainer = document.getElementById('display-tasks');
    
    for (dayI=0; dayI < nextDaysTasks.length; dayI++) {

        day = futureDaysTasks[dayI].stringDate.split('|')[0]
        sup = getSup(day)

        newDay = document.createElement('div');
        //dayLabel = document.createElement("p");
        dayLabel = document.createElement("div");

        dayLabel.style.margin = '0px'
        dayLabel.style.padding = '0px'

        x = document.createElement("p");
        x.innerText = day+sup
        x.classList.add('day-container-element')
        y = document.createElement("p");
        y.innerText = futureNumTasksCompletedList[dayI] + '/' + futureNumTasksSetList[dayI];
        y.classList.add('day-container-element')


        dayLabel.appendChild(x)
        dayLabel.appendChild(y)

        newDay.appendChild(dayLabel)

        newDay.classList.add('day-container')

        addSelectDayFunctionality(newDay, dayI)

        dayContainers[1].appendChild(newDay)


        tasksContainer = document.createElement('div');
        tasksContainer.classList.add('tasks-container')

        for (taskData of nextDaysTasks[dayI].tasks) {
            addTaskToContainer(tasksContainer, taskData.text)
        }
        selectorContainer.appendChild(tasksContainer)
        taskContainerElements.push(tasksContainer)

        if (dayI == 0) {
            currentVisibleDay = newDay
        } else {
            newDay.classList.add('not-active')
        }

        futureDayLabels.push( newDay )
    }

    taskContainerElements[0].classList.add('active')

    //Submit New Task Button
    document.getElementById('submit-button').addEventListener('click', async function() {
        var inputBox = document.getElementById('input-box');
        if (inputBox.value) {
            addTaskToContainer(taskContainerElements[currentVisibleDayI], inputBox.value)
            try {
                await fetch('http://127.0.0.1:8000/addTask', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify( {
                        stringDate : futureDaysTasks[currentVisibleDayI].stringDate,
                        taskText : inputBox.value} )
                })        } catch(e) {
                alert(e);
            }

            inputBox.value = '';

            totalTaskNumContainer = currentVisibleDay.childNodes[0].childNodes[1]
            futureNumTasksSetList[currentVisibleDayI] += 1
            totalTaskNumContainer.innerText = futureNumTasksCompletedList[currentVisibleDayI] + '/' + futureNumTasksSetList[currentVisibleDayI]
        }
    });  
}


function addTaskToContainer(container, task) {
    taskContainer = document.createElement('div')

    taskContainer = document.createElement('div');
    taskContainer.classList.add('task-container', 'border');

    taskText = document.createElement('p')
    taskText.innerText = task
    taskText.classList.add('task-text');
    taskContainer.appendChild(taskText)

    buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-holder')

    completeTaskButton = document.createElement('button');
    completeTaskButton.classList.add('complete-task-button', 'task-button');
    buttonContainer.appendChild(completeTaskButton)

    removeTaskButton = document.createElement('button');
    removeTaskButton.classList.add('remove-task-button', 'task-button');
    buttonContainer.appendChild(removeTaskButton)

    taskContainer.appendChild(buttonContainer)

    container.appendChild(taskContainer);

    addTaskButtonsFunctionality(completeTaskButton, removeTaskButton)
}

function addTaskButtonsFunctionality(completeTaskButton, removeTaskButton) {
    completeTaskButton.addEventListener('click', function() {
        
        taskTextBox = completeTaskButton.parentNode.parentNode.childNodes[0]
        completedTaskNumContainer = currentVisibleDay.childNodes[0].childNodes[1]
    
        if (taskTextBox.classList.contains('completed')) {
            taskTextBox.classList.remove('completed')
            futureNumTasksCompletedList[currentVisibleDayI] -= 1
        } else {
            taskTextBox.classList.add('completed')
            futureNumTasksCompletedList[currentVisibleDayI] += 1
        }

        completedTaskNumContainer.innerText = futureNumTasksCompletedList[currentVisibleDayI] + '/' + futureNumTasksSetList[currentVisibleDayI]

        //update backend
    })

    removeTaskButton.addEventListener('click', function() {

        taskTextBox = removeTaskButton.parentNode.parentNode.childNodes[0].classList
        if (taskTextBox.contains('completed')) {
            futureNumTasksCompletedList[currentVisibleDayI] -= 1
        }

        removeTaskButton.parentNode.parentNode.parentNode.removeChild(removeTaskButton.parentNode.parentNode)

        totalTaskNumContainer = currentVisibleDay.childNodes[0].childNodes[1]
        futureNumTasksSetList[currentVisibleDayI] -= 1
        totalTaskNumContainer.innerText = futureNumTasksCompletedList[currentVisibleDayI] + '/' + futureNumTasksSetList[currentVisibleDayI]

        //update backend
    })
}

function addSelectDayFunctionality(newDay, dayI) {
    newDay.onclick = function () {
        if (currentVisibleDay) {
            currentVisibleDay.classList.add('not-active')
        }
        newDay.classList.remove('not-active')
        if (dayI != currentVisibleDayI) {
            taskContainerElements[currentVisibleDayI].classList.remove('active');
            taskContainerElements[currentVisibleDayI].offsetHeight;
            taskContainerElements[dayI].classList.add('active');
            currentVisibleDayI = dayI
            currentVisibleDay = newDay
        }
    };
}


function getSup(day) {
    if (previousDaysTasks[dayI].day==1) return 'ˢᵗ'
    else if (previousDaysTasks[dayI].day==2) return 'ⁿᵈ'
    else if (previousDaysTasks[dayI].day==3) return 'ʳᵈ'
    else return 'ᵗʰ'
}
