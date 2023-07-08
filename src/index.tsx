import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.css";
import "./assets/fonts/font.ttf";

import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthProvider";

import App from "./App";
import { ProfileProvider } from "./context/ProfileProvider";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <>
    <React.StrictMode>
      <AuthProvider>
        <ProfileProvider>
          <BrowserRouter>
            <App />
            <ToastContainer limit={2} autoClose={1000} />
          </BrowserRouter>
        </ProfileProvider>
      </AuthProvider>
    </React.StrictMode>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
