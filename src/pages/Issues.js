import React, { useEffect, useState, useCallback } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import { getProjectById, getIssues } from "../helpers/db";

import Loading from "../components/Loading";

export default function Issues() {
  const { project_id } = useParams();
  const history = useHistory();

  const [status, setStatus] = useState("LOADING");
  const [currentProject, setCurrentProject] = useState(null);
  const [issues, setIssues] = useState([]);

  const getIssuesFromDB = useCallback(async () => {
    try {
      const issueList = await getIssues(project_id);

      issueList.sort((a, b) => b.id - a.id);

      setIssues(issueList);
    } catch (error) {
      console.log(error);
    }
  }, [project_id]);

  const getCurrentProject = useCallback(async () => {
    const project = await getProjectById(project_id);
    if (!project) {
      history.push("/projects");
      return;
    }

    setCurrentProject(project);
  }, [history, project_id]);

  useEffect(() => {
    Promise.all([getIssuesFromDB(), getCurrentProject()]).finally(() => {
      setStatus("IDLE");
    });
  }, [getIssuesFromDB, getCurrentProject]);

  return status === "LOADING" ? (
    <Loading />
  ) : (
    <>
      <div className="page issues-page">
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
          <span data-test="bc-3" data-test-dir="top">
            {currentProject && currentProject.name} - Issues
          </span>
        </div>
        <Link
          to={`/projects/${project_id}/issues/new`}
          data-test="add-issue-btn"
          className="btn btn-primary"
        >
          + Add Issue
        </Link>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, index) => (
              <tr key={issue.id}>
                <td>
                  <span data-test={`id-${index + 1}`}>{issue.id}</span>
                </td>
                <td>
                  <Link
                    to={`/projects/${project_id}/issues/${issue.id}`}
                    data-test={`title-${index + 1}`}
                  >
                    {issue.title}
                  </Link>
                </td>
                <td>
                  <span data-test={`author-${index + 1}`}>
                    {issue.owner.username}
                  </span>
                </td>
                <td>
                  <span data-test={`status-${index + 1}`}>
                    {issue.open ? "Open" : "Closed"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
