import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { playerAccount, user } = useAuth();
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignInWithGoogle = async () => {
    await signInWithGoogle();
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="w-100 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          {/* No decoration for link */}
          <Link to="/lobby" style={{ textDecoration: "none" }} className="text-white font-semibold text-xl">
            Lobby
          </Link>
        </div>
        <div className="relative">
          <button className="flex items-center text-white font-semibold focus:outline-none" onClick={toggleDropdown}>
            <span>{playerAccount?.displayName}</span>
            <svg className="ml-2 h-5 w-5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className={`absolute right-0 mt-2 py-2 bg-white rounded-md shadow-lg ${isDropdownOpen ? "" : "hidden"}`}>
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
              Edit Profile
            </a>
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
              Settings
            </a>
            {user?.isAnonymous ? (
              <a href="#" onClick={handleSignInWithGoogle} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                Login
              </a>
            ) : (
              <a href="#" onClick={handleSignOut} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                Logout
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
