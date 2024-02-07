import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import _get from "lodash/get";
import { toast } from "react-toastify";
import styles from "./updateBudget.module.css";

import { updateCampaign } from "@/utils/firebase";

const UpdateBudget = ({
  isBudgetModalOpen,
  hideBudgetModal,
  selectedCampaign,
}) => {
  console.log({ selectedCampaign });
  const [budget, setBudget] = useState(selectedCampaign?.budget ?? "");

  useEffect(() => {
    setBudget(_get(selectedCampaign, "budget"));
  }, [selectedCampaign]);

  const onUpdatePress = async () => {
    try {
      await updateCampaign(selectedCampaign, { budget });
      toast("Budget updated successfully.");
      hideBudgetModal();
    } catch {
      toast("Error updating budget. Try again later");
    }
  };
  console.log({ budget });
  return (
    <Modal
      title="Update Budget"
      open={isBudgetModalOpen}
      footer={null}
      onCancel={hideBudgetModal}
      closeIcon={false}
      classNames={{
        body: styles.body,
        wrapper: styles.wrapper,
      }}
    >
      <input
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        className={styles.inputFieldStyle}
        placeholder="budget..."
      />

      <Button
        type="primary"
        onClick={onUpdatePress}
        style={{ width: "fit-content", margin: "16px auto" }}
      >
        Update
      </Button>
    </Modal>
  );
};

export default UpdateBudget;
