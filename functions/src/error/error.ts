import * as functions from "firebase-functions";

const UnauthenticatedError = new functions.https.HttpsError(
  "unauthenticated",
  "You are not authenticated to perform this action"
);

export {UnauthenticatedError};
