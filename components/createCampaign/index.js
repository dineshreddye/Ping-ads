import React, { useState } from "react";
import { Input, Modal, Button, Radio, Checkbox } from "antd";
import _map from "lodash/map";
import _keys from "lodash/keys";
import { SearchOutlined } from "@ant-design/icons";
import { GiAirplaneDeparture } from "react-icons/gi";

import styles from "./createCampaign.module.css";
import { validateCampaignDetails } from "@/utils/common";
import {
  BID_MODALS,
  BID_MODAL_VALUES,
  COUNTRIES,
  CREATIVE_TYPES,
  CREATIVE_VALUES,
  STATUS,
  TRAFFIC_SOURCES,
  TRAFFIC_SOURCES_VALUES,
} from "@/constants/common";
import { saveCampaignDetails } from "@/utils/firebase";
import { toast } from "react-toastify";

const CreateCampaign = ({ isCampaignModalOpen, hideCampaignModal }) => {
  const [bidModal, setBidModal] = useState(BID_MODAL_VALUES.SMART_CPC);
  const [trafficSource, setTrafficSource] = useState(
    TRAFFIC_SOURCES_VALUES.NATIVE
  );
  const [campaignName, setCampaignName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [targetCPA, setTargetCPA] = useState("");
  const [budget, setBudget] = useState("");
  const [creativeType, setCreativeType] = useState(
    CREATIVE_VALUES.AI_GENERATED
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState(null);
  const [finalAck, setFinalAck] = useState(false);
  const [error, setError] = useState("");

  const onCampaignSubmit = async () => {
    if (!finalAck) return;
    setError("");
    const { status, msg } = validateCampaignDetails({
      bidModal,
      campaignName,
      targetUrl,
      creativeType,
      title,
      description,
      country,
      trafficSource,
      targetCPA,
      budget,
    });
    console.log({ status, msg });
    if (status === STATUS.FAILED) {
      setError(`* ${msg}`);
      // toast(msg);
      return;
    }
    const { status: campaignStatus, msg: campaignMsg } =
      await saveCampaignDetails({
        bidModal,
        campaignName,
        targetUrl,
        creativeType,
        title,
        description,
        country,
        trafficSource,
        targetCPA,
        budget,
      });
    if (status === STATUS.FAILED) {
      setError(campaignMsg);
      return;
    }
    toast(campaignMsg);
    hideCampaignModal();
  };

  const onCampaignNameChange = (e) => {
    setCampaignName(e.target.value);
  };

  const onCampaignTargetChange = (e) => {
    setTargetUrl(e.target.value);
  };

  const onTargetCPAChange = (e) => {
    setTargetCPA(e.target.value);
  };

  const onBudgetChange = (e) => {
    setBudget(e.target.value);
  };

  const onTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const onDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const onBidSelect = (e) => {
    setBidModal(e.target.value);
  };

  const onTrafficSelect = (e) => {
    setTrafficSource(e.target.value);
  };

  const onCreativeSelect = (e) => {
    setCreativeType(e.target.value);
  };

  const onSelectCountry = (e) => {
    setCountry(e.target.value);
  };

  const onFinalAckToggle = (e) => {
    setFinalAck(e.target.checked);
  };

  console.log({ finalAck });

  return (
    <Modal
      title="Create Campaign"
      open={isCampaignModalOpen}
      footer={null}
      width={800}
      onCancel={hideCampaignModal}
      closeIcon={false}
      classNames={{
        body: styles.body,
        wrapper: styles.wrapper,
      }}
    >
      <p style={{ color: "red" }}>{error}</p>
      <div className={styles.itemContainer}>
        <h5 className={styles.itemHeading}>Bid Modal</h5>
        <Radio.Group onChange={onBidSelect} value={bidModal}>
          {_map(BID_MODALS, ({ label, value }) => (
            <Radio key={value} value={value}>
              <p style={{ color: "#fff", margin: 0 }}>{label}</p>
            </Radio>
          ))}
        </Radio.Group>
      </div>
      <div className={styles.itemContainer}>
        <h5 className={styles.itemHeading}>Traffic Sources</h5>
        <Radio.Group onChange={onTrafficSelect} value={trafficSource}>
          {_map(TRAFFIC_SOURCES, ({ label, value }) => (
            <Radio key={value} value={value}>
              <p style={{ color: "#fff", margin: 0 }}>{label}</p>
            </Radio>
          ))}
        </Radio.Group>
      </div>

      <div className={styles.itemContainer}>
        <h5 className={styles.itemHeading}>General</h5>
        <input
          className={styles.inputFieldStyle}
          value={campaignName}
          onChange={onCampaignNameChange}
          placeholder="Campaign Name*"
        />
        <input
          value={targetUrl}
          onChange={onCampaignTargetChange}
          className={styles.inputFieldStyle}
          placeholder="Target URL*"
        />
      </div>
      <div className={styles.itemContainer}>
        <h5 className={styles.itemHeading}>Bidding</h5>
        <input
          className={styles.inputFieldStyle}
          value={targetCPA}
          onChange={onTargetCPAChange}
          placeholder="Target CPA*"
        />
        <input
          value={budget}
          onChange={onBudgetChange}
          className={styles.inputFieldStyle}
          placeholder="Budget*"
        />
      </div>
      <div className={styles.itemContainer}>
        <h5 className={styles.itemHeading}>Creatives</h5>
        <Radio.Group
          onChange={onCreativeSelect}
          value={creativeType}
          style={{ marginBottom: 8 }}
        >
          {_map(CREATIVE_TYPES, ({ label, value }) => (
            <Radio key={value} value={value}>
              <p style={{ color: "#fff", margin: 0 }}>{label}</p>
            </Radio>
          ))}
        </Radio.Group>
        <input
          className={styles.inputFieldStyle}
          placeholder="Title*"
          value={title}
          onChange={onTitleChange}
        />
        <input
          className={styles.inputFieldStyle}
          placeholder="Description*"
          value={description}
          onChange={onDescriptionChange}
        />
        <select
          id="countrySelect"
          onChange={onSelectCountry}
          className={styles.inputFieldStyle}
          required
        >
          <option value="" style={{ color: "#757575" }}>
            --Country--
          </option>
          {_map(_keys(COUNTRIES), (country) => {
            return (
              <option key={country} value={country}>
                {country}
              </option>
            );
          })}
        </select>
      </div>

      <div className={styles.itemContainer}>
        <h5 className={styles.itemHeading}>Save Changes</h5>
        <Checkbox checked={finalAck} onChange={onFinalAckToggle}>
          <p style={{ color: "#fff", margin: 0, fontSize: "0.7rem" }}>
            I declare and guarantee that my campaign meets the quality
            guidelines{" "}
          </p>
        </Checkbox>
        ;
        <Button
          className={
            finalAck ? styles.startCampaign : styles.defaultStartCampaign
          }
          icon={<GiAirplaneDeparture />}
          onClick={onCampaignSubmit}
        >
          Start Campaign
        </Button>
      </div>
    </Modal>
  );
};

export default CreateCampaign;
