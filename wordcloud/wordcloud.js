function draw(data){

    container = document.getElementById('cloud')
    container.innerHTML = ""
    // create a tag cloud chart
    var chart = anychart.tagCloud(data);

    // set the chart title
    chart.title('J-Term 2020 Review')
    // set array of angles, by which words will be placed
    chart.angles([0, -45, 90])
    // enable color range
    chart.colorRange(true);
    // set color range length
    chart.colorRange().length('80%');

    // format tooltips
    var formatter = "{%value}{scale:(1)(1000)(1000)(1000)|()( thousand)( million)( billion)}";
    var tooltip = chart.tooltip();
    tooltip.format(formatter);

    // display chart
    chart.container("cloud");
    chart.draw();
}

async function generateGraph() {
    res = await fetch('http://127.0.0.1:5000/word_cloud').then(response => response.json())
    let allData = [];
    for (d in res.words) {
        console.log(d)
        allData.push({
            "x": d,
            "value": res.words[d]
        })
    }
    draw(allData)
}

window.onload = async function () {
    generateGraph();
}