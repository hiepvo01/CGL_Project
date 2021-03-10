Chart.defaults.global.defaultFontFamily = 'Roboto';
Chart.defaults.global.defaultFontColor = '#333';

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

colors =['rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(231,233,237)'
]

function testChartPie(students, year, chartid) {
    students = students.filter(function(d){ return d.Academic_Year == year });
    var terms = d3.group(students, d => d.Term);
    terms_data = []
    terms_labels = []
    terms_colors = []

    for (val of terms.values()) {
        terms_data.push(val.length);
    }
    let idx = 0;
    for (val of terms.keys()) {
        terms_labels.push(val);
        terms_colors.push(colors[idx]);
        idx += 1
    }

    var chart = new Chart(chartid, {
        type: 'doughnut',
        options: {
        elements: {
            center: {
                text: year,
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
                  anchor:'center',
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

function testChartBar(students, year, chartid) {
    students = students.filter(function(d){ return d.Academic_Year == year });
    var terms = d3.group(students, d => d.Term);
    terms_data = []
    terms_labels = []
    terms_colors = []

    for (val of terms.values()) {
        terms_data.push(val.length);
    }
    let idx = 0;
    for (val of terms.keys()) {
        terms_labels.push(val);
        terms_colors.push(colors[idx]);
        idx += 1
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
                    anchor:'center',
            },
        },
          scales: {
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'Terms',
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

d3.csv('../backend/graphData/CGL_DataFinal_Mar2021.csv').then(function(result) {
    testChartPie(result, "2015-16", 'chart1');
    testChartPie(result, "2016-17", 'chart3');
    testChartPie(result, "2017-18", 'chart5');
    testChartPie(result, "2018-19", 'chart7');
});

d3.csv('../backend/graphData/CGL_DataFinal_Mar2021.csv').then(function(result) {
    testChartBar(result, "2015-16", 'chart2');
    testChartBar(result, "2016-17", 'chart4');
    testChartBar(result, "2017-18", 'chart6');
    testChartBar(result, "2018-19", 'chart8');
});


// d3.csv('http://127.0.0.1:5000/all_data.csv').then(function(result) {
//     testChartPie(result, "2015-16", 'chart1');
//     testChartPie(result, "2016-17", 'chart3');
// });

// d3.csv('http://127.0.0.1:5000/all_data.csv').then(function(result) {
//     testChartBar(result, "2015-16", 'chart2');
//     testChartBar(result, "2016-17", 'chart4');
// });