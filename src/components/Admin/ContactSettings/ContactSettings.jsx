import { useState, useEffect } from 'react';
import contactService from '../../../services/contactService';
import './ContactSettings.css';

function ContactSettings() {
  const [settings, setSettings] = useState({
    address: '',
    instagram: '',
    twitter: '',
    customerSupport: '',
    partnership: '',
    phone: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await contactService.getContactSettings();
      setSettings(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await contactService.updateContactSettings(settings);
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading settings...</div>;
  }

  return (
    <div className="contact-settings">
      <div className="page-header">
        <h1>Contact Information Settings</h1>
        <p>Manage your business contact details</p>
      </div>

      {message.text && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-section">
          <h3>📍 Business Address</h3>
          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={settings.address}
              onChange={handleChange}
              placeholder="Enter business address..."
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>📱 Social Media</h3>
          <div className="form-group">
            <label>Instagram URL</label>
            <input
              type="url"
              name="instagram"
              value={settings.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/yourbrand"
              required
            />
          </div>

          <div className="form-group">
            <label>Twitter URL</label>
            <input
              type="url"
              name="twitter"
              value={settings.twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/yourbrand"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>📧 Email Addresses</h3>
          <div className="form-group">
            <label>Customer Support Email</label>
            <input
              type="email"
              name="customerSupport"
              value={settings.customerSupport}
              onChange={handleChange}
              placeholder="support@yourbrand.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Partnership & Collaboration Email</label>
            <input
              type="email"
              name="partnership"
              value={settings.partnership}
              onChange={handleChange}
              placeholder="collab@yourbrand.com"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? '💾 Saving...' : '💾 Save Changes'}
          </button>
          <button type="button" className="btn-reset" onClick={loadSettings}>
            🔄 Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContactSettings;