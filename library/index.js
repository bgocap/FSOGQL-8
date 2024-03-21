const { ApolloServer } = require("@apollo/server");
const { GraphQLError } = require("graphql");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v4: uuid } = require("uuid");
const mongoose = require("mongoose");
const Book = require("./models/book");
const Author = require("./models/author");

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to DB...");

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = `

  type Book {
    title:String!
    author:Author
    published:Int!
    id:String!
    genres:[String]!
  }

  type Author {
    name:String!
    id:String!
    born:Int
    bookCount:Int!
  }

  type Query {
    bookCount:Int!
    authorCount:Int!
    allBooks(author:String, genre:String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
        title:String!
        author:String!
        published:Int!
        genres:[String]!
    ) : Book
    editAuthor(
        name:String!
        setBornTo:Int!
    ):Author
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) =>
      args.genre
        ? Book.find({ genres: [args.genre] }).populate("author")
        : Book.find({}).populate("author"),

    allAuthors: async () => Author.find({}),
  },
  Mutation: {
    addBook: async (root, args) => {
      const author = await Author.findOne({ name: args.author });
      const newBook = new Book({ ...args, author: author.id });
      try {
        const response = await newBook.save();
        return response.populate("author");
      } catch (error) {
        throw new GraphQLError("Create new Book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }
    },
    editAuthor: async (root, args) => {
      const updatedAuthor = await Author.findOne({ name: args.name });
      updatedAuthor.born = args.setBornTo;
      try {
        const response = await updatedAuthor.save();
        return response;
      } catch (error) {
        throw new GraphQLError("Edit author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
