import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Cell,
} from "recharts";
import axios from "../../utils/axiosConfig";
import Head from "../../components/Head";
import Sidebar from "../../components/Admin/Sidebar";
import Navbar from "../../components/Admin/Navbar";
import "../../css/DashboardChart.css";

const DashboardChart = () => {
  const [bookings, setBookings] = useState([]);
  const [detailedBookings, setDetailedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("day");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const bookingsResponse = await axios.get("/Booking");
        setBookings(bookingsResponse.data);

        const detailedData = await Promise.all(
          bookingsResponse.data.map((booking) =>
            axios
              .get(`/Booking/${booking.bookingId}`)
              .then((response) => response.data)
              .catch((error) => {
                console.error(
                  `Error fetching booking ${booking.bookingId}:`,
                  error
                );
                return null;
              })
          )
        );

        const validDetailedData = detailedData.filter(
          (booking) => booking !== null
        );
        setDetailedBookings(validDetailedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const calculateMetrics = () => {
    const totalRevenue = detailedBookings
      .filter(
        (booking) =>
          booking?.bookingStatusId === 5 || booking?.bookingStatusId === 4
      )
      .reduce((sum, booking) => {
        const price =
          Number(booking.actualPrice) || Number(booking.bookingPrice) || 0;
        return sum + price;
      }, 0);

    const completedBookings = detailedBookings.filter(
      (booking) => booking?.bookingStatusId === 5
    ).length;

    const activeBookings = detailedBookings.filter(
      (booking) => booking?.bookingStatusId === 4
    ).length;

    const pendingBookings = detailedBookings.filter(
      (booking) => booking?.bookingStatusId === 2
    ).length;

    const avgBookingValue = totalRevenue / (detailedBookings.length || 1);
    const totalSlots = detailedBookings.reduce((sum, booking) => {
      return sum + (booking?.bookingDetails?.length || 0);
    }, 0);
    const revenuePerSlot = totalSlots > 0 ? totalRevenue / totalSlots : 0;

    return {
      totalRevenue: isNaN(totalRevenue) ? 0 : totalRevenue,
      completedBookings,
      activeBookings,
      pendingBookings,
      totalBookings: detailedBookings.length,
      avgBookingValue: isNaN(avgBookingValue) ? 0 : avgBookingValue,
      totalSlots,
      revenuePerSlot: isNaN(revenuePerSlot) ? 0 : revenuePerSlot,
    };
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Update getFilteredRevenueData function
  const getFilteredRevenueData = () => {
    const relevantBookings = detailedBookings.filter(
      (booking) =>
        booking?.bookingStatusId === 5 || booking?.bookingStatusId === 4
    );

    switch (period) {
      case "day":
        const dailyData = {};
        relevantBookings.forEach((booking) => {
          if (booking.bookingDetails && booking.bookingDetails.length > 0) {
            const date = new Date(booking.bookingDetails[0].slot.arrivalDate);
            const formattedDate = `${String(date.getDate()).padStart(
              2,
              "0"
            )}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(
              date.getFullYear()
            ).slice(-2)}`;

            if (!dailyData[formattedDate]) {
              dailyData[formattedDate] = {
                period: formattedDate,
                revenue: 0,
                bookings: 0,
              };
            }
            // Use actualPrice if exists, otherwise use bookingPrice
            const finalPrice = booking.actualPrice || booking.bookingPrice || 0;
            dailyData[formattedDate].revenue += Number(finalPrice);
            dailyData[formattedDate].bookings += 1;
          }
        });
        return Object.values(dailyData);
    }
  };

  const getMonthlyRevenueData = () => {
    const monthlyData = {};

    const relevantBookings = [...detailedBookings]
      .filter(
        (booking) =>
          booking?.bookingStatusId === 5 || booking?.bookingStatusId === 4
      )
      .filter(
        (booking) => booking.bookingDetails && booking.bookingDetails.length > 0
      )
      .sort(
        (a, b) =>
          new Date(a.bookingDetails[0].slot.arrivalDate) -
          new Date(b.bookingDetails[0].slot.arrivalDate)
      );

    relevantBookings.forEach((booking) => {
      const date = new Date(booking.bookingDetails[0].slot.arrivalDate);
      const monthYear = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          revenue: 0,
          slots: 0,
          bookings: 0,
        };
      }

      const finalPrice =
        Number(booking.actualPrice) || Number(booking.bookingPrice) || 0;
      monthlyData[monthYear].revenue += finalPrice;
      monthlyData[monthYear].slots += booking.bookingDetails?.length || 0;
      monthlyData[monthYear].bookings += 1;
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      revenue: Number(data.revenue),
      slots: Number(data.slots),
      bookings: Number(data.bookings),
      avgRevenuePerSlot: Number(data.revenue) / Number(data.slots) || 0,
    }));
  };

  const getDailyRevenueData = () => {
    const dailyData = {};

    const relevantBookings = [...detailedBookings]
      .filter(
        (booking) =>
          booking?.bookingStatusId === 5 || booking?.bookingStatusId === 4
      )
      .filter(
        (booking) => booking.bookingDetails && booking.bookingDetails.length > 0
      )
      .sort(
        (a, b) =>
          new Date(a.bookingDetails[0].slot.arrivalDate) -
          new Date(b.bookingDetails[0].slot.arrivalDate)
      );

    relevantBookings.forEach((booking) => {
      const date = new Date(
        booking.bookingDetails[0].slot.arrivalDate
      ).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });

      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          revenue: 0,
          slots: 0,
          bookings: 0,
        };
      }

      const finalPrice =
        Number(booking.actualPrice) || Number(booking.bookingPrice) || 0;
      dailyData[date].revenue += finalPrice;
      dailyData[date].slots += booking.bookingDetails?.length || 0;
      dailyData[date].bookings += 1;
    });

    return Object.entries(dailyData)
      .map(([_, data]) => data)
      .slice(-7);
  };

  // Update CustomTooltip to show only final price
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          <p className="tooltip-value">
            Revenue: {Number(payload[0].value).toLocaleString()} VND
          </p>
          <p className="tooltip-value">
            Bookings: {payload[0].payload.bookings}
          </p>
        </div>
      );
    }
    return null;
  };

  const metrics = calculateMetrics();
  const monthlyData = getMonthlyRevenueData();
  const dailyData = getDailyRevenueData();

  if (loading) {
    return (
      <>
        <Head />
        <div className="wrapper">
          <Sidebar />
          <div className="main-panel">
            <Navbar />
            <div className="content">
              <div className="container-fluid">
                <div className="loading-card">
                  <i className="material-icons spinning">donut_large</i>
                  <p className="loading-text">Loading dashboard data...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head />
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel">
          <Navbar />
          <div className="content">
            <div className="container-fluid">
              <div className="dashboard-header">
                <h2 className="page-title">Revenue Analytics</h2>
                <p className="dashboard-subtitle">
                  Track your business performance and revenue metrics
                </p>
              </div>

              {/* Stats Cards */}
              <div className="stats-grid">
                {/* Existing stats cards code remains the same */}
                <div className="stats-card revenue">
                  <div className="stats-card-content">
                    <div className="stats-icon-wrapper">
                      <div className="stats-icon">
                        <i className="material-icons">payments</i>
                      </div>
                    </div>
                    <div className="stats-info">
                      <p className="stats-label">Total Revenue</p>
                      <h3 className="stats-value">
                        {metrics.totalRevenue.toLocaleString()}
                        <span className="currency">VND</span>
                      </h3>
                      <p className="stats-period">
                        <i className="material-icons">date_range</i>
                        All Time Revenue
                      </p>
                    </div>
                  </div>
                </div>

                <div className="stats-card completed">
                  {/* Completed bookings card content remains the same */}
                  <div className="stats-card-content">
                    <div className="stats-icon-wrapper">
                      <div className="stats-icon">
                        <i className="material-icons">verified</i>
                      </div>
                    </div>
                    <div className="stats-info">
                      <p className="stats-label">Completed Bookings</p>
                      <h3 className="stats-value">
                        {metrics.completedBookings}
                        <span className="metric">completed</span>
                      </h3>
                      <p className="stats-period">
                        <i className="material-icons">check_circle</i>
                        Successfully Processed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Other existing cards remain the same */}
                <div className="stats-card active">
                  <div className="stats-card-content">
                    {/* Active bookings card content */}
                    <div className="stats-icon-wrapper">
                      <div className="stats-icon">
                        <i className="material-icons">timelapse</i>
                      </div>
                    </div>
                    <div className="stats-info">
                      <p className="stats-label">Active Bookings</p>
                      <h3 className="stats-value">
                        {metrics.activeBookings}
                        <span className="metric">active</span>
                      </h3>
                      <p className="stats-period">
                        <i className="material-icons">schedule</i>
                        In Progress
                      </p>
                    </div>
                  </div>
                </div>

                <div className="stats-card pending">
                  <div className="stats-card-content">
                    {/* Pending bookings card content */}
                    <div className="stats-icon-wrapper">
                      <div className="stats-icon">
                        <i className="material-icons">hourglass_empty</i>
                      </div>
                    </div>
                    <div className="stats-info">
                      <p className="stats-label">Pending Bookings</p>
                      <h3 className="stats-value">
                        {metrics.pendingBookings}
                        <span className="metric">pending</span>
                      </h3>
                      <p className="stats-period">
                        <i className="material-icons">pending_actions</i>
                        Awaiting Processing
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="charts-grid">
                {/* Monthly Revenue Chart */}
                <div className="chart-card">
                  <div className="chart-header">
                    <div>
                      <h3 className="chart-title">Monthly Revenue</h3>
                      <p className="chart-subtitle">
                        Revenue performance by month
                      </p>
                    </div>
                  </div>
                  <div className="chart-content">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                        data={monthlyData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorRevenue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#2196F3"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#2196F3"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#eee"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#666", fontSize: 12 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#666", fontSize: 12 }}
                          tickFormatter={(value) => `${value.toLocaleString()}`}
                          width={80}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#2196F3"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                          animationDuration={1000}
                          animationEasing="ease-out"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Daily Revenue Chart */}
                <div className="chart-card">
                  <div className="chart-header">
                    <div>
                      <h3 className="chart-title">Daily Performance</h3>
                      <p className="chart-subtitle">
                        Last 7 days revenue trend
                      </p>
                    </div>
                  </div>
                  <div className="chart-content">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={dailyData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#eee"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#666", fontSize: 12 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#666", fontSize: 12 }}
                          tickFormatter={(value) => `${value.toLocaleString()}`}
                          width={80}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#FF5722"
                          strokeWidth={3}
                          dot={{ fill: "#FF5722", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: "#FF5722" }}
                          animationDuration={1000}
                          animationEasing="ease-out"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* New Revenue Overview Chart */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="chart-card revenue-overview">
                    <div className="chart-header">
                      <div>
                        <h3 className="chart-title">Revenue Overview</h3>
                        <p className="chart-subtitle">
                          Filter revenue by time period
                        </p>
                      </div>
                      <div className="period-selector">
                        <button
                          className={`period-btn ${
                            period === "day" ? "active" : ""
                          }`}
                          onClick={() => setPeriod("day")}
                        >
                          Day
                        </button>
                        <button
                          className={`period-btn ${
                            period === "week" ? "active" : ""
                          }`}
                          onClick={() => setPeriod("week")}
                        >
                          Week
                        </button>
                        <button
                          className={`period-btn ${
                            period === "month" ? "active" : ""
                          }`}
                          onClick={() => setPeriod("month")}
                        >
                          Month
                        </button>
                      </div>
                    </div>
                    <div className="chart-content">
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                          data={getFilteredRevenueData()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#eee"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="period"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#666", fontSize: 12 }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#666", fontSize: 12 }}
                            tickFormatter={(value) =>
                              `${value.toLocaleString()} VND`
                            }
                            width={100}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar
                            dataKey="revenue"
                            fill="url(#colorGradient)"
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                          >
                            {getFilteredRevenueData().map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={`url(#colorGradient-${index})`}
                              />
                            ))}
                          </Bar>
                          <defs>
                            {getFilteredRevenueData().map((entry, index) => (
                              <linearGradient
                                key={`gradient-${index}`}
                                id={`colorGradient-${index}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor={`hsl(${
                                    210 + index * 30
                                  }, 70%, 50%)`}
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="100%"
                                  stopColor={`hsl(${
                                    210 + index * 30
                                  }, 70%, 50%)`}
                                  stopOpacity={0.1}
                                />
                              </linearGradient>
                            ))}
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
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

export default DashboardChart;
