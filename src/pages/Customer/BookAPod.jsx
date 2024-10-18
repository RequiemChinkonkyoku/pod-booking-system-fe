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
  const [activeDay, setActiveDay] = useState(null);
  const [podTypes, setPodTypes] = useState([]);
  const [selectedPodTypeId, setSelectedPodTypeId] = useState(null);
  const [availablePodsBySlot, setAvailablePodsBySlot] = useState({}); // Pods mapped by slot ID
  const [fullyBookedSlots, setFullyBookedSlots] = useState([]);
  const [commonPods, setCommonPods] = useState([]);

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
    if (selectedSlots.includes(slot)) {
      // If slot is deselected, remove it from the selectedSlots and clear its pods
      const updatedSlots = selectedSlots.filter((s) => s !== slot);
      setSelectedSlots(updatedSlots);

      const updatedAvailablePods = { ...availablePodsBySlot };
      delete updatedAvailablePods[slot.id]; // Remove pods for the deselected slot
      setAvailablePodsBySlot(updatedAvailablePods);

      if (updatedSlots.length === 0) setActiveDay(null);
    } else {
      if (
        selectedSlots.length === 0 ||
        (selectedSlots.length === 1 &&
          Math.abs(slot.id - selectedSlots[0].id) === 1)
      ) {
        setSelectedSlots([...selectedSlots, slot]);
        fetchAvailablePods([...selectedSlots, slot]); // Fetch pods for selected slots
        setActiveDay(day);
      }
    }
    console.log(availablePodsBySlot);
  };

  const fetchAvailablePods = async (selectedSlots) => {
    const slotIds = selectedSlots.map((slot) => slot.id);
    const formattedDate = format(selectedDate, "yyyy-MM-dd"); // Format the selected date

    // Map slot IDs to their respective available pods
    const podsBySlot = {};

    for (const slotId of slotIds) {
      try {
        const response = await axios.get(
          `/Pods/Available/${selectedPodTypeId}?scheduleId=${slotId}&arrivalDate=${formattedDate}`
        );
        const availablePodData = response.data;

        // Add pods for this slot to the mapping
        podsBySlot[slotId] = availablePodData;
      } catch (error) {
        console.error("Error fetching available pods for slot:", slotId, error);
      }
    }

    // Set the fetched available pods to state
    setAvailablePodsBySlot(podsBySlot);

    // Find common pods between the selected slots and display them
    setCommonPods(findCommonPods(podsBySlot, selectedSlots));
    console.log("Common Available Pods:", commonPods);
  };

  const findCommonPods = (availablePodsBySlot, selectedSlots) => {
    // Case 1: If only one slot is selected, show pods of that slot
    if (selectedSlots.length === 1) {
      return availablePodsBySlot[selectedSlots[0].id] || []; // Return the pods of the single slot
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

    // Case 3: No slots selected or more than 2 slots (not allowed by your logic)
    return [];
  };

  const test = () => {
    const commonPods = findCommonPods(availablePodsBySlot, selectedSlots);
    console.log("Common Available Pods:", commonPods);
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

    if (podTypeId) {
      try {
        const response = await axios.get(`/Slot/Full/${podTypeId}`);
        setFullyBookedSlots(response.data);
      } catch (error) {
        console.error("Error fetching slots for pod type:", error);
      }
    }
  };

  // const bookedSlots = [
  //   { date: "18/10/2024", timeslotId: 2 },
  //   { date: "19/10/2024", timeslotId: 3 },
  //   { date: "20/10/2024", timeslotId: 1 },
  //   { date: "17/10/2024", timeslotId: 1 },
  //   { date: "23/10/2024", timeslotId: 1 },
  // ];

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
                        <div className="mb-4">
                          <label>Select a date: </label>
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date) => {
                              setSelectedDate(date);
                              setSelectedSlots([]);
                              setActiveDay(null);
                              setAvailablePodsBySlot({}); // Clear pods when changing date
                            }}
                            dateFormat="dd MMMM, yyyy"
                            className="form-control"
                          />
                        </div>
                        <div className="table-responsive">
                          <table className="table">
                            <thead className="text-primary">
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
                                    const isBooked = fullyBookedSlots.some(
                                      (booked) =>
                                        format(day, "yyyy-MM-dd") ===
                                          booked.arrivalDate &&
                                        slot.id === booked.scheduleId
                                    );

                                    return (
                                      <td key={day} className="text-center">
                                        <button
                                          className={`btn-sm ${
                                            isBooked
                                              ? "btn btn-danger"
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
                                            isBooked ||
                                            isBefore(day, new Date()) ||
                                            (activeDay &&
                                              !isSameDay(activeDay, day)) ||
                                            (selectedSlots.length === 2 &&
                                              !selectedSlots.includes(slot)) ||
                                            isSlotDisabled(slot)
                                          }
                                          onClick={() =>
                                            handleSlotSelect(slot, day)
                                          }
                                        >
                                          {isBooked ? "Booked" : "Available"}
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
                        {/* Display available pods for each selected slot */}
                        <div className="mt-4">
                          <h5>Available Pods by Slot:</h5>
                          {Object.keys(availablePodsBySlot).length > 0 ? (
                            Object.entries(availablePodsBySlot).map(
                              ([slotId, pods]) => (
                                <div key={slotId}>
                                  <h6>Slot {slotId}:</h6>
                                  <ul>
                                    {pods.map((pod) => (
                                      <li key={pod.id}>{pod.name}</li>
                                    ))}
                                  </ul>
                                </div>
                              )
                            )
                          ) : (
                            <p>No available pods for the selected slots.</p>
                          )}
                          {/* Display Common Pods */}
                          {selectedSlots.length > 1 && (
                            <div className="mt-4">
                              <h5>Common Pods:</h5>
                              {commonPods && commonPods.length > 0 ? (
                                <ul>
                                  {commonPods.map((pod) => (
                                    <li key={pod.id}>{pod.name}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p>No common pods between selected slots.</p>
                              )}
                            </div>
                          )}
                        </div>
                        <button onClick={test}>test</button>
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
