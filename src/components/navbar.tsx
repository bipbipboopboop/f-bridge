import {signOut} from "firebase/auth";
import {auth} from "../firebase";

import {useSignInWithGoogle} from "react-firebase-hooks/auth";
import {useAuth} from "../hooks/useAuth";

const Navbar = () => {
  const {playerProfile, user} = useAuth();
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  return (
    <div className="w-100 d-flex justify-content-evenly p-2">
      <p>Floating Bridge</p>
      <p>Lobby</p>
      <p>Leaderboard</p>
      <div>
        <p>{playerProfile?.displayName}</p>
        {user?.isAnonymous && (
          <button
            onClick={async () => {
              await signInWithGoogle();
            }}
          >
            Sign In
          </button>
        )}
        {!user?.isAnonymous && (
          <button
            onClick={async () => {
              await signOut(auth);
            }}
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
