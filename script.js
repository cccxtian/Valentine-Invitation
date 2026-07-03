/* ==========================================
   AQUA-CURE
   Smart Water Quality Monitoring Dashboard
========================================== */

"use strict";

/* ==========================================
   DOM ELEMENTS
========================================== */

const loader = document.getElementById("loader");

const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");

const connectionStatus = document.getElementById("connectionStatus");

const wqiValue = document.getElementById("wqiValue");

const systemStatus = document.getElementById("systemStatus");

const logContainer = document.getElementById("logContainer");
const alertContainer = document.getElementById("alertContainer");

const overrideBtn = document.getElementById("overrideBtn");

const modal = document.getElementById("modal");

const confirmOverride = document.getElementById("confirmOverride");
const cancelOverride = document.getElementById("cancelOverride");


/* ==========================================
   SENSOR VALUES
========================================== */

const sensorData = {

    ph: 7.2,

    temperature: 27,

    turbidity: 18,

    oxygen: 6.8,

    calcium: 335

};


/* ==========================================
   SENSOR DOM
========================================== */

const sensors = {

    ph: {
        value: document.getElementById("phValue"),
        status: document.getElementById("phText")
    },

    temperature: {
        value: document.getElementById("tempValue"),
        status: document.getElementById("tempText")
    },

    turbidity: {
        value: document.getElementById("turbidityValue"),
        status: document.getElementById("turbidityText")
    },

    oxygen: {
        value: document.getElementById("oxygenValue"),
        status: document.getElementById("oxygenText")
    },

    calcium: {
        value: document.getElementById("calciumValue"),
        status: document.getElementById("calciumText")
    }

};

/* ==========================================
   LOADING SCREEN
========================================== */

const loadingPercent = document.querySelector(".loading-percent");
const loadingStatus = document.getElementById("loadingStatus");

const messages = [

    "Initializing Sensors...",

    "Connecting to ESP32...",

    "Calibrating Water Parameters...",

    "Loading Dashboard...",

    "System Ready..."

];

let progress = 0;

const loading = setInterval(()=>{

    progress++;

    loadingPercent.textContent = progress + "%";

    if(progress==20)
        loadingStatus.textContent=messages[0];

    if(progress==40)
        loadingStatus.textContent=messages[1];

    if(progress==60)
        loadingStatus.textContent=messages[2];

    if(progress==80)
        loadingStatus.textContent=messages[3];

    if(progress==100){

        loadingStatus.textContent=messages[4];

        clearInterval(loading);

    }

},25);

window.addEventListener("load",()=>{

    setTimeout(()=>{

        loader.classList.add("hidden");

    },2600);

});
/* ==========================================
   DATE & TIME
========================================== */

function updateClock(){

    const now = new Date();

    currentDate.textContent = now.toLocaleDateString("en-US",{

        weekday:"long",

        month:"long",

        day:"numeric",

        year:"numeric"

    });

    currentTime.textContent = now.toLocaleTimeString();

}

updateClock();

setInterval(updateClock,1000);

/* ==========================================
   CONNECTION STATUS
========================================== */

function updateConnection(){

    if(navigator.onLine){

        connectionStatus.textContent="Online";

        connectionStatus.style.color="#00ff99";

    }

    else{

        connectionStatus.textContent="Offline";

        connectionStatus.style.color="#ff4d4d";

    }

}

updateConnection();

window.addEventListener("online",updateConnection);

window.addEventListener("offline",updateConnection);

/* ==========================================
   ACTIVITY LOG
========================================== */

function addLog(message){

    const div=document.createElement("div");

    div.className="log-item";

    div.innerHTML=`

        <strong>${new Date().toLocaleTimeString()}</strong>

        <br>

        ${message}

    `;

    logContainer.prepend(div);

    if(logContainer.children.length>20){

        logContainer.removeChild(

            logContainer.lastChild

        );

    }

}

/* ==========================================
   ALERTS
========================================== */

function addAlert(message,color="#ffb300"){

    const div=document.createElement("div");

    div.className="alert-item";

    div.style.borderLeftColor=color;

    div.innerHTML=`

        <strong>${new Date().toLocaleTimeString()}</strong>

        <br>

        ${message}

    `;

    alertContainer.prepend(div);

    if(alertContainer.children.length>10){

        alertContainer.removeChild(

            alertContainer.lastChild

        );

    }

}

