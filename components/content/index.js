import { Dropdown } from "antd";
import _map from "lodash/map";
import _identity from "lodash/identity";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import _values from "lodash/values";
import _sortBy from "lodash/sortBy";
import { BsThreeDots } from "react-icons/bs";
import {
  query,
  onValue,
  ref,
  equalTo,
  orderByChild,
  get,
} from "firebase/database";

import styles from "./content.module.css";
import AuthContext from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { database } from "@/firebase";
import {
  CAMPAIGN_STATUS,
  COUNTRIES_VS_BIDS,
  CREATIVE_LABELS,
  DELETE_CAMPAIGN,
} from "@/constants/common";
import { updateCampaign } from "@/utils/firebase";
import { toast } from "react-toastify";
import { getUndeletedCampaigns, updateRandomDigits } from "@/utils/common";
import UpdateBudget from "../updateBudget";

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

const getColumns = (fourDigit, threeDigit, onBudgetClick) => [
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
    formatter: (data, columnValue) => (
      <p
        style={{
          border: "1px solid white",
          borderRadius: 4,
          padding: 4,
          margin: 4,
        }}
        onClick={() => onBudgetClick(data)}
      >{`$${columnValue || 0}`}</p>
    ),
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
      return conversions * fourDigit;
    },
  },
  {
    title: "Clicks",
    dataIndex: ACCESSORS.CLICKS,
    key: ACCESSORS.CLICKS,
    width: 100,
    formatter: (data, columnValue) => {
      const conversions = _get(data, ACCESSORS.CONVERSIONS);
      return conversions * threeDigit;
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
      const clicks = _get(data, ACCESSORS.CONVERSIONS) * threeDigit;
      const impressions = _get(data, ACCESSORS.CONVERSIONS) * fourDigit;
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
  const dropDownOptions = [{}];
  if (_get(data, ACCESSORS.STATUS) === CAMPAIGN_STATUS.ACTIVE) {
    return [
      {
        label: "Mark as Inactive",
        key: CAMPAIGN_STATUS.INACTIVE,
        keyToUpdate: "status",
      },
      {
        label: "Delete Campaign",
        key: DELETE_CAMPAIGN,
        keyToUpdate: "isDelete",
      },
    ];
  }
  return [
    {
      label: "Mark as Active",
      key: CAMPAIGN_STATUS.ACTIVE,
      keyToUpdate: "status",
    },
    {
      label: "Delete Campaign",
      key: DELETE_CAMPAIGN,
      keyToUpdate: "isDelete",
    },
  ];
};

const Content = () => {
  const [campaigns, setCampaigns] = useState([]);
  const { user } = useContext(AuthContext);
  const [randomDigitsUpdate, setRandomDigitsUpdate] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {};
    if (!_isEmpty(user)) {
      const campaignsRef = query(ref(database, "campaigns"));
      unsubscribe = onValue(campaignsRef, (snapshot) => {
        const campaignsResponse = snapshot.val();
        setCampaigns(
          getUndeletedCampaigns(
            _sortBy(_values(campaignsResponse), "createdAt")
          )
        );
      });

      const configRandomRef = query(ref(database, "config/randomValues"));
      get(configRandomRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const randomDigits = updateRandomDigits(snapshot.val());
            setRandomDigitsUpdate(randomDigits);
          } else {
            const randomDigits = updateRandomDigits(snapshot.val());
            setRandomDigitsUpdate(randomDigits);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    return unsubscribe;
  }, [user]);

  const getMenuProps = (data) => {
    return {
      items: getDropDownOptions(data),
      onClick: async ({ key }) => {
        let dataToUpdate = {};
        if (
          key === CAMPAIGN_STATUS.ACTIVE ||
          key === CAMPAIGN_STATUS.INACTIVE
        ) {
          dataToUpdate = { status: key };
        }
        if (key === DELETE_CAMPAIGN) {
          dataToUpdate = { isDeleted: true };
        }
        const { status, msg } = await updateCampaign(data, dataToUpdate);
        toast(msg);
      },
    };
  };

  console.log({ randomDigitsUpdate });

  const getCampaignsData = () => {
    if (_isEmpty(randomDigitsUpdate)) {
      return (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ color: "white", fontSize: "0.8rem" }}>Getting Data...</p>
        </div>
      );
    }

    const onBudgetChange = (data) => {
      setSelectedCampaign(data);
    };
    const hideBudgetModal = () => setSelectedCampaign(null);

    const columns = getColumns(
      _get(randomDigitsUpdate, "fourDigit"),
      _get(randomDigitsUpdate, "threeDigit"),
      onBudgetChange
    );
    return (
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
        <UpdateBudget
          selectedCampaign={selectedCampaign}
          isBudgetModalOpen={selectedCampaign}
          hideBudgetModal={hideBudgetModal}
        />
      </>
    );
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
          getCampaignsData()
        )}
      </div>
    </div>
  );
};

export default Content;
