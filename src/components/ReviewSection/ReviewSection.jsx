import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { addReview, getReviews, deleteReview } from "../../api/review";
import "./ReviewSection.css";

function ReviewSection({ productId }) {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await getReviews(productId);
      setReviews(response.reviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to write a review");
      return;
    }

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a comment");
      return;
    }

    try {
      setSubmitting(true);
      await addReview(token, productId, { rating, comment });
      alert("Review submitted successfully!");
      setRating(0);
      setComment("");
      setShowReviewForm(false);
      loadReviews();
    } catch (error) {
      alert(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await deleteReview(token, productId, reviewId);
      alert("Review deleted successfully");
      loadReviews();
    } catch (error) {
      alert(error.message || "Failed to delete review");
    }
  };

  const renderStars = (count, interactive = false) => {
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`fa-${
              star <= (interactive ? hoverRating || rating : count)
                ? "solid"
                : "regular"
            } fa-star`}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            style={{
              cursor: interactive ? "pointer" : "default",
              color:
                star <= (interactive ? hoverRating || rating : count)
                  ? "#fbbf24"
                  : "#d1d5db",
            }}
          ></i>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="reviews-loading">Loading reviews...</div>;
  }

  const userHasReviewed = reviews.some(
    (review) => review.user === user?._id
  );

  return (
    <div className="review-section">
      <div className="review-header">
        <h3>Customer Reviews ({reviews.length})</h3>
        {user && !userHasReviewed && (
          <button
            className="btn-write-review"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? "Cancel" : "Write a Review"}
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <div className="form-group">
            <label>Your Rating *</label>
            {renderStars(rating, true)}
          </div>

          <div className="form-group">
            <label>Your Review *</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-submit-review"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <i className="fa-solid fa-comments"></i>
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header-info">
                <div className="review-user">
                  <div className="user-avatar">
                    {review.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <p className="username">{review.username}</p>
                    <p className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {user && (user._id === review.user || user.role === "admin") && (
                  <button
                    className="btn-delete-review"
                    onClick={() => handleDeleteReview(review._id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                )}
              </div>

              <div className="review-rating">{renderStars(review.rating)}</div>

              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewSection;