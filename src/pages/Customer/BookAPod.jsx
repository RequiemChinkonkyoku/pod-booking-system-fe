import axios from "../../utils/axiosConfig";
import React, { useState, useEffect } from "react";
import "../../assets/css/material-dashboard.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Navbar from "../../components/Customer/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Customer/Sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, startOfWeek, format, isBefore, isSameDay } from "date-fns";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get("/Schedules");
        setTimeSlots(response.data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
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
    setSelectedPodId(null);
    if (selectedSlots.includes(slot)) {
      const updatedSlots = selectedSlots.filter((s) => s !== slot);
      setSelectedSlots(updatedSlots);

      const updatedAvailablePods = { ...availablePodsBySlot };
      delete updatedAvailablePods[slot.id];
      setAvailablePodsBySlot(updatedAvailablePods);

      if (updatedSlots.length === 0) setActiveDay(null);
    } else {
      if (
        selectedSlots.length === 0 ||
        (selectedSlots.length === 1 &&
          Math.abs(slot.id - selectedSlots[0].id) === 1)
      ) {
        setSelectedSlots([...selectedSlots, slot]);
        fetchAvailablePods([...selectedSlots, slot]);
        setActiveDay(day);
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
        const availablePodData = response.data;

        podsBySlot[slotId] = availablePodData;
      } catch (error) {
        console.error("Error fetching available pods for slot:", slotId, error);
      }
    }

    setAvailablePodsBySlot(podsBySlot);

    setCommonPods(findCommonPods(podsBySlot, selectedSlots));
    console.log("Common Available Pods:", commonPods);
  };

  const findCommonPods = (availablePodsBySlot, selectedSlots) => {
    // Case 1: If only one slot is selected, show pods of that slot
    if (selectedSlots.length === 1) {
      return availablePodsBySlot[selectedSlots[0].id] || [];
    }

    // Case 2: If two slots are selected, find common pods
    if (selectedSlots.length === 2) {
      const podListSlot1 = availablePodsBySlot[selectedSlots[0].id] || [];
      const podListSlot2 = availablePodsBySlot[selectedSlots[1].id] || [];

      // Find common pods between slot 1 and slot 2
      const commonPods = podListSlot1.filter(
        (pod1) => podListSlot2.some((pod2) => pod1.id === pod2.id) // Compare pods by their ID
      );

      return commonPods.length > 0 ? commonPods : []; // Return common pods if any, otherwise return an empty array
    }

    // Case 3: No slots selected or more than 2 slots (not allowed by current customer logic)
    return [];
  };

  const isSlotDisabled = (slot) => {
    if (selectedSlots.length === 0) return false;

    const firstSelected = selectedSlots[0].id;
    const lastSelected = selectedSlots[selectedSlots.length - 1].id;

    return (
      Math.abs(slot.id - firstSelected) > 1 ||
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

    if (podTypeId) {
      try {
        const response = await axios.get(`/Slot/Full/${podTypeId}`);
        setFullyBookedSlots(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setFullyBookedSlots([]);
          setSelectedPodId(null);
        } else {
          console.error("Error fetching slots for pod type:", error);
        }
      }
    }
  };

  const handlePodSelect = (podId) => {
    setSelectedPodId(podId);
  };

  const confirmPodSelection = () => {
    console.log("Pod selected:", selectedPodId);
    handleConfirm();
  };

  const navigate = useNavigate();
  const handleConfirm = () => {
    const scheduleId = selectedSlots.map((slot) => slot.id);
    const arrivalDate = format(activeDay, "yyyy-MM-dd");
    const bookingData = {
      arrivalDate: arrivalDate,
      podId: selectedPodId,
      scheduleId: scheduleId,
    };
    console.log(bookingData);

    navigate("/customerConfirmBooking", { state: bookingData });
  };

  return (
    <>
      <Head />
      <body>
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
                        <h4 className="card-title">Schedule</h4>
                      </div>
                      <div className="card-body">
                        <div className="mb-4">
                          <label>Select POD: </label>
                          <select
                            className="form-control"
                            onChange={handlePodTypeChange}
                            value={selectedPodTypeId || ""}
                          >
                            <option value="" disabled>
                              Select a pod
                            </option>
                            {podTypes.map((podType) => (
                              <option key={podType.id} value={podType.id}>
                                {podType.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Only show the date picker and timetable if a pod type is selected */}
                        {selectedPodTypeId && (
                          <>
                            <div className="mb-4">
                              <label>Select a date: </label> <t />
                              <DatePicker
                                selected={selectedDate}
                                onChange={(date) => {
                                  setSelectedDate(date);
                                  setSelectedSlots([]);
                                  setActiveDay(null);
                                  setAvailablePodsBySlot({});
                                  setSelectedPodId(null);
                                }}
                                dateFormat="dd MMMM, yyyy"
                                className="form-control"
                              />
                            </div>

                            {selectedDate && (
                              <div className="table-responsive">
                                <table className="table">
                                  <thead className="text-primary">
                                    <tr>
                                      <th>Time</th>
                                      {weekDays.map((day) => (
                                        <th
                                          key={day}
                                          className="text-center"
                                          style={{ width: "14.28%" }}
                                        >
                                          {format(day, "EE, MMM d")}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {timeSlots.map((slot) => (
                                      <tr key={slot.id}>
                                        <td>
                                          {formatTime(slot.startTime)} -{" "}
                                          {formatTime(slot.endTime)}
                                        </td>
                                        {weekDays.map((day) => {
                                          const isBooked =
                                            fullyBookedSlots.some(
                                              (booked) =>
                                                format(day, "yyyy-MM-dd") ===
                                                  booked.arrivalDate &&
                                                slot.id === booked.scheduleId
                                            );

                                          const isSelected =
                                            selectedSlots.includes(slot);

                                          return (
                                            <td
                                              key={day}
                                              className="text-center"
                                            >
                                              <button
                                                className={`btn-sm ${
                                                  isBooked
                                                    ? "btn btn-danger"
                                                    : isBefore(day, new Date())
                                                    ? "btn"
                                                    : isSameDay(
                                                        day,
                                                        new Date()
                                                      ) ||
                                                      (isSelected &&
                                                        isSameDay(
                                                          activeDay,
                                                          day
                                                        ))
                                                    ? "btn btn-success"
                                                    : activeDay &&
                                                      !isSameDay(day, activeDay)
                                                    ? "btn"
                                                    : "btn btn-info"
                                                }`}
                                                disabled={
                                                  isBooked ||
                                                  isBefore(day, new Date()) ||
                                                  (activeDay &&
                                                    !isSameDay(
                                                      activeDay,
                                                      day
                                                    )) ||
                                                  (selectedSlots.length === 2 &&
                                                    !selectedSlots.includes(
                                                      slot
                                                    )) ||
                                                  isSlotDisabled(slot)
                                                }
                                                onClick={() =>
                                                  handleSlotSelect(slot, day)
                                                }
                                              >
                                                {isBooked
                                                  ? "Fully Booked"
                                                  : isBefore(day, new Date())
                                                  ? "Unavailable"
                                                  : "Available"}
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
                          </>
                        )}
                        {/* Display selected slots and available pods */}
                        {selectedSlots.length > 0 && (
                          <div className="mt-4">
                            <h5>Selected Time:</h5>
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
                                    Date: {dateOfSlot}, Time:{" "}
                                    {fullSlotInfo
                                      ? formatTime(fullSlotInfo.startTime)
                                      : "N/A"}{" "}
                                    -{" "}
                                    {fullSlotInfo
                                      ? formatTime(fullSlotInfo.endTime)
                                      : "N/A"}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                        <div className="mt-4">
                          {/* Case 1: Only one slot selected, display available pods for that slot */}
                          {selectedSlots.length === 1 && (
                            <div>
                              {availablePodsBySlot[selectedSlots[0].id] &&
                              availablePodsBySlot[selectedSlots[0].id].length >
                                0 ? (
                                <div>
                                  <h5>
                                    Booking can be made with one of these PODs:
                                  </h5>
                                  <button
                                    className={`btn ${
                                      selectedPodId === 0
                                        ? "btn-warning"
                                        : "btn-primary"
                                    }`}
                                    onClick={() => handlePodSelect(0)}
                                  >
                                    RANDOM
                                  </button>
                                  {availablePodsBySlot[selectedSlots[0].id].map(
                                    (pod) => (
                                      <button
                                        className={`btn ${
                                          selectedPodId === pod.id
                                            ? "btn-warning"
                                            : "btn-info"
                                        }`}
                                        key={pod.id}
                                        onClick={() => handlePodSelect(pod.id)}
                                      >
                                        {pod.name}
                                      </button>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p>No available pods for the selected slot.</p>
                              )}
                            </div>
                          )}

                          {/* Case 2: Two slots selected, display common pods */}
                          {selectedSlots.length > 1 && (
                            <div>
                              {commonPods && commonPods.length > 0 ? (
                                <div>
                                  <button
                                    className={`btn ${
                                      selectedPodId === 0
                                        ? "btn-warning"
                                        : "btn-primary"
                                    }`}
                                    onClick={() => handlePodSelect(0)}
                                  >
                                    RANDOM
                                  </button>
                                  {commonPods.map((pod) => (
                                    <button
                                      className={`btn ${
                                        selectedPodId === pod.id
                                          ? "btn-warning"
                                          : "btn-info"
                                      }`}
                                      key={pod.id}
                                      onClick={() => handlePodSelect(pod.id)}
                                    >
                                      {pod.name}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <p>No common pods between selected slots.</p>
                              )}
                            </div>
                          )}

                          {/* Show confirmation button if a pod is selected */}
                          {selectedPodId !== null && (
                            <div className="mt-3">
                              <button
                                className="btn btn-success"
                                onClick={() => confirmPodSelection()}
                              >
                                Confirm Selection
                              </button>
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
        </div>
      </body>
    </>
  );
};

export default BookAPod;
