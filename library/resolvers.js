const { GraphQLError } = require("graphql");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
const jwt = require("jsonwebtoken");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
/* const book = require("./models/book"); */

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
      }

      try {
        let author = await Author.findOne({ name: args.author });

        if (!author) {
          const newAuthor = new Author({ name: args.author });
          const createdAuthor = await newAuthor.save();
          author = createdAuthor;
        }

        const newBook = new Book({ ...args, author: author.id });
        const response = await newBook.save();
        pubsub.publish("BOOK_ADDED", {
          bookAdded: response.populate("author"),
        });
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
