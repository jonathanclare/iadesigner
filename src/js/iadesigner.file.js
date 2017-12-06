var iadesigner = (function (iad, $, window, document, undefined)
{
    'use strict';

    iad.file = iad.file || {};

    var fs = require('fs');

    var electron = require('electron');
    var remote = electron.remote;
    var dialog = remote.dialog;
    var win = remote.getCurrentWindow();

    var changesSaved = true;

    iad.file.init = function(o)
    {
        if (o !== undefined)
        {
            if (o.dragAndDrop !== undefined) addDragAndDrop(o.dragAndDrop);
        }
    };

    function addDragAndDrop(id)
    {
        var $container = $(id);

        // File upload drag and drop.
        $container.on('drop', function (e) 
        {
            e.stopPropagation();
            e.preventDefault();

            if (e.originalEvent.dataTransfer.files.length > 0)
            {
                var f = e.originalEvent.dataTransfer.files[0];
                var fileName = escape(f.name);
                var fileType = f.type;
                var fileSize = f.size + ' bytes';
                var filePath = f.path;
                var lastModified = 'last modified: '+f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a';
                //ia.log(fileName+' '+fileType+' '+fileSize+' '+lastModified);

                if (fileType.match('text/xml')) // config.xml
                {
                    iad.file.saveChangesBeforeContinuing(function()
                    {
                        iad.report.loaded = true;
                        iad.report.loadReport(f.path);
                        iad.usersettings.set('reportPath', f.path);
                    });
                }
                else if (fileName.indexOf('.json') != -1) // styles.json - file type doesnt seem to work for json.
                {
                    iad.css.readLessVarsFile(f.path, function () {});
                }
            }
        });
        $container.on('dragover', function (e) 
        {
            e.stopPropagation();
            e.preventDefault();
            e.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        });
    }

    iad.file.fileExists = function(filePath)
    {
        return fs.existsSync(filePath);
    };

    iad.file.saveFile = function(filePath, strFileContent, callback)
    {
        if (filePath !== undefined)
        {
            fs.writeFile(filePath, strFileContent, function (err) 
            {
                if (err === null) 
                {
                    if (callback !== undefined) callback.call(null);
                } 
                else 
                {
                    dialog.showErrorBox('File save error', err.message);
                }
            });
        }
    };

    iad.file.copyFile = function(readFile, writeFile, callback)
    {
        var wf = fs.createWriteStream(writeFile);
        wf.on('finish', function() 
        {
            if (callback !== undefined) callback.call(null);  
        });
        wf.on('error', function(err) 
        {
            dialog.showErrorBox('File save error', err.message);
        });
        var rf = fs.createReadStream(readFile);
        rf.on('error', function(err) 
        {
            dialog.showErrorBox('File save error', err.message);
        });
        rf.pipe(wf);
    };

    iad.file.openConfigFile = function(callback)
    {
        var files = dialog.showOpenDialog(win, 
        {
            title: 'Open IA Configuration File',
            properties: ['openFile'],
            filters: [{name: 'config', extensions: ['xml']}]
        });

        if (!files) 
        {
            return;
        }
        else 
        {
            if (callback !== undefined) callback.call(null, files[0]);
        }
    };

    iad.file.openStyleFile = function(callback)
    {
        var files = dialog.showOpenDialog(win, 
        {
            title: 'Open IA Style File',
            properties: ['openFile'],
            filters: [{name: 'style', extensions: ['json']}]
        });

        if (!files) 
        {
            return;
        }
        else 
        {
            if (callback !== undefined) callback.call(null, files[0]);
        }
    };

    iad.file.onChangesMade = function()
    {
        changesSaved = false;
    };

    iad.file.onChangesSaved = function()
    {
        changesSaved = true;
    };

    iad.file.saveChangesBeforeContinuing = function(callback)
    {
        if (changesSaved) callback.call(null); 
        else
        {
            bootbox.dialog(
            {
                title: "Save Changes?",
                message: "Save changes before continuing?",
                buttons: 
                {
                    cancel: 
                    {
                        label: 'Cancel',
                        className: 'btn-default',
                        callback: function ()
                        {
                            // Dont return anything.
                        }
                    },
                    no: 
                    {
                        label: "No",
                        className: 'btn-default',
                        callback: function ()
                        {
                            setTimeout(function()
                            {
                                callback.call(null);
                            }, 500);
                        }
                    },
                    ok: 
                    {
                        label: "Yes",
                        className: 'btn-primary',
                        callback: function ()
                        {
                            setTimeout(function()
                            {
                                saveChanges(function()
                                {
                                    callback.call(null); 
                                });
                            }, 500);
                        }
                    }
                }
            });
        }
    };

    iad.file.saveChanges = function(callback)
    {
        if (iad.report.loaded)
        {
            iad.progress.start('save', function()
            {
                iad.file.saveFile(iad.report.mapPath, iad.mapjson.toString(), function ()
                { 
                    iad.file.saveFile(iad.report.configPath, iad.config.toString(), function ()
                    { 
                        iad.file.saveFile(iad.report.lessPath, iad.css.getLessVarsAsString(), function ()
                        {
                            iad.css.getCssAsString(function (strCss)
                            {
                                iad.file.saveFile(iad.report.stylePath, strCss, function ()
                                {      
                                    // Copy ia-min.js because they might not have the latest version and a standalone report might break without it.
                                    iad.file.copyFile(__dirname + '/lib/ia/ia-min.js', iad.report.path + '/ia-min.js', function () 
                                    {
                                        iad.progress.end('save', function()
                                        {
                                            iad.file.onChangesSaved();
                                            if (callback !== undefined) callback.call(null);  
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        } 
        else
        {
            bootbox.alert(
            {
                message: 'You need to load a valid InstantAtlas Report before you can use this functionality.' +
                ' See <a target="_blank" href="http://www.instantatlas.com/">www.instantatlas.com</a> for further details.',
                backdrop: true
            });
        }
    };

    return iad;

})(iadesigner || {}, jQuery, window, document);
