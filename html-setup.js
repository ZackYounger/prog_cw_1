monthAbrebiations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function htmlSetup(numTasksSet, numTasksCompleted) {

    dayContainer = document.getElementById('days-container');

    for (dayI=0; dayI < numTasksCompleted.length; dayI++) {

        newDay = document.createElement('div');
        dayLabel = document.createElement("p");
        dayLabel.innerText = 'hi \n hello \n' + numTasksCompleted[dayI] + '/' + numTasksSet[dayI];
        progressBar = document.createElement('canvas');

        newDay.appendChild(dayLabel)
        //newDay.appendChild(progressBar)

        newDay.classList.add('day-container','test-border')

        dayContainer.appendChild(newDay)

    }

}