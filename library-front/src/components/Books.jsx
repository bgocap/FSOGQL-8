import { useState } from "react";
import { ALL_BOOKS, ALL_GENRES } from "../services/queries";
import { useQuery } from "@apollo/client";

const Book = ({ book }) => (
  <tr>
    <td>{book.title}</td>
    <td>{book.author.name}</td>
    <td>{book.published}</td>
  </tr>
);

const Books = () => {
  const [filter, setFilter] = useState(null);
  const booksQuery = useQuery(ALL_BOOKS, {
    variables: { filter },
  });
  const genresQuery = useQuery(ALL_GENRES);

  if (booksQuery.loading || genresQuery.loading) {
    return <div>loading...</div>;
  }

  const books = booksQuery.data.allBooks;

  const allGenres = genresQuery.data.allGenres;

  return (
    <div>
      <div>
        {filter ? <h3>In genre {filter}</h3> : <h3>All Genres</h3>}
        <button
          onClick={() => {
            setFilter(null);
          }}
        >
          All genres
        </button>
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => {
              setFilter(genre);
            }}
          >
            {genre}
          </button>
        ))}
      </div>
      <h2>books</h2>
      <div>
        <table>
          <tbody>
            <tr>
              <th>book</th>
              <th>author</th>
              <th>published</th>
            </tr>
            {filter
              ? books
                  .filter((book) =>
                    book.genres.some((genre) => genre === filter)
                  )
                  .map((book) => <Book book={book} key={book.title}></Book>)
              : books.map((book) => <Book book={book} key={book.title}></Book>)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Books;
