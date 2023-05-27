import "./App.css";
import useFunctions from "./hooks/useFunctions";
import Loading from "./components/loading";
import Navbar from "./components/navbar";

function App() {
  const {isLoading} = useFunctions();

  if (isLoading) return <Loading />;

  return (
    <div className="App">
      <Navbar />
      {/* <pre>{JSON.stringify(user)}</pre> */}
    </div>
  );
}

export default App;
