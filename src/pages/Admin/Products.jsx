import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/material-dashboard.min.css";

import Navbar from "../../components/Admin/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Admin/Sidebar";

export const Products = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [products, setProducts] = React.useState([]);
  React.useEffect(() => {
    axios.get("/Products").then((response) => {
      setProducts(response.data);
    });
  }, []);

  return (
    <>
      <Head />
      <body>
        <div class="wrapper">
          <Sidebar />
          <div class="main-panel ps-container ps-theme-default">
            <Navbar />
            <div class="content">
              <div class="container-fluid"></div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};
