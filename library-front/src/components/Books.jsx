import { useEffect, useState } from "react";
import { ALL_BOOKS } from "../services/queries";
import { useQuery } from "@apollo/client";

const Book = ({ book }) => (
  <tr>
    <td>{book.title}</td>
    <td>{book.author.name}</td>
    <td>{book.published}</td>
  </tr>
);

const Books = () => {
  const result = useQuery(ALL_BOOKS);
  const [filter, setFilter] = useState(null);

  if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;

  const allGenres = books
    .reduce((allGenresArray, book) => {
      book.genres.map((genre) => allGenresArray.push(genre));
      return allGenresArray;
    }, [])
    .filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

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
