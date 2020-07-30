import { db } from "../services/firebase";

export const getUsers = () => {
  return new Promise(function(resolve, reject) {
    const userList = [];

    db.collection("users")
      .get()
      .then(snap => {
        snap.forEach(doc => {
          const user = doc.data();
          user.id = doc.id;
          user.username = user.email.replace("@tkhquang.dev", "");

          userList.push(user);
        });

        userList.sort((a, b) => a.username.localeCompare(b.username));

        resolve(userList);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const getUserById = id => {
  return new Promise(function(resolve, reject) {
    db.collection("users")
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          const user = doc.data();
          user.id = id;
          user.username = user.email.replace("@tkhquang.dev", "");

          resolve(user);
        } else {
          resolve(null);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const createNewProject = (name, owner, members) => {
  return new Promise(function(resolve, reject) {
    db.collection("projects")
      .doc()
      .set({
        name,
        owner,
        members
      })
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const editProject = (id, name, owner, members) => {
  return new Promise(function(resolve, reject) {
    db.collection("projects")
      .doc(id)
      .update({
        name,
        owner,
        members
      })
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const deleteProject = id => {
  return new Promise(function(resolve, reject) {
    db.collection("projects")
      .doc(id)
      .delete()
      .then(result => {
        db.collection("issues")
          .doc(id)
          .delete()
          .then(result => {
            resolve(result);
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const getProjects = () => {
  return new Promise(function(resolve, reject) {
    const projectList = [];

    db.collection("projects")
      .get()
      .then(snap => {
        snap.forEach(doc => {
          const project = doc.data();
          project.id = doc.id;

          projectList.push(project);
        });

        projectList.sort((a, b) => a.name.localeCompare(b.name));

        resolve(projectList);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const getOwnerProjects = id => {
  return new Promise(function(resolve, reject) {
    const projectList = [];

    db.collection("projects")
      .where("owner.id", "==", id)
      .get()
      .then(snap => {
        snap.forEach(doc => {
          const project = doc.data();
          project.id = doc.id;

          projectList.push(project);
        });

        projectList.sort((a, b) => a.name.localeCompare(b.name));

        resolve(projectList);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const getReporterProjects = id => {
  return new Promise(function(resolve, reject) {
    const projectList = [];

    db.collection("projects")

      .get()
      .then(snap => {
        snap.forEach(doc => {
          const project = doc.data();
          project.id = doc.id;

          projectList.push(project);
        });

        projectList.sort((a, b) => a.name.localeCompare(b.name));

        resolve(
          projectList.filter(project =>
            project.members.some(member => member.id === id)
          )
        );
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const getProjectById = id => {
  return new Promise(function(resolve, reject) {
    db.collection("projects")
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          const project = doc.data();
          project.id = id;

          resolve(project);
        } else {
          resolve(null);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const getIssues = project_id => {
  return new Promise(function(resolve, reject) {
    const issueList = [];

    db.collection("issues")
      .doc(project_id)
      .get()
      .then(doc => {
        if (doc.exists) {
          Object.entries(doc.data()).forEach(([key, value]) => {
            issueList.push(value);
          });
        }

        resolve(issueList);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const getIssueById = (project_id, id) => {
  return new Promise(function(resolve, reject) {
    getIssues(project_id)
      .then(issueList => {
        const issue = issueList.find(issue => issue.id === id);

        if (issue) {
          resolve(issue);
        } else {
          resolve(null);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const createNewIssue = (project_id, owner, title, description) => {
  return new Promise(function(resolve, reject) {
    getIssues(project_id).then(issueList => {
      const count = `${issueList.length + 1}`;
      db.collection("issues")
        .doc(project_id)
        .set(
          {
            [count]: {
              id: count,
              project: project_id,
              owner,
              title,
              description,
              open: true
            }
          },
          { merge: true }
        )
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  });
};
