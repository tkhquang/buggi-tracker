import React, { useEffect, useState, useCallback } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import {
  getUsers,
  createNewProject,
  getProjectById,
  editProject
} from "../helpers/db";

import Loading from "../components/Loading";

const ERRORS = {
  NAME: {
    REQUIRED: "Name is required	"
  },
  OWNER: {
    REQUIRED: "Owner is required"
  },
  ADD_MEMBER: {
    REQUIRED: "Member is required"
  }
};

export default function AddOrEditProject() {
  const { id } = useParams();
  const history = useHistory();

  const [currentPage, setCurrentPage] = useState(null);
  const currentUser = JSON.parse(window.localStorage.getItem("user")) || null;

  const [status, setStatus] = useState("LOADING");
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState({
    name: {
      value: "",
      validating: false,
      error: ""
    },
    owner: {
      value: currentUser && currentUser.role === "owner" ? currentUser.uid : "",
      validating: false,
      error: ""
    },
    members: {
      value: [],
      validating: false,
      error: ""
    },
    member: {
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

    if (typeof value === "string") {
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

  const addNewMember = () => {
    if (input.member.value.length === 0) {
      setInput({
        ...input,
        member: {
          ...input.member,
          validating: true,
          error: checkErrors("member", input.member.value)
        }
      });
      return;
    }

    const newInput = { ...input };
    newInput.members.value.push(
      users.find(user => user.id === input.member.value)
    );
    newInput.members.value.sort((a, b) => a.username.localeCompare(b.username));
    newInput.member.value = "";
    setInput(newInput);
  };

  const deleteMember = id => {
    const newInput = { ...input };
    newInput.members.value = newInput.members.value.filter(
      member => member.id !== id
    );
    setInput(newInput);
  };

  const getUsersFromDB = async () => {
    try {
      const userList = await getUsers();

      setUsers(userList);
    } catch (error) {
      console.log(error);
    }
  };

  const filterUsersByRole = role => {
    return users.filter(user => user.role === role);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const fields = ["name", "members", "owner"];

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

    const name = input.name.value;
    const owner = users.find(user => user.id === input.owner.value);
    const members = input.members.value;

    try {
      setInput({
        ...input,
        submit: {
          ...input.submit,
          status: "CALLING"
        }
      });

      if (currentPage === "Add") {
        await createNewProject(name, owner, members);
      } else {
        await editProject(id, name, owner, members);
      }

      setInput({
        ...input,
        submit: {
          ...input.submit,
          status: "IDLE"
        }
      });

      history.push("/projects");
    } catch (error) {
      setInput({
        ...input,
        submit: {
          ...input.submit,
          error: "",
          status: "IDLE"
        }
      });
    }
  };

  const getCurrentProject = useCallback(async () => {
    if (id === "new") {
      setCurrentPage("Add");
      return;
    }

    setCurrentPage("Edit");

    const project = await getProjectById(id);
    if (!project) {
      history.push("/projects");
      return;
    }

    setInput(input => {
      const newInput = { ...input };
      newInput.name.value = project.name;
      newInput.owner.value = project.owner.id;
      newInput.members.value = project.members;

      return newInput;
    });
  }, [history, id]);

  useEffect(() => {
    Promise.all([getUsersFromDB(), getCurrentProject()]).finally(() => {
      setStatus("IDLE");
    });
  }, [getCurrentProject]);

  return status === "LOADING" ? (
    <Loading />
  ) : (
    <>
      <div className="page project-page">
        <div
          className="breadcrumb"
          data-test="breadcrumb"
          data-test-dir="top-center"
        >
          <Link to="/" data-test="bc-1" data-test-dir="top">
            Home
          </Link>
          <span className="breadcrumb__separator">&gt;</span>
          <Link to="/projects" data-test="bc-2" data-test-dir="top">
            Projects
          </Link>
          <span className="breadcrumb__separator">&gt;</span>
          <span data-test="bc-3" data-test-dir="top">
            {currentPage} Project
          </span>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="textbox" data-test="name">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={input.name.value}
              onChange={onInputChange}
            />
            {input.name.validating && input.name.error !== "" && (
              <div data-test="error" className="error">
                {ERRORS.NAME[input.name.error]}
              </div>
            )}
          </div>

          <div className="select" data-test="owner">
            <label htmlFor="owner">Owner</label>
            <select
              id="owner"
              name="owner"
              value={input.owner.value}
              onChange={onInputChange}
              disabled={currentUser && currentUser.role === "owner"}
            >
              <option disabled value="">
                select
              </option>
              {filterUsersByRole("owner").map(person => (
                <option key={person.id} value={person.id}>
                  {person.username}
                </option>
              ))}
            </select>
            {input.owner.validating && input.owner.error !== "" && (
              <div data-test="error" className="error">
                {ERRORS.OWNER[input.owner.error]}
              </div>
            )}
          </div>
          <div className="member-field">
            Members
            <ul>
              {input.members.value.map((member, index) => (
                <li key={member.id}>
                  <button
                    style={{
                      all: "unset",
                      cursor: "pointer",
                      color: "red",
                      marginRight: "5px"
                    }}
                    type="button"
                    data-test={`del-member-btn-${index + 1}`}
                    data-test-dir="left"
                    title="delete"
                    onClick={() => deleteMember(member.id)}
                  >
                    x
                  </button>
                  <span data-test={`member-${index + 1}`}>
                    {member.username}
                  </span>
                </li>
              ))}
            </ul>
            <div className="add-select-wrapper">
              <div
                className="select"
                data-test="add-member"
                data-test-dir="left"
              >
                <select
                  id="member"
                  name="member"
                  value={input.member.value}
                  onChange={onInputChange}
                  disabled={
                    filterUsersByRole("reporter").filter(
                      person =>
                        !input.members.value.some(
                          member => member.id === person.id
                        )
                    ).length === 0
                  }
                >
                  <option disabled value="">
                    select
                  </option>
                  {filterUsersByRole("reporter")
                    .filter(
                      person =>
                        !input.members.value.some(
                          member => member.id === person.id
                        )
                    )
                    .map(person => (
                      <option key={person.id} value={person.id}>
                        {person.username}
                      </option>
                    ))}
                </select>
                {input.member.validating && input.member.error !== "" && (
                  <div data-test="error" className="error">
                    {ERRORS.ADD_MEMBER[input.member.error]}
                  </div>
                )}
              </div>
              <button
                type="button"
                className="btn btn-primary"
                data-test="add-member-btn"
                onClick={addNewMember}
                disabled={false}
              >
                Add
              </button>
            </div>
          </div>
          <button
            className="btn btn-primary"
            data-test="save-btn"
            type="submit"
            disabled={input.submit.status === "CALLING"}
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
}
