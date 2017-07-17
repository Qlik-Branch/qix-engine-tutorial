const fs = require('fs'),
    spawn = require('child_process').spawn;

fs.watch('markdown-input', {recursive: true}, (e, file) =>{
  console.log(e);
  console.log(file);

  spawn('npm', ['run', 'compile-mdon']);
})