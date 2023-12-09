monthAbrebiations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

taskContainerElements = []
currentVisibleDay = 0;

function htmlSetup(previousDaysData, nextDaysData, numTasksSet, numTasksCompleted) {

    dayContainers = document.getElementsByClassName('days-container');

    for (dayI=0; dayI < previousDaysData.length; dayI++) {

        sup = getSup(previousDaysData[dayI].day)

        newDay = document.createElement('div');
        dayLabel = document.createElement("p");
        dayLabel.innerText = previousDaysData[dayI].day+sup +'\n'+ numTasksCompleted[dayI] + '/' + numTasksSet[dayI];

        newDay.appendChild(dayLabel)

        newDay.classList.add('day-container')

        dayContainers[0].appendChild(newDay)
    }


    selectorContainer = document.getElementById('display-tasks');
    
    for (dayI=0; dayI < nextDaysData.length; dayI++) {

        sup = getSup(nextDaysData[dayI].day)

        newDay = document.createElement('div');
        dayLabel = document.createElement("p");
        dayLabel.innerText = previousDaysData[dayI].day+sup +'\n'+ numTasksCompleted[dayI] + '/' + numTasksSet[dayI];

        newDay.appendChild(dayLabel)

        newDay.classList.add('day-container')

        addSelectDayFunctionality(newDay, dayI)

        dayContainers[1].appendChild(newDay)


        tasksContainer = document.createElement('div');
        tasksContainer.classList.add('tasks-container')

        for (taskData of nextDaysData[dayI].tasks) {
            addTaskToContainer(tasksContainer, taskData.text)
        }
        selectorContainer.appendChild(tasksContainer)
        taskContainerElements.push(tasksContainer)
    }

    taskContainerElements[0].classList.add('active')

    document.getElementById('submit-button').addEventListener('click', function() {
        var taskText = document.getElementById('input-box').value;
        if (taskText) addTaskToContainer(taskContainerElements[currentVisibleDay], taskText)
    });  
}


function addTaskToContainer(container, task) {
    taskContainer = document.createElement('div');

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

    addButtonFunctionality(completeTaskButton, removeTaskButton)
}

function addButtonFunctionality(completeTaskButton, removeTaskButton) {
    completeTaskButton.addEventListener('click', function() {
        taskTextBox = completeTaskButton.parentNode.parentNode.childNodes[0]
        console.log(taskTextBox.classList)
        if (taskTextBox.classList.contains('completed')) {
            taskTextBox.classList.remove('completed')
        } else {
            taskTextBox.classList.add('completed')
        }

        //update backend
    })

    removeTaskButton.addEventListener('click', function() {
        removeTaskButton.parentNode.parentNode.parentNode.removeChild(removeTaskButton.parentNode.parentNode)

        //update backend
    })
}

function addSelectDayFunctionality(newDay, dayI) {
    newDay.onclick = function () {

        if (dayI != currentVisibleDay) {
            taskContainerElements[currentVisibleDay].classList.remove('active');
            taskContainerElements[currentVisibleDay].offsetHeight;
            taskContainerElements[dayI].classList.add('active');
            currentVisibleDay = dayI
        }
    };
}


function getSup(day) {
    if (previousDaysData[dayI].day==1) return 'ˢᵗ'
    else if (previousDaysData[dayI].day==2) return 'ⁿᵈ'
    else if (previousDaysData[dayI].day==3) return 'ʳᵈ'
    else return 'ᵗʰ'
}
