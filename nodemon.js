const nodemon = require('nodemon');

nodemon({ script: 'index.js' }).on('start', function () {
    console.log('nodemon started');
}).on('crash', function () {
    nodemon.emit('restart');
    console.log('script crashed for some reason');
});

// // force a restart
// nodemon.emit('restart');

// // force a quit
// nodemon.emit('quit');