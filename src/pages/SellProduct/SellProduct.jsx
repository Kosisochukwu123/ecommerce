import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { submitProduct } from "../../api/sellerSubmissions";
import { uploadImage } from "../../api/upload";
import "./SellProduct.css";

const CATEGORIES = [
  "t-shirt",
  "hoodies",
  "clothing",
  "shoes",
  "sneakers",
  "watches",
  "glasses",
  "beauty",
  "cosmetics",
  "accessories",
];

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Used"];

function SellProduct() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    priceCents: "",
    image: "",
    description: "",
    stock: "1",
    brand: "",
    condition: "",
  });

  if (!user) {
    return (
      <div className="sell-container">
        <div className="access-denied">
          <h2>Please Login</h2>
          <p>You need to be logged in to sell products</p>
          <button onClick={() => navigate("/Login")}>Go to Login</button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    try {
      setUploading(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      const response = await uploadImage(token, file);
      setFormData({ ...formData, image: response.url });
      alert("Image uploaded successfully!");
    } catch (error) {
      alert("Failed to upload image: " + error.message);
      setImagePreview("");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      alert("Please upload a product image");
      return;
    }

    try {
      setSubmitting(true);

      const productData = {
        ...formData,
        priceCents: parseInt(formData.priceCents),
        stock: parseInt(formData.stock),
      };

      await submitProduct(token, productData);

      alert(
        "Product submitted successfully! We'll review it and notify you soon."
      );
      navigate("/my-submissions");
    } catch (error) {
      alert("Failed to submit product: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sell-container">
      <div className="sell-header">
        <h1>Sell Your Product</h1>
        <p>Submit your product for review. We'll get back to you within 24-48 hours.</p>
      </div>

      <form className="sell-form" onSubmit={handleSubmit}>
        {/* Image Upload */}
        <div className="form-section">
          <h3>Product Image</h3>
          <div className="image-upload-container">
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  className="btn-remove-image"
                  onClick={() => {
                    setImagePreview("");
                    setFormData({ ...formData, image: "" });
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  style={{ display: "none" }}
                />
                <div className="upload-placeholder">
                  {uploading ? (
                    <>
                      <div className="spinner-small"></div>
                      <p>Uploading...</p>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-cloud-upload-alt"></i>
                      <p>Click to upload product image</p>
                      <small>PNG, JPG up to 5MB</small>
                    </>
                  )}
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="form-section">
          <h3>Product Details</h3>

          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="e.g., Nike Air Max"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="e.g., Nike"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (in dollars) *</label>
              <input
                type="number"
                step="0.01"
                name="priceCents"
                value={formData.priceCents / 100 || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priceCents: Math.round(parseFloat(e.target.value) * 100) || "",
                  })
                }
                required
                placeholder="99.99"
              />
            </div>

            <div className="form-group">
              <label>Quantity Available *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Condition *</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Condition</option>
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              required
              placeholder="Describe your product in detail..."
            />
          </div>
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={uploading || submitting}
          >
            {submitting ? "Submitting..." : "Submit for Review"}
          </button>
        </div>
        
      </form>
    </div>
  );
}

export default SellProduct;