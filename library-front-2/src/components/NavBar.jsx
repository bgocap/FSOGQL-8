import { Link } from "react-router-dom";

const NavBar = ({ isLoggedIn, logoutHandler }) => {
  /* className="w-40 flex flex-wrap items-center justify-between mx-auto p-4" */
  return (
    <>
      <nav className=" w-100  bg-slate-200 top-0 left-0 right-100  text-slate-500 font-semibold">
        <div className=" p-3 pl-1 flex justify-end gap-x-6">
          <Link
            to="/Authors"
            className={`hover:text-slate-700 ${
              isLoggedIn ? "decoration decoration-solid" : "decoration-inherit"
            }`}
          >
            Authors
          </Link>
          <Link to="/Books" className=" hover:text-slate-700">
            Books
          </Link>
          {isLoggedIn ? (
            <>
              <div className="flex flex-row hover:text-slate-700">
                <Link to="/NewBook">Add New</Link>
                <svg
                  className="w-6 h-6 stroke-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth="2.2"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <a onClick={logoutHandler}>Log out</a>
            </>
          ) : (
            <Link to="Login" className=" hover:text-slate-700">
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
