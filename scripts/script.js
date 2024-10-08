let startTime;
let updatedTime;
let difference;
let running = false;
let downloadFlag = false;
let interval;
let capturedTimes3km = [];
let capturedTimes6km = [];
let place3km;
let place6km;
const customHeader = ["Posisie", "Tyd", "Naam"];


// Get elements from the DOM
const stopwatchDisplay = document.getElementById('stopwatch');
const capturedTimesDisplay3km = document.getElementById('capturedTimes3km');
const capturedTimesDisplay6km = document.getElementById("capturedTimes6km");

function startStopwatch() {
    if (!running) {
        downloadFlag = false
        place3km = 0;
        place6km = 0;
        startTime = new Date().getTime() - (difference || 0);
        interval = setInterval(updateStopwatch, 100);
        running = true;
    }
}

function stopStopwatch() {
    if (running) {
        clearInterval(interval);
        running = false;
        downloadFlag = true;
    }
}

function resetStopwatch() {
    // Show confirmation dialog
    const confirmReset = confirm("Are you sure you want to reset the stopwatch? All information will be lost if not saved");
    
    if (confirmReset) {
        clearInterval(interval);
        running = false;
        difference = 0;
        stopwatchDisplay.innerHTML = "00:00:00";
        capturedTimes3km = [];
        capturedTimes6km = [];
        capturedTimesDisplay3km.innerHTML = "";
        capturedTimesDisplay6km.innerHTML = "";
    }
}

function updateStopwatch() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;

    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    stopwatchDisplay.innerHTML = 
        String(hours).padStart(2, '0') + ':' + 
        String(minutes).padStart(2, '0') + ':' + 
        String(seconds).padStart(2, '0');
}

function captureTime3km() {
    if (running) {
        place3km++;
        const capturedTime3km = stopwatchDisplay.innerHTML;
        capturedTimes3km.push({runnerPosition: place3km, time: capturedTime3km, runnerName: '' });
        displayCapturedTimes3km();
    }
}
function captureTime6km() {
    if (running) {
        place6km++;
        const capturedTime6km = stopwatchDisplay.innerHTML;
        capturedTimes6km.push({runnerPosition: place6km, time: capturedTime6km, runnerName: '' });
        displayCapturedTimes6km();
    }
}

function displayCapturedTimes3km() {
    // Clear previous captured times display
    capturedTimesDisplay3km.innerHTML = "";
    
    // Create a new div for each captured time
    capturedTimes3km.forEach((item, index) => {
        const timeElement = document.createElement('div');
        timeElement.className = "input"
        timeElement.style.display = 'flex'; // Use flex to align items

        const postion = document.createElement('span');
        postion.textContent = (item.runnerPosition + ":");
        postion.style.marginRight = "10px";

        const timeText = document.createElement('span');
        timeText.textContent = item.time;
        timeText.style.marginRight = '10px'; // Space between time and input

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = 'Enter Name';
        inputField.value = item.runnerName; // Fill input with existing runnerNamee
        inputField.addEventListener('input', (event) => {
            // Update the runnerName in capturedTimes when typing
            capturedTimes3km[index].runnerName = event.target.value;
        });

        timeElement.appendChild(postion);
        timeElement.appendChild(timeText);
        timeElement.appendChild(inputField);
        capturedTimesDisplay3km.appendChild(timeElement);
    });
}

function displayCapturedTimes6km() {
    // Clear previous captured times display
    capturedTimesDisplay6km.innerHTML = "";
    
    // Create a new div for each captured time
    capturedTimes6km.forEach((item, index) => {
        const timeElement = document.createElement('div');
        timeElement.className = "input"
        timeElement.style.display = 'flex'; // Use flex to align items

        const postion = document.createElement('span');
        postion.textContent = (item.runnerPosition + ":");
        postion.style.marginRight = "10px";

        const timeText = document.createElement('span');
        timeText.textContent = item.time;
        timeText.style.marginRight = '10px'; // Space between time and input

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = 'Enter Name';
        inputField.value = item.runnerName; // Fill input with existing runnerNamee
        inputField.addEventListener('input', (event) => {
            // Update the runnerName in capturedTimes when typing
            capturedTimes6km[index].runnerName = event.target.value;
        });

        timeElement.appendChild(postion);
        timeElement.appendChild(timeText);
        timeElement.appendChild(inputField);
        capturedTimesDisplay6km.appendChild(timeElement);
    });
}

function downloadInfo() {
    if(downloadFlag){
        const confirmDownload = confirm("Confirm download");
        if(confirmDownload)
        {
            const isEmpty = (obj) => Object.entries(obj).length === 0;

            if(!isEmpty(capturedTimes3km) || !isEmpty(captureTime6km))
            {
                const date = new Date();
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                const day = String(date.getDate()).padStart(2, '0');
                const dateString = `${year}-${month}-${day}`;

                const workbook = XLSX.utils.book_new();
                const worksheet1 = XLSX.utils.json_to_sheet(capturedTimes3km, { header: ['runnerPosition', 'time', 'runnerName'] });
                XLSX.utils.sheet_add_aoa(worksheet1, [customHeader], { origin: 'A1' }); // Add custom headers
                XLSX.utils.book_append_sheet(workbook, worksheet1, "3_km");

                const worksheet2 = XLSX.utils.json_to_sheet(capturedTimes6km, { header: ['runnerPosition', 'time', 'runnerName'] });
                XLSX.utils.sheet_add_aoa(worksheet2, [customHeader], { origin: 'A1' }); // Add custom headers
                XLSX.utils.book_append_sheet(workbook, worksheet2, "6_km");

                XLSX.writeFile(workbook, `${dateString}.xlsx`);
            }
            else{
                alert("There is no data to download");
            }
        }
    }
    else{
        alert("stop timer first");
    }
}



// Attach event listeners to buttons
document.getElementById('startBtn').addEventListener('click', startStopwatch);
document.getElementById('stopBtn').addEventListener('click', stopStopwatch);
document.getElementById('resetBtn').addEventListener('click', resetStopwatch);
document.getElementById('captureBtn3km').addEventListener('click', captureTime3km);
document.getElementById('captureBtn6km').addEventListener('click', captureTime6km);
document.getElementById('download').addEventListener('click', downloadInfo);
