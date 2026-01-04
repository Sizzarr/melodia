import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout({ account, onConnect, isWrongNetwork, onSwitchNetwork }) {
  return (
    <>
      <Navbar account={account} onConnect={onConnect} isWrongNetwork={isWrongNetwork} onSwitchNetwork={onSwitchNetwork} />
      <div className="pt-16">
        <Outlet />
      </div>
    </>
  );
}
