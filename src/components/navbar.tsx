import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useAuth } from "../context/AuthContext";
import { User } from "firebase/auth";

const Navbar: React.FC = () => {
  const { playerProfile, user } = useAuth();
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  const handleSignInWithGoogle = async () => {
    await signInWithGoogle();
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

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
        <ul className="navbar-nav">
          <li className="nav-item active">
            <Link className="nav-link" to="/lobby">
              Lobby
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
          <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <a className="dropdown-item" href="#">
              Edit Profile
            </a>
            <a className="dropdown-item" href="#">
              Settings
            </a>
            {(user as User | null)?.isAnonymous ? (
              <a className="dropdown-item" onClick={handleSignInWithGoogle}>
                Login
              </a>
            ) : (
              <a className="dropdown-item" onClick={handleSignOut}>
                Logout
              </a>
            )}
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
