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
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </>
  );
}
