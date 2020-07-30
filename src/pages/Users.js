import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getUsers } from "../helpers/db";
import { deleteUser } from "../helpers/auth";

import Loading from "../components/Loading";
import DeleteModal from "../components/DeleteModal";

export default function Users() {
  const currentUser = JSON.parse(window.localStorage.getItem("user")) || null;

  const [status, setStatus] = useState("LOADING");
  const [users, setUsers] = useState([]);

  const getUsersFromDB = async () => {
    try {
      const userList = await getUsers();

      setUsers(userList);
    } catch (error) {
      console.log(error);
    } finally {
      setStatus("IDLE");
    }
  };

  const deleteCallback = async id => {
    try {
      await deleteUser(id);
      await getUsersFromDB();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsersFromDB();
  }, []);

  return status === "LOADING" ? (
    <Loading />
  ) : (
    <>
      <div className="page users-page">
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
            Users
          </span>
        </div>
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
                      />
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
}
