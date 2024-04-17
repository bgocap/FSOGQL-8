import { useMutation, useQuery } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../services/queries";
import { useState } from "react";

const SetBirthYear = ({ authors }) => {
  const [name, setName] = useState(authors[0].name);
  const [bornYear, setBornYear] = useState("");
  const [editBirthYear] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

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
    <div>
      <h2 className="text-xl font-bold">Set Birth Year</h2>
      <form
        onSubmit={submit}
        className="mt-12 flex flex-col items-center gap-y-6"
      >
        <div>
          <label htmlFor="select">Name</label>
          <select
            onChange={({ target }) => setName(target.value)}
            className="ml-3 px-2 py-1 bg-slate-200 rounded-xl"
          >
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
            className="ml-3 px-2 py-1 border rounded-xl border-black"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 border rounded-lg  bg-blue-600 hover:bg-blue-500 focus:ring-2 text-white items-center  w-full max-w-60"
        >
          update author
        </button>
      </form>
    </div>
  );
};

const Authors = ({ isLoggedIn }) => {
  const result = useQuery(ALL_AUTHORS);
  if (result.loading) {
    return <div>loading...</div>;
  }
  const authors = result.data.allAuthors;

  return (
    <div className="mx-3 my-2 flex flex-col gap-y-8">
      <h1 className="text-6xl font-serif">Authors</h1>
      <table>
        <tbody>
          <tr className=" p-1 border border-solid border-slate-700 rounded-3xl">
            <th>author</th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name} className=" border border-solid border-slate-700">
              <td className="px-1.5 py-2 border border-solid border-slate-700">
                <h4 className="font-semibold">{a.name}</h4>
              </td>
              <td className="px-1.5 py-2 text-center border border-solid border-slate-700">
                {a.born}
              </td>
              <td className="px-1.5 py-2 text-center border border-solid border-slate-700">
                {a.bookCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isLoggedIn && <SetBirthYear authors={authors} />}
    </div>
  );
};

export default Authors;
