const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { Game } = require('./src/loadGamesDB/loadGame.js')
const { genresToDb } = require('./src/loadGamesDB/loadGenre.js')
const { PORT } = require('./config.js');

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  genresToDb().then(()=>{
    Game().then(()=>{
      server.listen(PORT, () => {
         console.log('%s listening at ', PORT);
          // eslint-disable-line no-console
      });
    });
  });
});
