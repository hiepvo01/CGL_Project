Chart.defaults.global.defaultFontFamily = 'Roboto';
Chart.defaults.global.defaultFontColor = '#333';
Chart.Legend.prototype.afterFit = function() {
  this.height = this.height + 5;
};

Chart.pluginService.register({
    beforeDraw: function(chart) {
      if (chart.config.options.elements.center) {
        // Get ctx from string
        var ctx = chart.chart.ctx;
  
        // Get options from the center object in options
        var centerConfig = chart.config.options.elements.center;
        var fontStyle = centerConfig.fontStyle || 'Arial';
        var txt = centerConfig.text;
        var color = centerConfig.color || '#000';
        var maxFontSize = centerConfig.maxFontSize || 75;
        var sidePadding = centerConfig.sidePadding || 20;
        var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
        // Start with a base font of 30px
        ctx.font = "35px " + fontStyle;
  
        // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
        var stringWidth = ctx.measureText(txt).width;
        var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;
  
        // Find out how much the font can grow in width.
        var widthRatio = elementWidth / stringWidth;
        var newFontSize = Math.floor(30 * widthRatio);
        var elementHeight = (chart.innerRadius * 2);
  
        // Pick a new font size so it will not be larger than the height of label.
        var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
        var minFontSize = centerConfig.minFontSize;
        var lineHeight = centerConfig.lineHeight || 25;
        var wrapText = false;
  
        if (minFontSize === undefined) {
          minFontSize = 20;
        }
  
        if (minFontSize && fontSizeToUse < minFontSize) {
          fontSizeToUse = minFontSize;
          wrapText = true;
        }
  
        // Set font settings to draw it correctly.
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
        ctx.font = fontSizeToUse + "px " + fontStyle;
        ctx.fillStyle = color;
  
        if (!wrapText) {
          ctx.fillText(txt, centerX, centerY);
          return;
        }
  
        var words = txt.split(' ');
        var line = '';
        var lines = [];
  
        // Break words up into multiple lines if necessary
        for (var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = ctx.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > elementWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
  
        // Move the center up depending on line height and number of lines
        centerY -= (lines.length / 2) * lineHeight;
  
        for (var n = 0; n < lines.length; n++) {
          ctx.fillText(lines[n], centerX, centerY);
          centerY += lineHeight;
        }
        //Draw text in center
        ctx.fillText(line, centerX, centerY);
      }
    }
  });

function resetCanvas(){
  $('.container-fluid').remove();
  $('body').append('<div class="container-fluid"></div>')
  $('.container-fluid').append(`
  <div class="row">
    <div class="col-6">
      <canvas id="chart1"></canvas>
    </div>
    <div class="col-6">
      <canvas id="chart2"></canvas>
    </div>
  </div>
  `)
}

function changeTitle(title){
  var origin = document.querySelector("#title"); 
  origin.innerHTML = `Number of Students per ${title}`;
}

function testChartPie(students, attr, chartid) {
  
    students = students.filter(function(d){ return d.Academic_Year != "2014-15" });
    var terms = d3.group(students, d => d[attr]);
    terms_data = []
    terms_labels = []
    terms_colors = []

    var keyValues = []
    let large=0;
    for (key of terms.keys()) {
      if(parseInt(key)){
        if(parseInt(key) > 8){
          large += terms.get(key).length
        } else {
          keyValues.push([key.substring(0, key.length-2), terms.get(key).length ])
        }
      } else if (key != ""){
        keyValues.push([ key, terms.get(key).length ])
      }
    }
    keyValues.sort(function compare(kv1, kv2) {
      return kv2[0].localeCompare(kv1[0])
    })
    if (large > 0){
      keyValues.push(["9+", large])
    }

    for (val of keyValues) {
      terms_labels.push(val[0]);
      terms_data.push(val[1]);
    }

    var myColor = d3.scaleOrdinal().domain(terms_labels)
    .range(d3.schemeSet2)
    for (val of keyValues) {
      terms_colors.push(myColor(val[0]))
    }
    var chart = new Chart(chartid, {
        type: 'doughnut',
        options: {
        elements: {
            center: {
                text: "4 Years",
                color: '#FF6384', // Default is #000000
                fontStyle: 'Arial', // Default is Arial
                sidePadding: 20, // Default is 20 (as a percentage)
                minFontSize: 25, // Default is 20 (in px), set to false and text will not wrap.
                lineHeight: 25 // Default is 25 (in px), used for when text wraps
            }
        },
          maintainAspectRatio: true,
          responsive: true,
          legend: {
            display: true
          },
          plugins: {
            datalabels: {
                backgroundColor: function(context) {
                    return context.dataset.backgroundColor;
                  },
                  borderColor: 'white',
                  borderRadius: 50,
                  borderWidth: 5,
                  color: 'white',
                  anchor:'end',
            },
        },
        },
        data: {
          labels: terms_labels,
          datasets: [
            {
              data: terms_data,
              backgroundColor: terms_colors
            }
          ],
        }
      })
    }

function testChartBar(students, attr, chartid) {
    students = students.filter(function(d){ return d.Academic_Year != "2014-15" });
    var terms = d3.group(students, d => d[attr]);
    terms_data = []
    terms_labels = []
    terms_colors = []

    var keyValues = []
    console.log(terms.keys())
    let large = 0;
    for (key of terms.keys()) {
      if(parseInt(key)){
        if(parseInt(key) > 8){
          large += terms.get(key).length
        } else {
          keyValues.push([key.substring(0, key.length-2), terms.get(key).length ])
        }
      } else if (key != ""){
        keyValues.push([ key, terms.get(key).length ])
      }
    }
    keyValues.sort(function compare(kv1, kv2) {
      return kv2[0].localeCompare(kv1[0])
    })
    if (large > 0){
      keyValues.push(["9+", large])
    }

    for (val of keyValues) {
      terms_labels.push(val[0]);
      terms_data.push(val[1]);
    }

    var myColor = d3.scaleOrdinal().domain(terms_labels)
    .range(d3.schemeSet2)
    for (val of keyValues) {
      terms_colors.push(myColor(val[0]))
    }
    var chart = new Chart(chartid, {
        type: 'bar',
        options: {
            maintainAspectRatio: true,
            responsive: true,
            legend: {
            display: false
            },
            plugins: {
            datalabels: {
                formatter: (value, ctx) => {
                    let sum = 0;
                    let dataArr = ctx.chart.data.datasets[0].data;
                    dataArr.map(data => {
                        sum += data;
                    });
                    let percentage = (value*100 / sum).toFixed(2)+"%";
                    return percentage;
                },
                backgroundColor: function(context) {
                    return context.dataset.backgroundColor;
                    },
                    borderColor: 'white',
                    borderRadius: 50,
                    borderWidth: 5,
                    color: 'white',
                    anchor:'end',
            },
        },
          scales: {
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: attr,
                  fontSize: 16
                }
              }
            ]
          }
        },
        data: {
            labels: terms_labels,
            datasets: [
            {
                data: terms_data,
                backgroundColor: terms_colors
            }
            ],
        }
        })
    }

