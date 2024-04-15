import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../services/queries";
import { useNavigate } from "react-router-dom";

const LoginForm = ({
  submit,
  username,
  password,
  setUsername,
  setPassword,
}) => (
  <>
    <form
      onSubmit={submit}
      className="mt-12 flex flex-col items-center gap-y-6"
    >
      <h1 className="text-6xl font-serif">Login</h1>
      <div>
        Username
        <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-30 p-2.5"
        />
      </div>
      <div>
        Password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-30 p-2.5"
        />
      </div>
      <button
        className="px-4 py-2 border rounded-lg  bg-blue-500 text-white items-center  w-full max-w-32"
        type="submit"
      >
        Login
      </button>
    </form>
  </>
);

const Login = ({ loginInfo }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
    onCompleted: (data) => {
      const token = data.login.value;
      localStorage.setItem("booksAppUser", token);
      navigate("/Books");
    },
  });

  const submit = async (event) => {
    event.preventDefault();
    await login({ variables: { username, password } });
    console.log("Login working");
    loginInfo(true);
  };

  return (
    <>
      <LoginForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        submit={submit}
      />
    </>
  );
};

export default Login;
