import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { getUsers } from "../helpers/db";
import { deleteUser } from "../helpers/auth";

import withLoader from "../components/withLoader";
import InPageLoader from "../components/InPageLoader";
import DeleteModal from "../components/DeleteModal";
import Breadcrumb from "../components/Breadcrumb";

export default withLoader(getUsers)(function Users({ data }) {
  const [users, setUsers] = useState(data);
  const currentUser = JSON.parse(window.localStorage.getItem("user")) || null;
  const [status, setStatus] = useState("IDLE");

  const deleteCallback = async id => {
    try {
      await deleteUser(id);

      setStatus("CALLING");
      const userList = await getUsers();
      setUsers(userList);

      setStatus("IDLE");
    } catch (error) {
      setStatus("ERROR");
      Promise.reject(error);
    }
  };

  return status === "CALLING" ? (
    <InPageLoader />
  ) : (
    <>
      <Helmet>
        <title>User Management</title>
      </Helmet>
      <div className="page users-page">
        <Breadcrumb data={[{ path: "/", name: "Home" }, { name: "Users" }]} />
        <Link
          to="/users/new"
          data-test="add-user-btn"
          className="btn btn-primary"
        >
          + Add User
        </Link>
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>
                  <span data-test={`username-${index + 1}`}>
                    {user.username}
                  </span>
                </td>
                <td>
                  <span data-test={`role-${index + 1}`}>{user.role}</span>
                </td>
                <td>
                  {currentUser.uid !== user.id && (
                    <>
                      <DeleteModal
                        name={user.username}
                        index={index + 1}
                        callback={() => deleteCallback(user.id)}
                      />{" "}
                      |{" "}
                      <Link
                        to={`/users/${user.id}`}
                        data-test={`edit-btn-${index + 1}`}
                      >
                        Edit
                      </Link>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});
