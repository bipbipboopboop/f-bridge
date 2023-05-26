import {signOut} from "firebase/auth";
import {useAuth} from "../hooks/useAuth";
import {auth} from "../firebase";

const Navbar = () => {
  const {user} = useAuth();
  return (
    <div className="w-100">
      {user && user.isAnonymous && (
        <button onClick={async () => {}}>Sign In</button>
      )}
      {user && !user.isAnonymous && (
        <button onClick={() => signOut(auth)}>Sign Out</button>
      )}
    </div>
  );
};

export default Navbar;
