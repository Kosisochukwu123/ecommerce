import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  toggleProduct 
} from "../api/product.js";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { token, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    image: "",
    priceCents: "",
    discountCents: "",
    description: "",
    stock: "",
    brand: "",
    sizes: "",
    colors: "",
    keywords: "",
  });

  // Load products on mount
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

  // Check if user is admin
  if (!isAdmin) {
    return (
      <div className="access-denied">
        <h1>Access Denied</h1>
        <p>You must be an admin to view this page.</p>
        <button className="btn-primary" onClick={() => window.location.href = "/"}>
          Go Home
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      image: "",
      priceCents: "",
      discountCents: "",
      description: "",
      stock: "",
      brand: "",
      sizes: "",
      colors: "",
      keywords: "",
    });
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
      priceCents: product.priceCents,
      discountCents: product.discountCents || "",
      description: product.description || "",
      stock: product.stock,
      brand: product.brand || "",
      sizes: product.sizes?.join(", ") || "",
      colors: product.colors?.join(", ") || "",
      keywords: product.keywords?.join(", ") || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      priceCents: Number(formData.priceCents),
      discountCents: formData.discountCents ? Number(formData.discountCents) : null,
      stock: Number(formData.stock),
      sizes: formData.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: formData.colors.split(",").map((s) => s.trim()).filter(Boolean),
      keywords: formData.keywords.split(",").map((s) => s.trim()).filter(Boolean),
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
    if (!window.confirm("Are you sure you want to delete this product?")) return;

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
                    <span className={product.stock < 10 ? "stock-low" : "stock-ok"}>
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
                    <button className="btn-edit" onClick={() => handleEdit(product)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(product._id)}>
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
              <button className="modal-close" onClick={resetForm}>✕</button>
            </div>
            
            <form className="product-form" onSubmit={handleSubmit}>
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
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., hoodies, t-shirt"
                />
              </div>

              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  placeholder="/images/product.png"
                />
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
                    placeholder="15990 = $159.90"
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
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Nike"
                  />
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
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
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

export default AdminDashboard;