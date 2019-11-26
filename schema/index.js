//Import Type Helpers from Graphql -js
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require("graphql");

const MeType = require("./types/me");
const pgdb = require("../database/pgdb");

//the root query type is where in the data graph we can start asking questions
const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    me: {
      type: MeType,
      description: "fetch my details by providing API key ",
      args: {
        key: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (obj, args, { pgPool }) => {
        return pgdb(pgPool).getUser(args.key);
      }
    }
  }
});

const ncSchema = new GraphQLSchema({
  query: RootQueryType
  // mutation:
});

module.exports = ncSchema;
