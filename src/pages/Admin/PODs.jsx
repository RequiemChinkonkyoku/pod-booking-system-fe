import axios from "../../utils/axiosConfig";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/material-dashboard.min.css";

import Navbar from "../../components/Admin/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Admin/Sidebar";

export const Pods = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [pods, setPods] = React.useState([]);
  React.useEffect(() => {
    axios.get("/Pods").then((response) => {
      setPods(response.data);
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
                        <h4 className="card-title">Pods</h4>
                      </div>
                      <div className="card-body table-full-width table-hover">
                        <div className="table-responsive">
                          <table className="table">
                            {/* Table Head */}
                            <thead>
                              <tr>
                                <th className="text-center">#</th>
                                <th>Name</th>
                                <th>Desc</th>
                                <th>Status</th>
                                <th>PodTypeId</th>
                                <th>AreaId</th>
                                <th className="text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pods.map((pod) => (
                                <tr>
                                  <td className="text-center">{pod.id}</td>
                                  <td>{pod.name}</td>
                                  <td>{pod.description}</td>
                                  <td>{pod.status}</td>
                                  <td>{pod.podTypeId}</td>
                                  <td>{pod.areaId}</td>
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
                <div class="row">
                  <div class="col-md-12">
                    <div class="card ">
                      <div class="card-header card-header-rose card-header-text">
                        <div class="card-text">
                          <h4 class="card-title">CREATE NEW POD</h4>
                        </div>
                      </div>
                      <div class="card-body ">
                        <form method="get" action="/" class="form-horizontal">
                          <div class="row">
                            <label class="col-sm-2 col-form-label">Name</label>
                            <div class="col-sm-10">
                              <div class="form-group bmd-form-group">
                                <input type="text" class="form-control" />
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <label class="col-sm-2 col-form-label">
                              Description
                            </label>
                            <div class="col-sm-10">
                              <div class="form-group bmd-form-group">
                                <input type="text" class="form-control" />
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <label class="col-sm-2 col-form-label">Name</label>
                            <div class="col-sm-10">
                              <div class="form-group bmd-form-group">
                                <input type="text" class="form-control" />
                              </div>
                            </div>
                          </div>
                        </form>
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