/* ==========================================
   INITIAL LOGS
========================================== */

addLog("Dashboard initialized.");

addLog("Sensor monitoring started.");

addLog("Waiting for live sensor data...");

addAlert("System operating normally.","#00d084");

/* ==========================================
   SENSOR SIMULATION
========================================== */

function random(min, max) {

    return Math.random() * (max - min) + min;

}

function updateSensors() {

    sensorData.ph = random(6.5, 8.8);

    sensorData.temperature = random(24, 31);

    sensorData.turbidity = random(5, 40);

    sensorData.oxygen = random(4.5, 8.5);

    sensorData.calcium = random(250, 420);

}

/* ==========================================
   DISPLAY SENSOR VALUES
========================================== */

function displaySensors() {

    sensors.ph.value.textContent =
        sensorData.ph.toFixed(2);

    sensors.temperature.value.textContent =
        sensorData.temperature.toFixed(1) + " °C";

    sensors.turbidity.value.textContent =
        sensorData.turbidity.toFixed(1) + " NTU";

    sensors.oxygen.value.textContent =
        sensorData.oxygen.toFixed(2) + " mg/L";

    sensors.calcium.value.textContent =
        sensorData.calcium.toFixed(0) + " ppm";

}

/* ==========================================
   SENSOR STATUS
========================================== */

function setStatus(element, text, cssClass) {

    element.textContent = text;

    element.className = cssClass;

}

function checkPH() {

    if (sensorData.ph >= 6.8 && sensorData.ph <= 8.0) {

        setStatus(sensors.ph.status, "Normal", "normal");

    }

    else if (sensorData.ph >= 6.5 && sensorData.ph <= 8.5) {

        setStatus(sensors.ph.status, "Warning", "warning");

    }

    else {

        setStatus(sensors.ph.status, "Critical", "critical");

        addAlert("Critical pH detected.", "#ff4d4d");

    }

}

function checkTemperature() {

    if (sensorData.temperature <= 28) {

        setStatus(
            sensors.temperature.status,
            "Normal",
            "normal"
        );

    }

    else if (sensorData.temperature <= 30) {

        setStatus(
            sensors.temperature.status,
            "Warning",
            "warning"
        );

    }

    else {

        setStatus(
            sensors.temperature.status,
            "Critical",
            "critical"
        );

        addAlert(
            "Water temperature is too high.",
            "#ff4d4d"
        );

    }

}

function checkTurbidity() {

    if (sensorData.turbidity <= 15) {

        setStatus(
            sensors.turbidity.status,
            "Normal",
            "normal"
        );

    }

    else if (sensorData.turbidity <= 25) {

        setStatus(
            sensors.turbidity.status,
            "Warning",
            "warning"
        );

    }

    else {

        setStatus(
            sensors.turbidity.status,
            "Critical",
            "critical"
        );

        addAlert(
            "High turbidity detected.",
            "#ff4d4d"
        );

    }

}

function checkOxygen() {

    if (sensorData.oxygen >= 6) {

        setStatus(
            sensors.oxygen.status,
            "Normal",
            "normal"
        );

    }

    else if (sensorData.oxygen >= 5) {

        setStatus(
            sensors.oxygen.status,
            "Warning",
            "warning"
        );

    }

    else {

        setStatus(
            sensors.oxygen.status,
            "Critical",
            "critical"
        );

        addAlert(
            "Low dissolved oxygen.",
            "#ff4d4d"
        );

    }

}

function checkCalcium() {

    if (
        sensorData.calcium >= 280 &&
        sensorData.calcium <= 360
    ) {

        setStatus(
            sensors.calcium.status,
            "Normal",
            "normal"
        );

    }

    else if (
        sensorData.calcium >= 260 &&
        sensorData.calcium <= 390
    ) {

        setStatus(
            sensors.calcium.status,
            "Warning",
            "warning"
        );

    }

    else {

        setStatus(
            sensors.calcium.status,
            "Critical",
            "critical"
        );

        addAlert(
            "Calcium level out of range.",
            "#ff4d4d"
        );

    }

}

/* ==========================================
   CHECK ALL
========================================== */

function checkSensors() {

    checkPH();

    checkTemperature();

    checkTurbidity();

    checkOxygen();

    checkCalcium();

}

/* ==========================================
   LIVE UPDATE LOOP
========================================== */

