function htmlSetup(n) {

    dayContainer = document.getElementById('days-container');

    for (dayI=0; dayI < n; dayI++) {

        newDay = document.createElement('div');
        dayLabel = document.createElement("p");
        dayLabel.innerText = "Hello!";
        progressBar = document.createElement('canvas');

        newDay.appendChild(dayLabel)
        //newDay.appendChild(progressBar)

        newDay.classList.add('day-container','test-border')

        dayContainer.appendChild(newDay)

    }

}