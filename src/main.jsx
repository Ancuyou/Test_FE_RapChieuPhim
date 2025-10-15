import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext"; // Import
import './index.css'
import { ToastProvider } from './components/common/Toast';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <ToastProvider>
    <AuthProvider>
      {" "}
      {/* Bọc App */}
      <App />
    </AuthProvider>
      </ToastProvider>
  </React.StrictMode>
);

