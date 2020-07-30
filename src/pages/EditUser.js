import React, { useState, useEffect, useCallback } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import { updateUser } from "../helpers/auth";
import { getUsers, getUserById } from "../helpers/db";

import Loading from "../components/Loading";

const ERRORS = {
  USERNAME: {
    REQUIRED: "Username is required",
    MAX_LENGTH: "Username can have max 10 characters",
    ALLOWED_CHARACTERS: "Username can contain only letters and numbers",
    UNIQUE: "Username is already taken"
  },
  ROLE: {
    REQUIRED: "Role is required"
  }
};

export default function EditUser() {
  const { id } = useParams();
  const history = useHistory();

  const [currentUser, setCurrentUser] = useState(null);
  const [input, setInput] = useState({
    username: {
      value: "",
      validating: false,
      error: ""
    },
    role: {
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

      if (value.length > 10) {
        return "MAX_LENGTH";
      }

      if (!/^[A-Za-z0-9]*$/.test(value)) {
        return "ALLOWED_CHARACTERS";
      }
    }

    if (name === "role") {
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

    const fields = ["username", "role"];

    const newInput = { ...input };
    newInput["submit"].validating = true;
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

    const username = input.username.value;
    const role = input.role.value;

    // Nothing has changed
    if (currentUser.username === username && currentUser.role === role) {
      history.push("/users");
      return;
    }

    try {
      setInput({
        ...input,
        submit: {
          ...input.submit,
          status: "LOADING"
        }
      });

      const userList = await getUsers();

      // Username already exists
      if (
        userList.some(
          item =>
            item.username.toLowerCase() !==
              currentUser.username.toLowerCase() &&
            item.username.toLowerCase() === username.toLowerCase()
        )
      ) {
        setInput({
          ...input,
          username: {
            ...input.username,
            error: "UNIQUE"
          }
        });

        return;
      }

      await updateUser(currentUser.id, username, role);

      setInput({
        ...input,
        submit: {
          ...input.submit,
          status: "IDLE"
        }
      });

      history.push("/users");
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

  const getCurrentUser = useCallback(() => {
    getUserById(id).then(user => {
      if (!user) {
        history.push("/users");
        return;
      }

      setCurrentUser(user);

      setInput(input => ({
        ...input,
        username: {
          ...input.username,
          value: user.username
        },
        role: {
          ...input.role,
          value: user.role
        }
      }));
    });
  }, [history, id]);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return !currentUser ? (
    <Loading />
  ) : (
    <>
      <div className="page user-page">
        <div
          className="breadcrumb"
          data-test="breadcrumb"
          data-test-dir="top-center"
        >
          <Link to="/" data-test="bc-1" data-test-dir="top">
            Home
          </Link>
          <span className="breadcrumb__separator">&gt;</span>
          <Link to="/users" data-test="bc-2" data-test-dir="top">
            Users
          </Link>
          <span className="breadcrumb__separator">&gt;</span>
          <span data-test="bc-3" data-test-dir="top">
            Edit User
          </span>
        </div>
        <form className="form" onSubmit={handleSubmit}>
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
          <div className="select" data-test="role">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={input.role.value}
              onChange={onInputChange}
            >
              <option value="" disabled>
                select
              </option>
              <option value="admin">admin</option>
              <option value="owner">owner</option>
              <option value="reporter">reporter</option>
            </select>
            {input.role.validating && input.role.error !== "" && (
              <div data-test="error" className="error">
                {ERRORS.ROLE[input.role.error]}
              </div>
            )}
          </div>
          <button
            className="btn btn-primary"
            data-test="save-btn"
            type="submit"
            disabled={input.submit.status === "LOADING"}
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
}
