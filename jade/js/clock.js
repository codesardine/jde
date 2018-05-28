function timeDate() {
    var today = new Date();
    document.getElementById("time").innerHTML = today.toTimeString().slice(0, 8);
    document.getElementById("date").innerHTML = today.toDateString();
    var updateTime = setTimeout("timeDate()", 200);
}

window.onload = timeDate;
