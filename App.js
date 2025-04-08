import React from "react";
import Router from "./Router";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
