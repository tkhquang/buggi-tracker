const cors = require("cors")({ origin: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.createNewUser = functions.https.onCall(async (data, context) => {
  if (!context.auth.token.role === "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Request failed: forbidden (403)."
    );
  }

  try {
    const { username, role } = data;

    const { uid } = await admin.auth().createUser({
      email: `${username.toLowerCase()}@tkhquang.dev`,
      password: "passa1"
    });

    await admin.auth().setCustomUserClaims(uid, { role });

    await db
      .collection("users")
      .doc(uid)
      .set({
        email: `${username}@tkhquang.dev`,
        role
      });

    return "Done Successfully";

    return;
  } catch (error) {
    throw new functions.https.HttpsError("unknown", error.message, error);
  }
});

exports.updateUser = functions.https.onCall(async (data, context) => {
  if (!context.auth.token.role === "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Request failed: forbidden (403)."
    );
  }

  try {
    const { uid, username, role } = data;

    await admin.auth().updateUser(uid, {
      email: `${username.toLowerCase()}@tkhquang.dev`
    });

    await admin.auth().setCustomUserClaims(uid, {
      role
    });

    db.collection("users")
      .doc(uid)
      .update({
        email: `${username}@tkhquang.dev`,
        role
      });

    return "Done Successfully";
  } catch (error) {
    throw new functions.https.HttpsError("unknown", error.message, error);
  }
});

exports.deleteUser = functions.https.onCall(async (data, context) => {
  if (!context.auth.token.role === "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Request failed: forbidden (403)."
    );
  }

  try {
    await admin.auth().deleteUser(data.uid);

    db.collection("users")
      .doc(data.uid)
      .delete();

    return "Done Successfully";
  } catch (error) {
    throw new functions.https.HttpsError("unknown", error.message, error);
  }
});
