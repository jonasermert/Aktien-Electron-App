const db = require('electron-db')
const path = require('path')
const pfad = path.join(__dirname, '')

//createDB()
//inputDB()
//searchDB()

//Datenbank anlegen
function createDB(){
    db.createTable('stocks', pfad, (succ, msg) =>{
        if (succ){
            console.log(msg)
        } else{
            console.log("Error: " + msg)
        }
    })
}


//Daten einfuegen
function inputDB(){
    let obj = new Object()
    obj.symbol = "AAPL"
    obj.name = "Apple"

    if (db.valid('stocks', pfad)){
        db.insertTableContent('stocks',pfad, obj, (succ, msg)=>{
            console.log(succ + " " + msg)
        })
    }
}


//Daten auslesen
function searchDB(term){
    //let term = "a"
    document.getElementById("container").innerHTML = null
    db.search('stocks', pfad, 'name', term.value, (succ, data) =>{
        if (succ){
            document.getElementById("aktien").innerHTML = (data.length)
           // console.log(data[0].name)
           // console.log(data[1].symbol)

           //table
           let table = document.createElement("table")
           let row = table.insertRow()
           
           for (let i = 0; i< data.length; i++){
               let cell1 = row.insertCell()
               cell1.innerHTML = data[i].symbol
               let cell2 = row.insertCell()
               cell2.innerHTML = data[i].name
               let cell3 = row.insertCell()
               cell3.innerHTML = ('<a class="button is-small is-primary" href="">Chart</a>')

               let next = i + 1
               if (next!=data.length){
                   row = table.insertRow()
               }
           }
           document.getElementById("container").appendChild(table)
        }
    })
}
