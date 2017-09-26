//var app = require('app');  // Module to control application life.
//var BrowserWindow = require('browser-window');  // Module to create native browser window.
var electron = require('electron');
var ipc = electron.ipcMain;
var app = electron.app;

var log = require('electron-log');
var autoUpdater = require("electron-updater").autoUpdater;
var windowState = require('electron-window-state');
var jsonfile = require('jsonfile');

var path = require('path');
var os = require('os');
var mkdirp = require('mkdirp');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var win = null;

var isDev;
var pathUserSettings = app.getPath('userData') + '\\InstantAtlas Designer\\ia-designer-user-settings.json';
var jsonUserSettings = 
{
    locale: 'en'
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() 
{
    isDev = process.mainModule.filename.indexOf('app.asar') === -1;

    // User settings.
    try 
    {
        var json = jsonfile.readFileSync(pathUserSettings);
        jsonUserSettings = Object.assign(jsonUserSettings, json);
    } 
    catch (err) {}

    // Window state.
    var minWidth = 1000, minHeight = 800;
    var winState = windowState(
    { 
        file: 'ia-designer-window-state.json',
        path: app.getPath('userData') + '\\InstantAtlas Designer\\',
        defaultWidth: minWidth,
        defaultHeight: minHeight
    });

    if (isDev)
    {
        win = new electron.BrowserWindow(
        {
            backgroundColor: '#ffffff',
            icon:__dirname + '/assets/ia.ico', 
            title: 'InstantAtlas Designer', 
            x: winState.x,
            y: winState.y,
            width: winState.width,
            height: winState.height,
            minWidth: minWidth,
            minHeight: minHeight,
            show: false/*,
            frame: false*/
        });
        win.webContents.openDevTools();
    }
    else
    {
        win = new electron.BrowserWindow(
        {
            backgroundColor: '#ffffff',
            x: winState.x,
            y: winState.y,
            width: winState.width,
            height: winState.height,
            minWidth: minWidth,
            minHeight: minHeight,
            show: false,
            frame: false
        });
    }

    winState.manage(win);

    win.on('ready-to-show', function() 
    {
        win.show();
        win.focus();
    });

    // Emitted when the window is closed.
    win.on('closed', function() 
    {
        // Save user settings.
        try 
        {
            mkdirp.sync(path.dirname(pathUserSettings));
            jsonfile.writeFileSync(pathUserSettings, jsonUserSettings);
        } 
        catch (err) {}

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
    if (win !== undefined) win.webContents.send('log', text);
}

// User settings.
ipc.on('set-user-setting', function (event, name, value) 
{
    var o = {};
    o[name] = value;
    jsonUserSettings = Object.assign(jsonUserSettings, o);
});
ipc.on('get-user-settings', function (event) 
{
    event.sender.send('got-user-settings', jsonUserSettings);
});

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