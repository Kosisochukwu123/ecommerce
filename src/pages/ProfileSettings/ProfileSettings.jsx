import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  getUserProfile, 
  updateUserProfile, 
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress
} from "../../api/user";
import "./ProfileSettings.css";

function ProfileSettings() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Address form state
  const [addressForm, setAddressForm] = useState({
    type: "home",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isDefault: false,
  });

  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    if (!user) {
      navigate("/Login");
      return;
    }
    loadUserProfile();
  }, [user, navigate]);

  const loadUserProfile = async () => {
    try {
      const response = await getUserProfile(token);
      const userData = response.user || response;
      
      // Populate profile form
      setProfileForm({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phone: userData.phone || "",
        dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : "",
        gender: userData.gender || "",
      });

      // Populate addresses
      setAddresses(userData.addresses || []);
    } catch (error) {
      console.error("Error loading profile:", error);
      showMessage("error", "Failed to load profile data");
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  // Handle profile form changes
  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  // Handle address form changes
  const handleAddressChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setAddressForm({ ...addressForm, [e.target.name]: value });
  };

  // Submit profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserProfile(token, profileForm);
      showMessage("success", "Profile updated successfully!");
      loadUserProfile(); // Reload to get updated data
    } catch (error) {
      showMessage("error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Submit password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage("error", "New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showMessage("error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await changePassword(token, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      
      showMessage("success", "Password changed successfully!");
      
      // Clear form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      showMessage("error", error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Submit address
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingAddress) {
        // Update existing address
        const response = await updateAddress(token, editingAddress._id, addressForm);
        setAddresses(response.addresses);
        showMessage("success", "Address updated successfully!");
      } else {
        // Add new address
        const response = await addAddress(token, addressForm);
        setAddresses(response.addresses);
        showMessage("success", "Address added successfully!");
      }
      
      // Reset form
      resetAddressForm();
    } catch (error) {
      showMessage("error", error.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  // Edit address
  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      type: address.type,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setShowAddressForm(true);
  };

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    setLoading(true);

    try {
      const response = await deleteAddress(token, addressId);
      setAddresses(response.addresses);
      showMessage("success", "Address deleted successfully!");
    } catch (error) {
      showMessage("error", error.message || "Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  // Reset address form
  const resetAddressForm = () => {
    setAddressForm({
      type: "home",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      isDefault: false,
    });
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  return (
    <div className="profile-settings">
      {/* Back Button */}
      <button className="btn-back" onClick={() => navigate("/profile")}>
        ← Back to Profile
      </button>

      {/* Header */}
      <div className="settings-header">
        <h1>Account Settings</h1>
        <p>Manage your profile information and preferences</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Settings Navigation */}
      <div className="settings-nav">
        <button
          className={`settings-nav-btn ${activeSection === "profile" ? "active" : ""}`}
          onClick={() => setActiveSection("profile")}
        >
          Profile Information
        </button>
        <button
          className={`settings-nav-btn ${activeSection === "password" ? "active" : ""}`}
          onClick={() => setActiveSection("password")}
        >
          Change Password
        </button>
        <button
          className={`settings-nav-btn ${activeSection === "addresses" ? "active" : ""}`}
          onClick={() => setActiveSection("addresses")}
        >
          Manage Addresses
        </button>
      </div>

      {/* Settings Content */}
      <div className="settings-content">
        {/* Profile Information Section */}
        {activeSection === "profile" && (
          <div className="settings-section">
            <h2>Profile Information</h2>
            <form className="settings-form" onSubmit={handleProfileSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileForm.firstName}
                    onChange={handleProfileChange}
                    placeholder="John"
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileForm.lastName}
                    onChange={handleProfileChange}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profileForm.dateOfBirth}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={profileForm.gender}
                  onChange={handleProfileChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Password Section */}
        {activeSection === "password" && (
          <div className="settings-section">
            <h2>Change Password</h2>
            <p className="section-description">
              Ensure your account is using a strong password to stay secure.
            </p>

            <form className="settings-form" onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Enter current password"
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="At least 6 characters"
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Re-enter new password"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses Section */}
        {activeSection === "addresses" && (
          <div className="settings-section">
            <div className="section-header-row">
              <h2>Saved Addresses</h2>
              <button
                className="btn-add"
                onClick={() => setShowAddressForm(!showAddressForm)}
              >
                {showAddressForm ? "Cancel" : "+ Add Address"}
              </button>
            </div>

            {/* Address Form */}
            {showAddressForm && (
              <form className="settings-form address-form" onSubmit={handleAddressSubmit}>
                <div className="form-group">
                  <label>Address Type</label>
                  <select
                    name="type"
                    value={addressForm.type}
                    onChange={handleAddressChange}
                    required
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={addressForm.street}
                    onChange={handleAddressChange}
                    required
                    placeholder="123 Main St"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      required
                      placeholder="New York"
                    />
                  </div>

                  <div className="form-group">
                    <label>State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressChange}
                      required
                      placeholder="NY"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP/Postal Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={addressForm.zipCode}
                      onChange={handleAddressChange}
                      required
                      placeholder="10001"
                    />
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={addressForm.country}
                      onChange={handleAddressChange}
                      required
                      placeholder="United States"
                    />
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={addressForm.isDefault}
                      onChange={handleAddressChange}
                    />
                    <span>Set as default address</span>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={resetAddressForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
                  </button>
                </div>
              </form>
            )}

            {/* Addresses List */}
            {addresses.length > 0 ? (
              <div className="addresses-list">
                {addresses.map((address) => (
                  <div key={address._id} className="address-item">
                    <div className="address-item-header">
                      <div>
                        <span className="address-type-badge">{address.type}</span>
                        {address.isDefault && (
                          <span className="default-badge">Default</span>
                        )}
                      </div>
                      <div className="address-actions">
                        <button
                          className="btn-icon"
                          onClick={() => handleEditAddress(address)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDeleteAddress(address._id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="address-details">
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} {address.zipCode}</p>
                      <p>{address.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">
                No saved addresses yet. Add your first address above.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileSettings;