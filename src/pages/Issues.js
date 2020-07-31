import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { getProjectById, getIssues } from "../helpers/db";

import withLoader from "../components/withLoader";
import Breadcrumb from "../components/Breadcrumb";

const getData = async id => {
  try {
    const project = await getProjectById(id);
    const issues = await getIssues(project.id);
    issues.sort((a, b) => b.id - a.id);

    return { project, issues };
  } catch (error) {
    Promise.reject(error);
  }
};

export default withLoader(getData, { useParams: true, params: ["project_id"] })(
  function Issues({ data }) {
    const { project: currentProject, issues } = data;
    const history = useHistory();

    useEffect(() => {
      if (!currentProject) {
        history.push("/projects");
      }
    }, [currentProject, history]);

    return (
      currentProject && (
        <>
          <Helmet>
            <title>Issues · {currentProject.name}</title>
          </Helmet>
          <div className="page issues-page">
            <Breadcrumb
              data={[
                { path: "/", name: "Home" },
                { path: "/projects", name: "Projects" },
                {
                  name: `${currentProject.name} - Issues`
                }
              ]}
            />

            <Link
              to={`/projects/${currentProject.id}/issues/new`}
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
                        to={`/projects/${currentProject.id}/issues/${issue.id}`}
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
      )
    );
  }
);
