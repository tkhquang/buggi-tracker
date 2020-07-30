import React, { useState, useEffect, useCallback } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import { getProjectById, createNewIssue } from "../helpers/db";

import Loading from "../components/Loading";

const ERRORS = {
  TITLE: {
    REQUIRED: "Title is required	"
  },
  DESCRIPTION: {
    REQUIRED: "Description is required"
  }
};

export default function AddIssue() {
  const { project_id } = useParams();
  const history = useHistory();

  const currentUser = JSON.parse(window.localStorage.getItem("user")) || null;

  const [currentProject, setCurrentProject] = useState(null);
  const [status, setStatus] = useState("LOADING");
  const [input, setInput] = useState({
    title: {
      value: "",
      validating: false,
      error: ""
    },
    description: {
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

  const handleSubmit = async event => {
    event.preventDefault();

    const fields = ["title", "description"];

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

    const title = input.title.value;
    const description = input.description.value;
    const owner = currentUser;

    try {
      setInput({
        ...input,
        submit: {
          ...input.submit,
          status: "CALLING"
        }
      });

      await createNewIssue(project_id, owner, title, description);

      setInput({
        ...input,
        submit: {
          ...input.submit,
          status: "IDLE"
        }
      });

      history.push(`/projects/${project_id}/issues`);
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
    const project = await getProjectById(project_id);
    if (!project) {
      history.push("/projects");
      return;
    }

    setCurrentProject(project);

    setStatus("IDLE");
  }, [history, project_id]);

  useEffect(() => {
    getCurrentProject();
  }, [getCurrentProject]);

  return status === "LOADING" ? (
    <Loading />
  ) : (
    <>
      <div className="page add-issue-page">
        <div
          className="breadcrumb"
          data-test="breadcrumb"
          data-test-dir="top-center"
        >
          <Link to="/" data-test="bc-1" data-test-dir="top">
            Home
          </Link>
          <span className="breadcrumb__separator">&gt;</span>
          <Link data-test="bc-2" data-test-dir="top" to="/projects">
            Projects
          </Link>
          <span className="breadcrumb__separator">&gt;</span>
          <Link
            data-test="bc-3"
            data-test-dir="top"
            to={`/projects/${project_id}/issues`}
          >
            {currentProject && currentProject.name} - Issues
          </Link>
          <span className="breadcrumb__separator">&gt;</span>
          <span data-test="bc-4" data-test-dir="top">
            Add Issue
          </span>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="textbox" data-test="title">
            <label htmlFor="name">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={input.title.value}
              onChange={onInputChange}
            />
            {input.title.validating && input.title.error !== "" && (
              <div data-test="error" className="error">
                {ERRORS.TITLE[input.title.error]}
              </div>
            )}
          </div>
          <div className="textbox" data-test="description">
            <label htmlFor="name">Description</label>
            <textarea
              id="description"
              name="description"
              value={input.description.value}
              onChange={onInputChange}
            ></textarea>
            {input.description.validating && input.description.error !== "" && (
              <div data-test="error" className="error">
                {ERRORS.DESCRIPTION[input.description.error]}
              </div>
            )}
          </div>
          <button
            className="btn btn-primary"
            data-test="post-btn"
            type="submit"
          >
            Post
          </button>
        </form>
      </div>
    </>
  );
}
