import {signInAnonymously} from "firebase/auth";
import {useAuth} from "./hooks/useAuth";
import useFunctions from "./hooks/useFunctions";
import {auth} from "./firebase";
import Loading from "./components/loading";
import Navbar from "./components/navbar";

function App() {
  const {isLoading} = useFunctions();

  if (isLoading) return <Loading />;

  return (
    <div>
      <Navbar />
      {/* <pre>{JSON.stringify(user)}</pre> */}
    </div>
  );
}

export default App;
