import React, { useState, useEffect, useCallback } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import { getProjectById, getIssueById } from "../helpers/db";

import Loading from "../components/Loading";

export default function IssueDetail() {
  const { project_id, id } = useParams();
  const history = useHistory();

  const [currentIssue, setCurrentIssue] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [status, setStatus] = useState("LOADING");

  const getCurrentProject = useCallback(async () => {
    const project = await getProjectById(project_id);
    if (!project) {
      history.push("/projects");
      return;
    }

    setCurrentProject(project);

    const currentIssue = await getIssueById(project_id, id);

    if (!currentIssue) {
      history.push("/projects");
      return;
    }

    setCurrentIssue(currentIssue);
    setStatus("IDLE");
  }, [history, project_id, id]);

  useEffect(() => {
    getCurrentProject();
  }, [getCurrentProject]);

  return status === "LOADING" ? (
    <Loading />
  ) : (
    <>
      <div className="page issue-page">
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
            #{currentIssue && currentIssue.id}
          </span>
        </div>
        <div></div>
        <h1
          className="issue-title"
          data-test="issue-title"
          data-test-dir="top-center"
        >
          {currentIssue && currentIssue.title}{" "}
          <span>#{currentIssue && currentIssue.id}</span>
        </h1>
        <div
          className="issue-post"
          data-test="post-1"
          data-test-dir="top-center"
        >
          <div className="issue-post__author">
            <span data-test="author">
              {currentIssue && currentIssue.owner.username}
            </span>
          </div>
          <div
            className="issue-post__description"
            data-test="desc"
            data-test-dir="top-center"
          >
            {currentIssue && currentIssue.description}
          </div>
        </div>
      </div>
    </>
  );
}
