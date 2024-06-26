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
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      console.log(messages);
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
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={yearPublished}
            onChange={({ target }) => setYearPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
