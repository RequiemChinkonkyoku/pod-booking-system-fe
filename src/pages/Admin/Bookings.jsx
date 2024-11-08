import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import axios from "../../utils/axiosConfig";
import Navbar from "../../components/Admin/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Admin/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import {
  startOfWeek,
  addDays,
  format,
  isSameDay,
  startOfDay,
  endOfDay,
  isWithinInterval,
  subDays,
  startOfMonth,
  endOfMonth,
  isBefore,
  isAfter,
} from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import "../../css/AdminBookings.css";
import { useNavigate } from "react-router-dom";

const Bookings = () => {
  // State management
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [endDate, setEndDate] = useState(endOfDay(new Date()));
  const [bookings, setBookings] = useState([]);
  const [detailedBookings, setDetailedBookings] = useState({});
  const [timeSlots, setTimeSlots] = useState([]);
  const [podTypes, setPodTypes] = useState([]);
  const [selectedPodType, setSelectedPodType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState("schedule");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [showViewAllModal, setShowViewAllModal] = useState(false);
  const [selectedTimeSlotBookings, setSelectedTimeSlotBookings] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "arrivalDate",
    direction: "asc",
  });

  // Helper functions
  const getWeekDays = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const formatDate = (date) => {
    return format(date, "yyyy-MM-dd");
  };

  const handleDatePreset = (preset) => {
    const today = new Date();

    switch (preset) {
      case "today":
        setStartDate(startOfDay(today));
        setEndDate(endOfDay(today));
        break;
      case "yesterday":
        const yesterday = subDays(today, 1);
        setStartDate(startOfDay(yesterday));
        setEndDate(endOfDay(yesterday));
        break;
      case "thisWeek":
        setStartDate(startOfWeek(today, { weekStartsOn: 1 }));
        setEndDate(endOfDay(today));
        break;
      case "lastWeek":
        const lastWeekStart = startOfWeek(subDays(today, 7), {
          weekStartsOn: 1,
        });
        const lastWeekEnd = addDays(lastWeekStart, 6);
        setStartDate(startOfDay(lastWeekStart));
        setEndDate(endOfDay(lastWeekEnd));
        break;
      case "thisMonth":
        setStartDate(startOfMonth(today));
        setEndDate(endOfMonth(today));
        break;
      default:
        break;
    }
  };

  const sortBookings = (bookings) => {
    const sortedBookings = [...bookings];

    sortedBookings.sort((a, b) => {
      if (sortConfig.key === "arrivalDate") {
        const dateA = new Date(a.arrivalDate);
        const dateB = new Date(b.arrivalDate);

        if (dateA.getTime() === dateB.getTime()) {
          return a.startTime.localeCompare(b.startTime);
        }

        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (sortConfig.key === "startTime") {
        return sortConfig.direction === "asc"
          ? a.startTime.localeCompare(b.startTime)
          : b.startTime.localeCompare(a.startTime);
      }

      return 0;
    });

    return sortedBookings;
  };

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [schedulesResponse, podTypesResponse, bookingsResponse] =
          await Promise.all([
            axios.get("/Schedules"),
            axios.get("/PodType"),
            axios.get("/Booking"),
          ]);

        setTimeSlots(schedulesResponse.data);
        setPodTypes(podTypesResponse.data);

        // Store basic booking data
        const bookingsData = bookingsResponse.data;
        setBookings(bookingsData);

        // Fetch detailed information for each booking
        const detailedData = {};
        await Promise.all(
          bookingsData.map(async (booking) => {
            try {
              const response = await axios.get(`/Booking/${booking.bookingId}`);
              detailedData[booking.bookingId] = response.data;
            } catch (error) {
              console.error(
                `Error fetching details for booking ${booking.bookingId}:`,
                error
              );
              detailedData[booking.bookingId] = booking;
            }
          })
        );
        setDetailedBookings(detailedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up periodic refresh every 30 seconds
    const refreshInterval = setInterval(async () => {
      try {
        const bookingsResponse = await axios.get("/Booking");
        const bookingsData = bookingsResponse.data;
        setBookings(bookingsData);

        // Refresh detailed information
        const detailedData = {};
        await Promise.all(
          bookingsData.map(async (booking) => {
            try {
              const response = await axios.get(`/Booking/${booking.bookingId}`);
              detailedData[booking.bookingId] = response.data;
            } catch (error) {
              console.error(
                `Error fetching details for booking ${booking.bookingId}:`,
                error
              );
              detailedData[booking.bookingId] = booking;
            }
          })
        );
        setDetailedBookings(detailedData);
      } catch (error) {
        console.error("Error refreshing bookings:", error);
      }
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  // Filtering logic
  const filterBookings = () => {
    let filtered = bookings;

    if (viewMode === "schedule") {
      const weekDays = getWeekDays(selectedDate);
      const weekDatesStr = weekDays.map((day) => formatDate(day));
      filtered = filtered.filter((booking) =>
        weekDatesStr.includes(booking.arrivalDate)
      );
    } else {
      filtered = filtered.filter((booking) => {
        const bookingDate = startOfDay(new Date(booking.arrivalDate));
        return isWithinInterval(bookingDate, {
          start: startOfDay(startDate),
          end: endOfDay(endDate),
        });
      });
    }

    if (selectedPodType !== "all") {
      filtered = filtered.filter(
        (booking) => booking.podTypeId === parseInt(selectedPodType)
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((booking) => {
        const detailedStatus = detailedBookings[booking.bookingId]?.statusId;
        return detailedStatus === parseInt(selectedStatus);
      });
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (booking) =>
          booking.bookingId.toString().includes(searchQuery) ||
          booking.podTypeName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  // Get detailed booking status
  const getDetailedBookingStatus = (bookingId) => {
    const detailedBooking = detailedBookings[bookingId];
    const statusId =
      detailedBooking?.statusId ||
      bookings.find((b) => b.bookingId === bookingId)?.statusId;

    const statusMap = {
      1: { label: "Cancelled", color: "status-cancelled" },
      2: { label: "Pending", color: "status-pending" },
      3: { label: "Reserved", color: "status-confirmed" },
      4: { label: "On-going", color: "status-active" },
      5: { label: "Completed", color: "status-completed" },
    };
    return statusMap[statusId] || { label: "Unknown", color: "status-unknown" };
  };

  // Action handlers
  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.put(`/Booking/${bookingId}/cancel`);

      // Update the local detailed bookings state
      const updatedBooking = await axios.get(`/Booking/${bookingId}`);
      setDetailedBookings((prev) => ({
        ...prev,
        [bookingId]: updatedBooking.data,
      }));

      toast.success("Booking cancelled successfully");

      // Refresh all bookings
      const bookingsResponse = await axios.get("/Booking");
      setBookings(bookingsResponse.data);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

  const handleViewBooking = async (bookingId) => {
    try {
      const response = await axios.get(`/Booking/${bookingId}`);
      setDetailedBookings((prev) => ({
        ...prev,
        [bookingId]: response.data,
      }));
      navigate("/admin/details", { state: { bookingId: bookingId } });
    } catch (error) {
      console.error("Error fetching booking details:", error);
      navigate("/admin/details", { state: { bookingId: bookingId } });
    }
  };

  const handleViewAllBookings = (date, time, bookings) => {
    setSelectedTimeSlotBookings(bookings);
    setShowViewAllModal(true);
  };

  const handleWeekNavigation = (direction) => {
    const newDate = addDays(selectedDate, direction === "next" ? 7 : -7);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Components
  const DateRangeFilter = () => (
    <div className="date-range-section">
      <div className="date-presets">
        <button
          className="preset-btn"
          onClick={() => handleDatePreset("today")}
        >
          Today
        </button>
        <button
          className="preset-btn"
          onClick={() => handleDatePreset("yesterday")}
        >
          Yesterday
        </button>
        <button
          className="preset-btn"
          onClick={() => handleDatePreset("thisWeek")}
        >
          This Week
        </button>
        <button
          className="preset-btn"
          onClick={() => handleDatePreset("lastWeek")}
        >
          Last Week
        </button>
        <button
          className="preset-btn"
          onClick={() => handleDatePreset("thisMonth")}
        >
          This Month
        </button>
      </div>
      <div className="date-range-filters">
        <div className="filter-group">
          <label>Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              if (isAfter(date, endDate)) {
                setEndDate(date);
              }
            }}
            dateFormat="dd MMMM, yyyy"
            className="date-picker"
            maxDate={endDate}
          />
        </div>
        <div className="filter-group">
          <label>End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => {
              setEndDate(date);
              if (isBefore(date, startDate)) {
                setStartDate(date);
              }
            }}
            dateFormat="dd MMMM, yyyy"
            className="date-picker"
            minDate={startDate}
          />
        </div>
      </div>
    </div>
  );

  const ViewAllModal = ({ bookings, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>All Bookings for Time Slot</h3>
          <button className="modal-close" onClick={onClose}>
            <i className="material-icons">close</i>
          </button>
        </div>
        <div className="modal-body">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Pod Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.bookingId}>
                  <td>#{booking.bookingId}</td>
                  <td>{booking.podTypeName}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        getDetailedBookingStatus(booking.bookingId).color
                      }`}
                    >
                      {getDetailedBookingStatus(booking.bookingId).label}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => handleViewBooking(booking.bookingId)}
                    >
                      <i className="material-icons">visibility</i>
                      View
                    </button>
                    {getDetailedBookingStatus(booking.bookingId).label !==
                      "Cancelled" && (
                      <button
                        className="btn-cancel"
                        onClick={() => handleCancelBooking(booking.bookingId)}
                      >
                        <i className="material-icons">cancel</i>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Schedule View Component
  const renderScheduleView = () => {
    const weekDays = getWeekDays(selectedDate);
    const bookingsByDateAndTime = {};
    filteredBookings.forEach((booking) => {
      const date = booking.arrivalDate;
      const time = booking.startTime;
      if (!bookingsByDateAndTime[date]) {
        bookingsByDateAndTime[date] = {};
      }
      if (!bookingsByDateAndTime[date][time]) {
        bookingsByDateAndTime[date][time] = [];
      }
      bookingsByDateAndTime[date][time].push(booking);
    });

    return (
      <div className="schedule-view">
        <div className="week-navigation">
          <button
            className="nav-btn"
            onClick={() => handleWeekNavigation("prev")}
          >
            <i className="material-icons">chevron_left</i>
            Previous Week
          </button>
          <button className="nav-btn today-btn" onClick={goToToday}>
            <i className="material-icons">today</i>
            Today
          </button>
          <button
            className="nav-btn"
            onClick={() => handleWeekNavigation("next")}
          >
            Next Week
            <i className="material-icons">chevron_right</i>
          </button>
        </div>

        <div className="week-header">
          <div className="time-column-header">Time</div>
          {weekDays.map((day) => (
            <div
              key={formatDate(day)}
              className={`day-column-header ${
                isSameDay(day, selectedDate) ? "selected-day" : ""
              }`}
            >
              <div className="day-name">{format(day, "EEE")}</div>
              <div className="day-date">{format(day, "d MMM")}</div>
            </div>
          ))}
        </div>

        <div className="time-slots">
          {timeSlots.map((slot) => (
            <div key={slot.id} className="time-row">
              <div className="time-cell">
                {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
              </div>
              {weekDays.map((day) => {
                const dateStr = formatDate(day);
                const bookingsForSlot =
                  bookingsByDateAndTime[dateStr]?.[slot.startTime] || [];

                return (
                  <div
                    key={`${dateStr}-${slot.id}`}
                    className={`day-cell ${
                      bookingsForSlot.length > 0 ? "has-bookings" : ""
                    }`}
                  >
                    {bookingsForSlot.length > 0 ? (
                      <div className="bookings-container">
                        {bookingsForSlot.length <= 2 ? (
                          bookingsForSlot.map((booking) => (
                            <div
                              key={booking.bookingId}
                              className="booking-item"
                            >
                              <div className="booking-info">
                                <span className="pod-name">
                                  {booking.podTypeName} #{booking.bookingId}
                                </span>
                                <span
                                  className={`status-badge ${
                                    getDetailedBookingStatus(booking.bookingId)
                                      .color
                                  }`}
                                >
                                  {
                                    getDetailedBookingStatus(booking.bookingId)
                                      .label
                                  }
                                </span>
                              </div>
                              <div className="booking-actions">
                                <button
                                  className="btn-view-mini"
                                  onClick={() =>
                                    handleViewBooking(booking.bookingId)
                                  }
                                >
                                  <i className="material-icons">visibility</i>
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="multiple-bookings">
                            <div className="bookings-count">
                              {bookingsForSlot.length} bookings
                            </div>
                            <button
                              className="btn-view-all"
                              onClick={() =>
                                handleViewAllBookings(
                                  dateStr,
                                  slot.startTime,
                                  bookingsForSlot
                                )
                              }
                            >
                              View All
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="no-booking">-</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // List View Component with sorting
  const renderListView = () => (
    <div className="booking-list-view">
      <table className="booking-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th
              className="sortable-header"
              onClick={() => {
                setSortConfig({
                  key: "arrivalDate",
                  direction:
                    sortConfig.key === "arrivalDate" &&
                    sortConfig.direction === "asc"
                      ? "desc"
                      : "asc",
                });
              }}
            >
              Date
              {sortConfig.key === "arrivalDate" && (
                <i className="material-icons sort-icon">
                  {sortConfig.direction === "asc"
                    ? "arrow_upward"
                    : "arrow_downward"}
                </i>
              )}
            </th>
            <th
              className="sortable-header"
              onClick={() => {
                setSortConfig({
                  key: "startTime",
                  direction:
                    sortConfig.key === "startTime" &&
                    sortConfig.direction === "asc"
                      ? "desc"
                      : "asc",
                });
              }}
            >
              Time
              {sortConfig.key === "startTime" && (
                <i className="material-icons sort-icon">
                  {sortConfig.direction === "asc"
                    ? "arrow_upward"
                    : "arrow_downward"}
                </i>
              )}
            </th>
            <th>Pod Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBookings.map((booking) => (
            <tr key={booking.bookingId}>
              <td>#{booking.bookingId}</td>
              <td>
                {new Date(booking.arrivalDate).toLocaleDateString("en-GB")}
              </td>
              <td>{`${booking.startTime.slice(0, 5)} - ${booking.endTime.slice(
                0,
                5
              )}`}</td>
              <td>{booking.podTypeName}</td>
              <td>
                <span
                  className={`status-badge ${
                    getDetailedBookingStatus(booking.bookingId).color
                  }`}
                >
                  {getDetailedBookingStatus(booking.bookingId).label}
                </span>
              </td>
              <td className="action-buttons">
                <button
                  className="btn-view"
                  onClick={() => handleViewBooking(booking.bookingId)}
                >
                  <i className="material-icons">visibility</i>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          <i className="material-icons">chevron_left</i>
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          <i className="material-icons">chevron_right</i>
        </button>
      </div>
    </div>
  );

  // Pagination setup
  const filteredBookings = sortBookings(filterBookings());
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings =
    viewMode === "list"
      ? filteredBookings.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      : filteredBookings;

  // Main render
  return (
    <>
      <Head />
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="admin-booking-card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="material-icons">event</i>
                Pod Booking Schedule - Admin View
              </h2>
              <div className="view-toggle">
                <button
                  className={`toggle-btn ${
                    viewMode === "schedule" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("schedule")}
                >
                  <i className="material-icons">calendar_view_day</i>
                  Schedule View
                </button>
                <button
                  className={`toggle-btn ${
                    viewMode === "list" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <i className="material-icons">list</i>
                  List View
                </button>
              </div>
            </div>
            <div className="card-content">
              <div className="filters">
                <div className="search-box">
                  <i className="material-icons">search</i>
                  <input
                    type="text"
                    placeholder="Search by booking ID or pod type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
                {viewMode === "schedule" ? (
                  <div className="filter-group">
                    <label>Date</label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={setSelectedDate}
                      dateFormat="dd MMMM, yyyy"
                      className="date-picker"
                    />
                  </div>
                ) : (
                  <DateRangeFilter />
                )}
                <div className="filter-group">
                  <label>Pod Type</label>
                  <select
                    value={selectedPodType}
                    onChange={(e) => setSelectedPodType(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Pod Types</option>
                    {podTypes.map((type) => (
                      <option key={type.id} value={type.id.toString()}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Statuses</option>
                    <option value="1">Cancelled</option>
                    <option value="2">Pending</option>
                    <option value="3">Reserved</option>
                    <option value="4">On-going</option>
                    <option value="5">Completed</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="loading-spinner">
                  <i className="material-icons rotating">sync</i>
                  Loading...
                </div>
              ) : viewMode === "schedule" ? (
                renderScheduleView()
              ) : (
                renderListView()
              )}

              <div className="status-legend">
                <h3>Status Legend</h3>
                <div className="legend-items">
                  <div className="legend-item">
                    <span className="legend-dot status-pending"></span>
                    <span>Pending</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot status-confirmed"></span>
                    <span>Reserved</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot status-cancelled"></span>
                    <span>Cancelled</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot status-completed"></span>
                    <span>Completed</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot status-active"></span>
                    <span>On-going</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showViewAllModal && (
        <ViewAllModal
          bookings={selectedTimeSlotBookings}
          onClose={() => setShowViewAllModal(false)}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Bookings;
