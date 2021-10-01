const alpha = require('alphavantage')({key: 'DEINKEY'})
const Chart = require('chart.js')

function showData(symbol){
document.getElementById('chart').innerHTML = '<button class="button is-loading">loading</button>'
    
alpha.data.daily(symbol).then(data=>{
    let tempDataStore = []
    let datesData = []
    let tSeries=data['Time Series (Daily)']
        for(let tempData in tSeries)
        {
            tempDataStore.push(tSeries[tempData]['4. close'])
            datesData.push(tempData)
        }

    //document.getElementById('chart').innerHTML = tempDataStore[0]   
    
    var ctx = document.getElementById('myChart').getContext('2d')
    
        if(window.bar != undefined) 
        window.bar.destroy() 
        window.bar = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datesData.reverse(),
                datasets: [{
                    label: symbol,
                    data: tempDataStore.reverse(),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            }
        })


       document.getElementById("chart").innerHTML = '<button class="button is-warning" onclick="notify(\'' + symbol + '\')">Notification</button>' 


})
}

function notify(symbol){
    alert(symbol)
}
