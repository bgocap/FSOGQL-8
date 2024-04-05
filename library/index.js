const { ApolloServer } = require("@apollo/server");
const { GraphQLError } = require("graphql");
const { startStandaloneServer } = require("@apollo/server/standalone");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
mongoose.set("strictQuery", false);

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
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

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
    allGenres: [String]!
    me: User
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
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) =>
      args.genre
        ? Book.find({ genres: args.genre }).populate("author")
        : Book.find({}).populate("author"),

    allAuthors: async () => Author.find({}),
    allGenres: async () => {
      const allBooks = await Book.find({});
      const result = [
        ...allBooks.reduce((allG, book) => {
          book.genres.forEach((genre) => allG.add(genre));
          return allG;
        }, new Set()),
      ];

      return result;
    },
    me: async (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_REQUEST",
          },
        });
      } else {
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
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_REQUEST",
          },
        });
      } else {
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
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });
      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
