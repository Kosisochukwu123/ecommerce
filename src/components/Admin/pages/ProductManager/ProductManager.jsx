import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProduct,
} from "../../../../api/product.js";
import { uploadImage } from "../../../../api/upload";
import "./ProductManager.css";

function ProductManager() {
  const { token, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  
  // ← ADD THESE STATES FOR GALLERY IMAGES
  const [galleryImages, setGalleryImages] = useState([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    image: "",
    images: [], // ← ADD THIS
    priceCents: "",
    discountCents: "",
    description: "",
    stock: "",
    brand: "",
    sizes: "",
    colors: "",
    keywords: "",
  });

  const CATEGORIES = [
    { value: "", label: "Select Category" },
    { value: "t-shirt", label: "T-Shirts" },
    { value: "hoodies", label: "Hoodies" },
    { value: "clothing", label: "Clothing" },
    { value: "shoes", label: "Shoes" },
    { value: "sneakers", label: "Sneakers" },
    { value: "watches", label: "Watches" },
    { value: "glasses", label: "Glasses" },
    { value: "beauty", label: "Beauty & Makeup" },
    { value: "cosmetics", label: "Cosmetics" },
    { value: "accessories", label: "Accessories" },
    { value: "bags", label: "Bags" },
    { value: "jewelry", label: "Jewelry" },
    { value: "electronics", label: "Electronics" },
    { value: "sports", label: "Sports & Fitness" },
  ];

  const BRANDS = [
    { value: "", label: "Select Brand" },
    { value: "Nike", label: "Nike" },
    { value: "Adidas", label: "Adidas" },
    { value: "Puma", label: "Puma" },
    { value: "Reebok", label: "Reebok" },
    { value: "Under Armour", label: "Under Armour" },
    { value: "New Balance", label: "New Balance" },
    { value: "Converse", label: "Converse" },
    { value: "Vans", label: "Vans" },
    { value: "H&M", label: "H&M" },
    { value: "Zara", label: "Zara" },
    { value: "Gucci", label: "Gucci" },
    { value: "Louis Vuitton", label: "Louis Vuitton" },
    { value: "Chanel", label: "Chanel" },
    { value: "Dior", label: "Dior" },
    { value: "Versace", label: "Versace" },
    { value: "Prada", label: "Prada" },
    { value: "Balenciaga", label: "Balenciaga" },
    { value: "Supreme", label: "Supreme" },
    { value: "Off-White", label: "Off-White" },
    { value: "Tommy Hilfiger", label: "Tommy Hilfiger" },
    { value: "Calvin Klein", label: "Calvin Klein" },
    { value: "Ralph Lauren", label: "Ralph Lauren" },
    { value: "Levi's", label: "Levi's" },
    { value: "Gap", label: "Gap" },
    { value: "Uniqlo", label: "Uniqlo" },
    { value: "Forever 21", label: "Forever 21" },
    { value: "Apple", label: "Apple" },
    { value: "Samsung", label: "Samsung" },
    { value: "Sony", label: "Sony" },
    { value: "Generic", label: "Generic/Other" },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetchProducts({ includeInactive: true });
      setProducts(response.data);
    } catch (error) {
      alert("Error loading products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="access-denied">
        <h1>Access Denied</h1>
        <p>You must be an admin to view this page.</p>
        <button
          className="btn-primary"
          onClick={() => (window.location.href = "/")}
        >
          Go Home
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Main image upload
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

  // ← ADD THIS: Gallery images upload (multiple)
  const handleGalleryImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Check total gallery images count
    const totalImages = galleryImages.length + files.length;
    if (totalImages > 5) {
      alert(`You can upload maximum 5 gallery images. You have ${galleryImages.length}, trying to add ${files.length}`);
      return;
    }

    // Validate all files
    for (let file of files) {
      if (!file.type.startsWith("image/")) {
        alert("Please select only image files");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`Image ${file.name} is too large. Max 5MB per image.`);
        return;
      }
    }

    try {
      setUploadingGallery(true);
      const uploadedUrls = [];
      const previews = [];

      for (let file of files) {
        // Create preview
        const preview = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
        previews.push(preview);

        // Upload to Cloudinary
        const response = await uploadImage(token, file);
        uploadedUrls.push(response.url);
      }

      setGalleryImages([...galleryImages, ...previews]);
      setFormData({ 
        ...formData, 
        images: [...formData.images, ...uploadedUrls] 
      });
      
      alert(`${files.length} image(s) uploaded successfully!`);
    } catch (error) {
      alert("Failed to upload gallery images: " + error.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  // ← ADD THIS: Remove gallery image
  const handleRemoveGalleryImage = (index) => {
    const newGalleryImages = galleryImages.filter((_, i) => i !== index);
    const newImages = formData.images.filter((_, i) => i !== index);
    
    setGalleryImages(newGalleryImages);
    setFormData({ ...formData, images: newImages });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      image: "",
      images: [], // ← ADD THIS
      priceCents: "",
      discountCents: "",
      description: "",
      stock: "",
      brand: "",
      sizes: "",
      colors: "",
      keywords: "",
    });
    setImagePreview("");
    setGalleryImages([]); // ← ADD THIS
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleCreateNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      image: product.image,
      images: product.images || [], // ← ADD THIS
      priceCents: product.priceCents,
      discountCents: product.discountCents || "",
      description: product.description || "",
      stock: product.stock,
      brand: product.brand || "",
      sizes: product.sizes?.join(", ") || "",
      colors: product.colors?.join(", ") || "",
      keywords: product.keywords?.join(", ") || "",
    });
    setImagePreview(product.image);
    setGalleryImages(product.images || []); // ← ADD THIS
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      alert("Please upload a product image");
      return;
    }

    const productData = {
      ...formData,
      priceCents: Number(formData.priceCents),
      discountCents: formData.discountCents
        ? Number(formData.discountCents)
        : null,
      stock: Number(formData.stock),
      sizes: formData.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      colors: formData.colors
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      keywords: formData.keywords
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      images: formData.images, // ← Already an array
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, productData, token);
        alert("Product updated successfully!");
      } else {
        await createProduct(productData, token);
        alert("Product created successfully!");
      }
      resetForm();
      loadProducts();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await deleteProduct(id, token);
      alert("Product deleted successfully!");
      loadProducts();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleProduct(id, token);
      loadProducts();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Page Header */}
      <div className="dashboard-header">
        <h1>Product Management</h1>
        <button className="btn-create" onClick={handleCreateNew}>
          + Add New Product
        </button>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="loading-state">
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>No products found. Create your first product!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="td-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-thumb"
                    />
                  </td>
                  <td className="td-name">{product.name}</td>
                  <td className="td-category">
                    <span className="category-badge">{product.category}</span>
                  </td>
                  <td className="td-price">
                    ${(product.priceCents / 100).toFixed(2)}
                    {product.discountCents && (
                      <span className="discount-price">
                        ${(product.discountCents / 100).toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="td-stock">
                    <span
                      className={product.stock < 10 ? "stock-low" : "stock-ok"}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="td-status">
                    <button
                      className={`status-btn ${product.isActive ? "active" : "inactive"}`}
                      onClick={() => handleToggle(product._id)}
                    >
                      {product.isActive ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="td-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? "Edit Product" : "Create New Product"}</h2>
              <button className="modal-close" onClick={resetForm}>
                ✕
              </button>
            </div>

            <form className="product-form" onSubmit={handleSubmit}>
              
              {/* Main Product Image */}
              <div className="form-group">
                <label>Main Product Image *</label>
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
                            <p>Click to upload main image</p>
                            <small>PNG, JPG up to 5MB</small>
                          </>
                        )}
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* ← ADD THIS: Gallery Images Upload */}
              <div className="form-group">
                <label>Gallery Images (Optional - Max 5)</label>
                <div className="gallery-upload-container">
                  {/* Show existing gallery images */}
                  {galleryImages.length > 0 && (
                    <div className="gallery-preview-grid">
                      {galleryImages.map((img, index) => (
                        <div key={index} className="gallery-preview-item">
                          <img src={img} alt={`Gallery ${index + 1}`} />
                          <button
                            type="button"
                            className="btn-remove-gallery"
                            onClick={() => handleRemoveGalleryImage(index)}
                            title="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button */}
                  {galleryImages.length < 5 && (
                    <label className="upload-label-gallery">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryImagesChange}
                        disabled={uploadingGallery}
                        style={{ display: "none" }}
                      />
                      <div className="upload-placeholder-small">
                        {uploadingGallery ? (
                          <>
                            <div className="spinner-small"></div>
                            <p>Uploading...</p>
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-images"></i>
                            <p>Add Gallery Images</p>
                            <small>
                              Select up to {5 - galleryImages.length} more image(s)
                            </small>
                          </>
                        )}
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Classic Hoodie"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="form-select"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (cents) *</label>
                  <input
                    type="number"
                    name="priceCents"
                    value={formData.priceCents}
                    onChange={handleInputChange}
                    required
                    placeholder="1000 = $10.00"
                  />
                </div>

                <div className="form-group">
                  <label>Discount (cents)</label>
                  <input
                    type="number"
                    name="discountCents"
                    value={formData.discountCents}
                    onChange={handleInputChange}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Brand</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {BRANDS.map((brand) => (
                      <option key={brand.value} value={brand.value}>
                        {brand.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Product description..."
                />
              </div>

              <div className="form-group">
                <label>Sizes (comma separated)</label>
                <input
                  type="text"
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleInputChange}
                  placeholder="S, M, L, XL"
                />
              </div>

              <div className="form-group">
                <label>Colors (comma separated)</label>
                <input
                  type="text"
                  name="colors"
                  value={formData.colors}
                  onChange={handleInputChange}
                  placeholder="Black, White, Red"
                />
              </div>

              <div className="form-group">
                <label>Keywords (comma separated)</label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  placeholder="casual, clothing, fashion"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={uploading || uploadingGallery}
                >
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManager;