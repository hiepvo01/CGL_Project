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
        let labels = ['high', 'low', 'med', 'no', 'very low']
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
        // console.log(result['terms'])
        // console.log(result['programTypes'])
        // for (term in result["terms"]){
        //     if (checkAttr("high", Object.keys(result["terms"][term]))) {
        //         termsList[0] += result["terms"][term].high
        //     }
        //     if (checkAttr("low", Object.keys(result["terms"][term]))) {
        //         termsList[1] += result["terms"][term].low
        //     }
        //     if (checkAttr("med", Object.keys(result["terms"][term]))) {
        //         termsList[2] += result["terms"][term].med
        //     }
        //     if (checkAttr("no", Object.keys(result["terms"][term]))) {
        //         termsList[3] += result["terms"][term].no
        //     }
        //     if (checkAttr("very low", Object.keys(result["terms"][term]))) {
        //         termsList[4] += result["terms"][term]["very low"]
        //     }
        // }

        for (program in result["programTypes"]){

            if (checkAttr("high", Object.keys(result["programTypes"][program]))) {
                programsList[0] += result["programTypes"][program].high
            }
            if (checkAttr("low", Object.keys(result["programTypes"][program]))) {
                programsList[1] += result["programTypes"][program].low
            }
            if (checkAttr("med", Object.keys(result["programTypes"][program]))) {
                programsList[2] += result["programTypes"][program].med
            }
            if (checkAttr("no", Object.keys(result["programTypes"][program]))) {
                programsList[3] += result["programTypes"][program].no
            }
            if (checkAttr("very low", Object.keys(result["programTypes"][program]))) {
                programsList[4] += result["programTypes"][program]["very low"]
            }
        }

        var marksData = {
        labels: ['high', 'low', 'med', 'no', 'very low'],
        datasets: allData
        // datasets: [{
        //     label: "Terms",
        //     backgroundColor: "rgba(200,0,0,0.2)",
        //     data: termsList
        // }, {
        //     label: "Program Types",
        //     backgroundColor: "rgba(0,0,200,0.2)",
        //     data: programsList
        // }]
        };
    
        var radarChart = new Chart(marksCanvas, {
        type: 'radar',
        data: marksData
        });
    });
    
}