import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";

import { signin } from "../helpers/auth";

import InputText from "../components/InputText";

export default function Login() {
  const [status, setStatus] = useState("IDLE");
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async event => {
    event.preventDefault();

    usernameRef.current.setValidating();
    passwordRef.current.setValidating();

    if (usernameRef.current.hasErrors()) {
      return;
    }

    if (passwordRef.current.hasErrors()) {
      return;
    }

    const username = usernameRef.current.getValue();
    const password = passwordRef.current.getValue();

    try {
      setStatus("CALLING");
      await signin(username, password);
    } catch (error) {
      setStatus("ERROR");
    }
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="login-page">
        <h1>Buggi Login</h1>
        <form className="form" onSubmit={handleSubmit}>
          {status === "ERROR" && (
            <div data-test="login-error" className="alert">
              {"Authentication failed"}
            </div>
          )}
          <InputText ref={usernameRef} name="Username" rules={["REQUIRED"]} />
          <InputText
            ref={passwordRef}
            name="Password"
            rules={["REQUIRED"]}
            type="password"
          />
          <button
            className="btn btn-primary"
            data-test="login-btn"
            type="submit"
            disabled={status === "CALLING"}
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
