import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import { useApolloClient } from "@apollo/client";
import { useLoggedUser } from "./components/LoggedUserContext";

const App = () => {
  const { state, dispatch } = useLoggedUser();
  const client = useApolloClient();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    client.resetStore();
    dispatch({
      type: "CLEAR_USER",
    });
    navigate("/books");
  };

  return (
    <div>
      <nav>
        <NavLink to="authors" unstable_viewTransition>
          <button>Authors</button>
        </NavLink>
        <NavLink to="books" unstable_viewTransition>
          <button>Books</button>
        </NavLink>
        {state.user && (
          <>
            <NavLink to="recommended" unstable_viewTransition>
              <button>Recommended</button>
            </NavLink>
            <NavLink to="addBook" unstable_viewTransition>
              <button>Add Book</button>
            </NavLink>
            <button onClick={logout}>Logout</button>
          </>
        )}
        {!state.user && (
          <>
            <NavLink to="login" unstable_viewTransition>
              <button>Login</button>
            </NavLink>
          </>
        )}
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
