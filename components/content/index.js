import { Dropdown } from "antd";
import _map from "lodash/map";
import _identity from "lodash/identity";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import _values from "lodash/values";
import _sortBy from "lodash/sortBy";
import { BsThreeDots } from "react-icons/bs";
import { query, onValue, ref, equalTo, orderByChild } from "firebase/database";

import styles from "./content.module.css";
import AuthContext from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { database } from "@/firebase";
import {
  CAMPAIGN_STATUS,
  COUNTRIES_VS_BIDS,
  CREATIVE_LABELS,
} from "@/constants/common";
import { updateCampaign } from "@/utils/firebase";
import { toast } from "react-toastify";

// const dataSource = [
//   {
//     key: "1",
//     name: "Mike",
//     age: 32,
//     address: "10 Downing Street",
//   },
//   {
//     key: "2",
//     name: "John",
//     age: 42,
//     address: "10 Downing Street",
//   },
//   {
//     key: "2",
//     name: "John",
//     age: 42,
//     address: "10 Downing Street",
//   },
//   {
//     key: "2",
//     name: "John",
//     age: 42,
//     address: "10 Downing Street",
//   },
// ];

const ACCESSORS = {
  ID: "id",
  NAME: "campaignName",
  STATUS: "status",
  ADFORMAT: "adFormat",
  CREATIVE_TYPE: "creativeType",
  COUNTRY: "country",
  IMPRESSIONS: "impressions",
  CLICKS: "clicks",
  CONVERSIONS: "conversions",
  CTR: "ctr",
  CPA: "cpa",
  COST: "cost",
  TRAFFIC_SOURCE: "trafficSource",
  BUDGET: "budget",
  TARGETCPA: "targetCPA",
};

const random4Digit = Math.floor(1000 + Math.random() * 9000);
const random3Digit = Math.floor(100 + Math.random() * 900);
const columns = [
  {
    title: "Id",
    dataIndex: ACCESSORS.ID,
    key: ACCESSORS.ID,
    width: 80,
    formatter: (data, columnValue) => columnValue,
  },
  {
    title: "Name",
    dataIndex: ACCESSORS.NAME,
    key: ACCESSORS.NAME,
    width: 200,
    formatter: (data, columnValue) => columnValue,
  },
  {
    title: "Status",
    dataIndex: ACCESSORS.STATUS,
    key: ACCESSORS.STATUS,
    width: 120,
    formatter: (data, columnValue) => columnValue,
  },
  {
    title: "Ad Format",
    dataIndex: ACCESSORS.ADFORMAT,
    key: ACCESSORS.ADFORMAT,
    width: 100,
    formatter: (data, columnValue) => columnValue,
  },
  {
    title: "Target CPA",
    dataIndex: ACCESSORS.TARGETCPA,
    key: ACCESSORS.TARGETCPA,
    width: 100,
    formatter: (data, columnValue) => columnValue,
  },

  {
    title: "Type",
    dataIndex: ACCESSORS.CREATIVE_TYPE,
    key: ACCESSORS.CREATIVE_TYPE,
    width: 100,
    formatter: (data, columnValue) => CREATIVE_LABELS[columnValue],
  },
  {
    title: "Traffic Source",
    dataIndex: ACCESSORS.TRAFFIC_SOURCE,
    key: ACCESSORS.TRAFFIC_SOURCE,
    width: 100,
    formatter: (data, columnValue) => columnValue,
  },
  {
    title: "Budget",
    dataIndex: ACCESSORS.BUDGET,
    key: ACCESSORS.BUDGET,
    width: 100,
    formatter: (data, columnValue) => `$${columnValue || 0}`,
  },
  {
    title: "Bid",
    dataIndex: ACCESSORS.COUNTRY,
    key: ACCESSORS.COUNTRY,
    width: 100,
    formatter: (data, columnValue) => `$${COUNTRIES_VS_BIDS[columnValue]}`,
  },
  {
    title: "Impr.",
    dataIndex: ACCESSORS.IMPRESSIONS,
    key: ACCESSORS.IMPRESSIONS,
    width: 100,
    formatter: (data, columnValue) => {
      const conversions = _get(data, ACCESSORS.CONVERSIONS);
      return conversions * random4Digit;
    },
  },
  {
    title: "Clicks",
    dataIndex: ACCESSORS.CLICKS,
    key: ACCESSORS.CLICKS,
    width: 100,
    formatter: (data, columnValue) => {
      const conversions = _get(data, ACCESSORS.CONVERSIONS);
      return conversions * random3Digit;
    },
  },
  {
    title: "Conv.",
    dataIndex: ACCESSORS.CONVERSIONS,
    key: ACCESSORS.CONVERSIONS,
    width: 100,
    formatter: (data, columnValue) => columnValue,
  },
  {
    title: "CTR",
    dataIndex: ACCESSORS.CTR,
    key: ACCESSORS.CTR,
    width: 100,
    formatter: (data, columnValue) => {
      const clicks = _get(data, ACCESSORS.CONVERSIONS) * random3Digit;
      const impressions = _get(data, ACCESSORS.CONVERSIONS) * random4Digit;
      if (impressions)
        return `${Math.round((clicks / impressions) * 100, 2)} %`;
      return "0%";
    },
  },
  {
    title: "CPA",
    dataIndex: ACCESSORS.CPA,
    key: ACCESSORS.CPA,
    width: 100,
    formatter: (data, columnValue) => {
      return `$${COUNTRIES_VS_BIDS[_get(data, ACCESSORS.COUNTRY)]}`;
    },
  },
  {
    title: "Cost",
    dataIndex: ACCESSORS.COST,
    key: ACCESSORS.COST,
    width: 100,
    formatter: (data, columnValue) => {
      const conversions = _get(data, ACCESSORS.CONVERSIONS);
      const bid = COUNTRIES_VS_BIDS[_get(data, ACCESSORS.COUNTRY)];
      return `$${conversions * bid}`;
    },
  },
];

