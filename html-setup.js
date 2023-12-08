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

        newDay.classList.add('day-container','test-border')

        dayContainers[0].appendChild(newDay)
    }


    selectorContainer = document.getElementById('display-tasks');
    
    for (dayI=0; dayI < nextDaysData.length; dayI++) {

        sup = getSup(nextDaysData[dayI].day)

        newDay = document.createElement('div');
        dayLabel = document.createElement("p");
        dayLabel.innerText = previousDaysData[dayI].day+sup +'\n'+ numTasksCompleted[dayI] + '/' + numTasksSet[dayI];

        newDay.appendChild(dayLabel)

        newDay.classList.add('day-container','test-border')

        addHoverFunction(newDay, dayI)

        dayContainers[1].appendChild(newDay)


        tasksContainer = document.createElement('div');
        tasksContainer.classList.add('tasks-container')

        for (taskData of nextDaysData[dayI].tasks) {
            addTaskToContainer(tasksContainer, taskData.text)
        }
        selectorContainer.appendChild(tasksContainer)
        taskContainerElements.push(tasksContainer)
    }


    document.getElementById('submit-button').addEventListener('click', function() {
        var taskText = document.getElementById('input-box').value;
        addTaskToContainer(taskContainerElements[currentVisibleDay], taskText)
    });  

}


function addTaskToContainer(container, task) {
    taskContainer = document.createElement('div');
    taskContainer.classList.add('task-container', 'border');
    taskContainer.innerText = task

    container.appendChild(taskContainer);
}

function addHoverFunction(newDay, dayI) {
    newDay.onclick = function () {

        if (dayI != currentVisibleDay) {
            taskContainerElements[currentVisibleDay].classList.remove('active');
            taskContainerElements[currentVisibleDay].offsetHeight;
            taskContainerElements[dayI].classList.add('active');
            taskContainerElements[dayI].offsetHeight;
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
