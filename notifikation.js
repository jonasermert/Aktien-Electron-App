const {ipcRenderer} = require('electron')

querryNoti()
dbcount()
/*
//Datenbank anlegen
    db.createTable('notis', pfad, (succ, msg) =>{
        if (succ){
            console.log(msg)
        } else{
            console.log("Error: " + msg)
        }
    })
*/

ipcRenderer.on('refresh', (event)=>{
    dbcount()
    querryNoti()
})

function notify(symbol){
    ipcRenderer.send('window', symbol)
}


//Daten einfuegen
function inputNoti(){
    let obj = new Object()
    obj.symbol = document.getElementById("stocksymbol").value
    obj.minvalue = document.getElementById("minvalue").value
    obj.maxvalue = document.getElementById("maxvalue").value

    if (db.valid('notis', pfad)){
        db.insertTableContent('notis',pfad, obj, (succ, msg)=>{
            console.log(succ + " " + msg)
            currentPrice(obj.symbol)
        })
       
        searchNoti()
    }
}


//Daten auslesen
function searchNoti(){
    let term = ""
    document.getElementById("liste").innerHTML = null
    db.search('notis', pfad, 'symbol', term, (succ, data) =>{
        if (succ){
           //table
           let table = document.createElement("table")
           let row = table.insertRow()
           
           for (let i = 0; i< data.length; i++){
               let cell1 = row.insertCell()
               cell1.innerHTML = data[i].symbol
               let cell2 = row.insertCell()
               cell2.innerHTML = data[i].minvalue
               let cell3 = row.insertCell()
               cell3.innerHTML = data[i].maxvalue
               let cell4 = row.insertCell()
               cell4.innerHTML = data[i].price
               let cell5 = row.insertCell()
               cell5.innerHTML = ('<a class="button is-small is-danger" onclick="delNoti(\'' + data[i].id + '\')">X</a>')
   

               let next = i + 1
               if (next!=data.length){
                   row = table.insertRow()
               }
           }
           document.getElementById("liste").appendChild(table)
        }
    })
}

//daten loeschen
function delNoti(id){
    var integer = parseInt(id, 10)
    db.deleteRow('notis', pfad, {'id': integer}, (succ, msg)=>{
        console.log(msg)
    })
    searchNoti()
}

//zaehlen
function dbcount(){
    db.count('notis', pfad, (succ, data)=>{
        document.getElementById("noticount").innerHTML = (data)
    })
}

//Preis update
function currentPrice(symbol){
    alpha.data.daily(symbol).then(data =>{
        let price = []
        let tSeries=data['Time Series (Daily)']
        for(let tempData in tSeries)
        {
            price.push(tSeries[tempData]['4. close'])
        }

        let where = {"symbol": symbol}
        let set = {"price": price[0]}
        db.updateRow('notis', pfad, where, set, (succ, msg)=>{
            console.log(msg)
        })
    })
}

//currentPrice('DIS')


//Preis checken
function querryNoti(){
    let term = ""
    let symbol, minvalue, maxvalue, price
    db.search('notis', pfad, 'symbol', term, (succ, data)=>{
        if (succ){
            for (let i = 0; i<data.length; i++) {
                symbol = data[i].symbol
                currentPrice(symbol)
                minvalue = parseInt(data[i].minvalue)
                maxvalue = parseInt(data[i].maxvalue)
                price = parseInt(data[i].price)

                if(price >= maxvalue || price <= minvalue){
                    var x = document.getElementById('bulmaNoti')
                    x.style.display = "block"
                    document.getElementById('bulmaNoti').innerHTML = '<button class="delete" onclick="hideBulmaNoti()"></button> <p>Preisziel erreicht</p> <button class="button" onclick="notify(`Notifikation`)">Notifikation</button>'
                    callNoti(symbol, price)
                }
            }
        }
    })

}

//Bulma Notifikation
function hideBulmaNoti(){
    var x = document.getElementById('bulmaNoti')
    x.style.display = "none"
}

//electron Notifikation
function callNoti(symbol, price){
    const myNotification = new Notification(symbol+ ' @ ' +price, {
        body: symbol + ' hat das Preisziel bei '+price+ ' erreicht'
    })
}