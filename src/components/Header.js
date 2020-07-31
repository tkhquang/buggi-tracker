import React from "react";
import { signout } from "../helpers/auth";

export default function Header() {
  const currentUser = JSON.parse(window.localStorage.getItem("user")) || null;

  return (
    <div className="header">
      <h2 className="header__title">Buggi</h2>
      <div
        data-test-dir="left"
        data-test="header-username"
        className="header__username"
      >
        Hello {currentUser && currentUser.username}
      </div>
      <button
        data-test="logout-btn"
        className="btn btn-primary"
        onClick={signout}
      >
        Logout
      </button>
    </div>
  );
}
