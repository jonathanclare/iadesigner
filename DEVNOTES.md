# Developer Notes

## 28-09-2017
Created src/website/index.html - this is copied to ./dist/ when "grunt buildWebsite" is run
Created src/website/release-notes.html - this is copied to ./dist/release-notes/ and renamed index.html when "grunt buildWebsite" is run

"url": "http://oxygen/Work/GitHub/iadesigner/dist/"
changed to...
"url": "http://oxygen.geowise.co.uk/ia-designer/" which points to C:\Work\GitHub\iadesigner\dist
for rollout to geowise

## 22-09-2017
Added

grunt bump:prepatch
>> Version bumped to 0.0.1-0

grunt bump:preminor
>> Version bumped to 0.1.0-0

grunt bump:premajor
>> Version bumped to 1.0.0-0

"dist:prepatch": "grunt bump:prepatch && npm run dist:web",
"dist:preminor": "grunt bump:preminor && npm run dist:web",
"dist:premajor": "grunt bump:premajor && npm run dist:web",

Set a specific version
"dist:version": "grunt bump --setversion=2.0.1 && npm run dist:web"

## 19-09-2017
Added grunt-bump for version control in package.json
https://github.com/vojtajina/grunt-bump

grunt bump:patch
>> Version bumped to 0.0.1

grunt bump:minor
>> Version bumped to 0.1.0

grunt bump:major
>> Version bumped to 1.0.0

In package.js added some new scripts for releasing different versions. 

"dist:web": "grunt build && build --win nsis-web --ia32 --x64 && grunt copy:latest",
"dist:patch": "grunt bump:patch && dist:web",
"dist:minor": "grunt bump:minor && dist:web",
"dist:major": "grunt bump:major && dist:web"

## 06-09-2017
"url": "http://instantatlas.com/apps/ia-designer/dist/"
changed to...
"url": "http://oxygen/Work/GitHub/iadesigner/dist/"
for quicker testing

Theres no way of stopping autoupdater from installing a new version once autoUpdater.checkForUpdates() is called. 
It will be installed silently when the app is closed, even if you clicked to install later.

## 30/06/17
Added http-server for testing.
http-server C:\Work\InstantAtlasReports\ia-designer 
http://10.20.0.103:8080/

For autoupdates to work in IIS added mime types to web.config which werent included by default.
<mimeMap fileExtension=".7z" mimeType="application/x-7z-compressed" />
<mimeMap fileExtension=".yml" mimeType="application/yaml" />

Autoupdates werent working so replaced 'electron-prebuilt' with 'electron' because 'electron-updater' was breaking with old version of 'electron-prebuilt'.
'electron-prebuilt' and 'electron' are the same package - its now advised to use electron wherever possible.
https://stackoverflow.com/questions/41574586/what-is-the-difference-between-electron-and-electron-prebuilt

Used NPM 'http-server' for testing autoupdates.
http-server C:\Work\InstantAtlasReports\ia-designer 
http://10.20.0.103:8080/
https://www.npmjs.com/package/http-server

When I wanted to check the contents of an asar file (used in packaging the app) I installed asar for opening asar files. asar --help
Installed asar for opening asar files. asar --help