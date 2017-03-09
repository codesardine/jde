function checkTime(time) {
    if (time < 10) {
        time = "0" + time;
    }
    return time;
}

function timeDate() {
    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    var updateMinutes = checkTime(minutes);
    var updateSeconds = checkTime(seconds);
    document.getElementById("time").innerHTML = hours + ":" + updateMinutes + ":" + updateSeconds;
    document.getElementById("date").innerHTML = today.toDateString();
    var updateTime = setTimeout("timeDate()", 200);
}

window.onload = timeDate;