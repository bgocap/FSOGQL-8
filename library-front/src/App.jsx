import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./App.css";

const App = () => {
  const [page, setPage] = useState("authors");

  return (
    <div>
      <nav>
        <NavLink to="authors" unstable_viewTransition>
          <button>Authors</button>
        </NavLink>

        <NavLink to="books" unstable_viewTransition>
          <button>Books</button>
        </NavLink>
        <NavLink to="addBook" unstable_viewTransition>
          <button>Add Book</button>
        </NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
