import { useMutation, useQuery } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../services/queries";
import { useState } from "react";

const SetBirthYear = ({ authors }) => {
  console.log(authors);
  const [name, setName] = useState(authors[0].name);
  const [bornYear, setBornYear] = useState("");
  const [editBirthYear] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });
  console.log(bornYear);

  const submit = async (event) => {
    event.preventDefault();
    const setBornTo = parseInt(bornYear);
    editBirthYear({
      variables: {
        name,
        setBornTo,
      },
    });
    setBornYear("");
  };

  return (
    <>
      <h2>Set Birth Year</h2>
      <form onSubmit={submit}>
        <div>
          Name
          <select onChange={({ target }) => setName(target.value)}>
            {authors.map((author) => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          Year
          <input
            type="number"
            value={bornYear}
            onChange={({ target }) => setBornYear(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </>
  );
};

const Authors = () => {
  const result = useQuery(ALL_AUTHORS);
  if (result.loading) {
    return <div>loading...</div>;
  }
  const authors = result.data.allAuthors;

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th>author</th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBirthYear authors={authors} />
    </div>
  );
};

export default Authors;
