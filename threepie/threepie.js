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
  let i = 1
  $('.container-fluid').append(`
  <div class="row">
    <div class="col-4">
      <canvas id="chart${i}" class="myChart" width="500" height="500"></canvas>
    </div>
    <div class="col-4">
      <canvas id="chart${i+1}" class="myChart" width="500" height="500"></canvas>
    </div>
    <div class="col-4">
      <canvas id="chart${i+2}" class="myChart" width="500" height="500"></canvas>
    </div>
  </div>`)
}

function changeTitle(title){
  var origin = document.querySelector("#title"); 
  origin.innerHTML = `Number of Students per ${title} per Year`;
}

three_pies_dict = {}
three_pies_dict["study"] = {
    "labels": ['STEM Fields','Business/Management','Social Sciences','Languages/International Studies','Fine/Applied Arts',
    'Communications', 'Humanities', 'Education','Other'],
    0: [32.4,13.6,18.5, 6.9, 11.7, 3.4, 8.0,5.2,.2],
    1: [825, 244, 487, 254, 245, 82, 214, 102, 2],
    2: [25.9, 20.8, 17.1, 7.2, 6.7, 5.6, 3.6, 3.3, 8.5, 1.8]
}
three_pies_dict["gender"] = {
    "labels": ['Male', 'Female'],
    0: [44.3, 55.7],
    1: [642, 1127],
    2: [33, 67]
}
three_pies_dict["race"] = {
    "labels": ['Hispanic/Latinx','Asian/Hawaiian/Pacific Islander','Black/African-American','Multiracial',
    'American Indian/Alaskan Native'],
    0: [ 4.6, 1.7, 2, 2.2, .3],
    1: [ 41, 28, 18, 31, 6],
    2: [10.3, 8.4, 6.1, 4.3, 1.8]
}
three_pies_dict["FGEN"] = {
    "labels": ['Not FGEN', 'FGEN'],
    0: [ 2337+2169+2053+2005-(491+465+467+451), 491+465+467+451],
    1: [ 1769-235,235],
}
three_pies_dict["geographic"] = {
    "labels": ['US', 'International'],
    
    0: [92.7, 7.3],
    1: [1717, 52],
}

function testChartPie(attr, chartid, luther) {

  var terms = three_pies_dict[attr];
    terms_data = []
    terms_labels = []
    terms_colors = []

    var keyValues = []
    for (key in terms['labels']) {
      keyValues.push([ terms['labels'][key], terms[luther][key] ])
    }
    keyValues.sort(function compare(kv1, kv2) {
      return kv1[0].localeCompare(kv2[0])
    })

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
                text: attr,
                color: '#FF6384', // Default is #000000
                fontStyle: 'Arial', // Default is Arial
                sidePadding: 20, // Default is 20 (as a percentage)
                minFontSize: 25, // Default is 20 (in px), set to false and text will not wrap.
                lineHeight: 25 // Default is 25 (in px), used for when text wraps
            }
        },
          maintainAspectRatio: false,
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
        legend: {
          display: false
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
      return chart
    }

function draw(attr){
  resetCanvas();

  d3.csv('../backend/graphData/CGL_DataFinal_Mar2021.csv').then(function(result) {
      resetCanvas();
      let chart1 = testChartPie(attr, 'chart1', 0);
      let chart2 = testChartPie(attr, 'chart2', 1);
      let chart3 = testChartPie(attr, 'chart3', 2);
      changeTitle(attr)
      document.querySelector('.legend').innerHTML = chart1.generateLegend();
    
      var legendItems = document.querySelector('.legend').getElementsByTagName('li');
      for (var i = 0; i < legendItems.length; i++) {
        legendItems[i].addEventListener("click", legendClickCallback.bind(this,i), false);
      }

      
      function legendClickCallback(legendItemIndex){
        // console.log(legendItems[legendItemIndex].innerHTML)
        let idx = legendItems[legendItemIndex].innerHTML.indexOf('/span>');
        let length = legendItems[legendItemIndex].innerHTML.length;
        // console.log(legendItems[legendItemIndex].innerHTML.indexOf('/span>'));
        // console.log(legendItems[legendItemIndex].innerHTML[idx + 6])
        // console.log(legendItems[legendItemIndex].innerHTML[length-1])
        document.querySelectorAll('.myChart').forEach((chartItem,index)=>{
          chart1.getDatasetMeta(0).data[legendItemIndex].hidden = !chart1.getDatasetMeta(0).data[legendItemIndex].hidden
          chart2.getDatasetMeta(0).data[legendItemIndex].hidden = !chart2.getDatasetMeta(0).data[legendItemIndex].hidden
          chart3.getDatasetMeta(0).data[legendItemIndex].hidden = !chart3.getDatasetMeta(0).data[legendItemIndex].hidden
          chart1.update();chart2.update();chart3.update();
        })  
      }
  });

}


// d3.csv('http://127.0.0.1:5000/all_data.csv').then(function(result) {
//     testChartPie(result, "2015-16", 'chart1');
//     testChartPie(result, "2016-17", 'chart3');
// });

// d3.csv('http://127.0.0.1:5000/all_data.csv').then(function(result) {
//     testChartBar(result, "2015-16", 'chart2');
//     testChartBar(result, "2016-17", 'chart4');
// });