function sensorLoop() {

    // store previous values
    previousSensorData.ph = sensorData.ph;
    previousSensorData.temperature = sensorData.temperature;
    previousSensorData.turbidity = sensorData.turbidity;
    previousSensorData.oxygen = sensorData.oxygen;
    previousSensorData.calcium = sensorData.calcium;

    // simulate new sensor values
    updateSensors();

    // update UI
    displaySensors();
    checkSensors();

    // system logic
    calculateWQI();
    updateSystemStatus();
    updateCardColors();

    // visuals
    updateChart();
    updateTimestamp();

    // logs (keep this light)
    if (Math.random() > 0.6) {
    addLog("Sensor data refreshed.");
}
}

sensorLoop();
setInterval(sensorLoop, 5000);
/* ==========================================
   WATER QUALITY INDEX
========================================== */

function calculateWQI() {

    let score = 100;

    // pH
    if(sensorData.ph < 6.8 || sensorData.ph > 8.0){
        score -= 15;
    }

    // Temperature
    if(sensorData.temperature > 28){
        score -= 15;
    }

    // Turbidity
    if(sensorData.turbidity > 15){
        score -= 20;
    }

    // Oxygen
    if(sensorData.oxygen < 6){
        score -= 20;
    }

    // Calcium
    if(sensorData.calcium < 280 || sensorData.calcium > 360){
        score -= 15;
    }

    score = Math.max(0, score);

    wqiValue.textContent = score + "%";

    return score;

}

/* ==========================================
   SYSTEM STATUS
========================================== */

function updateSystemStatus(){

    const wqi = calculateWQI();

    if(wqi >= 90){

        systemStatus.textContent = "OPTIMAL";

        systemStatus.style.color = "#00ff99";

        systemStatus.style.borderColor = "#00ff99";

    }

    else if(wqi >= 70){

        systemStatus.textContent = "WARNING";

        systemStatus.style.color = "#ffd54f";

        systemStatus.style.borderColor = "#ffd54f";

    }

    else{

        systemStatus.textContent = "CRITICAL";

        systemStatus.style.color = "#ff4d4d";

        systemStatus.style.borderColor = "#ff4d4d";

    }

}

/* ==========================================
   CARD COLORS
========================================== */

const sensorCards = document.querySelectorAll(".sensor-card");

function updateCardColors(){

    sensorCards.forEach(card=>{

        const status = card.querySelector("p");

        card.style.border = "1px solid rgba(255,255,255,.15)";

        if(status.classList.contains("normal")){

            card.style.boxShadow =
            "0 0 25px rgba(0,255,120,.20)";

        }

        else if(status.classList.contains("warning")){

            card.style.boxShadow =
            "0 0 25px rgba(255,193,7,.25)";

        }

        else{

            card.style.boxShadow =
            "0 0 25px rgba(255,70,70,.30)";

        }

    });

}

/* ==========================================
   LIVE CHART
========================================== */

const ctx = document
.getElementById("historyChart")
.getContext("2d");

const historyChart = new Chart(ctx,{

    type:"line",

    data:{

        labels:[],

        datasets:[

        {

            label:"Temperature",

            data:[],

            borderColor:"#18b7ff",

            tension:.4

        },

        {

            label:"pH",

            data:[],

            borderColor:"#00d084",

            tension:.4

        },

        {

            label:"Turbidity",

            data:[],

            borderColor:"#ffc107",

            tension:.4

        }

        ]

    },

    options:{

        responsive:true,

        maintainAspectRatio:false,

        animation:true,

        scales:{

            x:{

                ticks:{

                    color:"#ffffff"

                }

            },

            y:{

                ticks:{

                    color:"#ffffff"

                }

            }

        },

        plugins:{

            legend:{

                labels:{

                    color:"#ffffff"

                }

            }

        }

    }

});

/* ==========================================
   UPDATE CHART
========================================== */

function updateChart(){

    const now = new Date().toLocaleTimeString();

    historyChart.data.labels.push(now);

    historyChart.data.datasets[0].data.push(
        sensorData.temperature.toFixed(1)
    );

    historyChart.data.datasets[1].data.push(
        sensorData.ph.toFixed(2)
    );

    historyChart.data.datasets[2].data.push(
        sensorData.turbidity.toFixed(1)
    );

    if(historyChart.data.labels.length>15){

        historyChart.data.labels.shift();

        historyChart.data.datasets.forEach(dataset=>{

            dataset.data.shift();

        });

    }

    historyChart.update();

}

