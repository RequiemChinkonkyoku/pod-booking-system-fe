import axios from "../../utils/axiosConfig";
import React, { useState, useEffect } from "react";
// import "../../assets/css/material-dashboard.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Customer/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Customer/Sidebar";
import { parse, format } from "date-fns";
import "../../css/CustomerBookingsList.css";

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [podTypes, setPodTypes] = useState([]);
  const [selectedPodType, setSelectedPodType] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const response = await axios.get("/Booking/customer");
        // Sort in descending order by bookingId
        const sortedBookings = response.data.sort((a, b) => b.bookingId - a.bookingId);
        setBookings(sortedBookings);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserBookings();
  }, []);

  useEffect(() => {
    const fetchPodTypes = async () => {
      try {
        const response = await axios.get("/PodType");
        setPodTypes(response.data);
      } catch (error) {
        console.error("Error fetching pod types:", error);
      }
    };
    fetchPodTypes();
  }, []);

  const handleSubmit = (bookingId) => {
    navigate("/customer/BookingDetails", { state: { bookingId } });
  };

  // Filter bookings based on status, pod type, and search query
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = 
      selectedStatus === "all" || booking.statusId === parseInt(selectedStatus);
    
    const matchesPodType = 
      selectedPodType === "all" || booking.podTypeId === parseInt(selectedPodType);
    
    const statusName = booking.statusId === 1
      ? "cancelled"
      : booking.statusId === 2
      ? "pending"
      : booking.statusId === 3
      ? "reserved"
      : booking.statusId === 4
      ? "on-going"
      : "completed";

    const matchesSearch = 
      statusName.includes(searchQuery.toLowerCase()) ||
      booking.podTypeName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPodType && matchesSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
              <div className="booking-card">
                <div className="card-header">
                  <div className="header-content">
                    <div className="title-section">
                      <i className="material-icons header-icon">date_range</i>
                      <h4 className="card-title">Your Bookings</h4>
                    </div>
                    <div className="filters-section">
                      <div className="search-box">
                        <i className="material-icons">search</i>
                        <input
                          type="text"
                          placeholder="Search bookings..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="search-input"
                        />
                      </div>
                      <div className="status-filter">
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="status-select"
                        >
                          <option value="all">All Statuses</option>
                          <option value="1">Cancelled</option>
                          <option value="2">Pending</option>
                          <option value="3">Reserved</option>
                          <option value="4">On-going</option>
                          <option value="5">Completed</option>
                        </select>
                      </div>
                      <div className="pod-type-filter">
                        <select
                          value={selectedPodType}
                          onChange={(e) => setSelectedPodType(e.target.value)}
                          className="status-select"
                        >
                          <option value="all">All Pod Types</option>
                          {podTypes.map(type => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="booking-table">
                      <thead>
                        <tr>
                          {/* <th>Booking ID</th> */}
                          <th>Date</th>
                          <th>Time</th>
                          <th>Pod Type</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((booking) => (
                          <tr key={booking.bookingId}>
                            {/* <td>#{booking.bookingId}</td> */}
                            <td>
                              {format(
                                new Date(booking.arrivalDate),
                                "do MMM, yyyy"
                              )}
                            </td>
                            <td>
                              {format(
                                parse(booking.startTime, "HH:mm:ss", new Date()),
                                "hh:mm a"
                              )}
                              {" - "}
                              {format(
                                parse(booking.endTime, "HH:mm:ss", new Date()),
                                "hh:mm a"
                              )}
                            </td>
                            <td>{booking.podTypeName}</td>
                            <td>
                              <span className={`status-badge status-${booking.statusId}`}>
                                {booking.statusId === 1
                                  ? "Cancelled"
                                  : booking.statusId === 2
                                  ? "Pending"
                                  : booking.statusId === 3
                                  ? "Reserved"
                                  : booking.statusId === 4
                                  ? "On-going"
                                  : "Completed"}
                              </span>
                            </td>
                            <td>
                              <button
                                className="view-button"
                                onClick={() => handleSubmit(booking.bookingId)}
                              >
                                <i className="material-icons">visibility</i>
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="pagination-section">
                    <div className="showing-entries">
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, filteredBookings.length)} of{" "}
                      {filteredBookings.length} entries
                    </div>
                    <div className="pagination">
                      <button
                        className="pagination-button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="material-icons">chevron_left</i>
                      </button>

                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              className={`pagination-number ${
                                currentPage === pageNumber ? "active" : ""
                              }`}
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span key={pageNumber} className="pagination-ellipsis">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}

                      <button
                        className="pagination-button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <i className="material-icons">chevron_right</i>
                      </button>
                    </div>
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

export default CustomerBookings;
