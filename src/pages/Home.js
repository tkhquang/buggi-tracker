import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Home() {
  const currentUser = JSON.parse(window.localStorage.getItem("user")) || null;

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="page home-page">
        {currentUser.role === "admin" && (
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
