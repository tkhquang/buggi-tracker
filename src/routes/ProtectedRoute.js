import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function ProtectedRoute({
  component: Component,
  roles,
  title,
  ...rest
}) {
  const currentUser = JSON.parse(window.localStorage.getItem("user")) || null;

  const isAuthorized = () => {
    if (currentUser) {
      return roles.some(role => role === currentUser.role);
    } else {
      return false;
    }
  };

  return (
    <Route
      {...rest}
      render={props =>
        isAuthorized() ? (
          <>
            <Component {...props} />
          </>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}
