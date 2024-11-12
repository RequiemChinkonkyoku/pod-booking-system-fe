import React, { useState, useEffect } from "react";
import {
  Star,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DatePicker from "react-datepicker";
import axios from "../utils/axiosConfig";
import "react-datepicker/dist/react-datepicker.css";
import "../css/ReviewsSection.css";

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [podTypes, setPodTypes] = useState([]);
  const [selectedPodType, setSelectedPodType] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [reviewsRes, podTypesRes] = await Promise.all([
          axios.get("/Reviews"),
          axios.get("/PodType"),
        ]);

        const sortedReviews = reviewsRes.data.sort(
          (a, b) => new Date(a.arrivalDate) - new Date(b.arrivalDate)
        );

        setReviews(sortedReviews);
        setPodTypes(podTypesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate review counts for each pod type
  const podTypeCounts = reviews.reduce((acc, review) => {
    acc[review.podTypeId] = (acc[review.podTypeId] || 0) + 1;
    return acc;
  }, {});

  // Calculate rating statistics
  const calculateRatingStats = () => {
    const stats = {
      totalRatings: reviews.length,
      averageRating: 0,
      ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };

    reviews.forEach((review) => {
      stats.ratingCounts[review.rating] =
        (stats.ratingCounts[review.rating] || 0) + 1;
      stats.averageRating += review.rating;
    });

    if (stats.totalRatings > 0) {
      stats.averageRating = (stats.averageRating / stats.totalRatings).toFixed(
        1
      );
    }

    return stats;
  };

  const ratingStats = calculateRatingStats();

  // Calculate percentage for rating bar
  const getRatingPercentage = (ratingCount) => {
    return ((ratingCount / ratingStats.totalRatings) * 100).toFixed(0);
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesPodType =
      selectedPodType === "all" ||
      review.podTypeId === parseInt(selectedPodType);
    const matchesRating =
      selectedRating === "all" || review.rating === parseInt(selectedRating);
    const matchesDate =
      !selectedDate ||
      new Date(review.arrivalDate).toDateString() ===
        selectedDate.toDateString();
    return matchesPodType && matchesRating && matchesDate;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination handlers
  const goToPage = (pageNumber) => {
    setCurrentPage(Math.min(Math.max(1, pageNumber), totalPages));
  };

  return (
    <div className="reviews-section">
      <div className="reviews-container">
        <h2 className="reviews-title">Customer Reviews</h2>
        <p className="reviews-subtitle">
          See what our customers say about their experience
        </p>

        {/* Filters */}
        <div className="filters-container">
          <div className="filter-group rating-filter-group">
            <label>
              <Star size={18} />
              Rating
            </label>
            <select
              value={selectedRating}
              onChange={(e) => {
                setSelectedRating(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="all">
                All Ratings ({ratingStats.totalRatings}) -{" "}
                {ratingStats.averageRating}★
              </option>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingStats.ratingCounts[rating] || 0;
                const percentage = getRatingPercentage(count);
                return (
                  <option key={rating} value={rating} className="rating-option">
                    {rating} Stars ({count}) - {percentage}%
                  </option>
                );
              })}
            </select>

            {/* Rating Statistics Display */}
            <div className="rating-stats">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="rating-bar-container">
                  <div className="rating-bar-label">
                    <span className="rating-number">{rating}</span>
                    <div className="stars-mini">
                      <Star size={12} fill="#fbbf24" color="#fbbf24" />
                    </div>
                  </div>
                  <div className="rating-bar-wrapper">
                    <div
                      className="rating-bar-fill"
                      style={{
                        width: `${getRatingPercentage(
                          ratingStats.ratingCounts[rating]
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="rating-count">
                    {ratingStats.ratingCounts[rating] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <label>
              <Filter size={18} />
              Pod Type
            </label>
            <select
              value={selectedPodType}
              onChange={(e) => {
                setSelectedPodType(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="all">All Types ({reviews.length})</option>
              {podTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} ({podTypeCounts[type.id] || 0})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>
              <Calendar size={18} />
              Date
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setCurrentPage(1);
              }}
              dateFormat="MMM dd, yyyy"
              className="filter-select"
              placeholderText="Select date"
              isClearable
            />
          </div>
        </div>

        {isLoading ? (
          <div className="loading-message">Loading reviews...</div>
        ) : (
          <>
            <div className="reviews-grid">
              {currentItems.map((review) => (
                <div key={review.reviewId} className="review-card">
                  <div className="review-header">
                    <div>
                      <div className="review-pod-type pod-badge">
                        {review.podTypeName}
                      </div>
                    </div>
                    <div className="review-date">
                      {formatDate(review.arrivalDate)}
                    </div>
                  </div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={20}
                        fill={index < review.rating ? "#fbbf24" : "none"}
                        color={index < review.rating ? "#fbbf24" : "#e5e7eb"}
                      />
                    ))}
                  </div>
                  <div className="review-text">{review.text}</div>
                  <div className="review-customer">
                    <div className="customer-avatar">
                      {review.customerName.charAt(0)}
                    </div>
                    <div className="customer-name">{review.customerName}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination section */}
            {filteredReviews.length > 0 && (
              <div className="pagination-section">
                <div className="reviews-count">
                  Showing {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, filteredReviews.length)} of{" "}
                  {filteredReviews.length} review
                  {filteredReviews.length !== 1 ? "s" : ""}
                </div>
                {filteredReviews.length > itemsPerPage && (
                  <div className="pagination">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-button"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div className="pagination-numbers">
                      {Array.from({ length: totalPages }, (_, index) => {
                        const pageNumber = index + 1;
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 &&
                            pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => goToPage(pageNumber)}
                              className={`pagination-number ${
                                currentPage === pageNumber ? "active" : ""
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span
                              key={pageNumber}
                              className="pagination-ellipsis"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="pagination-button"
                      aria-label="Next page"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
