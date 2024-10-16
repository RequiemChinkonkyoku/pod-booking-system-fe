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

const BookAPod = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [activeDay, setActiveDay] = useState(null); // Track the day with selected slots
  const [podTypes, setPodTypes] = useState([]);
  const [selectedPodTypeId, setSelectedPodTypeId] = useState(null);

  // Fetch time slots from the /Schedules API
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
        setPodTypes(response.data); // Assuming the response is an array of pod types
      } catch (error) {
        console.error("Error fetching pod types:", error);
      }
    };
    fetchPodTypes();
  }, []);

  // Calculate and set the week days based on the selected date
  useEffect(() => {
    const startOfSelectedWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const daysOfWeek = Array.from({ length: 7 }).map((_, index) =>
      addDays(startOfSelectedWeek, index)
    );
    setWeekDays(daysOfWeek);
  }, [selectedDate]);

  // Function to format time (removes seconds)
  const formatTime = (time) => {
    return time.slice(0, 5);
  };

  // Handle slot selection logic
  const handleSlotSelect = (slot, day) => {
    // If the slot is already selected, unselect it
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));

      // Clear activeDay if no more slots are selected
      if (selectedSlots.length === 1) setActiveDay(null);
    } else {
      // Enforce consecutive selection
      if (
        selectedSlots.length === 0 ||
        (selectedSlots.length === 1 &&
          Math.abs(slot.id - selectedSlots[0].id) === 1)
      ) {
        setSelectedSlots([...selectedSlots, slot]);
        setActiveDay(day);
      }
    }
  };

  // Check if a slot should be disabled for selection based on adjacency
  const isSlotDisabled = (slot) => {
    if (selectedSlots.length === 0) return false; // No selection, all slots are enabled

    // Slot should be adjacent to the current selected slot(s)
    const firstSelected = selectedSlots[0].id;
    const lastSelected = selectedSlots[selectedSlots.length - 1].id;

    return (
      Math.abs(slot.id - firstSelected) > 1 ||
      Math.abs(slot.id - lastSelected) > 1
    );
  };

  // Handle pod type selection and fetch available slots
  const handlePodTypeChange = async (event) => {
    const podTypeId = event.target.value;
    setSelectedPodTypeId(podTypeId);

    // Fetch available slots for the selected pod type
    if (podTypeId) {
      try {
        const response = await axios.get(`/Slot/PodType/${podTypeId}`);
      } catch (error) {
        console.error("Error fetching slots for pod type:", error);
      }
    }
  };

  const bookedSlots = [
    { date: "18/10/2024", timeslotId: 2 },
    { date: "19/10/2024", timeslotId: 3 },
    { date: "20/10/2024", timeslotId: 1 },
    { date: "17/10/2024", timeslotId: 1 },
  ];

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
                  <div class="col-md-12">
                    <div class="card">
                      <div class="card-header card-header-icon card-header-rose">
                        <div class="card-icon">
                          <i class="material-icons">assignment</i>
                        </div>
                        <h4 class="card-title">Schedule</h4>
                      </div>
                      <div class="card-body">
                        {/* Pod Type Selection */}
                        <div className="mb-4">
                          <label>Select Pod Type: </label>
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
                        {/* DatePicker */}
                        <div className="mb-4">
                          <label>Select a date: </label> <t />
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date) => {
                              setSelectedDate(date);
                              setSelectedSlots([]); // Reset selection when date changes
                              setActiveDay(null); // Reset active day
                            }}
                            dateFormat="dd MMMM, yyyy"
                            className="form-control"
                          />
                        </div>
                        {/* Timetable */}
                        <div class="table-responsive">
                          <table class="table">
                            <thead class="text-primary">
                              <tr>
                                <th>Time Slot</th>
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
                                    // Check if the current day and timeslot match any of the booked slots in the array
                                    const isBooked = bookedSlots.some(
                                      (booked) =>
                                        format(day, "dd/MM/yyyy") ===
                                          booked.date &&
                                        slot.id === booked.timeslotId
                                    );

                                    return (
                                      <td key={day} className="text-center">
                                        <button
                                          className={`btn-sm ${
                                            isBooked
                                              ? "btn btn-danger" // Change class to "btn-danger" for booked slots
                                              : isBefore(day, new Date()) ||
                                                isSameDay(day, new Date())
                                              ? "btn"
                                              : selectedSlots.includes(slot) &&
                                                isSameDay(activeDay, day)
                                              ? "btn btn-success"
                                              : activeDay &&
                                                !isSameDay(day, activeDay)
                                              ? "btn"
                                              : slot.status === 1
                                              ? "btn btn-info"
                                              : "btn"
                                          }`}
                                          disabled={
                                            isBooked || // Disable the booked slot here
                                            isBefore(day, new Date()) ||
                                            (activeDay &&
                                              !isSameDay(activeDay, day)) ||
                                            (selectedSlots.length === 2 &&
                                              !selectedSlots.includes(slot)) ||
                                            isSlotDisabled(slot) // Disable non-adjacent slots
                                          }
                                          onClick={() =>
                                            handleSlotSelect(slot, day)
                                          }
                                        >
                                          {isBooked
                                            ? "Fully Booked"
                                            : isBefore(day, new Date()) ||
                                              isSameDay(day, new Date())
                                            ? "Unavailable"
                                            : selectedSlots.includes(slot)
                                            ? "Selected"
                                            : slot.status === 1
                                            ? "Available"
                                            : "Booked"}
                                          <div class="ripple-container"></div>
                                        </button>
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {/* Display selected slots */}
                        {selectedSlots.length > 0 && (
                          <div className="mt-4">
                            <h5>Selected Time Slots:</h5>
                            <ul>
                              {selectedSlots.map((slot, index) => {
                                // Getting the full slot information based on the id
                                const fullSlotInfo = timeSlots.find(
                                  (s) => s.id === slot.id
                                ); // Ensure you have access to timeSlots here

                                // Assuming activeDay is always the day selected for the slots
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
