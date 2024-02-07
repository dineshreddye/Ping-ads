import _get from "lodash/get";
import { APPROVAL_STATUS, CAMPAIGN_STATUS, STATUS } from "@/constants/common";
import { database } from "@/firebase";
import { ref, refFromURL, set } from "firebase/database";
import moment from "moment";

export const saveCampaignDetails = async ({
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
}) => {
  try {
    const id = Math.floor(100000000 + Math.random() * 900000000);
    console.log({
      payload: {
        bidModal,
        campaignName,
        targetUrl,
        creativeType,
        title,
        description,
        country,
        id,
        trafficSource,
        targetCPA,
        budget,
        conversions: 0,
        status: CAMPAIGN_STATUS.INACTIVE,
        approvalStatus: APPROVAL_STATUS.INPROGRESS,
        createdAt: moment().valueOf(),
        formattedDate: moment(moment().valueOf()).format("DD/MM/YYYY"),
      },
    });
    await set(ref(database, `campaigns/${id}`), {
      bidModal,
      campaignName,
      targetUrl,
      creativeType,
      title,
      description,
      country,
      id,
      trafficSource,
      targetCPA,
      budget,
      conversions: 0,
      status: CAMPAIGN_STATUS.INACTIVE,
      approvalStatus: APPROVAL_STATUS.INPROGRESS,
      createdAt: moment().valueOf(),
      formattedDate: moment(moment().valueOf()).format("DD/MM/YYYY"),
    });
    return {
      status: STATUS.SUCCESS,
      msg: "Campaign saved successfully.",
    };
  } catch (error) {
    console.log({ error });
    return {
      status: STATUS.FAILED,
      msg: "Error saving campaign. please try again later.",
    };
  }
};

export const updateCampaign = async (data, updatedDetails) => {
  const campaignId = _get(data, "id");
  const updatedCampaignDetails = { ...data, ...updatedDetails };
  try {
    await set(ref(database, `campaigns/${campaignId}`), updatedCampaignDetails);
    return {
      status: STATUS.SUCCESS,
      msg: "Campaign updated successfully.",
    };
  } catch (error) {
    console.log({ error });
    return {
      status: STATUS.FAILED,
      msg: "Campaign updated failed. Plese try again later.",
    };
  }
};

export const createConfigLastUpdatedDate = async () => {
  try {
    await set(ref(database, `config/lastUpdatedAt`), "30/01/2023");
    return {
      status: STATUS.SUCCESS,
      msg: "Campaign updated successfully.",
    };
  } catch (error) {
    console.log({ error });
    return {
      status: STATUS.FAILED,
      msg: "Campaign updated failed. Plese try again later.",
    };
  }
};

export const createConfigRandomDigits = async ({ fourDigit, threeDigit }) => {
  try {
    await set(ref(database, `config/randomValues`), {
      dateUpdated: moment().valueOf(),
      fourDigit,
      threeDigit,
    });
    return {
      status: STATUS.SUCCESS,
      msg: "Campaign updated successfully.",
    };
  } catch (error) {
    console.log({ error });
    return {
      status: STATUS.FAILED,
      msg: "Campaign updated failed. Plese try again later.",
    };
  }
};
