import {signOut} from "firebase/auth";
import {auth} from "../firebase";
import {Link} from "react-router-dom";

import {useSignInWithGoogle} from "react-firebase-hooks/auth";
import {useAuth} from "../hooks/useAuth";
import GreenButton from "./buttons/button.green";

const Navbar = () => {
  const {playerProfile, user} = useAuth();
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  return (
    <nav className="w-100 navbar navbar-expand-lg navbar-dark px-3">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <Link className="navbar-brand" to="/">
          Floating Bridge
        </Link>
        <ul className="navbar-nav">
          <li className="nav-item active">
            <Link className="nav-link" to="/lobby">
              Lobby
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/leaderboard">
              Leaderboard
            </Link>
          </li>
        </ul>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdownMenuLink"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {playerProfile?.displayName}
          </a>
          <div
            className="dropdown-menu"
            aria-labelledby="navbarDropdownMenuLink"
          >
            <a className="dropdown-item" href="#">
              Edit Profile
            </a>
            <a className="dropdown-item" href="#">
              Settings
            </a>
            <a className="dropdown-item" href="#">
              {user?.isAnonymous ? "Login" : "Logout"}
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
