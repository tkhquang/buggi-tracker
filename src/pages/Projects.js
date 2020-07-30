import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

import {
  getProjects,
  getOwnerProjects,
  getReporterProjects,
  deleteProject,
  getIssues
} from "../helpers/db";

import Loading from "../components/Loading";
import DeleteModal from "../components/DeleteModal";

export default function Projects() {
  const currentUser = JSON.parse(window.localStorage.getItem("user")) || null;

  const [status, setStatus] = useState("LOADING");
  const [projects, setProjects] = useState([]);

  const getProjectsFromDB = useCallback(async () => {
    const currentUser = JSON.parse(window.localStorage.getItem("user")) || null;

    try {
      let projectList = [];

      if (currentUser) {
        switch (currentUser.role) {
          case "admin":
            projectList = await getProjects();
            break;

          case "owner":
            projectList = await getOwnerProjects(currentUser.id);
            break;

          case "reporter":
            projectList = await getReporterProjects(currentUser.id);
            break;

          default:
            break;
        }
      } else {
        return;
      }

      const projectListWithIssueCount = await Promise.all(
        projectList.map(project => {
          return new Promise(function(resolve, reject) {
            getIssues(project.id).then(issueList => {
              resolve({
                ...project,
                issues: issueList.filter(issue => issue.open).length
              });
            });
          });
        })
      );

      setProjects(projectListWithIssueCount);
      setStatus("IDLE");
    } catch (error) {
      console.log(error);
    }
  }, []);

  const deleteCallback = async id => {
    try {
      await deleteProject(id);
      await getProjectsFromDB();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProjectsFromDB();
  }, [getProjectsFromDB]);

  return status === "LOADING" ? (
    <Loading />
  ) : (
    <div className="page projects-page">
      <div
        className="breadcrumb"
        data-test="breadcrumb"
        data-test-dir="top-center"
      >
        <Link to="/" data-test="bc-1" data-test-dir="top">
          Home
        </Link>
        <span className="breadcrumb__separator">&gt;</span>
        <span data-test="bc-2" data-test-dir="top">
          Projects
        </span>
      </div>
      {currentUser &&
        (currentUser.role === "admin" || currentUser.role === "owner") && (
          <Link
            to="/projects/new"
            data-test="add-project-btn"
            className="btn btn-primary"
          >
            + Add Project
          </Link>
        )}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Owner</th>
            <th>Issues</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={project.id}>
              <td>
                <span data-test={`name-${index + 1}`}>{project.name}</span>
              </td>
              <td>
                <span data-test={`owner-${index + 1}`}>
                  {project.owner.username}
                </span>
              </td>
              <td>
                <Link
                  data-test={`issues-${index + 1}`}
                  to={`/projects/${project.id}/issues`}
                >
                  {`${project.issues} open ${
                    project.issues === 1 ? "issue" : "issues"
                  }`}
                </Link>
              </td>
              <td>
                {currentUser && currentUser.role === "admin" && (
                  <>
                    <DeleteModal
                      name={project.name}
                      index={index + 1}
                      callback={() => deleteCallback(project.id)}
                    />{" "}
                    |{" "}
                  </>
                )}
                {currentUser &&
                  (currentUser.role === "admin" ||
                    currentUser.role === "owner") && (
                    <Link
                      to={`/projects/${project.id}`}
                      data-test={`edit-btn-${index + 1}`}
                    >
                      Edit
                    </Link>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
