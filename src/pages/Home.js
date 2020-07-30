import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const user = JSON.parse(window.localStorage.getItem("user")) || null;

  return (
    <>
      <div className="page home-page">
        {user && user.role === "admin" && (
          <Link
            to="/users"
            className="home-page__card"
            data-test="home-card-users"
            data-test-dir="top-center"
          >
            Users
          </Link>
        )}
        <Link
          to="/projects"
          className="home-page__card"
          data-test="home-card-projects"
          data-test-dir="top-center"
        >
          Projects
        </Link>
      </div>
    </>
  );
}
