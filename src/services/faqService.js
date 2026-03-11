const backendAddress = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API_URL = `${backendAddress}/api/faqs`;

class FAQService {
  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  }

  // Get FAQs for visitors (public - no auth needed)
  async getFAQs() {
    try {
      const response = await fetch(`${API_URL}/public`); // ← Changed endpoint
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ FAQs loaded:', data);
      return data.faqs || [];
    } catch (error) {
      console.error('❌ Failed to load FAQs:', error.message);
      // Return empty array instead of throwing
      return [];
    }
  }

  // Get all FAQs for admin (requires auth)
  async getAdminFAQs() {
    try {
      const response = await fetch(API_URL, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Admin FAQs loaded:', data);
      return data.faqs || [];
    } catch (error) {
      console.error('❌ Failed to load admin FAQs:', error.message);
      throw error;
    }
  }

  // Create new FAQ
  async createFAQ(faq) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(faq)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create FAQ');
      }

      const data = await response.json();
      console.log('✅ FAQ created:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to create FAQ:', error.message);
      throw error;
    }
  }

  // Update FAQ
  async updateFAQ(id, faq) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(faq)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update FAQ');
      }

      const data = await response.json();
      console.log('✅ FAQ updated:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to update FAQ:', error.message);
      throw error;
    }
  }

  // Delete FAQ
  async deleteFAQ(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete FAQ');
      }

      const data = await response.json();
      console.log('✅ FAQ deleted:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to delete FAQ:', error.message);
      throw error;
    }
  }
}

export default new FAQService();