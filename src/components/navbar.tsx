import {signOut} from "firebase/auth";
import {auth} from "../firebase";

import {useSignInWithGoogle} from "react-firebase-hooks/auth";
import {useAuth} from "../hooks/useAuth";
import GreenButton from "./buttons/button.green";

const Navbar = () => {
  const {playerProfile, user} = useAuth();
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  return (
    <nav className="w-100 navbar navbar-expand-lg pt-5">
      <a className="navbar-brand">Navbar</a>
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
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" href="#">
              Home <span className="sr-only">(current)</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Features
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Pricing
            </a>
          </li>
          {!user?.isAnonymous && (
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
                <a className="dropdown-item">Edit Profile</a>
                <a className="dropdown-item">Settings</a>
                <button
                  className="dropdown-item"
                  onClick={async () => {
                    await signOut(auth);
                  }}
                >
                  Sign Out
                </button>
              </div>
            </li>
          )}
          {user?.isAnonymous && (
            <li className="nav-item">
              <a className="nav-link" href="#">
                {playerProfile?.displayName}
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
