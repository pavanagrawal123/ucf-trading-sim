const nodemon = require('nodemon');
const ngrok = require('ngrok');
const port = process.env.PORT || 4000;

nodemon({
  script: 'index.js',
  ext: 'js',
});

let url = null;

nodemon
  .on('start', async () => {
    if (!url) {
      url = await ngrok.connect({ port: port });
      console.log(`Server now available at ${url}`);
    }
  })
  .on('quit', async () => {
    await ngrok.kill();
  });
