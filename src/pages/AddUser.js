import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { signup } from "../helpers/auth";
import { getUsers } from "../helpers/db";

import InputText from "../components/InputText";
import InputSelect from "../components/InputSelect";
import Breadcrumb from "../components/Breadcrumb";

export default function AddUser() {
  const history = useHistory();
  const [status, setStatus] = useState("IDLE");
  const usernameRef = useRef(null);
  const roleRef = useRef(null);

  const checkIfUsernameTaken = async username => {
    try {
      const userList = await getUsers();

      return userList.some(
        item => item.username.toLowerCase() === username.toLowerCase()
      );
    } catch (error) {
      Promise.reject(error);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    usernameRef.current.setValidating();
    roleRef.current.setValidating();

    if (usernameRef.current.hasErrors()) {
      return;
    }

    if (roleRef.current.hasErrors()) {
      return;
    }

    const username = usernameRef.current.getValue();
    const role = roleRef.current.getValue();

    try {
      setStatus("CALLING");
      const isUsernameTaken = await checkIfUsernameTaken(username);
      if (isUsernameTaken) {
        usernameRef.current.setError("UNIQUE");
        setStatus("IDLE");
        return;
      }

      await signup(username, role);
      setStatus("IDLE");
      history.push("/users");
    } catch (error) {
      setStatus("ERROR");
    }
  };

  return (
    <>
      <Helmet>
        <title>New User</title>
      </Helmet>
      <div className="page user-page">
        <Breadcrumb
          data={[
            { path: "/", name: "Home" },
            { path: "/users", name: "Users" },
            { name: "Add User" }
          ]}
        />
        <form className="form" onSubmit={handleSubmit}>
          <InputText
            ref={usernameRef}
            name="Username"
            rules={["REQUIRED", "MAX_LENGTH", "ALLOWED_CHARACTERS"]}
          />
          <InputSelect
            ref={roleRef}
            name="Role"
            options={["admin", "owner", "reporter"]}
            rules={["REQUIRED"]}
          />
          <button
            className="btn btn-primary"
            data-test="save-btn"
            type="submit"
            disabled={status === "CALLING"}
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
}
