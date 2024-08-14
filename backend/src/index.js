import express from "express";
import http from "http";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

// Resolvers and TypeDefs
import mergedResolvers from "./GraphQL/resolvers/index.js";
import mergedTypeDefs from "./GraphQL/typeDefs/index.js";
import { connectDB } from "./db/connectDB.js";

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Database connection
dotenv.config();
connectDB(process.env.MONGODB_URL)
  .then(() => console.log("DataBase connect succesfully"))
  .catch((error) => console.log(error));

// Ensure we wait for our server to start
await server.start();

app.use(
  "/",
  cors(),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req }) => req,
  })
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀 Server ready at http://localhost:4000/`);
