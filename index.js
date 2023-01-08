const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { Game } = require('./src/loadGamesDB/loadGame.js')
const { genresToDb } = require('./src/loadGamesDB/loadGenre.js')
const port = process.env.PORT || 3001

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  genresToDb().then(()=>{
    Game().then(()=>{
      server.listen(port, () => {
         console.log(`%s listening at ${port}`); // eslint-disable-line no-console
      });
    });
  });
});
