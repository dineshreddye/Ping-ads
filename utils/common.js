import { STATUS } from "@/constants/common";
import _size from "lodash/size";
import _isEmpty from "lodash/isEmpty";

export const validEmailAndPasswordForSignin = (email, password) => {
  const reg = /^\S+@\S+\.\S+$/;
  console.log({ value: reg.test(email), email });
  if (!reg.test(email)) {
    return {
      status: STATUS.FAILED,
      msg: "Please enter a valid email.",
    };
  }
  if (_size(password) < 3) {
    return {
      status: STATUS.FAILED,
      msg: "Please enter a valid password.",
    };
  }
  return {
    status: STATUS.SUCCESS,
  };
};

export const validateCampaignDetails = ({
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
  if (_isEmpty(bidModal)) {
    return {
      status: STATUS.FAILED,
      msg: "Please select a bid modal.",
    };
  }
  if (_isEmpty(trafficSource)) {
    return {
      status: STATUS.FAILED,
      msg: "Please select a traffic source.",
    };
  }
  if (_isEmpty(campaignName) || _size(campaignName) < 3) {
    return {
      status: STATUS.FAILED,
      msg: "Please enter valid campaign name. Campaign name be atleast 3 characters long.",
    };
  }
  if (_isEmpty(targetUrl)) {
    return {
      status: STATUS.FAILED,
      msg: "Please enter a vvalid target URL.",
    };
  }
  if (_isEmpty(targetCPA)) {
    return {
      status: STATUS.FAILED,
      msg: "Please enter target CPA.",
    };
  }
  if (_isEmpty(budget)) {
    return {
      status: STATUS.FAILED,
      msg: "Please enter your budget.",
    };
  }
  if (_isEmpty(creativeType)) {
    return {
      status: STATUS.FAILED,
      msg: "Please select a creative type.",
    };
  }
  if (_isEmpty(title)) {
    return {
      status: STATUS.FAILED,
      msg: "Please enter a valid title.",
    };
  }
  if (_isEmpty(description)) {
    return {
      status: STATUS.FAILED,
      msg: "Please enter a valid description.",
    };
  }
  if (_isEmpty(country)) {
    return {
      status: STATUS.FAILED,
      msg: "Please select a country.",
    };
  }

  return {
    status: STATUS.SUCCESS,
  };
};