/* ==========================================
   SENSOR LOOP
========================================== */



/* ==========================================
   ALERT COOLDOWN
========================================== */

const alertCooldown = {};

function smartAlert(message, color = "#ff4d4d") {

    const now = Date.now();

    if (
        alertCooldown[message] &&
        now - alertCooldown[message] < 15000
    ) {
        return;
    }

    alertCooldown[message] = now;

    addAlert(message, color);

}

/* ==========================================
   SENSOR TRENDS
========================================== */

const previousSensorData = {

    ph: sensorData.ph,

    temperature: sensorData.temperature,

    turbidity: sensorData.turbidity,

    oxygen: sensorData.oxygen,

    calcium: sensorData.calcium

};

function trend(current, previous){

    if(current > previous){

        return " ▲";

    }

    if(current < previous){

        return " ▼";

    }

    return "";

}

/* ==========================================
   ANIMATED VALUES
========================================== */

function animateValue(element, start, end, decimals = 1){

    const duration = 600;

    const startTime = performance.now();

    function update(time){

        const progress = Math.min(
            (time - startTime) / duration,
            1
        );

        const value =
            start + (end - start) * progress;

        element.textContent =
            value.toFixed(decimals);

        if(progress < 1){

            requestAnimationFrame(update);

        }

    }

    requestAnimationFrame(update);

}

/* ==========================================
   LAST UPDATED
========================================== */

const updateElement = document.createElement("p");

updateElement.style.marginTop = "15px";

updateElement.style.fontSize = "14px";

updateElement.style.opacity = ".8";

document
.querySelector(".system-panel")
.appendChild(updateElement);

function updateTimestamp(){

    updateElement.textContent =
        "Last Updated: " +
        new Date().toLocaleTimeString();

}

/* ==========================================
   MODAL
========================================== */

overrideBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

document.getElementById("closeModal").addEventListener("click", () => {
    modal.style.display = "none";
});

confirmOverride.addEventListener("click", () => {
    modal.style.display = "none";

    addLog("Manual Override Activated.");

    addAlert("Manual Override Enabled.", "#18b7ff");
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

const devices = {
    airPump: document.getElementById("airPump"),
    filterPump: document.getElementById("filterPump"),
    phPump: document.getElementById("phPump"),
    calciumPump: document.getElementById("calciumPump")
};

function logDeviceChange(name, state) {
    addLog(`${name} turned ${state ? "ON" : "OFF"}`);
}

devices.airPump.addEventListener("change", () => {
    logDeviceChange("Air Pump", devices.airPump.checked);
});

devices.filterPump.addEventListener("change", () => {
    logDeviceChange("Filtration Pump", devices.filterPump.checked);
});

devices.phPump.addEventListener("change", () => {
    logDeviceChange("pH Dosing Pump", devices.phPump.checked);
});

devices.calciumPump.addEventListener("change", () => {
    logDeviceChange("Calcium Dosing Pump", devices.calciumPump.checked);
});

/* ==========================================
   EXPORT CSV
========================================== */

function exportCSV(){

    const csv =

`Sensor,Value
pH,${sensorData.ph.toFixed(2)}
Temperature,${sensorData.temperature.toFixed(1)}
Turbidity,${sensorData.turbidity.toFixed(1)}
Dissolved Oxygen,${sensorData.oxygen.toFixed(2)}
Calcium,${sensorData.calcium.toFixed(0)}
`;

    const blob = new Blob(
        [csv],
        {type:"text/csv"}
    );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "sensor-data.csv";

    a.click();

}

/* ==========================================
   SHORTCUT KEYS
========================================== */

document.addEventListener("keydown",e=>{

    if(e.key==="m"){

        overrideBtn.click();

    }

    if(e.key==="e"){

        exportCSV();

    }

});

/* ==========================================
   ESP32 PLACEHOLDER
========================================== */

async function getSensorData(){

    /*
    Example:

    const response =
        await fetch("http://192.168.1.100/data");

    const data =
        await response.json();

    sensorData.ph = data.ph;
    sensorData.temperature = data.temperature;
    sensorData.turbidity = data.turbidity;
    sensorData.oxygen = data.oxygen;
    sensorData.calcium = data.calcium;
    */

}