const getDropDownOptions = (data) => {
  if (_get(data, ACCESSORS.STATUS) === CAMPAIGN_STATUS.ACTIVE) {
    return [
      {
        label: "Mark as Inactive",
        key: CAMPAIGN_STATUS.INACTIVE,
      },
    ];
  }
  return [
    {
      label: "Mark as Active",
      key: CAMPAIGN_STATUS.ACTIVE,
    },
  ];
};

const Content = () => {
  const [campaigns, setCampaigns] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    let unsubscribe = () => {};
    if (!_isEmpty(user)) {
      const campaignsRef = query(ref(database, "campaigns"));
      unsubscribe = onValue(campaignsRef, (snapshot) => {
        const campaignsResponse = snapshot.val();
        setCampaigns(_sortBy(_values(campaignsResponse), "createdAt"));
      });
    }
    return unsubscribe;
  }, [user]);

  const getMenuProps = (data) => {
    return {
      items: getDropDownOptions(data),
      onClick: async ({ key }) => {
        const { status, msg } = await updateCampaign(data, {
          status: key,
        });
        toast(msg);
      },
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        {_isEmpty(user) ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <p style={{ color: "white" }}>
              Please login to access the campaigns
            </p>
          </div>
        ) : (
          <>
            <h4 className={styles.tableContentStyle}>List of campaigns</h4>
            <table
              style={{ overflow: "scroll" }}
              border="0"
              cellSpacing="0"
              cellPadding="0"
            >
              <thead>
                <tr className={styles.tableRowStyle}>
                  {_map(columns, ({ title, width }, index) => (
                    <th
                      key={title + index}
                      style={{ minWidth: width }}
                      className={`${styles.tableContentStyle} ${styles.tableHeadingStyle}`}
                    >
                      {title}
                    </th>
                  ))}
                  <th
                    className={`${styles.tableContentStyle} ${styles.tableHeadingStyle} ${styles.stickyCol} ${styles.stickHeading}`}
                  >
                    Options
                  </th>
                </tr>
              </thead>
              <tbody>
                {_map(campaigns, (data, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`${styles.tableRowStyle} ${
                      rowIndex % 2 === 0 ? styles.tableAlterRowColor : ""
                    }`}
                  >
                    {_map(
                      columns,
                      ({ width, dataIndex, formatter }, columnDatIndex) => (
                        <td
                          key={dataIndex + columnDatIndex}
                          style={{ minWidth: width }}
                          className={`${styles.tableContentStyle} ${styles.tableDataStyle}`}
                        >
                          {formatter(data, data[dataIndex])}
                        </td>
                      )
                    )}
                    <td
                      className={`${styles.tableContentStyle} ${
                        styles.tableDataStyle
                      } ${styles.stickyCol} ${styles.optionsIcon} ${
                        rowIndex % 2 === 0
                          ? styles.tableAlterRowColor
                          : styles.tableRowColor
                      }`}
                    >
                      <Dropdown trigger={["click"]} menu={getMenuProps(data)}>
                        <BsThreeDots />
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default Content;
