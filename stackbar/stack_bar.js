// const { group } = require("d3-array");

var labels = []
prior_data = {}
for(let i=1; i < 10; i++) {
    prior_data[String(i)] = []
}
d3.csv('../backend/graphData/CGL_DataFinal_Mar2021.csv').then(function(result) {
    let students = result.filter(function(d){ return d.Academic_Year != "2014-15" });
    var nested_data = d3.nest()
        .key(function(d) { return d.Special_Program; })
        .key(function(d) { return d["Prior Terms"]; })
        .entries(students)
    for (group of nested_data){
        if (group.key != "Luther J-Term"){
            labels.push(group.key)
            let notcheck = [];
            for(let i=1; i < 10; i++) {
                notcheck.push(String(i))
            }
            for (val of group.values) {
                try{
                    prior_data[val.key].push(val.values.length)
                    notcheck = notcheck.filter(function(item) {
                        return item !== val.key
                    })
                } catch(err){
                    continue
                }
            }
            for (remain of notcheck) {
                prior_data[remain].push(0)
            }
        }
        console.log(prior_data)
    }
});

let terms_colors = [];
for(let i=1; i < 10; i++) {
    terms_colors.push(String(i))
}
var myColor = d3.scaleOrdinal().domain(terms_colors)
    .range(d3.schemeSet2)

let datasets = [];
for (priorTerm in prior_data){
    let partial = {
        label: priorTerm,
        backgroundColor: myColor(priorTerm),
        data: prior_data[priorTerm]
    }
    datasets.push(partial);
}


var barChartData = {
    labels: labels,
    datasets: datasets,

};
window.onload = function() {
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            barStrokeWidth:0,
            barShowStroke: false,
            plugins: {
              datalabels: {
                  formatter: function (value, index, values) {
                    if(value >0 ){
                        value = value.toString();
                        value = value.split(/(?=(?:...)*$)/);
                        value = value.join(',');
                        return value;
                    }else{
                        value = "";
                        return value;
                    }
                  },
                  anchor:'center'
              },
          },
            title: {
                display: true,
                text: 'Stacked Bar of Prior Terms per Special Program'
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
