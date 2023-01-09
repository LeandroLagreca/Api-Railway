const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { Game } = require('./src/loadGamesDB/loadGame.js')
const { genresToDb } = require('./src/loadGamesDB/loadGenre.js')
require('dotenv').config();

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  genresToDb().then(()=>{
    Game().then(()=>{
      server.listen(process.env.PORT, () => {
         console.log('%s listening at ', process.env.PORT); // eslint-disable-line no-console
      });
    });
  });
});
