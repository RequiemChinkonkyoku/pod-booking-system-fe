import axios from "../../utils/axiosConfig";
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
              <div class="container-fluid">
                <div class="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-icon card-header-rose">
                        <div className="card-icon">
                          <i className="material-icons">assignment</i>
                        </div>
                        <h4 className="card-title">Products</h4>
                      </div>
                      <div className="card-body table-full-width table-hover">
                        <div className="table-responsive">
                          <table className="table">
                            {/* Table Head */}
                            <thead>
                              <tr>
                                <th className="text-center">#</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Desc</th>
                                <th>Status</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>CategoryId</th>
                                <th className="text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {products.map((product) => (
                                <tr>
                                  <td className="text-center">{product.id}</td>
                                  <td>{product.name}</td>
                                  <td>{product.price}</td>
                                  <td>{product.description}</td>
                                  <td>{product.status}</td>
                                  <td>{product.quantity}</td>
                                  <td>{product.unit}</td>
                                  <td>{product.categoryId}</td>
                                  <td class="td-actions text-right">
                                    <button
                                      type="button"
                                      rel="tooltip"
                                      class="btn btn-success"
                                      data-original-title=""
                                      title=""
                                    >
                                      <i class="material-icons">edit</i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};
