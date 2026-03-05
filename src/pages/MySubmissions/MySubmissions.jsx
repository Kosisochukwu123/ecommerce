import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMySubmissions, deleteSubmission } from "../../api/sellerSubmissions";
import "./MySubmissions.css";

function MySubmissions() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubmissions();
    }
  }, [user]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const response = await getMySubmissions(token);
      setSubmissions(response.submissions);
    } catch (error) {
      console.error("Error loading submissions:", error);
      alert("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      await deleteSubmission(token, id);
      alert("Submission deleted successfully");
      loadSubmissions();
    } catch (error) {
      alert("Failed to delete submission: " + error.message);
    }
  };

  if (!user) {
    return (
      <div className="submissions-container">
        <div className="access-denied">
          <h2>Please Login</h2>
          <p>You need to be logged in to view your submissions</p>
          <button onClick={() => navigate("/Login")}>Go to Login</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="submissions-container">
        <div className="loading-state">
          <p>Loading your submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="submissions-container">
      <div className="submissions-header">
        <div>
          <h1>My Product Submissions</h1>
          <p>Track the status of your submitted products</p>
        </div>
        <button className="btn-new-submission" onClick={() => navigate("/sell")}>
          + Submit New Product
        </button>
      </div>

      {submissions.length === 0 ? (
        <div className="no-submissions">
          <i className="fa-solid fa-box-open"></i>
          <h3>No submissions yet</h3>
          <p>Start selling by submitting your first product!</p>
          <button onClick={() => navigate("/sell")}>Submit a Product</button>
        </div>
      ) : (
        <div className="submissions-grid">
          {submissions.map((submission) => (
            <div key={submission._id} className="submission-card">
              <div className="submission-image">
                <img src={submission.image} alt={submission.name} />
                <span className={`status-badge ${submission.status}`}>
                  {submission.status}
                </span>
              </div>

              <div className="submission-details">
                <h3>{submission.name}</h3>
                <p className="submission-category">{submission.category}</p>
                <p className="submission-price">
                  ${(submission.priceCents / 100).toFixed(2)}
                </p>
                <p className="submission-condition">
                  Condition: {submission.condition}
                </p>
                <p className="submission-date">
                  Submitted: {new Date(submission.createdAt).toLocaleDateString()}
                </p>

                {submission.status === "approved" && (
                  <div className="approval-notice">
                    <i className="fa-solid fa-check-circle"></i>
                    <p>
                      Approved! Your product is now live on the marketplace.
                    </p>
                  </div>
                )}

                {submission.status === "rejected" && (
                  <div className="rejection-notice">
                    <i className="fa-solid fa-times-circle"></i>
                    <p>
                      <strong>Reason:</strong> {submission.adminNotes}
                    </p>
                  </div>
                )}

                {submission.status === "pending" && (
                  <div className="pending-notice">
                    <i className="fa-solid fa-clock"></i>
                    <p>Under review. We'll notify you soon!</p>
                  </div>
                )}

                {submission.status === "pending" && (
                  <button
                    className="btn-delete-submission"
                    onClick={() => handleDelete(submission._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MySubmissions;