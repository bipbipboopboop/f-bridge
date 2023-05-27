import {signOut} from "firebase/auth";
import {useAuth} from "../hooks/useAuth";
import {auth} from "../firebase";
import {useSignInWithGoogle} from "react-firebase-hooks/auth";

const Navbar = () => {
  const {playerProfile, user} = useAuth();
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  return (
    <div className="w-100">
      <p>{playerProfile?.displayName}</p>
      {user && (
        <button
          onClick={async () => {
            await signInWithGoogle();
          }}
        >
          Sign In
        </button>
      )}
      {/* {user && !user.isAnonymous && ( */}
      <button
        onClick={async () => {
          await signOut(auth);
        }}
      >
        Sign Out
      </button>
      {/* )} */}
    </div>
  );
};

export default Navbar;
