import { useQuery } from "@apollo/client";
import { ALL_BOOKS, USERINFO } from "../services/queries";
import { useLoggedUser } from "./LoggedUserContext";

const Recommended = () => {
  const { state, dispatch } = useLoggedUser();
  console.log("state before ME query", state);
  const userResult = useQuery(USERINFO, {
    onCompleted: (data) => {
      if (data) {
        console.log(data);
        dispatch({
          type: "SET_USER",
          payload: {
            username: data.me.username,
            favoriteGenre: data.me.favoriteGenre,
          },
        });
      }
    },
  });
  const result = useQuery(ALL_BOOKS);
  if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;
  console.log("state after ME query", state);
  return (
    <>
      <h2>Books in your favorite Genre "{state.user.favoriteGenre}"</h2>
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
                book.genres.some((genre) => genre === state.user.favoriteGenre)
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
