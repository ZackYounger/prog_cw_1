monthAbrebiations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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


    
    for (dayI=0; dayI < nextDaysData.length; dayI++) {

        sup = getSup(nextDaysData[dayI].day)

        newDay = document.createElement('div');
        dayLabel = document.createElement("p");
        dayLabel.innerText = previousDaysData[dayI].day+sup +'\n'+ numTasksCompleted[dayI] + '/' + numTasksSet[dayI];

        newDay.appendChild(dayLabel)

        newDay.classList.add('day-container','test-border')

        addHoverFunction(newDay, dayI)

        dayContainers[1].appendChild(newDay)
    }

}

function addHoverFunction(newDay, dayI) {
    newDay.onmouseover = function () {
        //showDayData(nextDaysData[dayI].day);
        console.log(dayI);
      };
}

function getSup(day) {
    if (previousDaysData[dayI].day==1) return 'ˢᵗ'
    else if (previousDaysData[dayI].day==2) return 'ⁿᵈ'
    else if (previousDaysData[dayI].day==3) return 'ʳᵈ'
    else return 'ᵗʰ'
}

function showDayData(d) {
    console.log('Boo' + d)
}