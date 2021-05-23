function checkAttr(atr, d){
    if (d.includes(atr)) {
        return true
    } else {
        return false
    }
}

function choice(attr){
    localStorage.setItem("choice", attr)
    document.getElementById('dropdownMenuLink').innerHTML = attr

    document.getElementById("marksChart").innerHTML = ""
    if(localStorage.getItem("choice")){
        console.log(localStorage.getItem("choice"))
        let selected = ""
        if(localStorage.getItem("choice") == "Terms") {
            selected = "terms"
        } else if (localStorage.getItem("choice") == "Program Types") {
            selected = "programTypes"
        }
        var marksCanvas = document.getElementById("marksChart");
        d3.json('https://vohi0311.pythonanywhere.com/financial/15_19').then(function(result) {
            let labels = ['no', 'very low', 'low', 'med', 'high']
            let allData = []
            var myColor = d3.schemeAccent
            let idx = 0
            for (term in result[selected]){
                let data = {}
                for (l of labels){
                    data[l] = 0
                }
                for (l of labels){
                    try{
                        data[l] = result[selected][term][l]
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
}