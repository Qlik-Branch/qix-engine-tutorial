var fs = require('fs-extra');
var path = require('path');

let fileSources = [
  {
    filename: 'jquery.min.js',
    filePath: path.join(__dirname, '../node_modules/jquery/dist/'),
    fileDest: path.join(__dirname, '../dist/')
  }
];

let folderSources = [
  {
    folderPath: path.join(__dirname, '../node_modules/bootstrap/dist'),
    folderDest: path.join(__dirname, '../dist/bootstrap/dist')
  }
]

fileSources.forEach((file) =>{
  fs.access(file.fileDest, (err) =>{
    if(err) fs.mkdirpSync(file.fileDest);

    fs.copy(file.filePath +file.filename,
      file.fileDest +file.filename,
      {replace: true},
      function(err){
        if(err) throw err;
      })
  });
});

folderSources.forEach((folder) =>{
  fs.access(folder.folderDest, (err) =>{
    if(err){
      fs.mkdirpSync(folder.folderDest);

      fs.copy(folder.folderPath, folder.folderDest, function(err){
        if(err) throw err;
      })
    }
  })
})