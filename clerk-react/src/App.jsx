import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";

export default function App() {
  return (
    <>
      <header style={{ padding: "10px", backgroundColor: "#f8f9fa" }}>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ marginLeft: "10px", padding: "5px" }}>
              <UserButton />
            </div>
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>
              Hello, Admin
            </span>
          </div>
        </SignedIn>
      </header>

      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </>
  );
}
