import React, { useState, useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";

import { auth } from "./services/firebase";
import { getUserById } from "./helpers/db";

import Loading from "./components/Loading";
import Header from "./components/Header";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import Projects from "./pages/Projects";
import AddOrEditProject from "./pages/AddOrEditProject";
import Issues from "./pages/Issues";
import AddIssue from "./pages/AddIssue";
import IssueDetail from "./pages/IssueDetail";

import "./App.css";

function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === false ? (
          <Component {...props} />
        ) : (
          <Redirect to="/home" />
        )
      }
    />
  );
}

function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

function ProtectedRoute({ component: Component, roles, ...rest }) {
  const user = JSON.parse(window.localStorage.getItem("user")) || null;

  const isAuthorized = () => {
    if (user) {
      return roles.some(role => role === user.role);
    } else {
      return false;
    }
  };

  return (
    <Route
      {...rest}
      render={props =>
        isAuthorized() ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (auth().currentUser) {
      const { uid } = auth().currentUser;

      getUserById(uid).then(data => {
        window.localStorage.setItem(
          "user",
          JSON.stringify({ ...data, uid: uid })
        );
      });
    }

    auth().onAuthStateChanged(user => {
      if (user) {
        const { uid } = user;
        getUserById(uid).then(data => {
          window.localStorage.setItem(
            "user",
            JSON.stringify({ ...data, uid: uid })
          );
          setAuthenticated(true);
          setLoading(false);
        });
      } else {
        window.localStorage.removeItem("user");
        setAuthenticated(false);
        setLoading(false);
      }
    });
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <Router>
      {authenticated && <Header />}
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
          roles={["admin", "owner"]}
          path="/projects/:id"
          component={AddOrEditProject}
        />

        <Redirect from="*" to="/home" />
      </Switch>
    </Router>
  );
}

export default App;
