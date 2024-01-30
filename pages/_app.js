import React from "react";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthProvider from "@/providers/AuthProvider";

const App = ({ Component, pageProps }) => (
  <AuthProvider>
    <ConfigProvider
      theme={{
        components: {
          token: {
            colorText: "#fff",
            colorTextBase: "#fff",
          },
          Modal: {
            contentBg: "#1B1B1F",
            headerBg: "#1B1B1F",
            titleColor: "white",
          },
          Radio: {
            buttonColor: "#ffffff",
            buttonSolidCheckedColor: "#fff",
          },
          Input: {
            /* here is your component tokens */
            activeBg: "#2B2C35",
          },
        },
      }}
    >
      <Component {...pageProps} />
    </ConfigProvider>
    <ToastContainer />
  </AuthProvider>
);

export default App;
