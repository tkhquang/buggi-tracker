import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

import { auth } from "./services/firebase";
import { getUserById } from "./helpers/db";

import Loader from "./components/Loader";
import Header from "./components/Header";
import Routes from "./routes/Routes";

function App() {
  const [status, setStatus] = useState("LOADING");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (auth().currentUser) {
      const { uid } = auth().currentUser;

      getUserById(uid).then(data => {
        window.localStorage.setItem(
          "user",
          JSON.stringify({ ...data, uid: uid })
        );
      });
    }

    auth().onAuthStateChanged(user => {
      if (user) {
        const { uid } = user;
        getUserById(uid).then(data => {
          window.localStorage.setItem(
            "user",
            JSON.stringify({ ...data, uid: uid })
          );
          setAuthenticated(true);
          setStatus("IDLE");
        });
      } else {
        window.localStorage.removeItem("user");
        setAuthenticated(false);
        setStatus("IDLE");
      }
    });
  }, []);

  return status === "LOADING" ? (
    <Loader />
  ) : (
    <>
      <Helmet titleTemplate="%s | Buggi Tracker" />
      <Header />
      <Routes authenticated={authenticated} />
    </>
  );
}

export default App;
