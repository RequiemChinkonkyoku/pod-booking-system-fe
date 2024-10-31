import axios from "../../utils/axiosConfig";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import { addDays, startOfWeek, format, isBefore, isSameDay } from "date-fns";
import Navbar from "../../components/Customer/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Customer/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import "../../css/BookAPod.css";

const BookAPod = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [activeDay, setActiveDay] = useState(null);
  const [podTypes, setPodTypes] = useState([]);
  const [selectedPodTypeId, setSelectedPodTypeId] = useState(null);
  const [availablePodsBySlot, setAvailablePodsBySlot] = useState({});
  const [fullyBookedSlots, setFullyBookedSlots] = useState([]);
  const [commonPods, setCommonPods] = useState([]);
  const [selectedPodId, setSelectedPodId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get("/Schedules");
        setTimeSlots(response.data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        toast.error("Unable to fetch schedules. Please try again later.");
      }
    };
    fetchSchedules();
  }, []);

  useEffect(() => {
    const fetchPodTypes = async () => {
      try {
        const response = await axios.get("/PodType");
        setPodTypes(response.data);
      } catch (error) {
        console.error("Error fetching pod types:", error);
        toast.error("Unable to load pod types. Please refresh the page.");
      }
    };
    fetchPodTypes();
  }, []);

  useEffect(() => {
    const startOfSelectedWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const daysOfWeek = Array.from({ length: 7 }).map((_, index) =>
      addDays(startOfSelectedWeek, index)
    );
    setWeekDays(daysOfWeek);
  }, [selectedDate]);

  const formatTime = (time) => {
    return time.slice(0, 5);
  };

  const handleSlotSelect = (slot, day) => {
    if (isBefore(day, new Date()) && !isSameDay(day, new Date())) {
      toast.error("Cannot select past dates");
      return;
    }

    setSelectedPodId(null);
    if (selectedSlots.includes(slot)) {
      const updatedSlots = selectedSlots.filter((s) => s !== slot);
      setSelectedSlots(updatedSlots);
      const updatedAvailablePods = { ...availablePodsBySlot };
      delete updatedAvailablePods[slot.id];
      setAvailablePodsBySlot(updatedAvailablePods);
      if (updatedSlots.length === 0) setActiveDay(null);
    } else {
      if (activeDay && !isSameDay(activeDay, day)) {
        toast.warn(
          "Please select slots from the same day. Clear your selection to choose a different day.",
          { autoClose: 5000 }
        );
        return;
      }
      if (
        selectedSlots.length === 0 ||
        (selectedSlots.length === 1 &&
          Math.abs(slot.id - selectedSlots[0].id) === 1)
      ) {
        setSelectedSlots([...selectedSlots, slot]);
        fetchAvailablePods([...selectedSlots, slot]);
        setActiveDay(day);
      } else if (selectedSlots.length === 2) {
        toast.warn("Maximum 2 consecutive slots can be selected");
      }
    }
  };

  const fetchAvailablePods = async (selectedSlots) => {
    setSelectedPodId(null);
    const slotIds = selectedSlots.map((slot) => slot.id);
    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    const podsBySlot = {};

    for (const slotId of slotIds) {
      try {
        const response = await axios.get(
          `/Pods/Available/${selectedPodTypeId}?scheduleId=${slotId}&arrivalDate=${formattedDate}`
        );
        podsBySlot[slotId] = response.data;
      } catch (error) {
        console.error("Error fetching available pods for slot:", slotId, error);
        toast.error("Error checking pod availability");
      }
    }

    setAvailablePodsBySlot(podsBySlot);
    const commonPodsResult = findCommonPods(podsBySlot, selectedSlots);
    setCommonPods(commonPodsResult);

    if (commonPodsResult.length === 0 && selectedSlots.length > 1) {
      toast.error("No common pods available for selected time slots");
    }
  };

  const findCommonPods = (availablePodsBySlot, selectedSlots) => {
    if (selectedSlots.length === 1) {
      return availablePodsBySlot[selectedSlots[0].id] || [];
    }

    if (selectedSlots.length === 2) {
      const podListSlot1 = availablePodsBySlot[selectedSlots[0].id] || [];
      const podListSlot2 = availablePodsBySlot[selectedSlots[1].id] || [];
      return podListSlot1.filter((pod1) =>
        podListSlot2.some((pod2) => pod1.id === pod2.id)
      );
    }

    return [];
  };

  const isSlotDisabled = (slot, day) => {
    if (isBefore(day, new Date()) && !isSameDay(day, new Date())) {
      return true;
    }

    if (selectedSlots.length === 0) return false;

    if (activeDay && !isSameDay(activeDay, day)) {
      return true;
    }

    const firstSelected = selectedSlots[0].id;
    const lastSelected = selectedSlots[selectedSlots.length - 1].id;
    return (
      Math.abs(slot.id - firstSelected) > 1 &&
      Math.abs(slot.id - lastSelected) > 1
    );
  };

  const handlePodTypeChange = async (event) => {
    const podTypeId = event.target.value;
    setSelectedPodTypeId(podTypeId);
    setSelectedSlots([]);
    setCommonPods([]);
    setAvailablePodsBySlot({});
    setSelectedPodId(null);
    setActiveDay(null);

    if (podTypeId) {
      try {
        const response = await axios.get(`/Slot/Full/${podTypeId}`);
        setFullyBookedSlots(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setFullyBookedSlots([]);
        } else {
          console.error("Error fetching slots for pod type:", error);
          toast.error("Error loading pod availability");
        }
      }
    }
  };

  const handlePodSelect = (podId) => {
    setSelectedPodId(podId);
    if (podId === 0) {
      toast.info("Random pod will be assigned");
    }
  };

  const handleDateChange = (date) => {
    if (selectedSlots.length > 0) {
      toast.info("Cleared previous slot selections");
    }
    setSelectedDate(date);
    setSelectedSlots([]);
    setActiveDay(null);
    setAvailablePodsBySlot({});
    setSelectedPodId(null);
  };

  const handleConfirm = () => {
    const scheduleId = selectedSlots.map((slot) => slot.id);
    const arrivalDate = format(activeDay, "yyyy-MM-dd");
    const bookingData = {
      arrivalDate: arrivalDate,
      podId: selectedPodId,
      scheduleId: scheduleId,
    };
    navigate("/customer/ConfirmBooking", { state: bookingData });
  };

  return (
    <>
      <Head />
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel">
          <Navbar />
          <div className="booking-container">
            <div className="container">
              <div className="booking-header">
                <h1>Book Your Pod</h1>
                <p>
                  <i className="material-icons">event_available</i>
                  Select your preferred pod and time slot (maximum 2 consecutive
                  slots)
                </p>
              </div>

              <div className="booking-card">
                <div className="card-header">
                  <i className="material-icons">meeting_room</i>
                  <h4>Pod Booking Schedule</h4>
                </div>

                <div className="card-body">
                  <div className="booking-grid">
                    {/* Left Sidebar */}
                    <div className="booking-sidebar">
                      <div className="form-section">
                        <label>
                          <i className="material-icons">widgets</i>
                          Pod Type
                        </label>
                        <select
                          className="form-control"
                          onChange={handlePodTypeChange}
                          value={selectedPodTypeId || ""}
                        >
                          <option value="" disabled>
                            Select a pod type
                          </option>
                          {podTypes.map((podType) => (
                            <option key={podType.id} value={podType.id}>
                              {podType.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedPodTypeId && (
                        <div className="form-section">
                          <label>
                            <i className="material-icons">calendar_month</i>
                            Date
                          </label>
                          <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="dd MMMM, yyyy"
                            className="form-control"
                            minDate={new Date()}
                          />
                        </div>
                      )}

                      <div className="calendar-info">
                        <h6>
                          <i className="material-icons">info</i>
                          Status Guide
                        </h6>
                        <div className="info-item1">
                          <i className="material-icons">schedule</i>
                          <span className="info-dot info-available"></span>
                          Available for Booking
                        </div>
                        <div className="info-item1">
                          <i className="material-icons">check_circle</i>
                          <span className="info-dot info-selected"></span>
                          Selected Time Slot
                        </div>
                        <div className="info-item1">
                          <i className="material-icons">block</i>
                          <span className="info-dot info-booked"></span>
                          Fully Booked
                        </div>
                        <div className="info-item1">
                          <i className="material-icons">event_busy</i>
                          <span className="info-dot info-unavailable"></span>
                          Not Available
                        </div>
                      </div>

                      {selectedSlots.length > 0 && (
                        <div className="selected-slots">
                          <h6>
                            <i className="material-icons">event_available</i>
                            Selected Time Slots
                          </h6>
                          <ul>
                            {selectedSlots.map((slot, index) => {
                              const fullSlotInfo = timeSlots.find(
                                (s) => s.id === slot.id
                              );
                              const dateOfSlot = activeDay
                                ? format(activeDay, "dd/MM/yyyy")
                                : "N/A";
                              return (
                                <li key={index}>
                                  <i className="material-icons">schedule</i>
                                  <span>
                                    {dateOfSlot},{" "}
                                    {fullSlotInfo
                                      ? formatTime(fullSlotInfo.startTime)
                                      : "N/A"}{" "}
                                    -{" "}
                                    {fullSlotInfo
                                      ? formatTime(fullSlotInfo.endTime)
                                      : "N/A"}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Right Content Area */}
                    <div className="booking-content">
                      {selectedPodTypeId && selectedDate && (
                        <div className="time-table-container">
                          <table className="time-table">
                            <thead>
                              <tr>
                                <th>
                                  <i className="material-icons">schedule</i>
                                  Time
                                </th>
                                {weekDays.map((day) => (
                                  <th key={format(day, "yyyy-MM-dd")}>
                                    {format(day, "EE, MMM d")}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {timeSlots.map((slot) => (
                                <tr key={slot.id}>
                                  <td>
                                    <i className="material-icons">schedule</i>
                                    {formatTime(slot.startTime)}
                                  </td>
                                  {weekDays.map((day) => {
                                    const isBooked = fullyBookedSlots.some(
                                      (booked) =>
                                        format(day, "yyyy-MM-dd") ===
                                          booked.arrivalDate &&
                                        slot.id === booked.scheduleId
                                    );
                                    const isSelected =
                                      selectedSlots.includes(slot) &&
                                      isSameDay(activeDay, day);
                                    const isPast =
                                      isBefore(day, new Date()) &&
                                      !isSameDay(day, new Date());

                                    let buttonClass = "time-slot ";
                                    if (isBooked)
                                      buttonClass += "time-slot-booked";
                                    else if (isPast)
                                      buttonClass += "time-slot-unavailable";
                                    else if (isSelected)
                                      buttonClass += "time-slot-selected";
                                    else buttonClass += "time-slot-available";

                                    return (
                                      <td key={format(day, "yyyy-MM-dd")}>
                                        <button
                                          className={buttonClass}
                                          onClick={() =>
                                            handleSlotSelect(slot, day)
                                          }
                                          disabled={
                                            isBooked ||
                                            isPast ||
                                            isSlotDisabled(slot, day)
                                          }
                                        >
                                          {isBooked ? (
                                            <>
                                              <i className="material-icons">
                                                block
                                              </i>
                                              <span>Booked</span>
                                            </>
                                          ) : isPast ? (
                                            <>
                                              <i className="material-icons">
                                                event_busy
                                              </i>
                                              <span>Unavailable</span>
                                            </>
                                          ) : isSelected ? (
                                            <>
                                              <i className="material-icons">
                                                check_circle
                                              </i>
                                              <span>Selected</span>
                                            </>
                                          ) : (
                                            <>
                                              <i className="material-icons">
                                                schedule
                                              </i>
                                              <span>Available</span>
                                            </>
                                          )}
                                        </button>
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {selectedSlots.length > 0 && (
                        <div className="pod-selection">
                          <h6>
                            <i className="material-icons">location_city</i>
                            Available Pods
                          </h6>
                          <div className="pod-buttons">
                            <button
                              className={`pod-button pod-button-random ${
                                selectedPodId === 0 ? "selected" : ""
                              }`}
                              onClick={() => handlePodSelect(0)}
                            >
                              <i className="material-icons">shuffle</i>
                              Random
                            </button>
                            {(selectedSlots.length === 1
                              ? availablePodsBySlot[selectedSlots[0].id] || []
                              : commonPods
                            ).map((pod) => (
                              <button
                                key={pod.id}
                                className={`pod-button pod-button-normal ${
                                  selectedPodId === pod.id ? "selected" : ""
                                }`}
                                onClick={() => handlePodSelect(pod.id)}
                              >
                                <i className="material-icons">meeting_room</i>
                                {pod.name}
                              </button>
                            ))}
                          </div>

                          {selectedPodId !== null && (
                            <button
                              className="confirm-button"
                              onClick={handleConfirm}
                            >
                              <span>Proceed to Confirm</span>
                              <i className="material-icons">arrow_forward</i>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default BookAPod;
