import React, { useContext, useState } from "react";
import { Input, Modal, Button } from "antd";
import styles from "./login.module.css";
import AuthContext from "@/contexts/AuthContext";
import { STATUS } from "@/constants/common";
import { validEmailAndPasswordForSignin } from "@/utils/common";

const Login = ({ isLoginModalOpen, hideLoginModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { loginUser } = useContext(AuthContext);

  const onLoginPress = async () => {
    setError("");
    const { status, msg } = validEmailAndPasswordForSignin(email, password);
    console.log({ status, msg });
    if (status === STATUS.FAILED) {
      setError(`* ${msg}`);
      return;
    }
    const { status: loginStatus, msg: loginMsg } = await loginUser(
      email,
      password
    );
    if (loginStatus === STATUS.FAILED) {
      setError(`* ${loginMsg}`);
      return;
    }
    hideLoginModal();
  };
  return (
    <Modal
      title="Login"
      open={isLoginModalOpen}
      footer={null}
      onCancel={hideLoginModal}
      closeIcon={false}
      classNames={{
        body: styles.body,
        wrapper: styles.wrapper,
      }}
    >
      <p style={{ color: "red" }}>{error}</p>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.inputFieldStyle}
        placeholder="Enter your email..."
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.inputFieldStyle}
        placeholder="Enter your password..."
        type="password"
      />

      <Button
        type="primary"
        onClick={onLoginPress}
        style={{ width: "fit-content", margin: "16px auto" }}
      >
        Login
      </Button>
    </Modal>
  );
};

export default Login;
