import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
export default function MainTemplate() {
  return (
    <div>
      <div>
        <Header />
        <Outlet></Outlet>
        <Footer />
      </div>
    </div>
  );
}
