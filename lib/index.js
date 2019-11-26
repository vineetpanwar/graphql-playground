const graphqlHTTP = require("express-graphql");
const pg = require("pg");
const { MongoClient } = require("mongodb");
const assert = require("assert");

const { nodeEnv } = require("./util");
const ncSchema = require("../schema");
const pgConfig = require("../config/pg")[nodeEnv];
const mConfig = require("../config/mongo")[nodeEnv];

console.log(`Running in ${nodeEnv} mode...`);

//Initialize the HTTP Client Setup using express
const app = require("express")();

//Initialize the Postgress Pool Connection Object
const pgPool = new pg.Pool(pgConfig);

//Initialize and Connect the MongoClient
MongoClient.connect(mConfig.url, (err, mPool) => {
  assert.equal(err, null);

  //define HTTP routes
  app.use(
    "/graphql",
    graphqlHTTP({
      schema: ncSchema,
      graphiql: true,
      context: { pgPool, mPool }
    })
  );
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
  });
});
