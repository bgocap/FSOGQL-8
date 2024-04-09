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
  
  type Subscription {
    bookAdded: Book!
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

module.exports = typeDefs;
