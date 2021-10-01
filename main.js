const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } = require('electron')
const path = require('path')
const iconPath = path.join(__dirname, 'assets/icon-tray.png')

function createWindow () {
  const win = new BrowserWindow({
    icon: 'assets/icon.png',
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('src/index.html')
  //win.webContents.openDevTools()

  const template = [
    {
      label: "Menu",
      submenu: [
        {label: "Notifikation",
        click(){
          openWin2("Notifikation")
          }
       },
       {label: "Refresh",
      click(){
        win.webContents.send('refresh')
        }
      },
      {type: "separator"},
      {role: "quit", label: "Ende"}
      ]
    }

  ]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

}

//window2
ipcMain.on('window', function(event, arg){
  openWin2(arg)
})

function openWin2(arg){
  const win2 = new BrowserWindow({width:600, height: 400,
    icon: 'assets/icon.png',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  win2.loadFile('src/notify.html')
  win2.removeMenu()
  win2.title = arg
}

app.whenReady().then(() =>{
  createWindow(),
 // tray = new Tray('assets/icon-tray.png')
 tray = new Tray(nativeImage.createFromPath(iconPath))
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Aktien App', click(){
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    }},
    { label: 'Notifikation', click(){
      openWin2("Notifikation")
    }
  },
  {role: "reload", label: "Refresh"},
  {role: "quit", label: "Ende"}
  ])
  tray.setToolTip('Aktien App'),
  tray.setContextMenu(contextMenu)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
  //  app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})