const knex = require('knex');

app = require("./app");

const { PORT, DB_URL } = require("./config");

const db = knex({
  client: 'pg',
  connections: 'DB_URL'
})

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
