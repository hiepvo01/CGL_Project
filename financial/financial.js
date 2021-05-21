window.onload=function() {
    var marksCanvas = document.getElementById("marksChart");

    var marksData = {
    labels: ['No', 'Very Low', 'Low', 'Med', 'High'],
    datasets: [{
        label: "Terms",
        backgroundColor: "rgba(200,0,0,0.2)",
        data: [65, 75, 70, 80, 60]
    }, {
        label: "Program Types",
        backgroundColor: "rgba(0,0,200,0.2)",
        data: [54, 65, 60, 70, 75]
    }]
    };

    var radarChart = new Chart(marksCanvas, {
    type: 'radar',
    data: marksData
    });
}