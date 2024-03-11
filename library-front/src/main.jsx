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
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import NewBook from "./components/NewBook.jsx";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="authors" element={<Authors />} />
      <Route path="books" element={<Books />} />
      <Route path="addBook" element={<NewBook />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);
