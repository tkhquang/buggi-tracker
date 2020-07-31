import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { getUsers, editProject, getProjectById } from "../helpers/db";

import withLoader from "../components/withLoader";
import InputText from "../components/InputText";
import InputSelect from "../components/InputSelect";
import InputDataList from "../components/InputDataList";
import Breadcrumb from "../components/Breadcrumb";

const getData = async id => {
  try {
    const users = await getUsers();
    const project = await getProjectById(id);

    return { users, project };
  } catch (error) {
    Promise.reject(error);
  }
};

export default withLoader(getData, { useParams: true, params: ["id"] })(
  function AddProject({ data }) {
    const { users, project: targetProject } = data;
    const currentUser = JSON.parse(window.localStorage.getItem("user")) || null;
    const history = useHistory();
    const [status, setStatus] = useState("IDLE");
    const nameRef = useRef(null);
    const memberRef = useRef(null);
    const ownerRef = useRef(null);

    const filterUsersByRole = role => {
      return users.filter(user => user.role === role);
    };

    const handleSubmit = async event => {
      event.preventDefault();

      nameRef.current.setValidating();
      ownerRef.current.setValidating();

      if (nameRef.current.hasErrors()) {
        return;
      }

      if (ownerRef.current.hasErrors()) {
        return;
      }

      const name = nameRef.current.getValue();
      const owner = users.find(
        user => user.username === ownerRef.current.getValue()
      );
      const members = memberRef.current
        .getList()
        .map(member => users.find(user => user.username === member));

      try {
        setStatus("CALLING");
        await editProject(targetProject.id, name, owner, members);
        setStatus("IDLE");

        history.push("/projects");
      } catch (error) {
        setStatus("ERROR");
      }
    };

    useEffect(() => {
      if (!targetProject) {
        history.push("/projects");
      }
    }, [targetProject, history]);

    return (
      targetProject && (
        <>
          <Helmet>
            <title>Edit Project · {targetProject.name}</title>
          </Helmet>
          <div className="page project-page">
            <Breadcrumb
              data={[
                { path: "/", name: "Home" },
                { path: "/projects", name: "Projects" },
                { name: "Edit Project" }
              ]}
            />
            <form className="form" onSubmit={handleSubmit}>
              <InputText
                ref={nameRef}
                name="Name"
                rules={["REQUIRED"]}
                {...(targetProject &&
                  targetProject.id && {
                    defaultValue: targetProject.name
                  })}
              />

              <InputSelect
                ref={ownerRef}
                name="Owner"
                rules={["REQUIRED"]}
                options={filterUsersByRole("owner").map(user => user.username)}
                {...(currentUser.role === "owner" && {
                  defaultValue: currentUser.username
                })}
                {...(targetProject &&
                  targetProject.owner && {
                    defaultValue: targetProject.owner.username
                  })}
              />

              <InputDataList
                ref={memberRef}
                single="Member"
                plural="Members"
                options={filterUsersByRole("reporter").map(
                  user => user.username
                )}
                rules={["REQUIRED"]}
                {...(targetProject &&
                  targetProject.members && {
                    defaultValue: targetProject.members.map(
                      member => member.username
                    )
                  })}
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
      )
    );
  }
);
