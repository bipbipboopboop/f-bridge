import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "./assets/fonts/font.ttf";

import reportWebVitals from "./reportWebVitals";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { FunctionProvider } from "./context/FunctionContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <>
    <AuthProvider>
      <FunctionProvider>
        <BrowserRouter>
          <App />
          <ToastContainer limit={2} autoClose={3000} />
        </BrowserRouter>
      </FunctionProvider>
    </AuthProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
