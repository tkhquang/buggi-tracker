import { auth, functions } from "../services/firebase";

export function signup(username, role) {
  return new Promise(function(resolve, reject) {
    const addMessage = functions().httpsCallable("createNewUser");

    const data = {
      username,
      role
    };

    addMessage(data)
      .then(function(result) {
        resolve(result);
      })
      .catch(function(error) {
        reject(error);
      });
  });
}

export function signin(username, password) {
  // Firebase doesn't support signin with username & password
  // Bypass this by using `dummy email` without email validating
  return auth().signInWithEmailAndPassword(
    `${username}@tkhquang.dev`,
    password
  );
}

export function signout() {
  auth().signOut();
}

export function updateUser(uid, username, role) {
  return new Promise(function(resolve, reject) {
    const addMessage = functions().httpsCallable("updateUser");

    const data = {
      uid,
      username,
      role
    };

    addMessage(data)
      .then(function(result) {
        resolve(result);
      })
      .catch(function(error) {
        reject(error);
      });
  });
}

export function deleteUser(uid) {
  return new Promise(function(resolve, reject) {
    const addMessage = functions().httpsCallable("deleteUser");

    const data = {
      uid
    };

    addMessage(data)
      .then(function(result) {
        resolve(result);
      })
      .catch(function(error) {
        reject(error);
      });
  });
}
