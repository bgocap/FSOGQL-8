import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import { useApolloClient } from "@apollo/client";
import Recommended from "./components/Recommended";
import { useSubscription } from "@apollo/client";
import { BOOK_ADDED, ALL_BOOKS } from "./services/queries";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState();
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: async ({ data, client }) => {
      window.alert(`Book has been added`);
      const addedBook = data.data.bookAdded;
      console.log(addedBook);
      client.cache.updateQuery(
        { query: ALL_BOOKS, variables: { filter: null } },
        ({ allBooks }) => {
          return {
            allBooks: allBooks.concat(addedBook),
          };
        }
      );
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (localStorage.getItem("booksAppUser")) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (data) => {
    if (data) {
      setIsLoggedIn(data);
    }
  };

  const logOut = () => {
    localStorage.clear();
    client.resetStore();
    setIsLoggedIn(false);
  };

  return (
    <>
      <Router>
        <div>
          <NavBar isLoggedIn={isLoggedIn} logoutHandler={logOut} />
        </div>

        <Routes>
          <Route
            path="/NewBook"
            element={
              isLoggedIn ? <NewBook /> : <Navigate replace to="/login" />
            }
          />
          <Route
            path="/Authors"
            element={<Authors isLoggedIn={isLoggedIn} />}
          />
          <Route path="/Books" element={<Books />} />
          <Route path="/Recommended" element={<Recommended />} />
          <Route
            path="/Login"
            element={
              isLoggedIn ? (
                <Navigate replace to="/Books" />
              ) : (
                <Login loginInfo={handleLogin} />
              )
            }
          />
          <Route path="/" />
        </Routes>
      </Router>
    </>
  );
};

export default App;
