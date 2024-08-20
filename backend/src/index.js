import express from "express";
import http from "http";
import cors from "cors";

import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";

import dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { buildContext } from "graphql-passport";

// Resolvers and TypeDefs
import mergedResolvers from "./GraphQL/resolvers/index.js";
import mergedTypeDefs from "./GraphQL/typeDefs/index.js";
import { connectDB } from "./db/connectDB.js";

import { configurePassport } from "./passport/passport.config.js";
configurePassport();

const app = express();
const httpServer = http.createServer(app);

// Creating User's login session in the Mongodb
const MongoDBstore = connectMongo(session);

const store = new MongoDBstore({
  uri: process.env.MONGODB_URL,
  collection: "sessions",
});

store.on("error", (err) => {
  console.log(err, "Mongodb session error");
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true, //this option prevents the Corss-Site Scripting (xss) attacks
    },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Ensure we wait for our server to start
await server.start();

app.use(
  "/",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
// Database connection
connectDB(process.env.MONGODB_URL)
  .then(() => console.log("DataBase connect succesfully"))
  .catch((error) => console.log(error));

console.log(`🚀 Server ready at http://localhost:4000/`);
