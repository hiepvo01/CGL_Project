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
  if (title == "study") {
    title = "Field of Study"
  } else if (title == "gender") {
    title = "Sex"
  } else if (title == "race") {
    title = "Race/ Ethnicity"
  }
  origin.innerHTML = `% by ${title}`;
}
let studysum = 825 + 244 + 487 + 254 + 245 + 82 + 214 + 102 + 2
function round(n, sum) {
  num = (n/sum)*100
  return Math.round(num*10)/10
}
three_pies_dict = {}
three_pies_dict["Study"] = {
    "labels": ['STEM Fields','Business/Management','Social Sciences','Languages/International Studies','Fine/Applied Arts',
    'Communications', 'Humanities', 'Education','Other'],
    0: [32.4,13.6,18.5, 6.9, 11.7, 3.4, 8.0,5.2,.2],
    1: [round(825,studysum), round(244,studysum), round(487,studysum), round(254,studysum), round(245,studysum), round(82,studysum), round(214,studysum), round(102,studysum)
      , round(2,studysum)],
    2: [25.9, 20.8, 17.1, 7.2, 6.7, 5.6, 3.6, 3.3, 8.5, 1.8]
}
three_pies_dict["Sex"] = {
    "labels": ['Male', 'Female'],
    0: [44.3, 55.7],
    1: [36.3, 63.7],
    2: [33, 67]
}
three_pies_dict["Race"] = {
    "labels": ['White', 'Hispanic/Latinx','Asian/Hawaiian/Pacific Islander','Black/African-American','Multiracial',
    'American Indian/Alaskan Native'],
    0: [89.2, 4.6, 1.7, 2, 2.2, .3],
    1: [92.1, 2.6, 1.8, 1.1, 2.0, 0.4],
    2: [69.5, 10.3, 8.4, 6.1, 4.3, 1.8]
}
three_pies_dict["FGEN"] = {
    "labels": ['Not FGEN', 'FGEN'],
    0: [ round(2337+2169+2053+2005-(491+465+467+451), 2337+2169+2053+2005), round(491+465+467+451, 2337+2169+2053+2005)],
    1: [ round(1769-235, 1769),round(235, 1769)],
}
three_pies_dict["Geographic"] = {
    "labels": ['US', 'International'],
    
    0: [92.7, 7.3],
    1: [ round(1717, 1717+52), round(52, 1717+52)],
}
three_pies_dict["Sport"] = {
  "labels": ['Not Sport', 'Sport'],
  
  0: [81.4, 18.6],
  1: [76.8, 23.2],
}
three_pies_dict["Music"] = {
  "labels": ['Not Music', 'Music'],
  
  0: [80.8, 19.2],
  1: [56.2, 43.8],
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
    let centers = ["Luther All", "Luther Study Away", "U.S. Study Abroad"];

    var myColor = d3.scaleOrdinal().domain(terms_labels)

    .range(d3.schemeCategory10)
    for (val of keyValues) {
      terms_colors.push(myColor(val[0]))
    }
    var chart = new Chart(chartid, {
        type: 'doughnut',
        options: {
        elements: {
            center: {
                text: centers[luther],
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
                formatter: (value, ctx) => {
                  return value + "%"
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

  d3.csv('https://cgl-project.onrender.com/allData').then(function(result) {
      resetCanvas();
      try {
        let chart3 = testChartPie(attr, 'chart3', 2);
        let chart1 = testChartPie(attr, 'chart1', 0);
        let chart2 = testChartPie(attr, 'chart2', 1);
        changeTitle(attr)
        document.querySelector('.legend').innerHTML = chart1.generateLegend();
      
        var legendItems = document.querySelector('.legend').getElementsByTagName('li');
        for (var i = 0; i < legendItems.length; i++) {
          legendItems[i].addEventListener("click", legendClickCallback.bind(this,i), false);
        }

        
        function legendClickCallback(legendItemIndex){
          let idx = legendItems[legendItemIndex].innerHTML.indexOf('/span>');
          let length = legendItems[legendItemIndex].innerHTML.length;
          if(legendItems[legendItemIndex].innerHTML.indexOf('<del>') < 0){
            legendItems[legendItemIndex].innerHTML = legendItems[legendItemIndex].innerHTML.substr(0, idx+6) + '<del>' + legendItems[legendItemIndex].innerHTML.substr(idx+6, length) + '</del>'
          } else {
            legendItems[legendItemIndex].innerHTML = legendItems[legendItemIndex].innerHTML.substr(0, idx+6)+legendItems[legendItemIndex].innerText
          }
          document.querySelectorAll('.myChart').forEach((chartItem,index)=>{
            chart1.getDatasetMeta(0).data[legendItemIndex].hidden = !chart1.getDatasetMeta(0).data[legendItemIndex].hidden
            chart2.getDatasetMeta(0).data[legendItemIndex].hidden = !chart2.getDatasetMeta(0).data[legendItemIndex].hidden
            chart3.getDatasetMeta(0).data[legendItemIndex].hidden = !chart3.getDatasetMeta(0).data[legendItemIndex].hidden
            chart1.update();chart2.update();chart3.update();
          })  
        }
      } catch (e){
        let chart1 = testChartPie(attr, 'chart1', 0);
        let chart2 = testChartPie(attr, 'chart2', 1);
        changeTitle(attr)
        document.querySelector('.legend').innerHTML = chart1.generateLegend();
      
        var legendItems = document.querySelector('.legend').getElementsByTagName('li');
        for (var i = 0; i < legendItems.length; i++) {
          legendItems[i].addEventListener("click", legendClickCallback.bind(this,i), false);
        }
      }
  });

}
