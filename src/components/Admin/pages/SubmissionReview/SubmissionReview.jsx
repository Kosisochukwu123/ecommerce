import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import {
  getAllSubmissions,
  approveSubmission,
  rejectSubmission,
} from "../../../../api/sellerSubmissions";
import "./SubmissionReview.css";

function SubmissionReview() {
  const { token, isAdmin } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadSubmissions();
    }
  }, [isAdmin, statusFilter]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const response = await getAllSubmissions(token, statusFilter);
      setSubmissions(response.submissions);
    } catch (error) {
      console.error("Error loading submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submission) => {
    if (
      !window.confirm(
        `Approve "${submission.name}" and create it as a product?`
      )
    ) {
      return;
    }

    try {
      setProcessing(true);
      await approveSubmission(token, submission._id);
      alert("Submission approved! Product created successfully.");
      loadSubmissions();
    } catch (error) {
      alert("Failed to approve: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    try {
      setProcessing(true);
      await rejectSubmission(token, selectedSubmission._id, rejectReason);
      alert("Submission rejected");
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedSubmission(null);
      loadSubmissions();
    } catch (error) {
      alert("Failed to reject: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="access-denied">
        <h1>Access Denied</h1>
        <p>You must be an admin to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-state">
        <p>Loading submissions...</p>
      </div>
    );
  }

  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  return (
    <div className="submission-review">
      <div className="review-header">
        <div>
          <h1>Seller Submissions</h1>
          <p>Review and approve products submitted by sellers</p>
        </div>
        {pendingCount > 0 && (
          <div className="pending-badge">{pendingCount} Pending Review</div>
        )}
      </div>

      {/* Status Filter */}
      <div className="status-filter">
        <button
          className={`filter-btn ${statusFilter === "pending" ? "active" : ""}`}
          onClick={() => setStatusFilter("pending")}
        >
          Pending ({submissions.filter((s) => s.status === "pending").length})
        </button>
        <button
          className={`filter-btn ${statusFilter === "approved" ? "active" : ""}`}
          onClick={() => setStatusFilter("approved")}
        >
          Approved
        </button>
        <button
          className={`filter-btn ${statusFilter === "rejected" ? "active" : ""}`}
          onClick={() => setStatusFilter("rejected")}
        >
          Rejected
        </button>
        <button
          className={`filter-btn ${statusFilter === "all" ? "active" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          All
        </button>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <div className="no-submissions">
          <p>No {statusFilter !== "all" ? statusFilter : ""} submissions found</p>
        </div>
      ) : (
        <div className="submissions-table">
          {submissions.map((submission) => (
            <div key={submission._id} className="submission-row">
              <div className="submission-image">
                <img src={submission.image} alt={submission.name} />
              </div>

              <div className="submission-info">
                <h3>{submission.name}</h3>
                <p className="seller-info">
                  By: <strong>{submission.sellerName}</strong> ({submission.sellerEmail})
                </p>
                <div className="product-details">
                  <span className="detail-badge">{submission.category}</span>
                  <span className="detail-badge">{submission.condition}</span>
                  <span className="detail-price">
                    ${(submission.priceCents / 100).toFixed(2)}
                  </span>
                  <span className="detail-stock">Stock: {submission.stock}</span>
                </div>
                <p className="description">{submission.description}</p>
                <p className="submission-date">
                  Submitted: {new Date(submission.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="submission-actions">
                <span className={`status-badge ${submission.status}`}>
                  {submission.status}
                </span>

                {submission.status === "pending" && (
                  <>
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(submission)}
                      disabled={processing}
                    >
                      <i className="fa-solid fa-check"></i> Approve
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setShowRejectModal(true);
                      }}
                      disabled={processing}
                    >
                      <i className="fa-solid fa-times"></i> Reject
                    </button>
                  </>
                )}

                {submission.status === "rejected" && (
                  <div className="rejection-reason">
                    <strong>Reason:</strong> {submission.adminNotes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reject Submission</h2>
              <button
                className="modal-close"
                onClick={() => setShowRejectModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p>
                Rejecting: <strong>{selectedSubmission?.name}</strong>
              </p>
              <label>Reason for Rejection *</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this product doesn't meet our guidelines..."
                rows={4}
              />
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-reject"
                onClick={handleReject}
                disabled={processing || !rejectReason.trim()}
              >
                {processing ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubmissionReview;