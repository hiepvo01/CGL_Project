const { group } = require("d3-array");

var labels = []
prior_data = {}
for(let i=1; i < 10; i++) {
    prior_data[i] = []
}
d3.csv('../backend/graphData/CGL_DataFinal_Mar2021.csv').then(function(result) {
    let students = result.filter(function(d){ return d.Academic_Year != "2014-15" });
    var nested_data = d3.nest()
        .key(function(d) { return d.Special_Program; })
        .key(function(d) { return d["Prior Terms"]; })
        .entries(students)
    for (group of nested_data){
        labels.push(group.key)
        for (k in prior_data){
            if (k in group.values) {
                prior_data[k].push()
            }
        }
        for (val of group.values) {
            prior_data[val].push(val.values.length)
        }
    }
});


var barChartData = {
    labels: labels,
    datasets: [{
        label: 'Dataset 1',
        backgroundColor: window.chartColors.red,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(), 
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }, {
        label: 'Dataset 2',
        backgroundColor: window.chartColors.blue,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }, {
        label: 'Dataset 3',
        backgroundColor: window.chartColors.green,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }]

};
window.onload = function() {
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myBar = new Chart(ctx, {
        type: 'line',
        data: barChartData,
        options: {
            title: {
                display: true,
                text: 'Chart.js Bar Chart - Stacked'
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            responsive: true,
            scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });
};
