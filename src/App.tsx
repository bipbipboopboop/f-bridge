import {signInAnonymously} from "firebase/auth";
import {useAuth} from "./hooks/useAuth";
import useFunctions from "./hooks/useFunctions";
import {auth} from "./firebase";
import Loading from "./components/loading";

function App() {
  const {createAnonymousPlayer, retrieveMyPlayerProfile, signOut, isLoading} =
    useFunctions();

  const {user} = useAuth();

  if (isLoading) return <Loading />;

  return (
    <div className="d-flex justify-content-center align-items-center">
      {/* <pre>{JSON.stringify(user)}</pre> */}
      <div>
        {user && user.isAnonymous && (
          <button
            onClick={async () => {
              await signInAnonymously(auth);
            }}
          >
            Sign In
          </button>
        )}
        {user && !user.isAnonymous && (
          <button onClick={() => signOut()}>Sign Out</button>
        )}
      </div>
    </div>
  );
}

export default App;