function stackPie(students, attr, chartid) {
  
      students = students.filter(function(d){ return d.Academic_Year != "2014-15" });
      var terms = d3.group(students, d => d[attr]);
      
      terms_data = []
      terms_labels = []
      terms_colors = []
      
      genders_data = []
      genders_labels = []
      genders_colors = []
  
      var keyValues = []
      for (key of terms.keys()) {
        keyValues.push([ key, terms.get(key).length ])
      }
      keyValues.sort(function compare(kv1, kv2) {
        return kv2[0].localeCompare(kv1[0])
      })
  
      for (val of keyValues) {
        terms_labels.push(val[0]);
        terms_data.push(val[1]);
      }
  
      var genTerm = []
  
      for (tkey of terms_labels) {
          let term = students.filter(function(d){ return d[attr] == tkey });
          let genders = d3.group(term, d => d.Sex);
  
          var genderKeyValues = []
          for (key of genders.keys()) {
              genderKeyValues.push([ key, genders.get(key).length ])
          }
      
          if (genders.size == 2) {
              genTerm.push(tkey)
              genTerm.push(tkey)
          } else {
              genTerm.push(tkey)
          }
          genderKeyValues.sort(function compare(kv1, kv2) {
          return kv2[0].localeCompare(kv1[0])
          })
  
          for (val of genderKeyValues) {
          genders_labels.push(val[0]);
          if (val[0] == "Male") {
              genders_colors.push('#00FFFF')
          } else {
              genders_colors.push("#FF6666")
          }
          genders_data.push(val[1]);
          }
      }
      
      var myColor = d3.scaleOrdinal().domain(terms_labels)
      .range(d3.schemeSet2)
      for (val of keyValues) {
        terms_colors.push(myColor(val[0]))
      }
      var chart = new Chart(chartid, {
          type: 'doughnut',
          options: {
          elements: {
              center: {
                  text: "4 Years",
                  color: '#FF6384', // Default is #000000
                  fontStyle: 'Arial', // Default is Arial
                  sidePadding: 20, // Default is 20 (as a percentage)
                  minFontSize: 25, // Default is 20 (in px), set to false and text will not wrap.
                  lineHeight: 25 // Default is 25 (in px), used for when text wraps
              }
          },
            maintainAspectRatio: true,
            responsive: true,
            legend: {
              display: true
            },
            plugins: {
              datalabels: {
                  backgroundColor: function(context) {
                      return context.dataset.backgroundColor;
                    },
                    borderColor: 'white',
                    borderRadius: 50,
                    borderWidth: 5,
                    color: 'white',
                    anchor: function(context) {
                      if (context.dataset.label == "Sex") {
                          return 'end'
                      } else {
                          return 'end'
                      }
                  },
              },
          },
          legend: {
              labels: {
                generateLabels: function(config) {
                  let labels = [];
                  config.data.datasets.filter(function(ds, iDs) {return iDs ==0}).forEach((ds, iDs) => labels = labels.concat(ds.labels.map((l, iLabel) => ({
                    datasetIndex: iDs,
                    labelIndex: iLabel, 
                    text: l,
                    fillStyle: ds.backgroundColor[iLabel],
                    hidden: chart ? chart.getDatasetMeta(iDs).data[iLabel].hidden : false,
                    strokeStyle: '#fff'
                  }))));
                  return labels;
                }
              },
              onClick: (event, legendItem) => {
                  let metaData = chart.getDatasetMeta(legendItem.datasetIndex).data;
                  metaData[legendItem.labelIndex].hidden = !metaData[legendItem.labelIndex].hidden;
                  console.log(metaData)
                  console.log(metaData[legendItem.labelIndex])
                  
                  let metaData1 = chart.getDatasetMeta(1).data;
  
                  gen = genTerm.reduce(function(a, e, i) {
                      if (e === terms_labels[legendItem.labelIndex])
                      a.push(i);
                      return a;
                  }, []);
                  
                  for (idx of gen) {
                      metaData1[idx].hidden = !metaData1[idx].hidden;
                  }
  
                  chart.update();
                },
                tooltips: {
                  callbacks: {
                    label: (tooltipItem, data) => {
                      let dataset = data.datasets[tooltipItem.datasetIndex];
                      let index = tooltipItem.index;
                      return dataset.labels[index] + ": " + dataset.data[index];
                    }
                  }
                },
  
          },
          },
          data: {
            datasets: [
              {
                data: terms_data,
                backgroundColor: terms_colors,
                label: attr,
                labels: terms_labels
              },
              {
                data: genders_data,
                backgroundColor: genders_colors,
                label: "Sex",
                labels: genders_labels
              }
            ],
            labels: terms_labels.concat(genders_labels)
          }
        })
      }

function draw(attr){
  // let check = await userCheck();
  let check = true;
  if (check == true) {
    resetCanvas();
    d3.select('canvas').selectAll('*').remove();
  
    d3.csv('https://cgl-project.onrender.com/allData').then(function(result) {
        testChartPie(result, attr, 'chart1');
        testChartBar(result, attr, 'chart2');
        // stackPie(result, attr, 'chart3');
        changeTitle(attr)
    });
  } else if (check == false){
    location.href = "../user/login/login.html"
  }
}


// d3.csv('https://cgl-project.onrender.com/all_data.csv').then(function(result) {
//     testChartPie(result, "2015-16", 'chart1');
//     testChartPie(result, "2016-17", 'chart3');
// });

// d3.csv('https://cgl-project.onrender.com/all_data.csv').then(function(result) {
//     testChartBar(result, "2015-16", 'chart2');
//     testChartBar(result, "2016-17", 'chart4');
// });