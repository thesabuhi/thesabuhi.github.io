function getClockTime() {
    const d = new Date();
    d.getHours();
    d.getMinutes();
    let clock;
    if (d.getMinutes()<10) {
        clock = d.getHours() + ':' + '0' + d.getMinutes();
    } else {
        clock = d.getHours() + ':' + d.getMinutes();
    }
    
    document.getElementById("detail__time").innerHTML = clock;
}

    getClockTime();
    setInterval(getClockTime,500);
