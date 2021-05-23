function checkAttr(atr, d){
    if (d.includes(atr)) {
        return true
    } else {
        return false
    }
}

window.onload=function() {
    var marksCanvas = document.getElementById("marksChart");
    d3.json('https://vohi0311.pythonanywhere.com/financial/15_16').then(function(result) {
        let termsList = [0,0,0,0,0]
        let programsList = [0,0,0,0,0]
        let labels = ['no', 'very low', 'low', 'med', 'high']
        let allData = []
        var myColor = d3.schemeAccent
        let idx = 0
        for (term in result["terms"]){
            let data = {}
            for (l of labels){
                data[l] = 0
            }
            for (l of labels){
                try{
                    data[l] = result["terms"][term][l]
                } catch(e) { continue}
            }
            var values = Object.keys(data).map(function(key){
                return data[key];
            });
            allData.push({
                label: term,
                backgroundColor: myColor[idx],
                data: values
            })
            idx += 1
        }

        var marksData = {
        labels: ['no', 'very low', 'low', 'med', 'high'],
        datasets: allData
        };
    
        var radarChart = new Chart(marksCanvas, {
        type: 'bar',
        data: marksData
        });
    });
    
}