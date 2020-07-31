import React from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Login";
import Home from "../pages/Home";
import Users from "../pages/Users";
import AddUser from "../pages/AddUser";
import EditUser from "../pages/EditUser";
import Projects from "../pages/Projects";
import AddProject from "../pages/AddProject";
import EditProject from "../pages/EditProject";
import Issues from "../pages/Issues";
import AddIssue from "../pages/AddIssue";
import IssueDetail from "../pages/IssueDetail";

function Routes({ authenticated }) {
  return (
    <Router>
      <Switch>
        <PublicRoute
          path="/login"
          authenticated={authenticated}
          component={Login}
        />

        <PrivateRoute
          path="/home"
          authenticated={authenticated}
          component={Home}
        />

        <ProtectedRoute
          exact
          roles={["admin"]}
          path="/users"
          component={Users}
        />

        <ProtectedRoute
          roles={["admin"]}
          path="/users/new"
          component={AddUser}
        />

        <ProtectedRoute
          roles={["admin"]}
          path="/users/:id"
          component={EditUser}
        />

        <PrivateRoute
          exact
          path="/projects"
          authenticated={authenticated}
          component={Projects}
        />

        <PrivateRoute
          exact
          path="/projects/:project_id/issues"
          authenticated={authenticated}
          component={Issues}
        />

        <PrivateRoute
          exact
          path="/projects/:project_id/issues/new"
          authenticated={authenticated}
          component={AddIssue}
        />

        <PrivateRoute
          path="/projects/:project_id/issues/:id"
          authenticated={authenticated}
          component={IssueDetail}
        />

        <ProtectedRoute
          exact
          roles={["admin", "owner"]}
          path="/projects/new"
          component={AddProject}
        />

        <ProtectedRoute
          roles={["admin", "owner"]}
          path="/projects/:id"
          component={EditProject}
        />

        <Redirect from="*" to="/home" />
      </Switch>
    </Router>
  );
}

export default Routes;
