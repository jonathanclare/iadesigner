var fs = require('fs');
var files = ['data.js', '_louisiana_parishes.shp1-t2.js', '_louisiana_parishes.shp1-t1.js'];
for (var i in files)
{
    reformatFile(files[i]);
}

function reformatFile(f)
{
    var fileJson = fs.readFileSync(f);
    console.log('Read complete ' + f + ' - ' + fileJson.length);
    fs.writeFile(f, JSON.stringify(JSON.parse(fileJson), null, 2), function (err)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log("JSON saved to " + f);
        }
    });
}