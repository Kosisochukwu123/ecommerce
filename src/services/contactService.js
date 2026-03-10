const backendAddress = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API_URL = `${backendAddress}/api/settings`;

class ContactService {
  // Get contact settings (public)
  async getContactSettings() {
    try {
      const response = await fetch(`${API_URL}/contact`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return data.settings;
    } catch (error) {
      console.error('❌ Failed to load contact settings:', error);
      // Return defaults if API fails
      return {
        address: "Loading...",
        instagram: "#",
        twitter: "#",
        customerSupport: "support@brandi.com",
        partnership: "collab@brandi.com",
        phone: ""
      };
    }
  }

  // Update contact settings (admin only)
  async updateContactSettings(settings) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/contact`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update settings');
      }

      return response.json();
    } catch (error) {
      console.error('❌ Failed to update contact settings:', error);
      throw error;
    }
  }
}

export default new ContactService();