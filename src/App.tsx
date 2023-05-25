// import { useState } from "react";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
  useSignOut,
} from "react-firebase-hooks/auth";
import {auth} from "./firebase";
import {useAuth} from "./hooks/useAuth";

function App() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [createUserWithEmailAndPassword, _] =
    useCreateUserWithEmailAndPassword(auth);

  const [signInWithEmailAndPassword, __] = useSignInWithEmailAndPassword(auth);

  const [signOut, loading, error] = useSignOut(auth);

  const {user} = useAuth();

  return (
    <div className="d-flex justify-content-center align-items-center">
      <pre>{JSON.stringify(user)}</pre>
      <div>
        <button
          onClick={() =>
            createUserWithEmailAndPassword("u1@email.com", "123456")
          }
        >
          Sign Up
        </button>
        <button
          onClick={() => signInWithEmailAndPassword("u1@email.com", "123456")}
        >
          Sign In
        </button>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    </div>
  );
}

export default App;
