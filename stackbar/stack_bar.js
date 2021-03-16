function testStackBar(result, attr){
    var labels = []
    prior_data = {}
    for(let i=1; i < 10; i++) {
        prior_data[String(i)] = []
    }
    let students = result.filter(function(d){ return d.Academic_Year != "2014-15" });
    var nested_data = d3.nest()
        .key(function(d) { return d[attr]; })
        .sortKeys(d3.ascending)
        .key(function(d) { return d["Prior Terms"]; })
        .entries(students)

    console.log(nested_data)

    for (group of nested_data){
        if (group.key != "" && group.key!= "Luther J-Term"){
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
    };
    let terms_colors = [];
    for(let i=1; i < 10; i++) {
        terms_colors.push(String(i))
    }

    var myColor = d3.scaleOrdinal().domain(terms_colors)
        .range(d3.schemeSet2)

    
    for (l of labels) {
        if (l.includes(', ')) {
            sep = l.split(', ')
            for (s of sep) {
                for(let i =1; i < 10; i++) {
                    prior_data[String(i)][labels.indexOf(s)] += prior_data[String(i)][labels.indexOf(l)]
                }
            }
        }
    }
    let comma = [];
    for (l of labels) {
        if (l.includes(', ')) {
            comma.push(labels.indexOf(l))
        }
    }
    for (c of comma) {
        labels[c]= " ";
        for(let i =1; i < 10; i++) {
            prior_data[String(i)][c] = " "
        }
    }
    labels = labels.filter(item => item !== " ")
    for(let i =1; i < 10; i++) {
        prior_data[String(i)] = prior_data[String(i)].filter(item => item !== " ")
    }

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

    var ctx = document.getElementById('canvas').getContext('2d');
    var chart = new Chart(ctx, {
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
                display: false,
                text: 'Stacked Bar Chart of Prior Terms'
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            hover: {
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
}
function changeTitle(title){
    var origin = document.querySelector("#title"); 
    origin.innerHTML = `${title} Stacked Bar Chart of Prior Terms `;
}

function resetCanvas(){
    $('#canvas').remove();
    $('.stackbar').append('<canvas id="canvas"></canvas>')
  }
  

function draw(attr){
    resetCanvas();
    d3.select('canvas').selectAll('*').remove();
  
    d3.csv('../backend/graphData/CGL_DataFinal_Mar2021.csv').then(function(result) {
        testStackBar(result, attr);
        changeTitle(attr)
    });
  }