//var app = require('app');  // Module to control application life.
//var BrowserWindow = require('browser-window');  // Module to create native browser window.
var electron = require('electron');
var log = require('electron-log');
var autoUpdater = require("electron-updater").autoUpdater;
var dialog = electron.dialog;

var app = electron.app;
var BrowserWindow = electron.BrowserWindow; 

 


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var win = null;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() 
{
    // Create the browser window.
    win = new BrowserWindow(
    {
        width: 900, 
        height: 600, 
        //icon:__dirname + '/assets/ia.ico', 
        title: 'InstantAtlas Designer',
        show: false
    });

    // Open the DevTools.
    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', function() 
    {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    win.webContents.on('dom-ready', function() 
    {
        log.info('dom-ready');
    });

    win.webContents.once('did-frame-finish-load', function() 
    {
        log.info('did-frame-finish-load');
        win.maximize();
        win.show();

        autoUpdater.checkForUpdates();

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

// Auto-updater.
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');
log.info('Current version is:' + app.getVersion());

function sendStatusToWindow(text) 
{
    log.info(text);
    win.webContents.send('message', text);
}
autoUpdater.on('checking-for-update', function()
{
    sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', function(e, info)
{
    sendStatusToWindow('Update available.');
});
autoUpdater.on('update-not-available', function(e, info) 
{
    sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', function(e, err) 
{
    sendStatusToWindow('Error in auto-updater.');
    sendStatusToWindow(err);
});
autoUpdater.on('download-progress', function(progressObj) 
{
      var msg = "Download speed: " + progressObj.bytesPerSecond;
      msg = msg + ' - Downloaded ' + progressObj.percent + '%';
      msg = msg + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
      sendStatusToWindow(msg);
});
autoUpdater.on('update-downloaded', function(e, info)
{
    sendStatusToWindow('Update downloaded; will install in 5 seconds');

    // Ask user to update the app.
    dialog.showMessageBox(
    {
        type: 'question',
        buttons: ['Install and Relaunch', 'Later'],
        defaultId: 0,
        message: 'A new version of ' + app.getName() + ' has been downloaded',
        detail: 'It will be installed the next time you restart the application'
    }, 
    function (response) 
    {
        if (response === 0)
        {
            setTimeout(function() 
            {
                autoUpdater.quitAndInstall();  
            }, 1);
        }
    });
});
