import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../services/queries";
import { useNavigate } from "react-router-dom";
import { useLoggedUser } from "./LoggedUserContext";

const Login = () => {
  const { state, dispatch } = useLoggedUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
    onCompleted: (data) => {
      const token = data.login.value;
      localStorage.setItem("booksAppUserToken", token);
      dispatch({
        type: "SET_USER",
        payload: { username: "exampleUser", token: token },
      });
      navigate("/books");
    },
  });

  const submit = async (event) => {
    event.preventDefault();
    await login({ variables: { username, password } });
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
