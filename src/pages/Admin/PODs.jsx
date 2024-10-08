import axios from "../../utils/axiosConfig";
import React, { useState, useEffect } from "react";
import "../../assets/css/material-dashboard.min.css";
// import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JS

import Navbar from "../../components/Admin/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Admin/Sidebar";

export const Pods = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [pods, setPods] = useState([]); // State to store the list of pods
  const [podTypes, setPodTypes] = useState([]); // State to store pod types for the dropdown
  const [areas, setAreas] = useState([]); // State to store areas for the dropdown
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPodType, setSelectedPodType] = useState(""); // State to track selected pod type
  const [selectedArea, setSelectedArea] = useState(""); // State to track selected area

  // Fetch data for pods, pod types, and areas when the component mounts
  useEffect(() => {
    axios.get("/Pods").then((response) => {
      setPods(response.data);
    });

    // Fetch PodTypes
    axios
      .get("/PodType")
      .then((response) => {
        setPodTypes(response.data); // Store the pod types data
      })
      .catch((error) => {
        console.error("Failed to fetch pod types:", error);
      });

    // Fetch Areas
    axios
      .get("/Areas")
      .then((response) => {
        setAreas(response.data); // Store the areas data
      })
      .catch((error) => {
        console.error("Failed to fetch areas:", error);
      });
  }, []);

  // Handle dropdown changes
  const handlePodTypeChange = (e) => {
    setSelectedPodType(e.target.value);
    console.log("Selected Pod Type:", e.target.value);
  };

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
    console.log("Selected Area:", e.target.value);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Use params to send the data as query parameters instead of the request body
      const response = await axios.post("/Pods", {
        name,
        description,
        podTypeId: selectedPodType,
        areaId: selectedArea,
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <>
      <Head />
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel ps-container ps-theme-default">
          <Navbar />
          <div className="content">
            <div className="container-fluid">
              <div className="row">
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
                              <tr key={pod.id}>
                                <td className="text-center">{pod.id}</td>
                                <td>{pod.name}</td>
                                <td>{pod.description}</td>
                                <td>{pod.status}</td>
                                <td>{pod.podTypeId}</td>
                                <td>{pod.areaId}</td>
                                <td className="td-actions text-right">
                                  <button
                                    type="button"
                                    rel="tooltip"
                                    className="btn btn-success"
                                    data-original-title=""
                                    title=""
                                  >
                                    <i className="material-icons">edit</i>
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
              {/* New Pod Creation Form */}
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header card-header-rose card-header-text">
                      <div className="card-text">
                        <h4 className="card-title">CREATE NEW POD</h4>
                      </div>
                    </div>
                    <form
                      role="form"
                      onSubmit={handleCreate}
                      className="form-horizontal"
                    >
                      <div className="card-body">
                        <div className="row">
                          <label className="col-sm-2 col-form-label">
                            Name
                          </label>
                          <div className="col-sm-10">
                            <div className="form-group bmd-form-group">
                              <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <label className="col-sm-2 col-form-label">
                            Description
                          </label>
                          <div className="col-sm-10">
                            <div className="form-group bmd-form-group">
                              <input
                                type="text"
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        {/* Dropdown for Pod Type */}
                        <div className="row">
                          <label className="col-sm-2 col-form-label">
                            Pod Type
                          </label>
                          <div className="col-sm-10">
                            <div className="form-group bmd-form-group">
                              <select
                                className="form-control"
                                value={selectedPodType}
                                onChange={handlePodTypeChange}
                              >
                                <option value="" disabled>
                                  Select Pod Type
                                </option>
                                {podTypes.map((type) => (
                                  <option key={type.id} value={type.id}>
                                    {type.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        {/* Dropdown for Area */}
                        <div className="row">
                          <label className="col-sm-2 col-form-label">
                            Area
                          </label>
                          <div className="col-sm-10">
                            <div className="form-group bmd-form-group">
                              <select
                                className="form-control"
                                value={selectedArea}
                                onChange={handleAreaChange}
                              >
                                <option value="" disabled>
                                  Select Area
                                </option>
                                {areas.map((area) => (
                                  <option key={area.id} value={area.id}>
                                    {area.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer">
                        <button type="submit" className="btn btn-fill btn-rose">
                          Submit
                          <div className="ripple-container"></div>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
