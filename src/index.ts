import express, { Application, Request, Response } from "express";
import { ApolloServer, gql } from "apollo-server-express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import { connectDB } from "./db/connection";


// Initialize Express app
const app: Application = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());

// Define GraphQL schema (this should be in a separate file for large projects)
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    age: Int
  }

  type Query {
    hello: String
    getUser(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, age: Int): User
  }
`;

// Dummy data and resolvers (again, separate them into their own files)
const users: { id: number; name: string; age: number }[] = [];

const resolvers = {
  Query: {
    hello: () => "Hello, world!",
    getUser: (_: any, { id }: { id: number }) =>
      users.find((user) => user.id === id),
  },
  Mutation: {
    createUser: (_: any, { name, age }: { name: string; age: number }) => {
      const user = { id: users.length + 1, name, age };
      users.push(user);
      return user;
    },
  },
};

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  // Connect to MongoDB
  // await connectDB();

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `✅ Server running 🚀 on http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startServer();
