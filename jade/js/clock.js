function timeDate() {
    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    var updateMinutes = checkTime(minutes);
    var updateSeconds = checkTime(seconds);
    document.getElementById('time').innerHTML = hours + ":" + updateMinutes + ":" + updateSeconds;
    document.getElementById('date').innerHTML = today.toDateString();
    var updateTime = setTimeout('timeDate()', 200);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
window.onload = timeDate;