function timeDate() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('time').innerHTML = h + ":" + m + ":" + s;
    document.getElementById('date').innerHTML = today.toDateString();

    t = setTimeout('timeDate()', 200)
}
function checkTime(i) {
    if ( i < 10 ) {
        i = "0" + i;
    }
    return i
}
window.onload=timeDate;
