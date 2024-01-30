import dynamic from "next/dynamic";
import _isEmpty from "lodash/isEmpty";
import Image from "next/image";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import AuthContext from "@/contexts/AuthContext";
import { useContext } from "react";
import { IMAGES } from "@/assets/images";
import NonLoggedHome from "@/components/NonLoggedHome";

const Content = dynamic(() => import("@/components/content"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { user } = useContext(AuthContext);
  return (
    <main
      className={`flex min-h-screen flex-col bg-gray-800 ${inter.className}`}
      style={{ height: "100vh" }}
    >
      {_isEmpty(user) ? (
        <NonLoggedHome />
      ) : (
        <>
          <Navbar />
          <Content />
        </>
      )}
    </main>
  );
}
