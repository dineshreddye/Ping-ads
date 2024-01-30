import React, { useContext, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Tooltip } from "antd";
import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import { get, ref } from "firebase/database";

import styles from "./navbar.module.css";
import Login from "../login";
import CreateCampaign from "../createCampaign";
import AuthContext from "@/contexts/AuthContext";
import { IMAGES } from "@/assets/images";
import Image from "next/image";
import { database } from "@/firebase";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState("");
  const { user, signOutUser } = useContext(AuthContext);

  useEffect(() => {
    if (!_isEmpty(user)) {
      const lastupdatedRef = ref(database, `config/lastUpdatedAt`);
      get(lastupdatedRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log({ snapshotValue: snapshot.val() });
            setLastUpdatedAt(snapshot.val());
          } else {
            setLastUpdatedAt("");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user]);

  const onLoginClick = () => setShowLoginModal(true);
  const hideLoginModal = () => setShowLoginModal(false);

  const onNewCampaignClick = () => setShowCreateCampaignModal(true);
  const hideCampaignModal = () => setShowCreateCampaignModal(false);

  return (
    <nav className={styles.container}>
      <Image
        src={IMAGES.LOGO}
        alt="logo"
        style={{ height: "auto", width: 120 }}
      />

      <div className={styles.userInfoContainer}>
        <div style={{ flex: 1, justifyContent: "center", display: "flex" }}>
          {_isEmpty(user) || !lastUpdatedAt ? null : (
            <p style={{ color: "white", fontSize: "0.7rem" }}>
              Last updated at: {lastUpdatedAt}
            </p>
          )}
        </div>
        {_isEmpty(user) ? null : (
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={onNewCampaignClick}
          >
            New Campaign
          </Button>
        )}
        {_isEmpty(user) ? (
          <Button type="primary" onClick={onLoginClick}>
            Login
          </Button>
        ) : (
          <div className={styles.loggedInUser}>
            <p>Hello, {_get(user, "email")}</p>
            <Button type="link" onClick={signOutUser}>
              Sign out
            </Button>
          </div>
        )}
      </div>
      <Login
        isLoginModalOpen={showLoginModal}
        hideLoginModal={hideLoginModal}
      />
      <CreateCampaign
        isCampaignModalOpen={showCreateCampaignModal}
        hideCampaignModal={hideCampaignModal}
      />
    </nav>
  );
};

export default Navbar;
