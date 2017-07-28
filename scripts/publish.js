const fs = require('fs-extra');
const path = require('path');

const folderSource = path.join(__dirname, '../dist'),
    folderDest = '/Users/johnbellizzi/Dropbox/Small Victories/magnetic spider wolf';

fs.emptyDir(folderDest, (err) =>{
  if(err) return console.log(err);

  fs.copy(folderSource, folderDest, function(err){
    if(err) throw err;
  })
})