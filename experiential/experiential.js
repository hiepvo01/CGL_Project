function testStackBar(result, j=false){
    attr = document.querySelector("#musicSport").innerHTML
    term = document.querySelector("#term").innerHTML

    let students = result.filter(function(d){ return d.Academic_Year != "2014-15" });
    
    var labels = []
    prior_data = {}
    
    var nested_labels = d3.nest()
        .key(function(d) { return d[term]; })
        .sortKeys(d3.ascending)
        .entries(students)

    for(let i of nested_labels) {
        if(i.key != "" && i.key != "17" && i.key != "11"){
            prior_data[i.key] = []
        }
    }

    var nested_data = d3.nest()
        .key(function(d) { return d[attr]; })
        .sortKeys(d3.ascending)
        .key(function(d) { return d[term]; })
        .entries(students)
    
    if (j) {
        for (group of nested_data){
            // if (group.key != "" && group.key!= "Luther J-Term"){
            if (group.key != "" && group.key== "Luther J-Term"){
    
                try {
                    musics = group.key.split(", ")
                    if (musics.length == 2 && musics.pop()==""){
                        group.key = musics[0]
                    }
                } catch (e) {
                }
                labels.push(group.key)
                let notcheck = [];
                for(let i of nested_labels) {
                    if(i.key != "" && i.key != "17" && i.key != "11"){
                        notcheck.push(i.key)
                    }
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
    } else {
        for (group of nested_data){
            // if (group.key != "" && group.key!= "Luther J-Term"){
            if (group.key != "" && group.key!= "Luther J-Term"){
    
                try {
                    musics = group.key.split(", ")
                    if (musics.length == 2 && musics.pop()==""){
                        group.key = musics[0]
                    }
                } catch (e) {
                }
                labels.push(group.key)
                let notcheck = [];
                for(let i of nested_labels) {
                    if(i.key != "" && i.key != "17" && i.key != "11"){
                        notcheck.push(i.key)
                    }
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
    }

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
                for(let i of nested_labels) {
                    if(i.key != "" && i.key != "17" && i.key != "11"){
                        prior_data[i.key][labels.indexOf(s)] += prior_data[i.key][labels.indexOf(l)]
                    }
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
        for(let i of nested_labels) {
            if(i.key != "" && i.key != "17" && i.key != "11"){
                prior_data[i.key][c] = " "
            }
        }
    }

    labels = labels.filter(item => item !== " ")
    for(let i of nested_labels) {
        if(i.key != "" && i.key != "17" && i.key != "11"){
            prior_data[i.key] = prior_data[i.key].filter(item => item !== " ")
        }
    }

    let datasets = [];
    let over = [];
    for (priorTerm in prior_data){
        console.log(prior_data[priorTerm])
        if(parseInt(priorTerm)) {
            if(parseInt(priorTerm) > 8){
                if (over.length == 0) {
                    over = prior_data[priorTerm]
                } else {
                    let added = [];
                    for(let i=0; i < over.length; i++) {
                        added.push(over[i]+prior_data[priorTerm][i])
                    }
                    over = added;
                }
            } else {
                let partial = {
                    label: parseInt(priorTerm),
                    backgroundColor: myColor(priorTerm),
                    data: prior_data[priorTerm]
                }
                datasets.push(partial);
            }
        } else {
            let partial = {
                label: priorTerm,
                backgroundColor: myColor(priorTerm),
                data: prior_data[priorTerm]
            }
            datasets.push(partial);
        }
    }
    if (over.length > 0) {
        let partial = {
            label: "9+",
            backgroundColor: "#FF6666",
            data: over
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

function changeTitle(title, id, j){
    let list = document.querySelector(id)
    list.innerHTML = title;
    var origin = document.querySelector("#title"); 
    var ms = document.querySelector("#musicSport"); 
    var term = document.querySelector("#term"); 
    if(title == "Music") {
        title = "Ensembles"
    }
    if (j) {
        origin.innerHTML = `# by Prior Term and Luther J-Term `;
    } else {
        origin.innerHTML = `# by ${ms.innerHTML} and ${term.innerHTML}`;
    }
}


function resetCanvas(){
    $('#canvas').remove();
    $('.stackbar').append('<canvas id="canvas"></canvas>')
  }

function draw(j=false){
    resetCanvas();
    d3.select('canvas').selectAll('*').remove();
  
    d3.csv('https://cgl-project.onrender.com/allData').then(function(result) {
        testStackBar(result, j);
    });
  }