import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Authors from "./components/Authors.jsx";
import Books from "./components/Books.jsx";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import NewBook from "./components/NewBook.jsx";
import Login from "./components/Login.jsx";
import { setContext } from "@apollo/client/link/context";
import { LoggedUserProvider } from "./components/LoggedUserContext.jsx";

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("booksAppUserToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="authors" element={<Authors />} />
      <Route path="books" element={<Books />} />
      <Route path="addBook" element={<NewBook />} />
      <Route path="login" element={<Login />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <LoggedUserProvider>
      <RouterProvider router={router} />
    </LoggedUserProvider>
  </ApolloProvider>
);
