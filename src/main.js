//var app = require('app');  // Module to control application life.
//var BrowserWindow = require('browser-window');  // Module to create native browser window.
var electron = require('electron');
var log = require('electron-log');
var autoUpdater = require("electron-updater").autoUpdater;
var ipc = electron.ipcMain;
var app = electron.app;
var os = require('os');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var win = null;
var isDev;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() 
{
    isDev = process.mainModule.filename.indexOf('app.asar') === -1;
    if (isDev)
    {
        win = new electron.BrowserWindow(
        {
            backgroundColor: '#ffffff',
            icon:__dirname + '/assets/ia.ico', 
            title: 'InstantAtlas Designer',
            width: 1200,
            minWidth: 800,
            height: 800,
            minHeight: 600,
            show: false/*,
            frame: false*/
        });
        win.webContents.openDevTools();
        win.webContents.once('did-frame-finish-load', function() 
        {
            win.show();
        });
    }
    else
    {
        win = new electron.BrowserWindow(
        {
            backgroundColor: '#ffffff',
            width: 1200,
            minWidth: 800,
            height: 800,
            minHeight: 600,
            show: false,
            frame: false
        });
        win.webContents.once('did-frame-finish-load', function() 
        {
            win.show();
        });
    }

    // Emitted when the window is closed.
    win.on('closed', function() 
    {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    // and load the index.html of the app.
    win.loadURL('file://' + __dirname + '/index.html#v' + app.getVersion());
});

// Quit when all windows are closed.
app.on('window-all-closed', function() 
{
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') 
    {
        app.quit();
    }
});

// Log to renderer console.
function logToConsole(text) 
{
    log.info(text);
    win.webContents.send('log', text);
}

// Autoupdates.
ipc.on('check-for-update', function (event) 
{
    if (isDev) win.webContents.send('update-not-available');
    else autoUpdater.checkForUpdates();
});
ipc.on('quit-and-install', function (event) 
{
    autoUpdater.quitAndInstall();
});
autoUpdater.on('checking-for-update', function()
{
    logToConsole('Checking for update...');
});
autoUpdater.on('update-available', function(e, info)
{
    logToConsole('Update available.');
});
autoUpdater.on('update-not-available', function(e, info) 
{
    win.webContents.send('update-not-available');
    logToConsole('Update not available.');
});
autoUpdater.on('error', function(e, err) 
{
    win.webContents.send('update-not-available');
    logToConsole('Error in auto-updater.');
    logToConsole(err);
});
autoUpdater.on('download-progress', function(progressObj) 
{
    var msg = "Download speed: " + progressObj.bytesPerSecond;
    msg = msg + ' - Downloaded ' + progressObj.percent + '%';
    msg = msg + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    logToConsole(msg);
});
autoUpdater.on('update-downloaded', function(e, info)
{
    win.webContents.send('update-downloaded');
    logToConsole('Update downloaded');
});

// Provide app info to renderer process upon request.
ipc.on('get-app-info', function (event) 
{
    // Send app info back to renderer.
    event.sender.send('got-app-info', 
    [
        {name:'Name', value:app.getName()},
        {name:'Version', value:app.getVersion()},
        {name:'App Path', value:app.getAppPath()},
        {name:'User Data', value:app.getPath('userData')},
        {name:'Home Directory', value:os.homedir()},
        {name:'Electron Version', value:process.versions.electron},
        {name:'Node Version', value:process.versions.node},
        {name:'Chrome Version', value:process.versions.chrome}
    ]);
});