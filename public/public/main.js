const {app,BrowserWindow} = require('electron')
//creating window for desktop application
const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,            
      webPreferences:{}
    })
    //connecting web app to desktop app using URL
    win.loadURL('http://localhost:3000')
  }
   //create window after app is ready
  app.on('ready',createWindow)
  
  //quit the app while all windows are closed
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })