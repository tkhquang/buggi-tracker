import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { getProjectById, createNewIssue } from "../helpers/db";

import InputText from "../components/InputText";
import InputTextarea from "../components/InputTextarea";
import withLoader from "../components/withLoader";
import Breadcrumb from "../components/Breadcrumb";

export default withLoader(getProjectById, {
  useParams: true,
  params: ["project_id"]
})(function AddIssue({ data }) {
  const currentProject = data;
  const currentUser = JSON.parse(window.localStorage.getItem("user")) || null;
  const history = useHistory();
  const [status, setStatus] = useState("IDLE");
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleSubmit = async event => {
    event.preventDefault();

    titleRef.current.setValidating();
    descriptionRef.current.setValidating();

    if (titleRef.current.hasErrors()) {
      return;
    }

    if (descriptionRef.current.hasErrors()) {
      return;
    }

    const title = titleRef.current.getValue();
    const description = descriptionRef.current.getValue();
    const owner = currentUser;

    try {
      setStatus("CALLING");
      await createNewIssue(currentProject.id, owner, title, description);
      setStatus("IDLE");
      history.push(`/projects/${currentProject.id}/issues`);
    } catch (error) {
      setStatus("ERROR");
    }
  };

  useEffect(() => {
    if (!currentProject) {
      history.push("/projects");
    }
  }, [history, currentProject]);

  return (
    currentProject && (
      <>
        <Helmet>
          <title>New Issue</title>
        </Helmet>
        <div className="page add-issue-page">
          <Breadcrumb
            data={[
              { path: "/", name: "Home" },
              { path: "/projects", name: "Projects" },
              {
                path: `/projects/${currentProject.id}/issues`,
                name: `${currentProject.name} - Issues`
              },
              { name: "Add Issue" }
            ]}
          />
          <form className="form" onSubmit={handleSubmit}>
            <InputText ref={titleRef} name="Title" rules={["REQUIRED"]} />
            <InputTextarea
              ref={descriptionRef}
              name="Description"
              rules={["REQUIRED"]}
            />
            <button
              className="btn btn-primary"
              data-test="post-btn"
              type="submit"
              disabled={status === "CALLING"}
            >
              Post
            </button>
          </form>
        </div>
      </>
    )
  );
});
