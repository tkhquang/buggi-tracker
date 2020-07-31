import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { getUsers, createNewProject } from "../helpers/db";

import withLoader from "../components/withLoader";
import InputText from "../components/InputText";
import InputSelect from "../components/InputSelect";
import InputDataList from "../components/InputDataList";
import Breadcrumb from "../components/Breadcrumb";

export default withLoader(getUsers)(function AddProject({ data }) {
  const users = data;
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
      await createNewProject(name, owner, members);
      setStatus("IDLE");

      history.push("/projects");
    } catch (error) {
      setStatus("ERROR");
    }
  };

  return (
    <>
      <Helmet>
        <title>New Project</title>
      </Helmet>
      <div className="page project-page">
        <Breadcrumb
          data={[
            { path: "/", name: "Home" },
            { path: "/projects", name: "Projects" },
            { name: "Add Project" }
          ]}
        />
        <form className="form" onSubmit={handleSubmit}>
          <InputText ref={nameRef} name="Name" rules={["REQUIRED"]} />

          <InputSelect
            ref={ownerRef}
            name="Owner"
            rules={["REQUIRED"]}
            options={filterUsersByRole("owner").map(user => user.username)}
            {...(currentUser.role === "owner" && {
              defaultValue: currentUser.username
            })}
          />

          <InputDataList
            ref={memberRef}
            single="Member"
            plural="Members"
            options={filterUsersByRole("reporter").map(user => user.username)}
            rules={["REQUIRED"]}
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
  );
});
