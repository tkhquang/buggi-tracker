import React, { useState } from "react";
import { signin } from "../helpers/auth";

const ERRORS = {
  USERNAME: {
    REQUIRED: "Username is required"
  },
  PASSWORD: {
    REQUIRED: "Password is required"
  },
  SUBMIT: {
    AUTHENTICATION: "Authentication failed"
  }
};

export default function Login() {
  const [input, setInput] = useState({
    username: {
      value: "",
      validating: false,
      error: ""
    },
    password: {
      value: "",
      validating: false,
      error: ""
    },
    submit: {
      status: "IDLE",
      error: ""
    }
  });

  const checkErrors = (name, value) => {
    value = value || input[name].value;

    if (name === "username") {
      if (value.trim().length === 0) {
        return "REQUIRED";
      }
    }

    if (name === "password") {
      if (value.trim().length === 0) {
        return "REQUIRED";
      }
    }

    return "";
  };

  const onInputChange = ({ target: { name, value } }) => {
    const newInput = { ...input };

    newInput[name].validating = true;
    newInput[name].value = value;
    newInput[name].error = checkErrors(name, value);

    setInput(newInput);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const fields = ["username", "password"];

    const newInput = { ...input };
    newInput["submit"].error = "";

    let hasErrors = false;

    fields.forEach(field => {
      let fieldErrors = checkErrors(field);

      if (fieldErrors !== "") {
        hasErrors = true;
      }

      newInput[field].validating = true;
      newInput[field].error = fieldErrors;
    });

    setInput(newInput);

    if (hasErrors) {
      return;
    }

    const username = input.username.value.toLowerCase();
    const password = input.password.value;

    setInput({
      ...input,
      submit: {
        ...input.submit,
        status: "LOADING"
      }
    });

    try {
      await signin(username, password);

      setInput({
        ...input,
        submit: {
          ...input.submit,
          status: "IDLE"
        }
      });
    } catch (error) {
      setInput({
        ...input,
        submit: {
          ...input.submit,
          error: "AUTHENTICATION",
          status: "IDLE"
        }
      });
    }
  };

  return (
    <div className="login-page">
      <h1>Buggi Login</h1>
      <form className="form" onSubmit={handleSubmit}>
        {input.submit.error !== "" && (
          <div data-test="login-error" className="alert">
            {ERRORS.SUBMIT[input.submit.error]}
          </div>
        )}
        <div className="textbox" data-test="username">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            onChange={onInputChange}
            value={input.username.value}
          />
          {input.username.validating && input.username.error !== "" && (
            <div data-test="error" className="error">
              {ERRORS.USERNAME[input.username.error]}
            </div>
          )}
        </div>
        <div className="textbox" data-test="password">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={onInputChange}
            value={input.password.value}
          />
          {input.password.validating && input.password.error !== "" && (
            <div data-test="error" className="error">
              {ERRORS.PASSWORD[input.password.error]}
            </div>
          )}
        </div>
        <button
          className="btn btn-primary"
          data-test="login-btn"
          type="submit"
          disabled={input.submit.status === "LOADING"}
        >
          Login
        </button>
      </form>
    </div>
  );
}
