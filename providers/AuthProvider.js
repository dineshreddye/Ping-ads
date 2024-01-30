import React, { useCallback, useEffect, useRef, useState } from "react";
import _get from "lodash/get";
import AuthContext from "../contexts/AuthContext";
import { database, firebaseAuth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { STATUS } from "../constants/common";
import { onValue, ref } from "firebase/database";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (loggedInUser) => {
      setUser(loggedInUser);
    });

    return unsubscribe;
  }, []);

  const loginUser = async (email, password) => {
    try {
      const user = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      // setUser(user)
      return {
        status: STATUS.SUCCESS,
      };
    } catch (error) {
      console.log({ error });
      if (_get(error, "code") === "auth/user-not-found") {
        return {
          status: STATUS.FAILED,
          msg: "No user found with email. Please signup.",
        };
      }
      return {
        status: STATUS.FAILED,
        msg: "Something went wrong. Please try again.",
      };
    }
  };

  // const signupUser = async (email, password) => {
  //   try {
  //     const auth = getAuth();
  //     const user = await createUserWithEmailAndPassword(
  //       firebaseAuth,
  //       email,
  //       password
  //     );
  //     console.log({ user });
  //     getUserFromuid(user);
  //     setUser(user);
  //     return user;
  //   } catch {
  //     return null;
  //   }
  // };

  // const getUserFromuid = (user) => {
  //   console.log({ user });
  //   const usersRef = ref(database, `users/${user.uid}`);
  //   onValue(usersRef, (snapshot) => {
  //     if (snapshot.exists()) {
  //       console.log({ uid: user.uid, usersRef });
  //       console.log(snapshot.val());
  //       setUser({ ...snapshot.val(), uid: user.uid });
  //     } else {
  //       setUser({});
  //     }
  //   });
  //   // database
  //   //   .object("/users/" + user.uid)
  //   //   .valueChanges()
  //   //   .get(value => {
  //   //     if (value != null) {
  //   //       setUser(value)
  //   //     }
  //   //   })
  // };

  const signOutUser = async () => {
    await firebaseSignOut(firebaseAuth);
  };

  const sendResetPasswordMail = async (email) => {
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      return {
        status: STATUS.SUCCESS,
        msg: "Email sent successfully to reset your password",
      };
    } catch (error) {
      console.log({ error });
      let msg = "Error sending email.";

      if (_get(error, "code") === "auth/user-not-found") {
        msg = "User does not exist. Please signup";
      }
      return {
        status: STATUS.FAILED,
        msg,
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginUser,
        // signupUser,
        signOutUser,
        sendResetPasswordMail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
