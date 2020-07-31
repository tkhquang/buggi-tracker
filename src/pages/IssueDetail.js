import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { getProjectById, getIssueById } from "../helpers/db";

import withLoader from "../components/withLoader";
import Breadcrumb from "../components/Breadcrumb";

const getData = async (projectId, issueId) => {
  try {
    const project = await getProjectById(projectId);
    const issue = await getIssueById(project.id, issueId);

    return { project, issue };
  } catch (error) {
    Promise.reject(error);
  }
};

export default withLoader(getData, {
  useParams: true,
  params: ["project_id", "id"]
})(function IssueDetail({ data }) {
  const { project: currentProject, issue: currentIssue } = data;
  const history = useHistory();

  useEffect(() => {
    if (!currentProject || !currentIssue) {
      history.push("/projects");
    }
  }, [history, currentProject, currentIssue]);

  return (
    currentIssue && (
      <>
        <Helmet>
          <title>
            {currentIssue.title} · Issue #{currentIssue.id} ·{" "}
            {currentProject.name}
          </title>
        </Helmet>
        <div className="page issue-page">
          <Breadcrumb
            data={[
              { path: "/", name: "Home" },
              { path: "/projects", name: "Projects" },
              {
                path: `/projects/${currentProject.id}/issues`,
                name: `${currentProject.name} - Issues`
              },
              { name: `#${currentIssue.id}` }
            ]}
          />
          <div></div>
          <h1
            className="issue-title"
            data-test="issue-title"
            data-test-dir="top-center"
          >
            {currentIssue.title} <span>#{currentIssue.id}</span>
          </h1>
          <div
            className="issue-post"
            data-test="post-1"
            data-test-dir="top-center"
          >
            <div className="issue-post__author">
              <span data-test="author">{currentIssue.owner.username}</span>
            </div>
            <div
              className="issue-post__description"
              data-test="desc"
              data-test-dir="top-center"
            >
              {currentIssue.description}
            </div>
          </div>
        </div>
      </>
    )
  );
});
