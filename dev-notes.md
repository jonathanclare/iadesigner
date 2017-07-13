04/07/17




03/07/17

For autoupdates to work in IIS added mime types to web.config which werent included by default.
<mimeMap fileExtension=".7z" mimeType="application/x-7z-compressed" />
<mimeMap fileExtension=".yml" mimeType="application/yaml" />

Autoupdates werent working so replaced 'electron-prebuilt' with 'electron' because 'electron-updater' was breaking with old version of 'electron-prebuilt'.
'electron-prebuilt' and 'electron' are the same package - its now advised to use electron wherever possible.
https://stackoverflow.com/questions/41574586/what-is-the-difference-between-electron-and-electron-prebuilt

30/06/17

Used NPM 'http-server' for testing autoupdates.
http-server C:\Work\InstantAtlasReports\ia-designer 
http://10.20.0.103:8080/
https://www.npmjs.com/package/http-server

When I wanted to check the conatents of an asar file (used in packaging the app) I installed asar for opening asar files. asar --help