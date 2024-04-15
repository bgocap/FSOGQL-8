import { useQuery } from "@apollo/client";
import { ALL_BOOKS, USERINFO } from "../services/queries";

const Recommended = () => {
  const userResult = useQuery(USERINFO);
  const result = useQuery(ALL_BOOKS);

  if (result.loading || userResult.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;
  const favoriteGenre = userResult.data.me.favoriteGenre;

  return (
    <>
      <h2>Books in your favorite Genre "{favoriteGenre}"</h2>
      <div>
        <table>
          <tbody>
            <tr>
              <th>book</th>
              <th>author</th>
              <th>published</th>
            </tr>
            {books
              .filter((book) =>
                book.genres.some((genre) => genre === favoriteGenre)
              )
              .map((book) => (
                <tr key={book.title}>
                  <td>{book.title}</td>
                  <td>{book.author.name}</td>
                  <td>{book.published}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Recommended;
