import nodemon from 'nodemon';

nodemon({script: 'server.js'}).on('start', () => {
    console.log('Server has started');
}).on('quit', () => {
    console.log('Server has quit');
}).on('restart', files => {
    console.log('Server restarted due to: ', files);
});