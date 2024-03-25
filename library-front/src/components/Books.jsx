import { ALL_BOOKS } from "../services/queries";
import { useQuery } from "@apollo/client";

const Books = () => {
  const result = useQuery(ALL_BOOKS);
  console.log(result);
  if (result.loading) {
    return <div>loading...</div>;
  }
  const books = result.data.allBooks;
  //console.log(books);
  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th>book</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
