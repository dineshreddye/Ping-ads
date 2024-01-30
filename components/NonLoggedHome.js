import { IMAGES } from "@/assets/images";
import AuthContext from "@/contexts/AuthContext";
import { Button } from "antd";
import Image from "next/image";
import { useContext, useState } from "react";
import Login from "./login";

const NonLoggedHome = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useContext(AuthContext);
  const onLoginClick = () => setShowLoginModal(true);
  const hideLoginModal = () => setShowLoginModal(false);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        src={IMAGES.LOGO}
        alt="logo"
        style={{ height: "auto", width: 300 }}
      />
      <div
        style={{
          marginTop: 64,
          display: "flex",
          alignItems: "center",
          columnGap: 100,
        }}
      >
        <Button
          type="primary"
          onClick={onLoginClick}
          style={{
            width: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Login
        </Button>
        <Button
          type="primary"
          onClick={() => (location.href = "mailto:contact@thepingads.com")}
          style={{
            width: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Contact Us
        </Button>
      </div>

      <Login
        isLoginModalOpen={showLoginModal}
        hideLoginModal={hideLoginModal}
      />
    </div>
  );
};

export default NonLoggedHome;
