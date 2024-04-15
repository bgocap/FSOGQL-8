import { useMutation } from "@apollo/client";
import { useState } from "react";
import {
  ADD_BOOK,
  ALL_BOOKS,
  ALL_GENRES,
  ALL_AUTHORS,
} from "../services/queries";

const NewBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [yearPublished, setYearPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [createBook] = useMutation(ADD_BOOK, {
    refetchQueries: [
      { query: ALL_BOOKS },
      { query: ALL_GENRES },
      { query: ALL_AUTHORS },
    ],
    onError: (error) => {
      /*       const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      console.log(messages); */
    },
    //didn't work -> returns prevData===null all the time
    /* update: (cache, response) => {
            cache.updateQuery({ query: ALL_BOOKS }, ({ prevData }) => {
        console.log(prevData);
        if (!prevData) return prevData;
        return {
          allBooks: [...prevData.allBooks].concat(response.data.addBook),
        };
      });
    },
    }, */
  });

  const submit = async (event) => {
    event.preventDefault();
    const published = parseInt(yearPublished);
    createBook({
      variables: {
        title,
        author,
        published,
        genres,
      },
    });

    setTitle("");
    setYearPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div className="mx-3 my-2 flex flex-col gap-y-8">
      <h1 className="text-6xl font-serif">New Book</h1>
      <form
        onSubmit={submit}
        className="mt-12 flex flex-col items-center gap-y-6 w-100"
      >
        <div className="w-1/3">
          <h4 className="font-semibold">Title: </h4>
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            className=" px-2 py-1 border rounded-xl border-black w-full"
          />
        </div>
        <div className="w-1/3">
          <h4 className="font-semibold">Author: </h4>
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            className=" px-2 py-1 border rounded-xl border-black w-full"
          />
        </div>
        <div className="w-1/3">
          <h4 className="font-semibold">Published: </h4>
          <input
            type="number"
            value={yearPublished}
            onChange={({ target }) => setYearPublished(target.value)}
            className=" px-2 py-1 border rounded-xl border-black w-full"
          />
        </div>
        <div className="w-1/3">
          <h4 className="font-semibold">Genres: </h4>
          <div className="flex flex-row">
            <input
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
              className=" px-2 py-1 border rounded-xl border-black w-2/3"
            />
            <button
              onClick={addGenre}
              type="button"
              className="ml-3 px-2 py-1 bg-blue-300 active:bg-blue-200 rounded-xl w-1/3"
            >
              Add genre
            </button>
          </div>
          <div className="mt-2 px-2 py-1 border bg-slate-200 border-black rounded-xl w-100 min-h-8">
            {genres.join(", ")}
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 border rounded-lg  bg-blue-600 hover:bg-blue-500 active:bg-blue-400 focus:ring-2 text-white items-center  w-full max-w-60"
        >
          create book
        </button>
      </form>
    </div>
  );
};

export default NewBook;
