import { useEffect, useState } from "react";
import { ALL_BOOKS, ALL_GENRES } from "../services/queries";
import { useQuery } from "@apollo/client";

const Book = ({ book }) => (
  <tr className="  border border-solid border-slate-700">
    <td className=" px-1.5 py-2 border border-solid border-slate-700">
      {book.title}
    </td>
    <td className="px-1.5 py-2 text-center border border-solid border-slate-700">
      {book.author.name}
    </td>
    <td className="px-1.5 py-2 text-center border border-solid border-slate-700">
      {book.published}
    </td>
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
    <div className="mx-3 my-2 flex flex-col gap-y-8">
      <h1 className="text-6xl font-serif">Books</h1>
      <div>
        <h4>Filters: </h4>
        <button
          onClick={() => {
            setFilter(null);
          }}
          className="mx-1 my-0.5 py-0.5 px-1.5 border border-solid border-black rounded-full hover:bg-black hover:text-white hover:border-none"
        >
          All genres
        </button>
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => {
              setFilter(genre);
            }}
            className="mx-1 my-0.5 py-0.5 px-1.5 rounded-full bg-slate-200 text-slate-900 hover:bg-slate-100"
          >
            {genre}
          </button>
        ))}
      </div>
      <div className="flex flex-col">
        {filter ? (
          <h3 className="text-2xl font-serif">In genre {filter}</h3>
        ) : (
          <h3 className="text-2xl font-serif">All Genres</h3>
        )}
        <table className=" mt-4 mx-3 p-1 border border-solid border-slate-700 w-100">
          <tbody>
            <tr className=" p-1 border border-solid border-slate-700 rounded-3xl">
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
