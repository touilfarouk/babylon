
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import App from "./App";
import AdminLayout from "layouts/Admin.js";
import { SocketProvider } from 'views/SocketProvider';
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <HashRouter>
   <SocketProvider>  <App/></SocketProvider>
  </HashRouter>
);
